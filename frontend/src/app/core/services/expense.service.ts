import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Expense, ExpenseRequest } from '../models/expense.model';
import { MOCK_CATEGORIES } from '../mocks/mock-categories';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private http = inject(HttpClient, { optional: true });
  private expenses: Expense[] = [];

  getAllRawExpenses(): Expense[] {
    return [...this.expenses];
  }

  getExpenses(filter?: { search?: string; categoryId?: number; from?: string; to?: string }): Observable<{ content: Expense[]; totalElements: number }> {
    let result = [...this.expenses];

    if (filter) {
      if (filter.search && filter.search.trim()) {
        const query = filter.search.toLowerCase().trim();
        result = result.filter(e => 
          (e.note && e.note.toLowerCase().includes(query)) || 
          e.category.name.toLowerCase().includes(query) ||
          e.amount.toString().includes(query)
        );
      }
      if (filter.categoryId && filter.categoryId > 0) {
        result = result.filter(e => e.category.id === filter.categoryId);
      }
      if (filter.from) {
        result = result.filter(e => e.expenseDate >= filter.from!);
      }
      if (filter.to) {
        result = result.filter(e => e.expenseDate <= filter.to!);
      }
    }

    // Sort descending by date
    result.sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime());

    return of({ content: result, totalElements: result.length });
  }

  getExpenseById(id: number): Observable<Expense> {
    const exp = this.expenses.find(e => e.id === id);
    if (!exp) throw new Error('Expense not found');
    return of(exp);
  }

  createExpense(request: ExpenseRequest): Observable<Expense> {
    const category = MOCK_CATEGORIES.find(c => c.id === request.categoryId) || {
      id: request.categoryId,
      name: 'Other',
      icon: '🏷️',
      isActive: true
    };
    
    const maxId = this.expenses.length > 0 ? Math.max(...this.expenses.map(e => e.id)) : 0;
    const newExpense: Expense = {
      id: maxId + 1,
      amount: Number(request.amount),
      category,
      expenseDate: request.expenseDate,
      note: request.note || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.expenses = [newExpense, ...this.expenses];
    return of(newExpense);
  }

  updateExpense(id: number, request: ExpenseRequest): Observable<Expense> {
    const index = this.expenses.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Expense not found');
    
    const category = MOCK_CATEGORIES.find(c => c.id === request.categoryId) || this.expenses[index].category;

    const updated: Expense = {
      ...this.expenses[index],
      amount: Number(request.amount),
      category,
      expenseDate: request.expenseDate,
      note: request.note || '',
      updatedAt: new Date().toISOString()
    };
    
    this.expenses[index] = updated;
    return of(updated);
  }

  deleteExpense(id: number): Observable<void> {
    this.expenses = this.expenses.filter(e => e.id !== id);
    return of(void 0);
  }
}
