import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8 text-center bg-[var(--card-bg)] rounded-2xl shadow-[var(--card-shadow)] border border-[var(--border-color)]">
      <span class="text-4xl mb-3">{{ icon }}</span>
      <h3 class="text-lg font-medium text-[var(--text-primary)] mb-1">{{ message }}</h3>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() message = 'No data available';
  @Input() icon = '📭';
}
