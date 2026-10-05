import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BudgetData, BudgetRequest } from '../models/budget.model';
import { MOCK_BUDGET } from '../mocks/mock-budget';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private budget = { ...MOCK_BUDGET };

  getBudget(): Observable<BudgetData> {
    return of(this.budget);
  }

  updateBudget(request: BudgetRequest): Observable<BudgetData> {
    this.budget.monthlyBudget = request.monthlyBudget;
    this.budget.formattedBudget = `₹${request.monthlyBudget.toLocaleString('en-IN')}`;
    this.budget.amountRemaining = this.budget.monthlyBudget - this.budget.amountSpent;
    this.budget.formattedRemaining = `₹${this.budget.amountRemaining.toLocaleString('en-IN')}`;
    this.budget.percentageUsed = (this.budget.amountSpent / this.budget.monthlyBudget) * 100;
    return of(this.budget);
  }
}
