import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BudgetData, BudgetRequest } from '../models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'https://knowexp.onrender.com/api/budget';

  getBudget(): Observable<BudgetData> {
    return this.http.get<BudgetData>(this.apiUrl);
  }

  updateBudget(request: BudgetRequest): Observable<BudgetData> {
    return this.http.put<BudgetData>(this.apiUrl, request);
  }
}