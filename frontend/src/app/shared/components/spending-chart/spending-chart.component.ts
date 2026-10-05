import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpendingTrend } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-spending-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[var(--card-bg)] rounded-2xl p-6 shadow-[var(--card-shadow)] border border-[var(--border-color)]">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-[var(--text-primary)]">Monthly Spending Trend</h3>
          <p class="text-xs text-[var(--text-secondary)] mt-0.5">Overview across 12 months</p>
        </div>
        <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
          Yearly
        </span>
      </div>

      <div class="h-64 flex items-end gap-2.5 pt-6 pb-2 border-b border-[var(--border-color)]">
        @for (item of trend; track item.month) {
          <div class="flex-1 flex flex-col items-center justify-end h-full group relative">
            
            <!-- Tooltip -->
            <div class="absolute -top-9 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 whitespace-nowrap bg-[var(--text-primary)] text-[var(--bg-primary)] px-2.5 py-1 rounded-lg text-xs font-semibold shadow-lg">
              {{ item.formattedAmount }}
            </div>

            <!-- Bar -->
            <div
              class="w-full rounded-t-lg bg-[var(--color-primary)] transition-all duration-300 group-hover:brightness-110 relative"
              [style.height.%]="getBarHeight(item.amount)"
              [style.opacity]="item.amount > 0 ? '0.85' : '0.15'"
            >
              @if (isHighest(item.amount)) {
                <div class="w-1.5 h-1.5 rounded-full bg-white absolute top-1 left-1/2 -translate-x-1/2"></div>
              }
            </div>

            <!-- Month Label -->
            <span class="text-[11px] font-medium text-[var(--text-secondary)] mt-2 group-hover:text-[var(--text-primary)] transition-colors">
              {{ item.monthName }}
            </span>
          </div>
        }
      </div>

      <div class="flex justify-between items-center mt-4 text-xs text-[var(--text-tertiary)]">
        <span>Min: ₹0</span>
        <span>Peak: {{ maxAmountFormatted() }}</span>
      </div>
    </div>
  `
})
export class SpendingChartComponent {
  @Input() trend: SpendingTrend[] = [];

  getMax(): number {
    if (!this.trend || this.trend.length === 0) return 100;
    const max = Math.max(...this.trend.map(t => t.amount));
    return max > 0 ? max : 100;
  }

  getBarHeight(amount: number): number {
    if (!amount || amount <= 0) return 4;
    return Math.max(6, (amount / this.getMax()) * 100);
  }

  isHighest(amount: number): boolean {
    return amount > 0 && amount === this.getMax();
  }

  maxAmountFormatted(): string {
    const max = this.getMax();
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(max);
  }
}
