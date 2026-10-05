import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryBreakdown } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-category-breakdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[var(--card-bg)] rounded-2xl p-6 shadow-[var(--card-shadow)] border border-[var(--border-color)]">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-[var(--text-primary)]">Category Spending</h3>
          <p class="text-xs text-[var(--text-secondary)] mt-0.5">Distribution across categories</p>
        </div>
        <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
          {{ breakdown.length }} Categories
        </span>
      </div>
      
      @if (breakdown && breakdown.length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <!-- Circular / Donut SVG Chart -->
          <div class="md:col-span-5 flex flex-col items-center justify-center relative py-2">
            <svg class="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
              <!-- Background circle -->
              <circle
                cx="50" cy="50" r="38"
                fill="transparent"
                stroke="var(--bg-tertiary)"
                stroke-width="12"
              />
              
              <!-- Slices -->
              @for (slice of svgSlices; track slice.name) {
                <circle
                  cx="50" cy="50" r="38"
                  fill="transparent"
                  [attr.stroke]="slice.color"
                  stroke-width="12"
                  [attr.stroke-dasharray]="slice.dashArray"
                  [attr.stroke-dashoffset]="slice.dashOffset"
                  stroke-linecap="round"
                  class="transition-all duration-700 ease-out"
                />
              }
            </svg>

            <!-- Center label in donut -->
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span class="text-xs text-[var(--text-secondary)] font-medium">Top Category</span>
              <span class="text-sm font-bold text-[var(--text-primary)]">{{ topCategory?.categoryName || 'None' }}</span>
              <span class="text-xs text-[var(--color-primary)] font-semibold">{{ topCategory?.percentage | number:'1.0-1' }}%</span>
            </div>
          </div>

          <!-- Category Progress List -->
          <div class="md:col-span-7 space-y-3.5">
            @for (item of breakdown; track item.categoryId) {
              <div>
                <div class="flex items-center justify-between text-sm mb-1.5">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full" [style.backgroundColor]="getCategoryColor(item.categoryName)"></span>
                    <span class="text-base">{{ item.categoryIcon }}</span>
                    <span class="font-medium text-[var(--text-primary)] text-xs">{{ item.categoryName }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-semibold text-xs text-[var(--text-primary)]">{{ item.formattedAmount }}</span>
                    <span class="text-xs text-[var(--text-secondary)] w-9 text-right font-mono">{{ item.percentage | number:'1.0-1' }}%</span>
                  </div>
                </div>
                
                <div class="h-2 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-700 ease-out" 
                    [style.width.%]="item.percentage"
                    [style.backgroundColor]="getCategoryColor(item.categoryName)"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <p class="text-center text-[var(--text-secondary)] py-8 text-sm">No spending recorded for this period.</p>
      }
    </div>
  `
})
export class CategoryBreakdownComponent {
  private _breakdown: CategoryBreakdown[] = [];

  @Input() 
  set breakdown(val: CategoryBreakdown[]) {
    this._breakdown = val || [];
    this.computeSvgSlices();
  }
  get breakdown(): CategoryBreakdown[] {
    return this._breakdown;
  }

  svgSlices: { name: string; color: string; dashArray: string; dashOffset: number }[] = [];
  topCategory: CategoryBreakdown | null = null;

  private categoryColorMap: { [key: string]: string } = {
    'Food': '#FF9500',
    'Grocery': '#34C759',
    'Beauty': '#AF52DE',
    'Bills': '#FF3B30',
    'Travel': '#007AFF',
    'Snacks': '#FF6482'
  };

  getCategoryColor(name: string): string {
    return this.categoryColorMap[name] || '#8E8E93';
  }

  private computeSvgSlices() {
    if (!this._breakdown || this._breakdown.length === 0) {
      this.svgSlices = [];
      this.topCategory = null;
      return;
    }

    const circumference = 2 * Math.PI * 38; // ~238.76
    let currentOffset = 0;

    // Find top category
    this.topCategory = [...this._breakdown].sort((a, b) => b.amount - a.amount)[0] || null;

    this.svgSlices = this._breakdown.map(item => {
      const fraction = item.percentage / 100;
      const strokeLength = fraction * circumference;
      const dashArray = `${strokeLength} ${circumference - strokeLength}`;
      const slice = {
        name: item.categoryName,
        color: this.getCategoryColor(item.categoryName),
        dashArray: dashArray,
        dashOffset: -currentOffset
      };
      currentOffset += strokeLength;
      return slice;
    });
  }
}
