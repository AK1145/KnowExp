import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Expense } from '../../../core/models/expense.model';
import { IndianCurrencyPipe } from '../../pipes/indian-currency.pipe';

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [CommonModule, IndianCurrencyPipe],
  template: `
    <div class="bg-[var(--card-bg)] rounded-2xl p-6 shadow-[var(--card-shadow)] border border-[var(--border-color)]">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-[var(--text-primary)]">Recent Transactions</h3>
      </div>
      
      @if (transactions && transactions.length > 0) {
        <div class="space-y-4">
          @for (tx of transactions; track tx.id) {
            <div class="flex items-center justify-between py-2 border-b border-[var(--border-color)] last:border-0 last:pb-0">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-xl">
                  {{ tx.category.icon }}
                </div>
                <div>
                  <p class="font-medium text-[var(--text-primary)]">{{ tx.category.name }}</p>
                  <p class="text-xs text-[var(--text-secondary)]">{{ tx.expenseDate }} <span *ngIf="tx.note">· {{ tx.note }}</span></p>
                </div>
              </div>
              <div class="font-medium text-[var(--text-primary)]">
                {{ tx.amount | indianCurrency }}
              </div>
            </div>
          }
        </div>
      } @else {
        <p class="text-center text-[var(--text-secondary)] py-4">No recent transactions.</p>
      }
    </div>
  `
})
export class RecentTransactionsComponent {
  @Input() transactions: Expense[] = [];
}
