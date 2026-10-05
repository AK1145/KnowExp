import { Expense } from './expense.model';

export interface CategoryBreakdown {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  amount: number;
  percentage: number;
  formattedAmount: string;
}

export interface SpendingTrend {
  month: number;
  monthName: string;
  amount: number;
  formattedAmount: string;
}

export interface DashboardData {
  period: string;
  periodLabel: string;
  totalSpending: number;
  formattedTotal: string;
  monthlyBudget: number;
  formattedBudget: string;
  remainingBudget: number;
  formattedRemaining: string;
  budgetPercentage: number;
  previousPeriodSpending: number;
  formattedPreviousSpending: string;
  comparisonPercentage: number;
  categoryBreakdown: CategoryBreakdown[];
  spendingTrend: SpendingTrend[];
  recentTransactions: Expense[];
}
