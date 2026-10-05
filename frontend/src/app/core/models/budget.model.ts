export interface BudgetData {
  monthlyBudget: number;
  amountSpent: number;
  amountRemaining: number;
  percentageUsed: number;
  currency: string;
  formattedBudget: string;
  formattedSpent: string;
  formattedRemaining: string;
}

export interface BudgetRequest {
  monthlyBudget: number;
}
