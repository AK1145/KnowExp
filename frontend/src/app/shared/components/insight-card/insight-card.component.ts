import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Insight } from '../../../core/models/insight.model';

@Component({
  selector: 'app-insight-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[var(--card-bg)] rounded-2xl p-6 shadow-[var(--card-shadow)] border border-[var(--border-color)] h-full">
      <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-4">Insights</h3>
      
      @if (insights && insights.length > 0) {
        <div class="space-y-3">
          @for (insight of insights.slice(0, 3); track insight.type) {
            <div class="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)] bg-opacity-50">
              <span class="text-xl mt-0.5">{{ insight.icon }}</span>
              <p class="text-sm text-[var(--text-primary)] leading-relaxed">{{ insight.message }}</p>
            </div>
          }
        </div>
      } @else {
        <p class="text-sm text-[var(--text-secondary)]">No insights available right now.</p>
      }
    </div>
  `
})
export class InsightCardComponent {
  @Input() insights: Insight[] = [];
}
