import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetData } from '../../../core/models/budget.model';

@Component({
  selector: 'app-budget-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (budget) {
      <div class="bg-[var(--card-bg)] rounded-2xl p-6 shadow-[var(--card-shadow)] border border-[var(--border-color)]">
        <div class="flex justify-between items-end mb-4">
          <div>
            <p class="text-sm text-[var(--text-secondary)] mb-1">Monthly Budget</p>
            <p class="text-xl font-semibold text-[var(--text-primary)]">{{ budget.formattedBudget }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-[var(--text-secondary)] mb-1">Remaining</p>
            <p class="text-xl font-semibold text-[var(--color-primary)]">{{ budget.formattedRemaining }}</p>
          </div>
        </div>
        
        <div class="h-3 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden mb-2">
          <div class="h-full rounded-full transition-all duration-500" 
               [style.width.%]="budget.percentageUsed > 100 ? 100 : budget.percentageUsed"
               [ngClass]="{
                 'bg-[var(--color-success)]': budget.percentageUsed <= 80,
                 'bg-[var(--color-warning)]': budget.percentageUsed > 80 && budget.percentageUsed <= 100,
                 'bg-[var(--color-danger)]': budget.percentageUsed > 100
               }">
          </div>
        </div>
        
        <div class="flex justify-between text-xs text-[var(--text-tertiary)]">
          <span>Spent: {{ budget.formattedSpent }}</span>
          <span>{{ budget.percentageUsed | number:'1.0-1' }}% Used</span>
        </div>
      </div>
    }
  `
})
export class BudgetSummaryComponent {
  @Input() budget!: BudgetData;
}
