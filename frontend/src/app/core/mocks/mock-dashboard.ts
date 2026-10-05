import { DashboardData } from '../models/dashboard.model';

export const MOCK_DASHBOARD_MONTH: DashboardData = {
  period: 'month',
  periodLabel: 'This Month',
  totalSpending: 0,
  formattedTotal: '₹0',
  monthlyBudget: 0,
  formattedBudget: '₹0',
  remainingBudget: 0,
  formattedRemaining: '₹0',
  budgetPercentage: 0,
  previousPeriodSpending: 0,
  formattedPreviousSpending: '₹0',
  comparisonPercentage: 0,
  categoryBreakdown: [],
  spendingTrend: [],
  recentTransactions: []
};

export const MOCK_DASHBOARD_WEEK: DashboardData = {
  period: 'week',
  periodLabel: 'This Week',
  totalSpending: 0,
  formattedTotal: '₹0',
  monthlyBudget: 0,
  formattedBudget: '₹0',
  remainingBudget: 0,
  formattedRemaining: '₹0',
  budgetPercentage: 0,
  previousPeriodSpending: 0,
  formattedPreviousSpending: '₹0',
  comparisonPercentage: 0,
  categoryBreakdown: [],
  spendingTrend: [],
  recentTransactions: []
};

export const MOCK_DASHBOARD_YEAR: DashboardData = {
  period: 'year',
  periodLabel: 'This Year',
  totalSpending: 0,
  formattedTotal: '₹0',
  monthlyBudget: 0,
  formattedBudget: '₹0',
  remainingBudget: 0,
  formattedRemaining: '₹0',
  budgetPercentage: 0,
  previousPeriodSpending: 0,
  formattedPreviousSpending: '₹0',
  comparisonPercentage: 0,
  categoryBreakdown: [],
  spendingTrend: [
    { month: 1, monthName: 'Jan', amount: 0, formattedAmount: '₹0' },
    { month: 2, monthName: 'Feb', amount: 0, formattedAmount: '₹0' },
    { month: 3, monthName: 'Mar', amount: 0, formattedAmount: '₹0' },
    { month: 4, monthName: 'Apr', amount: 0, formattedAmount: '₹0' },
    { month: 5, monthName: 'May', amount: 0, formattedAmount: '₹0' },
    { month: 6, monthName: 'Jun', amount: 0, formattedAmount: '₹0' },
    { month: 7, monthName: 'Jul', amount: 0, formattedAmount: '₹0' },
    { month: 8, monthName: 'Aug', amount: 0, formattedAmount: '₹0' },
    { month: 9, monthName: 'Sep', amount: 0, formattedAmount: '₹0' },
    { month: 10, monthName: 'Oct', amount: 0, formattedAmount: '₹0' },
    { month: 11, monthName: 'Nov', amount: 0, formattedAmount: '₹0' },
    { month: 12, monthName: 'Dec', amount: 0, formattedAmount: '₹0' }
  ],
  recentTransactions: []
};
