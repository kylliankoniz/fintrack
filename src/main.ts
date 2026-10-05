/**
 * FinTrack - Personal Budget Dashboard
 * Vanilla JavaScript (ES6+) Architecture
 * Supporting all 5 Navigation Components:
 * 1. Dashboard
 * 2. Analytics & Budgets
 * 3. Master Transactions Ledger
 * 4. Accounts & Cards
 * 5. Savings Goals
 */

declare const Chart: any;
declare const lucide: any;

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

interface CategoryMeta {
  name: string;
  color: string;
  icon: string;
}

interface BudgetCategory {
  category: string;
  cap: number;
}

interface AccountItem {
  id: string;
  name: string;
  type: 'credit' | 'checking' | 'savings' | 'investment';
  digits: string;
  balance: number;
  limit?: number;
  isFrozen?: boolean;
}

interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  date: string;
  category: 'shield' | 'car' | 'plane' | 'home' | 'laptop';
}

const EXPENSE_CATEGORIES: Record<string, CategoryMeta> = {
  'Housing & Rent': { name: 'Housing & Rent', color: '#8b5cf6', icon: 'home' },
  'Food & Dining': { name: 'Food & Dining', color: '#f97316', icon: 'utensils' },
  'Entertainment': { name: 'Entertainment', color: '#ec4899', icon: 'clapperboard' },
  'Utilities & Bills': { name: 'Utilities & Bills', color: '#eab308', icon: 'zap' },
  'Transportation': { name: 'Transportation', color: '#06b6d4', icon: 'car' },
  'Healthcare': { name: 'Healthcare', color: '#ef4444', icon: 'heart-pulse' },
  'Shopping': { name: 'Shopping', color: '#3b82f6', icon: 'shopping-bag' },
  'Other Expense': { name: 'Other Expense', color: '#a855f7', icon: 'tag' },
};

const INCOME_CATEGORIES: Record<string, CategoryMeta> = {
  'Salary & Earnings': { name: 'Salary & Earnings', color: '#10b981', icon: 'briefcase' },
  'Freelance & Consulting': { name: 'Freelance & Consulting', color: '#10b981', icon: 'laptop' },
  'Investment': { name: 'Investment', color: '#06b6d4', icon: 'trending-up' },
  'Bonus & Rewards': { name: 'Bonus & Rewards', color: '#f59e0b', icon: 'gift' },
  'Other Income': { name: 'Other Income', color: '#8b5cf6', icon: 'plus-circle' },
};

// Seed dataset matching reference UI
const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Senior Eng Salary',
    amount: 5400.0,
    type: 'income',
    category: 'Salary & Earnings',
    date: '2025-05-01',
    createdAt: 1714521600000,
  },
  {
    id: 'tx-2',
    title: 'Modern Loft Rent',
    amount: 1850.0,
    type: 'expense',
    category: 'Housing & Rent',
    date: '2025-05-02',
    createdAt: 1714608000000,
  },
  {
    id: 'tx-3',
    title: 'Whole Foods Market',
    amount: 184.2,
    type: 'expense',
    category: 'Food & Dining',
    date: '2025-05-03',
    createdAt: 1714694400000,
  },
  {
    id: 'tx-4',
    title: 'Freelance UI Consulting',
    amount: 1250.0,
    type: 'income',
    category: 'Salary & Earnings',
    date: '2025-05-04',
    createdAt: 1714780800000,
  },
  {
    id: 'tx-5',
    title: 'Fiber Optic Internet',
    amount: 85.0,
    type: 'expense',
    category: 'Utilities & Bills',
    date: '2025-05-05',
    createdAt: 1714867200000,
  },
  {
    id: 'tx-6',
    title: 'Tesla Supercharging',
    amount: 42.5,
    type: 'expense',
    category: 'Transportation',
    date: '2025-05-06',
    createdAt: 1714953600000,
  },
  {
    id: 'tx-7',
    title: 'Cinema & Dinner Night',
    amount: 110.0,
    type: 'expense',
    category: 'Entertainment',
    date: '2025-05-07',
    createdAt: 1715040000000,
  },
  {
    id: 'tx-8',
    title: 'Investment Dividend',
    amount: 215.3,
    type: 'income',
    category: 'Investment',
    date: '2025-05-08',
    createdAt: 1715126400000,
  },
];

const INITIAL_BUDGET_CAPS: BudgetCategory[] = [
  { category: 'Housing & Rent', cap: 2000 },
  { category: 'Food & Dining', cap: 600 },
  { category: 'Transportation', cap: 300 },
  { category: 'Utilities & Bills', cap: 200 },
  { category: 'Entertainment', cap: 250 },
  { category: 'Healthcare', cap: 150 },
  { category: 'Shopping', cap: 200 },
  { category: 'Other Expense', cap: 100 },
];

const INITIAL_ACCOUNTS: AccountItem[] = [
  {
    id: 'acc-1',
    name: 'Obsidian Black Card',
    type: 'credit',
    digits: '8821',
    balance: 840.0,
    limit: 20000,
    isFrozen: false,
  },
  {
    id: 'acc-2',
    name: 'Apple Titanium Card',
    type: 'credit',
    digits: '4192',
    balance: 1000.0,
    limit: 10000,
    isFrozen: false,
  },
  {
    id: 'acc-3',
    name: 'Chase Sapphire Checking',
    type: 'checking',
    digits: '3920',
    balance: 4593.6,
  },
  {
    id: 'acc-4',
    name: 'Marcus High-Yield Savings (4.75%)',
    type: 'savings',
    digits: '7714',
    balance: 27856.4,
  },
  {
    id: 'acc-5',
    name: 'Vanguard Total Stock Market Index',
    type: 'investment',
    digits: '9902',
    balance: 42100.0,
  },
];

const INITIAL_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    name: 'Emergency Fund (6 Months)',
    target: 25000,
    current: 18000,
    date: '2026-12-31',
    category: 'shield',
  },
  {
    id: 'goal-2',
    name: 'New Electric Vehicle (Tesla Model Y)',
    target: 35000,
    current: 12500,
    date: '2027-08-15',
    category: 'car',
  },
  {
    id: 'goal-3',
    name: 'Japan Vacation (Tokyo & Kyoto)',
    target: 5000,
    current: 4200,
    date: '2026-11-20',
    category: 'plane',
  },
  {
    id: 'goal-4',
    name: 'Home Down Payment',
    target: 80000,
    current: 45000,
    date: '2028-06-30',
    category: 'home',
  },
];

class FinTrackApp {
  private transactions: Transaction[] = [];
  private budgetCaps: BudgetCategory[] = [];
  private accounts: AccountItem[] = [];
  private goals: SavingsGoal[] = [];

  private currentView: 'dashboard' | 'analytics' | 'transactions' | 'accounts' | 'goals' = 'dashboard';
  private currentFilter: 'all' | 'income' | 'expense' = 'all';
  private searchQuery: string = '';
  private currentFormType: 'income' | 'expense' = 'expense';

  // Ledger dedicated view filters
  private ledgerSearchQuery: string = '';
  private ledgerTypeFilter: 'all' | 'income' | 'expense' = 'all';
  private ledgerCategoryFilter: string = 'all';
  private ledgerSortOrder: 'newest' | 'oldest' | 'highest' | 'lowest' = 'newest';

  // Modal active states
  private activeDepositGoalId: string | null = null;
  private activeAdjustBudgetCategory: string | null = null;

  // Chart instances
  private categoryChartInstance: any = null;
  private trendChartInstance: any = null;

  private currencySymbol: string = '$';
  private simulationLatency: number = 400;
  private isDarkMode: boolean = true;

  constructor() {
    this.init();
  }

  private async init() {
    this.initTheme();
    this.loadPersistedData();
    this.setupEventListeners();
    this.setDefaultFormDate();
    this.updateCategoryOptions('expense');
    this.populateLedgerCategoryFilter();

    // Initial fetch simulating asynchronous REST API
    await this.fetchTransactionsAPI();

    this.initCategoryChart();
    this.renderAll();
    this.renderLucideIcons();
  }

  // --- THEME MANAGEMENT ---
  private initTheme() {
    const savedTheme = localStorage.getItem('fintrack_theme');
    if (savedTheme === 'light') {
      this.setTheme(false);
    } else {
      this.setTheme(true);
    }
  }

  private setTheme(isDark: boolean) {
    this.isDarkMode = isDark;
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');

    if (isDark) {
      html.classList.add('dark');
      html.classList.remove('light');
      localStorage.setItem('fintrack_theme', 'dark');
      if (themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
      localStorage.setItem('fintrack_theme', 'light');
      if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
    }

    this.renderLucideIcons();
    this.updateAllChartsTheme();
  }

  private toggleTheme() {
    this.setTheme(!this.isDarkMode);
    this.showToast(this.isDarkMode ? 'Dark mode enabled' : 'Light mode enabled', 'info');
  }

  // --- DATA STORAGE & REST API SIMULATION ---
  private loadPersistedData() {
    try {
      const storedTx = localStorage.getItem('fintrack_transactions_v2');
      this.transactions = storedTx ? JSON.parse(storedTx) : [...SEED_TRANSACTIONS];

      const storedBudgets = localStorage.getItem('fintrack_budgets_v2');
      this.budgetCaps = storedBudgets ? JSON.parse(storedBudgets) : [...INITIAL_BUDGET_CAPS];

      const storedAccounts = localStorage.getItem('fintrack_accounts_v2');
      this.accounts = storedAccounts ? JSON.parse(storedAccounts) : [...INITIAL_ACCOUNTS];

      const storedGoals = localStorage.getItem('fintrack_goals_v2');
      this.goals = storedGoals ? JSON.parse(storedGoals) : [...INITIAL_GOALS];
    } catch {
      this.transactions = [...SEED_TRANSACTIONS];
      this.budgetCaps = [...INITIAL_BUDGET_CAPS];
      this.accounts = [...INITIAL_ACCOUNTS];
      this.goals = [...INITIAL_GOALS];
    }
  }

  private persistAll() {
    localStorage.setItem('fintrack_transactions_v2', JSON.stringify(this.transactions));
    localStorage.setItem('fintrack_budgets_v2', JSON.stringify(this.budgetCaps));
    localStorage.setItem('fintrack_accounts_v2', JSON.stringify(this.accounts));
    localStorage.setItem('fintrack_goals_v2', JSON.stringify(this.goals));
  }

  private async fetchTransactionsAPI(): Promise<void> {
    const apiStatus = document.getElementById('api-status-text');
    const syncIcon = document.getElementById('sync-icon');

    if (apiStatus) apiStatus.textContent = 'REST API: Fetching...';
    if (syncIcon) syncIcon.classList.add('animate-spin');

    return new Promise((resolve) => {
      setTimeout(() => {
        this.loadPersistedData();
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        const syncTimestamp = document.getElementById('sync-timestamp-text');
        if (syncTimestamp) syncTimestamp.textContent = `Synced at ${timeStr}`;

        if (apiStatus) apiStatus.textContent = 'REST API: Live Synced (REST 200)';
        if (syncIcon) syncIcon.classList.remove('animate-spin');
        resolve();
      }, this.simulationLatency);
    });
  }

  // --- NAVIGATION & VIEW SWITCHING (Focus Mode Target) ---
  public switchView(viewName: 'dashboard' | 'analytics' | 'transactions' | 'accounts' | 'goals') {
    this.currentView = viewName;

    // Update active nav button styles in the sidebar
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach((btn) => {
      const targetNav = btn.getAttribute('data-nav');
      if (targetNav === viewName) {
        btn.className =
          'nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 active cursor-pointer';
      } else {
        btn.className =
          'nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all text-app-muted hover:text-app-main hover:bg-slate-200/60 dark:hover:bg-slate-800/60 cursor-pointer';
      }
    });

    // Update page header title and subtitle
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    if (pageTitle && pageSubtitle) {
      switch (viewName) {
        case 'dashboard':
          pageTitle.textContent = 'Financial Overview';
          pageSubtitle.textContent = 'Welcome back, Kyllian • Live real-time ledger';
          break;
        case 'analytics':
          pageTitle.textContent = 'Analytics & Budgets';
          pageSubtitle.textContent = 'Monthly cashflow dynamics, budget health, and expense caps';
          break;
        case 'transactions':
          pageTitle.textContent = 'Transactions Ledger';
          pageSubtitle.textContent = 'Historical financial records with multi-dimensional filtering';
          break;
        case 'accounts':
          pageTitle.textContent = 'Accounts & Payment Cards';
          pageSubtitle.textContent = 'Linked checking, high-yield savings, and revolving credit accounts';
          break;
        case 'goals':
          pageTitle.textContent = 'Savings Goals & Milestones';
          pageSubtitle.textContent = 'Track target allocations and automated deposit progress';
          break;
      }
    }

    // Toggle view containers visibility
    const views = document.querySelectorAll('.view-panel');
    views.forEach((v) => {
      v.classList.add('hidden');
    });

    const activeViewEl = document.getElementById(`view-${viewName}`);
    if (activeViewEl) {
      activeViewEl.classList.remove('hidden');
    }

    // Specific view initializations
    if (viewName === 'analytics') {
      this.initTrendChart();
      this.renderAnalyticsView();
    } else if (viewName === 'transactions') {
      this.renderLedgerTable();
    } else if (viewName === 'accounts') {
      this.renderAccountsView();
    } else if (viewName === 'goals') {
      this.renderGoalsView();
    }

    this.renderLucideIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- VIEW 1: DASHBOARD RENDERING ---
  private initCategoryChart() {
    const canvas = document.getElementById('category-chart') as HTMLCanvasElement;
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { labels, data, colors } = this.calculateCategoryBreakdown();

    this.categoryChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels.length ? labels : ['No Expenses'],
        datasets: [
          {
            data: data.length ? data : [1],
            backgroundColor: colors.length ? colors : ['#334155'],
            borderColor: this.isDarkMode ? '#111827' : '#ffffff',
            borderWidth: 2,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '74%',
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: data.length > 0,
            backgroundColor: this.isDarkMode ? '#0f172a' : '#ffffff',
            titleColor: this.isDarkMode ? '#f8fafc' : '#0f172a',
            bodyColor: this.isDarkMode ? '#94a3b8' : '#475569',
            borderColor: this.isDarkMode ? '#334155' : '#cbd5e1',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (context: any) => {
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return ` ${context.label}: ${this.formatCurrency(value)} (${percentage}%)`;
              },
            },
          },
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 650,
        },
      },
    });
  }

  private updateCategoryChart() {
    if (!this.categoryChartInstance) return;

    const { labels, data, colors } = this.calculateCategoryBreakdown();

    if (data.length === 0) {
      this.categoryChartInstance.data.labels = ['No Outflow Recorded'];
      this.categoryChartInstance.data.datasets[0].data = [1];
      this.categoryChartInstance.data.datasets[0].backgroundColor = ['#334155'];
      this.categoryChartInstance.options.plugins.tooltip.enabled = false;
    } else {
      this.categoryChartInstance.data.labels = labels;
      this.categoryChartInstance.data.datasets[0].data = data;
      this.categoryChartInstance.data.datasets[0].backgroundColor = colors;
      this.categoryChartInstance.data.datasets[0].borderColor = this.isDarkMode ? '#111827' : '#ffffff';
      this.categoryChartInstance.options.plugins.tooltip.enabled = true;
    }

    this.categoryChartInstance.update();
  }

  private renderOverviewCards() {
    let totalIncome = 0;
    let totalExpenses = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    for (const tx of this.transactions) {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
        incomeCount++;
      } else {
        totalExpenses += tx.amount;
        expenseCount++;
      }
    }

    const netBalance = totalIncome - totalExpenses;

    const balanceEl = document.getElementById('metric-total-balance');
    const incomeEl = document.getElementById('metric-total-income');
    const expensesEl = document.getElementById('metric-total-expenses');
    const incomeSubEl = document.getElementById('metric-income-sub');
    const expensesSubEl = document.getElementById('metric-expenses-sub');
    const chartPill = document.getElementById('chart-total-expensed-pill');
    const chartCenterAmount = document.getElementById('chart-center-amount');

    if (balanceEl) {
      balanceEl.textContent = this.formatCurrency(netBalance);
      balanceEl.className = `text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 font-mono tabular-nums ${
        netBalance >= 0 ? 'text-app-main' : 'text-rose-500 dark:text-rose-400'
      }`;
    }

    if (incomeEl) incomeEl.textContent = this.formatCurrency(totalIncome);
    if (expensesEl) expensesEl.textContent = this.formatCurrency(totalExpenses);

    if (incomeSubEl) {
      incomeSubEl.textContent = `${incomeCount} transactions • Recurring active`;
    }
    if (expensesSubEl) {
      expensesSubEl.textContent = `${expenseCount} transactions • Under budget cap`;
    }

    if (chartPill) {
      chartPill.textContent = `${this.formatCurrency(totalExpenses)} Expensed`;
    }

    if (chartCenterAmount) {
      chartCenterAmount.textContent = `${this.currencySymbol}${Math.round(totalExpenses).toLocaleString()}`;
    }

    // Dynamic savings rate update
    const savingsRatio =
      totalIncome > 0
        ? Math.max(0, Math.min(100, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)))
        : 0;
    const savingsDisplay = document.getElementById('savings-rate-display');
    const savingsBar = document.getElementById('savings-progress-bar');
    if (savingsDisplay) savingsDisplay.textContent = `${savingsRatio}%`;
    if (savingsBar) savingsBar.style.width = `${savingsRatio}%`;
  }

  private renderChartLegend() {
    const container = document.getElementById('chart-legend-container');
    if (!container) return;

    const { sortedCategories } = this.calculateCategoryBreakdown();
    const totalExpenses = this.transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    if (sortedCategories.length === 0) {
      container.innerHTML = `
        <div class="text-xs text-slate-500 italic py-2">
          No expense entries yet. Add your first expense above.
        </div>
      `;
      return;
    }

    container.innerHTML = sortedCategories
      .map(([category, amount]) => {
        const percentage = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
        const color = EXPENSE_CATEGORIES[category]?.color || '#8b5cf6';

        return `
          <div class="flex items-center gap-2 bg-surface-elevated border border-app px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-colors hover:border-slate-400 dark:hover:border-slate-700">
            <span class="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style="background-color: ${color}"></span>
            <span class="text-app-main font-semibold">${this.escapeHtml(category)}</span>
            <span class="text-app-muted font-mono">${percentage}% • ${this.formatCurrency(amount)}</span>
          </div>
        `;
      })
      .join('');
  }

  private renderRecentTransactionsList() {
    const container = document.getElementById('tx-list-container');
    const countSubtitle = document.getElementById('tx-count-subtitle');
    const footerCount = document.getElementById('tx-list-footer-count');

    if (!container) return;

    let filtered = [...this.transactions];
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter((t) => t.type === this.currentFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (t) => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }

    if (countSubtitle) {
      countSubtitle.textContent = `Showing ${filtered.length} of ${this.transactions.length} entries`;
    }
    if (footerCount) {
      footerCount.textContent = `${filtered.length} transactions shown`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-12 text-center text-app-muted">
          <i data-lucide="inbox" class="w-10 h-10 mb-2 stroke-1 text-app-soft"></i>
          <p class="text-sm font-semibold text-app-main">No matching transactions found</p>
          <p class="text-xs text-app-muted mt-1">Try adjusting your search query or active filter.</p>
        </div>
      `;
      this.renderLucideIcons();
      return;
    }

    container.innerHTML = filtered
      .map((tx) => {
        const isIncome = tx.type === 'income';
        const meta = isIncome ? INCOME_CATEGORIES[tx.category] : EXPENSE_CATEGORIES[tx.category];
        const iconName = meta?.icon || (isIncome ? 'arrow-down-left' : 'arrow-up-right');
        const formattedDate = this.formatDate(tx.date);

        return `
          <div class="group flex items-center justify-between p-3 rounded-xl card-item-theme border border-app transition-all duration-150" data-id="${tx.id}">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                isIncome
                  ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20'
              }">
                <i data-lucide="${iconName}" class="w-4 h-4"></i>
              </div>
              <div class="min-w-0">
                <h4 class="text-xs font-bold text-app-main tracking-tight truncate group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors">
                  ${this.escapeHtml(tx.title)}
                </h4>
                <div class="flex items-center gap-1.5 text-[11px] text-app-muted mt-0.5 truncate">
                  <span>${this.escapeHtml(tx.category)}</span>
                  <span>•</span>
                  <span>${formattedDate}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 shrink-0">
              <div class="text-right">
                <div class="text-xs font-mono font-bold ${
                  isIncome ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
                }">
                  ${isIncome ? '+' : '-'}${this.formatCurrency(tx.amount)}
                </div>
                <div class="text-[9px] font-bold uppercase tracking-wider ${
                  isIncome ? 'text-emerald-600 dark:text-emerald-400/80' : 'text-rose-600 dark:text-rose-400/80'
                }">
                  ${tx.type}
                </div>
              </div>

              <button class="delete-tx-btn p-1.5 rounded-lg text-app-soft hover:text-rose-500 hover:bg-rose-500/10 opacity-70 group-hover:opacity-100 transition-all cursor-pointer" data-id="${tx.id}" title="Delete transaction">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        `;
      })
      .join('');

    this.renderLucideIcons();
  }

  // --- VIEW 2: ANALYTICS & BUDGETS RENDERING ---
  private initTrendChart() {
    const canvas = document.getElementById('analytics-trend-chart') as HTMLCanvasElement;
    if (!canvas || typeof Chart === 'undefined') return;

    if (this.trendChartInstance) {
      this.trendChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simulate 6 months of historical trend
    const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May (Current)'];
    const incomeTrend = [5200, 5400, 5800, 6100, 6400, 6865.3];
    const expenseTrend = [2800, 2600, 2450, 2300, 2400, 2271.7];

    this.trendChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Inflow / Income',
            data: incomeTrend,
            backgroundColor: '#10b981',
            borderRadius: 6,
            barPercentage: 0.6,
          },
          {
            label: 'Outflow / Expenses',
            data: expenseTrend,
            backgroundColor: '#f43f5e',
            borderRadius: 6,
            barPercentage: 0.6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: this.isDarkMode ? '#0f172a' : '#ffffff',
            titleColor: this.isDarkMode ? '#f8fafc' : '#0f172a',
            bodyColor: this.isDarkMode ? '#94a3b8' : '#475569',
            borderColor: this.isDarkMode ? '#334155' : '#cbd5e1',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (context: any) => ` ${context.dataset.label}: ${this.formatCurrency(context.parsed.y)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: this.isDarkMode ? '#94a3b8' : '#64748b',
              font: { size: 11 },
            },
          },
          y: {
            grid: {
              color: this.isDarkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)',
            },
            ticks: {
              color: this.isDarkMode ? '#94a3b8' : '#64748b',
              font: { size: 11 },
              callback: (val: number) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`,
            },
          },
        },
      },
    });
  }

  private renderAnalyticsView() {
    // Total budget calculation
    const totalBudgetCap = this.budgetCaps.reduce((acc, b) => acc + b.cap, 0);
    const totalExpenses = this.transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const safeToSpend = Math.max(0, totalBudgetCap - totalExpenses);
    const utilization = totalBudgetCap > 0 ? ((totalExpenses / totalBudgetCap) * 100).toFixed(1) : '0';

    const capEl = document.getElementById('analytics-budget-cap');
    const spentEl = document.getElementById('analytics-spent-amount');
    const safeEl = document.getElementById('analytics-remaining-amount');
    const utilText = document.getElementById('analytics-utilization-text');

    if (capEl) capEl.textContent = this.formatCurrency(totalBudgetCap);
    if (spentEl) spentEl.textContent = this.formatCurrency(totalExpenses);
    if (safeEl) safeEl.textContent = this.formatCurrency(safeToSpend);
    if (utilText) utilText.textContent = `${utilization}% of total budget used`;

    // Render category cards
    const grid = document.getElementById('analytics-categories-grid');
    if (!grid) return;

    // Calculate actual spend per category
    const catSpendMap: Record<string, number> = {};
    for (const tx of this.transactions) {
      if (tx.type === 'expense') {
        catSpendMap[tx.category] = (catSpendMap[tx.category] || 0) + tx.amount;
      }
    }

    grid.innerHTML = this.budgetCaps
      .map((item) => {
        const spent = catSpendMap[item.category] || 0;
        const percentage = Math.min(100, Math.round((spent / item.cap) * 100));
        const meta = EXPENSE_CATEGORIES[item.category] || { icon: 'tag', color: '#8b5cf6' };

        let progressColor = 'bg-emerald-500';
        let statusBadge = 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        let statusText = 'Normal';

        if (percentage >= 90) {
          progressColor = 'bg-rose-500';
          statusBadge = 'text-rose-500 dark:text-rose-400 bg-rose-500/10 border-rose-500/20';
          statusText = 'Critical Cap';
        } else if (percentage >= 75) {
          progressColor = 'bg-amber-500';
          statusBadge = 'text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
          statusText = 'Near Limit';
        }

        return `
          <div class="bg-surface-elevated rounded-xl p-4 border border-app shadow-xs space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center border" style="background-color: ${meta.color}15; color: ${meta.color}; border-color: ${meta.color}30">
                  <i data-lucide="${meta.icon}" class="w-4 h-4"></i>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-app-main">${this.escapeHtml(item.category)}</h4>
                  <p class="text-[10px] text-app-muted">${this.formatCurrency(spent)} of ${this.formatCurrency(item.cap)}</p>
                </div>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusBadge}">${statusText}</span>
            </div>

            <div>
              <div class="flex justify-between text-[11px] text-app-muted mb-1 font-mono">
                <span>${percentage}% used</span>
                <span>${spent > item.cap ? 'Exceeded by ' + this.formatCurrency(spent - item.cap) : this.formatCurrency(item.cap - spent) + ' left'}</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div class="${progressColor} h-2 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
              </div>
            </div>

            <div class="pt-2 border-t border-app flex justify-end">
              <button class="adjust-budget-btn text-[11px] font-semibold text-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer" data-category="${this.escapeHtml(item.category)}" data-cap="${item.cap}">
                Adjust Cap →
              </button>
            </div>
          </div>
        `;
      })
      .join('');

    this.renderLucideIcons();
  }

  // --- VIEW 3: MASTER TRANSACTIONS LEDGER ---
  private populateLedgerCategoryFilter() {
    const select = document.getElementById('ledger-category-filter') as HTMLSelectElement;
    if (!select) return;

    const allCategories = [
      ...Object.keys(EXPENSE_CATEGORIES),
      ...Object.keys(INCOME_CATEGORIES),
    ];
    const unique = Array.from(new Set(allCategories));

    select.innerHTML =
      '<option value="all">All Categories</option>' +
      unique.map((cat) => `<option value="${this.escapeHtml(cat)}">${this.escapeHtml(cat)}</option>`).join('');
  }

  private renderLedgerTable() {
    const tbody = document.getElementById('ledger-table-body');
    const summaryCount = document.getElementById('ledger-summary-count');
    const summaryIncome = document.getElementById('ledger-summary-income');
    const summaryExpense = document.getElementById('ledger-summary-expense');
    const summaryNet = document.getElementById('ledger-summary-net');

    if (!tbody) return;

    let filtered = [...this.transactions];

    // Filter by type
    if (this.ledgerTypeFilter !== 'all') {
      filtered = filtered.filter((t) => t.type === this.ledgerTypeFilter);
    }

    // Filter by category
    if (this.ledgerCategoryFilter !== 'all') {
      filtered = filtered.filter((t) => t.category === this.ledgerCategoryFilter);
    }

    // Filter by search query
    if (this.ledgerSearchQuery.trim()) {
      const q = this.ledgerSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (t) => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (this.ledgerSortOrder === 'newest') {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else if (this.ledgerSortOrder === 'oldest') {
      filtered.sort((a, b) => a.createdAt - b.createdAt);
    } else if (this.ledgerSortOrder === 'highest') {
      filtered.sort((a, b) => b.amount - a.amount);
    } else if (this.ledgerSortOrder === 'lowest') {
      filtered.sort((a, b) => a.amount - b.amount);
    }

    // Calculate ledger summary metrics
    const inflow = filtered
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const outflow = filtered
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    const net = inflow - outflow;

    if (summaryCount) summaryCount.textContent = `${filtered.length} entries filtered`;
    if (summaryIncome) summaryIncome.textContent = `+${this.formatCurrency(inflow)} Inflow`;
    if (summaryExpense) summaryExpense.textContent = `-${this.formatCurrency(outflow)} Outflow`;
    if (summaryNet) {
      summaryNet.textContent = `${net >= 0 ? '+' : '-'}${this.formatCurrency(Math.abs(net))} Net`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="py-12 text-center text-app-muted">
            <i data-lucide="search-x" class="w-8 h-8 mx-auto mb-2 text-app-soft"></i>
            <p class="font-semibold text-app-main">No ledger entries match current criteria</p>
            <p class="text-xs text-app-muted mt-1">Try resetting search or category filters.</p>
          </td>
        </tr>
      `;
      this.renderLucideIcons();
      return;
    }

    tbody.innerHTML = filtered
      .map((tx) => {
        const isIncome = tx.type === 'income';
        const meta = isIncome ? INCOME_CATEGORIES[tx.category] : EXPENSE_CATEGORIES[tx.category];
        const iconName = meta?.icon || (isIncome ? 'arrow-down-left' : 'arrow-up-right');
        const formattedDate = this.formatDate(tx.date);

        return `
          <tr class="hover:bg-surface-elevated transition-colors">
            <td class="py-3.5 px-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${
                  isIncome
                    ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20'
                }">
                  <i data-lucide="${iconName}" class="w-4 h-4"></i>
                </div>
                <div>
                  <div class="font-bold text-app-main">${this.escapeHtml(tx.title)}</div>
                  <div class="text-[10px] text-app-muted font-mono">ID: ${tx.id}</div>
                </div>
              </div>
            </td>
            <td class="py-3.5 px-4 text-app-main">${this.escapeHtml(tx.category)}</td>
            <td class="py-3.5 px-4 text-app-muted font-mono">${formattedDate}</td>
            <td class="py-3.5 px-4">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                isIncome
                  ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20'
              }">${tx.type}</span>
            </td>
            <td class="py-3.5 px-4 text-right font-mono font-bold ${
              isIncome ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
            }">
              ${isIncome ? '+' : '-'}${this.formatCurrency(tx.amount)}
            </td>
            <td class="py-3.5 px-4 text-center">
              <button class="delete-tx-btn p-1.5 rounded-lg text-app-soft hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer" data-id="${tx.id}" title="Delete transaction">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </td>
          </tr>
        `;
      })
      .join('');

    this.renderLucideIcons();
  }

  // --- VIEW 4: ACCOUNTS & CARDS RENDERING ---
  private renderAccountsView() {
    const cardsGrid = document.getElementById('accounts-cards-grid');
    const listContainer = document.getElementById('accounts-list-container');
    const networthEl = document.getElementById('accounts-total-networth');
    const cashEl = document.getElementById('accounts-cash-balance');
    const debtEl = document.getElementById('accounts-credit-debt');
    const availEl = document.getElementById('accounts-avail-credit');

    // Calculate metrics
    let totalAssets = 0;
    let creditDebt = 0;
    let availCredit = 0;
    let cashBalance = 0;

    for (const acc of this.accounts) {
      if (acc.type === 'credit') {
        creditDebt += acc.balance;
        if (acc.limit) availCredit += Math.max(0, acc.limit - acc.balance);
      } else {
        totalAssets += acc.balance;
        if (acc.type === 'checking' || acc.type === 'savings') {
          cashBalance += acc.balance;
        }
      }
    }

    const netWorth = totalAssets - creditDebt;

    if (networthEl) networthEl.textContent = this.formatCurrency(netWorth);
    if (cashEl) cashEl.textContent = this.formatCurrency(cashBalance);
    if (debtEl) debtEl.textContent = this.formatCurrency(creditDebt);
    if (availEl) availEl.textContent = this.formatCurrency(availCredit);

    // Render Visual Cards
    if (cardsGrid) {
      cardsGrid.innerHTML = this.accounts
        .map((acc) => {
          const isCredit = acc.type === 'credit';
          const cardGradient =
            acc.name.includes('Obsidian')
              ? 'bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-white border-slate-700/80 shadow-xl'
              : acc.name.includes('Apple')
              ? 'bg-gradient-to-tr from-slate-300 via-slate-100 to-slate-200 text-slate-900 border-slate-300 shadow-md'
              : acc.type === 'checking'
              ? 'bg-gradient-to-tr from-blue-900 via-indigo-900 to-slate-900 text-white border-blue-800/80 shadow-xl'
              : 'bg-gradient-to-tr from-teal-900 via-emerald-900 to-slate-900 text-white border-emerald-800/80 shadow-xl';

          const textColor = acc.name.includes('Apple') ? 'text-slate-900' : 'text-white';
          const textMuted = acc.name.includes('Apple') ? 'text-slate-600' : 'text-slate-400';

          return `
            <div class="relative p-6 rounded-2xl border ${cardGradient} flex flex-col justify-between h-56 transition-transform duration-200 hover:-translate-y-1">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-[10px] uppercase font-bold tracking-wider opacity-80">${this.escapeHtml(acc.name)}</span>
                  <div class="text-xs font-semibold mt-0.5 opacity-90">${isCredit ? 'Revolving Credit' : 'Depository Account'}</div>
                </div>
                <div class="flex items-center gap-1.5 opacity-80">
                  <i data-lucide="wifi" class="w-4 h-4"></i>
                  <i data-lucide="credit-card" class="w-5 h-5"></i>
                </div>
              </div>

              <!-- Chip & Digits -->
              <div>
                <div class="w-8 h-6 rounded-md bg-amber-400/80 border border-amber-300/60 mb-3 shadow-xs"></div>
                <div class="font-mono text-base tracking-widest ${textColor}">
                  •••• •••• •••• ${acc.digits}
                </div>
              </div>

              <!-- Balance & Controls -->
              <div class="flex items-end justify-between pt-2 border-t border-white/10">
                <div>
                  <div class="text-[10px] uppercase font-medium ${textMuted}">${isCredit ? 'Current Balance' : 'Available Balance'}</div>
                  <div class="text-lg font-mono font-extrabold ${textColor}">${this.formatCurrency(acc.balance)}</div>
                </div>
                <div class="text-right">
                  <button class="toggle-card-freeze-btn text-[11px] font-semibold underline opacity-80 hover:opacity-100 transition-opacity cursor-pointer" data-id="${acc.id}">
                    ${acc.isFrozen ? '❄ Unfreeze' : 'Freeze'}
                  </button>
                </div>
              </div>
            </div>
          `;
        })
        .join('');
    }

    // Render detailed bank accounts list
    if (listContainer) {
      listContainer.innerHTML = this.accounts
        .map((acc) => {
          const typeIcon =
            acc.type === 'checking'
              ? 'wallet'
              : acc.type === 'savings'
              ? 'piggy-bank'
              : acc.type === 'credit'
              ? 'credit-card'
              : 'trending-up';

          return `
            <div class="py-3.5 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <i data-lucide="${typeIcon}" class="w-4 h-4"></i>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-app-main">${this.escapeHtml(acc.name)}</h4>
                  <p class="text-[11px] text-app-muted">Ending in •••• ${acc.digits} • ${acc.type.toUpperCase()}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs font-mono font-bold text-app-main">${this.formatCurrency(acc.balance)}</div>
                <div class="text-[10px] text-emerald-400 font-semibold">${acc.isFrozen ? 'FROZEN' : 'ACTIVE'}</div>
              </div>
            </div>
          `;
        })
        .join('');
    }

    this.renderLucideIcons();
  }

  // --- VIEW 5: SAVINGS GOALS RENDERING ---
  private renderGoalsView() {
    const grid = document.getElementById('goals-cards-grid');
    const totalTargetEl = document.getElementById('goals-total-target');
    const totalSavedEl = document.getElementById('goals-total-saved');

    const totalTarget = this.goals.reduce((acc, g) => acc + g.target, 0);
    const totalSaved = this.goals.reduce((acc, g) => acc + g.current, 0);

    if (totalTargetEl) totalTargetEl.textContent = this.formatCurrency(totalTarget);
    if (totalSavedEl) totalSavedEl.textContent = this.formatCurrency(totalSaved);

    if (!grid) return;

    grid.innerHTML = this.goals
      .map((goal) => {
        const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
        const remaining = Math.max(0, goal.target - goal.current);
        const iconName =
          goal.category === 'shield'
            ? 'shield-check'
            : goal.category === 'car'
            ? 'car'
            : goal.category === 'plane'
            ? 'plane'
            : goal.category === 'home'
            ? 'home'
            : 'laptop';

        return `
          <div class="bg-surface rounded-2xl p-6 border border-app shadow-xs space-y-4 relative group">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600/20 to-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <i data-lucide="${iconName}" class="w-5 h-5"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-app-main">${this.escapeHtml(goal.name)}</h3>
                  <p class="text-xs text-app-muted">Target milestone: ${goal.date}</p>
                </div>
              </div>
              <span class="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                ${percentage}% Saved
              </span>
            </div>

            <!-- Progress bar -->
            <div>
              <div class="flex justify-between text-xs text-app-muted mb-1.5 font-mono">
                <span>Current: <strong class="text-app-main">${this.formatCurrency(goal.current)}</strong></span>
                <span>Goal: <strong class="text-app-main">${this.formatCurrency(goal.target)}</strong></span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div class="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
              </div>
              <div class="flex justify-between items-center text-[11px] text-app-muted mt-2">
                <span>Remaining: <strong class="text-indigo-400">${this.formatCurrency(remaining)}</strong></span>
                <span>${percentage >= 100 ? '🎉 Goal Achieved!' : 'On track for deadline'}</span>
              </div>
            </div>

            <!-- Deposit Action Button -->
            <div class="pt-3 border-t border-app flex items-center justify-between">
              <button class="delete-goal-btn text-xs text-app-soft hover:text-rose-500 transition-colors cursor-pointer" data-id="${goal.id}">
                Delete Goal
              </button>
              <button class="deposit-to-goal-btn px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer" data-id="${goal.id}" data-name="${this.escapeHtml(goal.name)}">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>+ Deposit Funds</span>
              </button>
            </div>
          </div>
        `;
      })
      .join('');

    this.renderLucideIcons();
  }

  // --- CHART HELPERS & THEME SYNCHRONIZATION ---
  private calculateCategoryBreakdown() {
    const expenses = this.transactions.filter((t) => t.type === 'expense');
    const categoryTotals: Record<string, number> = {};

    for (const tx of expenses) {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    }

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const labels = sortedCategories.map(([cat]) => cat);
    const data = sortedCategories.map(([, amt]) => amt);
    const colors = sortedCategories.map(([cat]) => EXPENSE_CATEGORIES[cat]?.color || '#8b5cf6');

    return { labels, data, colors, sortedCategories };
  }

  private updateAllChartsTheme() {
    if (this.categoryChartInstance) {
      this.categoryChartInstance.data.datasets[0].borderColor = this.isDarkMode ? '#111827' : '#ffffff';
      this.categoryChartInstance.options.plugins.tooltip.backgroundColor = this.isDarkMode ? '#0f172a' : '#ffffff';
      this.categoryChartInstance.options.plugins.tooltip.titleColor = this.isDarkMode ? '#f8fafc' : '#0f172a';
      this.categoryChartInstance.options.plugins.tooltip.bodyColor = this.isDarkMode ? '#94a3b8' : '#475569';
      this.categoryChartInstance.options.plugins.tooltip.borderColor = this.isDarkMode ? '#334155' : '#cbd5e1';
      this.categoryChartInstance.update();
    }

    if (this.trendChartInstance) {
      this.trendChartInstance.options.plugins.tooltip.backgroundColor = this.isDarkMode ? '#0f172a' : '#ffffff';
      this.trendChartInstance.options.plugins.tooltip.titleColor = this.isDarkMode ? '#f8fafc' : '#0f172a';
      this.trendChartInstance.options.plugins.tooltip.bodyColor = this.isDarkMode ? '#94a3b8' : '#475569';
      this.trendChartInstance.options.plugins.tooltip.borderColor = this.isDarkMode ? '#334155' : '#cbd5e1';
      this.trendChartInstance.options.scales.x.ticks.color = this.isDarkMode ? '#94a3b8' : '#64748b';
      this.trendChartInstance.options.scales.y.ticks.color = this.isDarkMode ? '#94a3b8' : '#64748b';
      this.trendChartInstance.options.scales.y.grid.color = this.isDarkMode
        ? 'rgba(51, 65, 85, 0.4)'
        : 'rgba(226, 232, 240, 0.8)';
      this.trendChartInstance.update();
    }
  }

  // --- RENDER ALL UI SECTIONS ---
  private renderAll() {
    this.renderOverviewCards();
    this.renderChartLegend();
    this.updateCategoryChart();
    this.renderRecentTransactionsList();

    if (this.currentView === 'analytics') this.renderAnalyticsView();
    if (this.currentView === 'transactions') this.renderLedgerTable();
    if (this.currentView === 'accounts') this.renderAccountsView();
    if (this.currentView === 'goals') this.renderGoalsView();
  }

  // --- EVENT LISTENERS & MODAL HOOKS ---
  private setupEventListeners() {
    // 1. Navigation item switching (Focus Mode targets)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        const current = e.currentTarget as HTMLElement;
        const nav = current.getAttribute('data-nav') as any;
        if (nav) this.switchView(nav);

        // Mobile drawer close
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('mobile-backdrop');
        if (sidebar && backdrop) {
          sidebar.classList.add('-translate-x-full');
          backdrop.classList.add('hidden');
        }
      });
    });

    // 2. Transaction Form Submission (Dashboard)
    const form = document.getElementById('transaction-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Type Toggle Buttons in Form
    const expenseBtn = document.getElementById('type-expense-btn');
    const incomeBtn = document.getElementById('type-income-btn');
    if (expenseBtn) expenseBtn.addEventListener('click', () => this.setFormType('expense'));
    if (incomeBtn) incomeBtn.addEventListener('click', () => this.setFormType('income'));

    // Dashboard Filter Buttons
    const filterButtons = document.querySelectorAll('.filter-tab-btn');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const filter = target.dataset.filter as 'all' | 'income' | 'expense';
        this.setDashboardFilter(filter);
      });
    });

    // Dashboard Search Input
    const searchInput = document.getElementById('tx-search-input') as HTMLInputElement;
    const clearSearchBtn = document.getElementById('clear-search-btn');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = (e.target as HTMLInputElement).value;
        if (clearSearchBtn) clearSearchBtn.classList.toggle('hidden', !this.searchQuery);
        this.renderRecentTransactionsList();
      });
    }
    if (clearSearchBtn && searchInput) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        this.searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        this.renderRecentTransactionsList();
        searchInput.focus();
      });
    }

    // Dashboard Delete Button Delegation
    const txContainer = document.getElementById('tx-list-container');
    if (txContainer) {
      txContainer.addEventListener('click', (e) => {
        const btn = (e.target as HTMLElement).closest('.delete-tx-btn') as HTMLButtonElement;
        if (btn && btn.dataset.id) this.deleteTransaction(btn.dataset.id);
      });
    }

    // Reset Seed Data
    const resetBtn = document.getElementById('reset-seed-btn');
    if (resetBtn) resetBtn.addEventListener('click', () => this.resetSeedData());

    // Sync Button
    const syncBtn = document.getElementById('sync-btn');
    if (syncBtn) {
      syncBtn.addEventListener('click', async () => {
        await this.fetchTransactionsAPI();
        this.showToast('Ledger successfully re-synchronized with REST API', 'success');
        this.renderAll();
      });
    }

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) themeBtn.addEventListener('click', () => this.toggleTheme());

    // Notifications Popover
    const notificationsBtn = document.getElementById('notifications-btn');
    const notificationsPopover = document.getElementById('notifications-popover');
    if (notificationsBtn && notificationsPopover) {
      notificationsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationsPopover.classList.toggle('hidden');
      });
      document.addEventListener('click', (e) => {
        if (!notificationsPopover.contains(e.target as Node) && !notificationsBtn.contains(e.target as Node)) {
          notificationsPopover.classList.add('hidden');
        }
      });
    }

    // Mobile Drawer
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('mobile-backdrop');
    if (mobileMenuBtn && sidebar && backdrop) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.remove('-translate-x-full');
        backdrop.classList.remove('hidden');
      });
    }
    if (closeSidebarBtn && sidebar && backdrop) {
      closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
        backdrop.classList.add('hidden');
      });
    }
    if (backdrop && sidebar) {
      backdrop.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
        backdrop.classList.add('hidden');
      });
    }

    // Settings Modal
    const openSettingsBtn = document.getElementById('open-settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings-modal-btn');
    const settingsModal = document.getElementById('settings-modal');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const targetSlider = document.getElementById('setting-target-slider') as HTMLInputElement;
    const targetVal = document.getElementById('setting-target-val');

    if (targetSlider && targetVal) {
      targetSlider.addEventListener('input', () => {
        targetVal.textContent = `${targetSlider.value}%`;
      });
    }
    if (openSettingsBtn && settingsModal) {
      openSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    }
    if (closeSettingsBtn && settingsModal) {
      closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
    }
    if (saveSettingsBtn && settingsModal) {
      saveSettingsBtn.addEventListener('click', () => {
        const currencySelect = document.getElementById('setting-currency') as HTMLSelectElement;
        const latencySelect = document.getElementById('setting-latency') as HTMLSelectElement;
        if (currencySelect) this.currencySymbol = currencySelect.value;
        if (latencySelect) this.simulationLatency = parseInt(latencySelect.value, 10) || 400;

        settingsModal.classList.add('hidden');
        this.renderAll();
        this.showToast('Settings applied successfully', 'success');
      });
    }

    // Export CSV
    const exportBtn = document.getElementById('export-csv-btn');
    if (exportBtn) exportBtn.addEventListener('click', () => this.exportToCSV());
    const ledgerExportBtn = document.getElementById('ledger-export-csv-btn');
    if (ledgerExportBtn) ledgerExportBtn.addEventListener('click', () => this.exportToCSV());

    // 3. LEDGER VIEW EVENT LISTENERS
    const ledgerSearch = document.getElementById('ledger-search-input') as HTMLInputElement;
    if (ledgerSearch) {
      ledgerSearch.addEventListener('input', (e) => {
        this.ledgerSearchQuery = (e.target as HTMLInputElement).value;
        this.renderLedgerTable();
      });
    }

    const ledgerType = document.getElementById('ledger-type-filter') as HTMLSelectElement;
    if (ledgerType) {
      ledgerType.addEventListener('change', () => {
        this.ledgerTypeFilter = ledgerType.value as any;
        this.renderLedgerTable();
      });
    }

    const ledgerCategory = document.getElementById('ledger-category-filter') as HTMLSelectElement;
    if (ledgerCategory) {
      ledgerCategory.addEventListener('change', () => {
        this.ledgerCategoryFilter = ledgerCategory.value;
        this.renderLedgerTable();
      });
    }

    const ledgerSort = document.getElementById('ledger-sort-filter') as HTMLSelectElement;
    if (ledgerSort) {
      ledgerSort.addEventListener('change', () => {
        this.ledgerSortOrder = ledgerSort.value as any;
        this.renderLedgerTable();
      });
    }

    const ledgerAddBtn = document.getElementById('ledger-add-tx-btn');
    if (ledgerAddBtn) {
      ledgerAddBtn.addEventListener('click', () => {
        this.switchView('dashboard');
        const titleInput = document.getElementById('tx-title');
        if (titleInput) titleInput.focus();
      });
    }

    const ledgerBody = document.getElementById('ledger-table-body');
    if (ledgerBody) {
      ledgerBody.addEventListener('click', (e) => {
        const btn = (e.target as HTMLElement).closest('.delete-tx-btn') as HTMLButtonElement;
        if (btn && btn.dataset.id) this.deleteTransaction(btn.dataset.id);
      });
    }

    // 4. ANALYTICS BUDGET ADJUST MODAL
    const catGrid = document.getElementById('analytics-categories-grid');
    const adjustBudgetModal = document.getElementById('adjust-budget-modal');
    const closeAdjustModal = document.getElementById('close-adjust-budget-modal-btn');
    const confirmAdjustBtn = document.getElementById('confirm-adjust-budget-btn');

    if (catGrid && adjustBudgetModal) {
      catGrid.addEventListener('click', (e) => {
        const btn = (e.target as HTMLElement).closest('.adjust-budget-btn') as HTMLElement;
        if (btn) {
          const category = btn.dataset.category || '';
          const cap = parseFloat(btn.dataset.cap || '0');
          this.activeAdjustBudgetCategory = category;

          const titleEl = document.getElementById('adjust-budget-category-title');
          const amountInput = document.getElementById('adjust-budget-amount') as HTMLInputElement;

          if (titleEl) titleEl.textContent = category;
          if (amountInput) amountInput.value = cap.toString();

          adjustBudgetModal.classList.remove('hidden');
        }
      });
    }

    if (closeAdjustModal && adjustBudgetModal) {
      closeAdjustModal.addEventListener('click', () => adjustBudgetModal.classList.add('hidden'));
    }

    if (confirmAdjustBtn && adjustBudgetModal) {
      confirmAdjustBtn.addEventListener('click', () => {
        const amountInput = document.getElementById('adjust-budget-amount') as HTMLInputElement;
        const newCap = parseFloat(amountInput?.value);

        if (!isNaN(newCap) && newCap > 0 && this.activeAdjustBudgetCategory) {
          const item = this.budgetCaps.find((b) => b.category === this.activeAdjustBudgetCategory);
          if (item) {
            item.cap = newCap;
            this.persistAll();
            this.renderAnalyticsView();
            adjustBudgetModal.classList.add('hidden');
            this.showToast(`Updated budget cap for "${this.activeAdjustBudgetCategory}" to ${this.formatCurrency(newCap)}`, 'success');
          }
        }
      });
    }

    // 5. ACCOUNTS & CARDS EVENT LISTENERS
    const openAddCardBtn = document.getElementById('open-add-card-modal-btn');
    const closeAddCardBtn = document.getElementById('close-add-card-modal-btn');
    const addCardModal = document.getElementById('add-card-modal');
    const addCardForm = document.getElementById('add-card-form');

    if (openAddCardBtn && addCardModal) {
      openAddCardBtn.addEventListener('click', () => addCardModal.classList.remove('hidden'));
    }
    if (closeAddCardBtn && addCardModal) {
      closeAddCardBtn.addEventListener('click', () => addCardModal.classList.add('hidden'));
    }
    if (addCardForm && addCardModal) {
      addCardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('card-input-name') as HTMLInputElement;
        const typeSelect = document.getElementById('card-input-type') as HTMLSelectElement;
        const digitsInput = document.getElementById('card-input-digits') as HTMLInputElement;
        const balanceInput = document.getElementById('card-input-balance') as HTMLInputElement;
        const limitInput = document.getElementById('card-input-limit') as HTMLInputElement;

        const newAccount: AccountItem = {
          id: `acc-${Date.now()}`,
          name: nameInput.value.trim(),
          type: typeSelect.value as any,
          digits: digitsInput.value.trim() || '0000',
          balance: parseFloat(balanceInput.value) || 0,
          limit: limitInput.value ? parseFloat(limitInput.value) : undefined,
          isFrozen: false,
        };

        this.accounts.push(newAccount);
        this.persistAll();
        this.renderAccountsView();
        addCardModal.classList.add('hidden');
        (addCardForm as HTMLFormElement).reset();
        this.showToast(`Successfully linked "${newAccount.name}"`, 'success');
      });
    }

    // Card Freeze Toggle
    const cardsGrid = document.getElementById('accounts-cards-grid');
    if (cardsGrid) {
      cardsGrid.addEventListener('click', (e) => {
        const btn = (e.target as HTMLElement).closest('.toggle-card-freeze-btn') as HTMLElement;
        if (btn && btn.dataset.id) {
          const card = this.accounts.find((a) => a.id === btn.dataset.id);
          if (card) {
            card.isFrozen = !card.isFrozen;
            this.persistAll();
            this.renderAccountsView();
            this.showToast(`${card.name} is now ${card.isFrozen ? 'frozen' : 'unfrozen'}`, 'info');
          }
        }
      });
    }

    // 6. SAVINGS GOALS EVENT LISTENERS
    const goalsGrid = document.getElementById('goals-cards-grid');
    const depositModal = document.getElementById('deposit-goal-modal');
    const closeDepositModal = document.getElementById('close-deposit-modal-btn');
    const confirmDepositBtn = document.getElementById('confirm-deposit-btn');
    const quickChips = document.querySelectorAll('.quick-deposit-chip');

    if (goalsGrid && depositModal) {
      goalsGrid.addEventListener('click', (e) => {
        const depositBtn = (e.target as HTMLElement).closest('.deposit-to-goal-btn') as HTMLElement;
        if (depositBtn) {
          this.activeDepositGoalId = depositBtn.dataset.id || null;
          const titleEl = document.getElementById('deposit-goal-title');
          if (titleEl) titleEl.textContent = depositBtn.dataset.name || 'Savings Goal';
          depositModal.classList.remove('hidden');
        }

        const deleteGoalBtn = (e.target as HTMLElement).closest('.delete-goal-btn') as HTMLElement;
        if (deleteGoalBtn && deleteGoalBtn.dataset.id) {
          this.goals = this.goals.filter((g) => g.id !== deleteGoalBtn.dataset.id);
          this.persistAll();
          this.renderGoalsView();
          this.showToast('Savings goal deleted', 'info');
        }
      });
    }

    quickChips.forEach((chip) => {
      chip.addEventListener('click', (e) => {
        const btn = e.currentTarget as HTMLElement;
        const amount = btn.dataset.amount;
        const customInput = document.getElementById('deposit-custom-amount') as HTMLInputElement;
        if (customInput && amount) customInput.value = amount;
      });
    });

    if (closeDepositModal && depositModal) {
      closeDepositModal.addEventListener('click', () => depositModal.classList.add('hidden'));
    }

    if (confirmDepositBtn && depositModal) {
      confirmDepositBtn.addEventListener('click', () => {
        const customInput = document.getElementById('deposit-custom-amount') as HTMLInputElement;
        const amount = parseFloat(customInput?.value);

        if (!isNaN(amount) && amount > 0 && this.activeDepositGoalId) {
          const goal = this.goals.find((g) => g.id === this.activeDepositGoalId);
          if (goal) {
            goal.current += amount;
            this.persistAll();
            this.renderGoalsView();
            depositModal.classList.add('hidden');
            if (customInput) customInput.value = '';
            this.showToast(`Deposited ${this.formatCurrency(amount)} into "${goal.name}"!`, 'success');
          }
        }
      });
    }

    // New Goal Modal
    const openNewGoalBtn = document.getElementById('open-new-goal-modal-btn');
    const closeNewGoalBtn = document.getElementById('close-new-goal-modal-btn');
    const newGoalModal = document.getElementById('new-goal-modal');
    const newGoalForm = document.getElementById('new-goal-form');

    if (openNewGoalBtn && newGoalModal) {
      openNewGoalBtn.addEventListener('click', () => newGoalModal.classList.remove('hidden'));
    }
    if (closeNewGoalBtn && newGoalModal) {
      closeNewGoalBtn.addEventListener('click', () => newGoalModal.classList.add('hidden'));
    }
    if (newGoalForm && newGoalModal) {
      newGoalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('goal-input-name') as HTMLInputElement;
        const targetInput = document.getElementById('goal-input-target') as HTMLInputElement;
        const currentInput = document.getElementById('goal-input-current') as HTMLInputElement;
        const dateInput = document.getElementById('goal-input-date') as HTMLInputElement;
        const categorySelect = document.getElementById('goal-input-category') as HTMLSelectElement;

        const newGoal: SavingsGoal = {
          id: `goal-${Date.now()}`,
          name: nameInput.value.trim(),
          target: parseFloat(targetInput.value) || 1000,
          current: parseFloat(currentInput.value) || 0,
          date: dateInput.value,
          category: categorySelect.value as any,
        };

        this.goals.push(newGoal);
        this.persistAll();
        this.renderGoalsView();
        newGoalModal.classList.add('hidden');
        (newGoalForm as HTMLFormElement).reset();
        this.showToast(`Savings milestone "${newGoal.name}" created!`, 'success');
      });
    }
  }

  // --- FORM HANDLING & TRANSACTION CREATION ---
  private setFormType(type: 'income' | 'expense') {
    this.currentFormType = type;
    const expenseBtn = document.getElementById('type-expense-btn');
    const incomeBtn = document.getElementById('type-income-btn');

    if (type === 'expense') {
      if (expenseBtn) {
        expenseBtn.className =
          'type-toggle-btn flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all bg-rose-500/15 border-rose-500/40 text-rose-500 dark:text-rose-400 shadow-xs cursor-pointer';
      }
      if (incomeBtn) {
        incomeBtn.className =
          'type-toggle-btn flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all bg-surface-elevated border-app text-app-muted hover:text-app-main cursor-pointer';
      }
    } else {
      if (incomeBtn) {
        incomeBtn.className =
          'type-toggle-btn flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all bg-emerald-500/15 border-emerald-500/40 text-emerald-500 dark:text-emerald-400 shadow-xs cursor-pointer';
      }
      if (expenseBtn) {
        expenseBtn.className =
          'type-toggle-btn flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all bg-surface-elevated border-app text-app-muted hover:text-app-main cursor-pointer';
      }
    }

    this.updateCategoryOptions(type);
    this.renderLucideIcons();
  }

  private updateCategoryOptions(type: 'income' | 'expense') {
    const categorySelect = document.getElementById('tx-category') as HTMLSelectElement;
    if (!categorySelect) return;

    const source = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    const optionsHtml = Object.keys(source)
      .map((catKey) => `<option value="${this.escapeHtml(catKey)}">${this.escapeHtml(catKey)}</option>`)
      .join('');

    categorySelect.innerHTML = optionsHtml;
  }

  private setDefaultFormDate() {
    const dateInput = document.getElementById('tx-date') as HTMLInputElement;
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.value = today;
    }
    const goalDateInput = document.getElementById('goal-input-date') as HTMLInputElement;
    if (goalDateInput) {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      goalDateInput.value = nextYear.toISOString().split('T')[0];
    }
  }

  private handleFormSubmit(e: Event) {
    e.preventDefault();

    const titleInput = document.getElementById('tx-title') as HTMLInputElement;
    const amountInput = document.getElementById('tx-amount') as HTMLInputElement;
    const categorySelect = document.getElementById('tx-category') as HTMLSelectElement;
    const dateInput = document.getElementById('tx-date') as HTMLInputElement;

    const title = titleInput?.value.trim();
    const amount = parseFloat(amountInput?.value);
    const category = categorySelect?.value;
    const date = dateInput?.value;

    if (!title || isNaN(amount) || amount <= 0 || !category || !date) {
      this.showToast('Please provide valid title, amount, category, and date.', 'error');
      return;
    }

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      title,
      amount,
      type: this.currentFormType,
      category,
      date,
      createdAt: Date.now(),
    };

    this.transactions.unshift(newTransaction);
    this.persistAll();

    if (titleInput) titleInput.value = '';
    if (amountInput) amountInput.value = '';
    this.setDefaultFormDate();

    this.renderAll();

    const sign = this.currentFormType === 'income' ? '+' : '-';
    this.showToast(`Committed "${title}" (${sign}${this.formatCurrency(amount)}) to ledger!`, 'success');
  }

  // --- FILTERING & ACTIONS ---
  private setDashboardFilter(filter: 'all' | 'income' | 'expense') {
    this.currentFilter = filter;
    const buttons = document.querySelectorAll('.filter-tab-btn');
    buttons.forEach((btn) => {
      const b = btn as HTMLButtonElement;
      if (b.dataset.filter === filter) {
        b.className = 'filter-tab-btn px-3 py-1 text-xs font-semibold rounded-lg transition-all bg-indigo-600 text-white shadow-xs cursor-pointer';
      } else {
        b.className = 'filter-tab-btn px-3 py-1 text-xs font-semibold rounded-lg transition-all text-app-muted hover:text-app-main cursor-pointer';
      }
    });

    this.renderRecentTransactionsList();
  }

  private deleteTransaction(id: string) {
    const target = this.transactions.find((t) => t.id === id);
    if (!target) return;

    this.transactions = this.transactions.filter((t) => t.id !== id);
    this.persistAll();
    this.renderAll();

    this.showToast(`Removed "${target.title}" from ledger`, 'info');
  }

  private resetSeedData() {
    this.transactions = [...SEED_TRANSACTIONS];
    this.budgetCaps = [...INITIAL_BUDGET_CAPS];
    this.accounts = [...INITIAL_ACCOUNTS];
    this.goals = [...INITIAL_GOALS];
    this.persistAll();
    this.renderAll();
    this.showToast('Restored default seed dataset', 'success');
  }

  private exportToCSV() {
    if (this.transactions.length === 0) {
      this.showToast('No transactions to export', 'error');
      return;
    }

    const headers = ['ID', 'Title', 'Type', 'Category', 'Amount', 'Date'];
    const rows = this.transactions.map((t) => [
      `"${t.id}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.type}"`,
      `"${t.category.replace(/"/g, '""')}"`,
      t.amount.toFixed(2),
      `"${t.date}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `FinTrack_Transactions_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast('Exported transactions to CSV', 'success');
  }

  // --- UTILITIES ---
  private formatCurrency(value: number): string {
    return `${this.currencySymbol}${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  private formatDate(dateStr: string): string {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch {
      // Fallback
    }
    return dateStr;
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private renderLucideIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const colorClasses =
      type === 'success'
        ? 'border-emerald-500/40 bg-[#0e1726] text-emerald-300'
        : type === 'error'
        ? 'border-rose-500/40 bg-[#1c111a] text-rose-300'
        : 'border-indigo-500/40 bg-[#11162b] text-indigo-300';

    toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold shadow-xl transition-all duration-300 opacity-0 translate-y-2 ${colorClasses}`;
    toast.innerHTML = `<span>${this.escapeHtml(message)}</span>`;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('opacity-0', 'translate-y-2');
      toast.classList.add('opacity-100', 'translate-y-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new FinTrackApp();
});
