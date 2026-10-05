import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { BudgetService } from '../../core/services/budget.service';
import { BudgetData } from '../../core/models/budget.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <h2 class="text-2xl font-semibold text-[var(--text-primary)] mb-6">Settings</h2>

      <!-- Appearance -->
      <div class="bg-[var(--card-bg)] rounded-2xl shadow-[var(--card-shadow)] border border-[var(--border-color)] overflow-hidden">
        <div class="p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <h3 class="font-medium text-[var(--text-primary)]">Appearance</h3>
        </div>
        <div class="p-6 flex items-center justify-between">
          <div>
            <p class="font-medium text-[var(--text-primary)]">Dark Mode</p>
            <p class="text-sm text-[var(--text-secondary)]">Toggle dark appearance</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" [checked]="themeService.isDark()" (change)="themeService.toggle()">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
          </label>
        </div>
      </div>

      <!-- Budget Settings -->
      <div class="bg-[var(--card-bg)] rounded-2xl shadow-[var(--card-shadow)] border border-[var(--border-color)] overflow-hidden">
        <div class="p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <h3 class="font-medium text-[var(--text-primary)]">Budget Settings</h3>
        </div>
        <div class="p-6">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p class="font-medium text-[var(--text-primary)]">Monthly Budget</p>
              <p class="text-sm text-[var(--text-secondary)]">Set your target spending limit</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[var(--text-secondary)] font-medium">₹</span>
              <input type="number" [value]="budget?.monthlyBudget" #budgetInput
                     class="w-32 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--color-primary)]">
              <button (click)="saveBudget(budgetInput.value)"
                      class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-light)] transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- App Info -->
      <div class="bg-[var(--card-bg)] rounded-2xl shadow-[var(--card-shadow)] border border-[var(--border-color)] overflow-hidden">
        <div class="p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <h3 class="font-medium text-[var(--text-primary)]">About</h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex justify-between">
            <span class="text-[var(--text-secondary)]">Version</span>
            <span class="text-[var(--text-primary)] font-medium">1.0.0</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--text-secondary)]">Developer</span>
            <span class="text-[var(--text-primary)] font-medium">Gemini Assistant</span>
          </div>
        </div>
      </div>

    </div>
  `
})
export class SettingsComponent implements OnInit {
  themeService = inject(ThemeService);
  private budgetService = inject(BudgetService);

  budget: BudgetData | null = null;

  ngOnInit() {
    this.budgetService.getBudget().subscribe(b => this.budget = b);
  }

  saveBudget(val: string) {
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      this.budgetService.updateBudget({ monthlyBudget: num }).subscribe(b => this.budget = b);
      alert('Budget saved!');
    }
  }
}
