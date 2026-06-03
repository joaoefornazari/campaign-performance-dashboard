import { storage } from '../utils/storage.js';
import { logout } from '../services/authService.js';

export function initDashboard() {
    const token = storage.getToken();
    const user = storage.getUser();

    if (!token) {
        window.location.href = '/login';
        return;
    }

    const welcomeEl = document.getElementById('welcome-message');
    if (welcomeEl && user) {
        welcomeEl.textContent = `Welcome, ${user.name}!`;
    }

    const importBtn = document.getElementById('import-csv-btn');
    const fileInput = document.getElementById('csv-file-input');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.getElementById('modal-close');

    if (importBtn && fileInput) {
        importBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', async () => {
            const file = fileInput.files?.[0];
            if (!file) return;

            if (!file.name.endsWith('.csv')) {
                showModal('Please select a valid .csv file.');
                fileInput.value = '';
                return;
            }

            try {
                const text = await file.text();
                const res = await fetch('/api/campaigns/import', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ csv: text }),
                });

                const data = await res.json();

                if (!res.ok) {
                    showModal(data.message || 'Failed to import CSV.');
                } else {
                    alert(data.message);
                    loadCampaigns(token);
                }
            } catch (err) {
                showModal('An error occurred while importing the CSV file.');
            } finally {
                fileInput.value = '';
            }
        });
    }

    if (modalClose && modal) {
        modalClose.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    const filterInput = document.getElementById('min-roas-filter');
    if (filterInput) {
        filterInput.addEventListener('input', applyRoasFilter);
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await logout(token);
            } catch {
                // ignore backend errors, still clear local state
            }
            storage.clear();
            window.location.href = '/login';
        });
    }

    loadCampaigns(token);
    loadSummary(token);

    async function loadSummary(token) {
        const totalSpendEl = document.getElementById('total-spend');
        const totalRevenueEl = document.getElementById('total-revenue');
        const overallRoasEl = document.getElementById('overall-roas');

        try {
            const res = await fetch('/api/campaigns/summary', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!res.ok) throw new Error('Failed to fetch summary');

            const data = await res.json();

            if (totalSpendEl) totalSpendEl.textContent = formatCurrency(data.total_spend);
            if (totalRevenueEl) totalRevenueEl.textContent = formatCurrency(data.total_revenue);
            if (overallRoasEl) overallRoasEl.textContent = data.overall_roas !== null ? `${data.overall_roas.toFixed(2)}x` : 'N/A';
        } catch {
            if (totalSpendEl) totalSpendEl.textContent = '—';
            if (totalRevenueEl) totalRevenueEl.textContent = '—';
            if (overallRoasEl) overallRoasEl.textContent = '—';
        }
    }

    let allCampaigns = [];

    function renderCampaigns(campaigns) {
        const table = document.getElementById('campaigns-table');
        const tbody = document.getElementById('campaigns-table-body');
        const empty = document.getElementById('campaigns-empty');

        if (!tbody) return;

        if (campaigns.length === 0) {
            if (table) table.classList.add('hidden');
            if (empty) empty.classList.remove('hidden');
            return;
        }

        if (table) table.classList.remove('hidden');
        if (empty) empty.classList.add('hidden');

        tbody.innerHTML = campaigns.map(c => {
            const roas = c.spend > 0 ? (c.revenue / c.spend) : null;
            const cpa = c.conversions > 0 ? (c.spend / c.conversions) : null;

            let rowClass = '';
            if (roas !== null) {
                if (roas >= 3.0) rowClass = 'bg-green-100';
                else if (roas >= 1.5) rowClass = 'bg-yellow-100';
                else rowClass = 'bg-red-100';
            }

            const platformName = c.platform ? c.platform.name : '—';

            return `<tr class="${rowClass} border-b border-gray-200">
                <td class="px-4 py-3 text-sm text-gray-800">${escapeHtml(c.name)}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(platformName)}</td>
                <td class="px-4 py-3 text-sm text-gray-800 text-right">${formatCurrency(c.spend)}</td>
                <td class="px-4 py-3 text-sm text-gray-800 text-right">${formatCurrency(c.revenue)}</td>
                <td class="px-4 py-3 text-sm text-gray-800 text-right">${c.conversions}</td>
                <td class="px-4 py-3 text-sm text-gray-800 text-right font-semibold">${roas !== null ? roas.toFixed(2) : 'N/A'}</td>
                <td class="px-4 py-3 text-sm text-gray-800 text-right font-semibold">${cpa !== null ? formatCurrency(cpa) : 'N/A'}</td>
            </tr>`;
        }).join('');
    }

    function applyRoasFilter() {
        const filterInput = document.getElementById('min-roas-filter');
        if (!filterInput) {
            renderCampaigns(allCampaigns);
            return;
        }
        const minRoas = parseFloat(filterInput.value);
        if (isNaN(minRoas) || minRoas < 0) {
            renderCampaigns(allCampaigns);
            return;
        }
        const filtered = allCampaigns.filter(c => {
            const roas = c.spend > 0 ? (c.revenue / c.spend) : null;
            return roas !== null && roas >= minRoas;
        });
        renderCampaigns(filtered);
    }

    async function loadCampaigns(token) {
        const loading = document.getElementById('campaigns-loading');
        const error = document.getElementById('campaigns-error');

        try {
            const res = await fetch('/api/campaigns', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!res.ok) throw new Error('Failed to fetch');

            const data = await res.json();
            allCampaigns = data.data || [];

            if (loading) loading.classList.add('hidden');
            if (error) error.classList.add('hidden');

            renderCampaigns(allCampaigns);
        } catch (err) {
            if (loading) loading.classList.add('hidden');
            const table = document.getElementById('campaigns-table');
            const empty = document.getElementById('campaigns-empty');
            if (table) table.classList.add('hidden');
            if (empty) empty.classList.add('hidden');
            if (error) {
                error.textContent = 'Failed to load campaigns.';
                error.classList.remove('hidden');
            }
        }
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function showModal(message) {
        if (modal && modalMessage) {
            modalMessage.textContent = message;
            modal.classList.remove('hidden');
        }
    }
}
