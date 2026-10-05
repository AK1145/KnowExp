import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense, ExpenseRequest } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://knowexp.onrender.com/api/expenses';

  getAllRawExpenses(): Expense[] {
    return [];
  }

  getExpenses(filter?: {
    search?: string;
    categoryId?: number;
    from?: string;
    to?: string;
  }): Observable<{ content: Expense[]; totalElements: number }> {

    let params = new HttpParams()
      .set('page', '0')
      .set('size', '100');

    if (filter?.search?.trim()) {
      params = params.set('search', filter.search.trim());
    }

    if (filter?.categoryId && filter.categoryId > 0) {
      params = params.set('categoryId', filter.categoryId.toString());
    }

    if (filter?.from) {
      params = params.set('from', filter.from);
    }

    if (filter?.to) {
      params = params.set('to', filter.to);
    }

    return this.http.get<{ content: Expense[]; totalElements: number }>(
      this.apiUrl,
      { params }
    );
  }

  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  createExpense(request: ExpenseRequest): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, request);
  }

  updateExpense(id: number, request: ExpenseRequest): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, request);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}