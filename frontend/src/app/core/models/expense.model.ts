export interface Expense {
  id: number;
  amount: number;
  category: Category;
  expenseDate: string; // ISO date string YYYY-MM-DD
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseRequest {
  amount: number;
  categoryId: number;
  expenseDate: string;
  note?: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  isActive: boolean;
}
