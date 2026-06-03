import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

const MOCK_CAMPAIGNS = [
  { id: 1, name: 'Wrinkle Cream FB', spend: 4200, revenue: 18900, conversions: 312, platform: { id: 1, name: 'Facebook' }, user_id: 1 },
  { id: 2, name: 'Weight Loss IG', spend: 3100.5, revenue: 8680, conversions: 198, platform: { id: 2, name: 'Instagram' }, user_id: 1 },
  { id: 3, name: 'Zepbound Google', spend: 5500, revenue: 24750, conversions: 440, platform: { id: 3, name: 'Google' }, user_id: 1 },
];

function setupDom() {
  document.body.innerHTML = `
    <div id="dashboard-page">
      <div id="welcome-message"></div>
      <div id="summary-bar">
        <p id="total-spend">—</p>
        <p id="total-revenue">—</p>
        <p id="overall-roas">—</p>
      </div>
      <input id="min-roas-filter" type="number" min="0" step="0.1" placeholder="e.g. 2.0" />
      <div id="campaigns-loading">Loading campaigns...</div>
      <div id="campaigns-error" class="hidden"></div>
      <div id="campaigns-empty" class="hidden"></div>
      <table id="campaigns-table" class="hidden">
        <tbody id="campaigns-table-body"></tbody>
      </table>
    </div>
  `;
}

describe('Dashboard table', () => {
  beforeEach(() => {
    setupDom();
    localStorage.setItem('skyhouse_token', 'test-token');
    localStorage.setItem('skyhouse_user', JSON.stringify({ name: 'Test User', email: 'test@test.com' }));
    global.fetch = vi.fn();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders campaign rows with correct ROAS and CPA', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: MOCK_CAMPAIGNS }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total_spend: 12800.5, total_revenue: 52330, overall_roas: 4.09 }),
      });

    const { initDashboard } = await import('../../resources/js/components/dashboard.js');
    initDashboard();

    await vi.waitFor(() => {
      const rows = document.querySelectorAll('#campaigns-table-body tr');
      expect(rows.length).toBe(3);
    });

    const rows = document.querySelectorAll('#campaigns-table-body tr');

    expect(rows[0].children[0].textContent).toBe('Wrinkle Cream FB');
    expect(rows[0].children[1].textContent).toBe('Facebook');
    expect(rows[0].children[5].textContent).toBe('4.50');
    expect(rows[0].children[6].textContent).toBe('$13.46');

    expect(rows[1].children[5].textContent).toBe('2.80');
    expect(rows[2].children[5].textContent).toBe('4.50');
  });

  it('color-codes rows based on ROAS', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: MOCK_CAMPAIGNS }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total_spend: 12800.5, total_revenue: 52330, overall_roas: 4.09 }),
      });

    const { initDashboard } = await import('../../resources/js/components/dashboard.js');
    initDashboard();

    await vi.waitFor(() => {
      const rows = document.querySelectorAll('#campaigns-table-body tr');
      expect(rows.length).toBe(3);
    });

    const rows = document.querySelectorAll('#campaigns-table-body tr');

    expect(rows[0].className).toContain('bg-green-100');
    expect(rows[1].className).toContain('bg-yellow-100');
    expect(rows[2].className).toContain('bg-green-100');
  });

  it('shows empty message when no campaigns', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total_spend: 0, total_revenue: 0, overall_roas: null }),
      });

    const { initDashboard } = await import('../../resources/js/components/dashboard.js');
    initDashboard();

    await vi.waitFor(() => {
      const empty = document.getElementById('campaigns-empty');
      expect(empty!.classList.contains('hidden')).toBe(false);
    });
  });

  it('shows error message on fetch failure', async () => {
    (global.fetch as any)
      .mockRejectedValueOnce(new Error('Network error'));

    const { initDashboard } = await import('../../resources/js/components/dashboard.js');
    initDashboard();

    await vi.waitFor(() => {
      const error = document.getElementById('campaigns-error');
      expect(error!.classList.contains('hidden')).toBe(false);
    });
  });

  it('handles zero spend and zero conversions gracefully', async () => {
    const edgeCampaigns = [
      { id: 4, name: 'Edge Case', spend: 0, revenue: 0, conversions: 0, platform: { id: 1, name: 'Facebook' }, user_id: 1 },
    ];

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: edgeCampaigns }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total_spend: 0, total_revenue: 0, overall_roas: null }),
      });

    const { initDashboard } = await import('../../resources/js/components/dashboard.js');
    initDashboard();

    await vi.waitFor(() => {
      const rows = document.querySelectorAll('#campaigns-table-body tr');
      expect(rows.length).toBe(1);
    });

    const row = document.querySelector('#campaigns-table-body tr')!;
    expect(row.children[5].textContent).toBe('N/A');
    expect(row.children[6].textContent).toBe('N/A');
  });

  it('renders summary bar with total spend, revenue, and ROAS', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: MOCK_CAMPAIGNS }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total_spend: 12800.5, total_revenue: 52330, overall_roas: 4.09 }),
      });

    const { initDashboard } = await import('../../resources/js/components/dashboard.js');
    initDashboard();

    await vi.waitFor(() => {
      const spend = document.getElementById('total-spend');
      expect(spend!.textContent).toBe('$12,800.50');
    });

    const revenue = document.getElementById('total-revenue');
    expect(revenue!.textContent).toBe('$52,330.00');

    const roas = document.getElementById('overall-roas');
    expect(roas!.textContent).toBe('4.09x');
  });

  it('shows fallback values in summary bar when fetch fails', async () => {
    (global.fetch as any)
      .mockRejectedValueOnce(new Error('Network error'));

    const { initDashboard } = await import('../../resources/js/components/dashboard.js');
    initDashboard();

    await vi.waitFor(() => {
      const spend = document.getElementById('total-spend');
      expect(spend!.textContent).toBe('—');
    });
  });

  it('shows N/A in summary bar when spend is zero', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: MOCK_CAMPAIGNS }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total_spend: 0, total_revenue: 0, overall_roas: null }),
      });

    const { initDashboard } = await import('../../resources/js/components/dashboard.js');
    initDashboard();

    await vi.waitFor(() => {
      const roas = document.getElementById('overall-roas');
      expect(roas!.textContent).toBe('N/A');
    });
  });

  it('shows all campaigns when ROAS filter is empty', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: MOCK_CAMPAIGNS }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total_spend: 12800.5, total_revenue: 52330, overall_roas: 4.09 }),
      });

    const { initDashboard } = await import('../../resources/js/components/dashboard.js');
    initDashboard();

    await vi.waitFor(() => {
      const rows = document.querySelectorAll('#campaigns-table-body tr');
      expect(rows.length).toBe(3);
    });
  });

  it('filters campaigns by minimum ROAS value', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: MOCK_CAMPAIGNS }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total_spend: 12800.5, total_revenue: 52330, overall_roas: 4.09 }),
      });

    const { initDashboard } = await import('../../resources/js/components/dashboard.js');
    initDashboard();

    await vi.waitFor(() => {
      const rows = document.querySelectorAll('#campaigns-table-body tr');
      expect(rows.length).toBe(3);
    });

    const filterInput = document.getElementById('min-roas-filter') as HTMLInputElement;
    filterInput.value = '3.0';
    filterInput.dispatchEvent(new Event('input'));

    await vi.waitFor(() => {
      const rows = document.querySelectorAll('#campaigns-table-body tr');
      expect(rows.length).toBe(2);
    });

    const rows = document.querySelectorAll('#campaigns-table-body tr');
    expect(rows[0].children[0].textContent).toBe('Wrinkle Cream FB');
    expect(rows[1].children[0].textContent).toBe('Zepbound Google');
  });

  it('shows all campaigns when ROAS filter is non-numeric', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: MOCK_CAMPAIGNS }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total_spend: 12800.5, total_revenue: 52330, overall_roas: 4.09 }),
      });

    const { initDashboard } = await import('../../resources/js/components/dashboard.js');
    initDashboard();

    await vi.waitFor(() => {
      const rows = document.querySelectorAll('#campaigns-table-body tr');
      expect(rows.length).toBe(3);
    });

    const filterInput = document.getElementById('min-roas-filter') as HTMLInputElement;
    filterInput.value = 'abc';
    filterInput.dispatchEvent(new Event('input'));

    await vi.waitFor(() => {
      const rows = document.querySelectorAll('#campaigns-table-body tr');
      expect(rows.length).toBe(3);
    });
  });

  it('shows empty state when ROAS filter excludes all campaigns', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: MOCK_CAMPAIGNS }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total_spend: 12800.5, total_revenue: 52330, overall_roas: 4.09 }),
      });

    const { initDashboard } = await import('../../resources/js/components/dashboard.js');
    initDashboard();

    await vi.waitFor(() => {
      const rows = document.querySelectorAll('#campaigns-table-body tr');
      expect(rows.length).toBe(3);
    });

    const filterInput = document.getElementById('min-roas-filter') as HTMLInputElement;
    filterInput.value = '10';
    filterInput.dispatchEvent(new Event('input'));

    await vi.waitFor(() => {
      const empty = document.getElementById('campaigns-empty');
      expect(empty!.classList.contains('hidden')).toBe(false);
    });

    const table = document.getElementById('campaigns-table');
    expect(table!.classList.contains('hidden')).toBe(true);
  });
});
