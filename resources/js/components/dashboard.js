import { storage } from '../utils/storage.js';

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

    function showModal(message) {
        if (modal && modalMessage) {
            modalMessage.textContent = message;
            modal.classList.remove('hidden');
        }
    }
}
