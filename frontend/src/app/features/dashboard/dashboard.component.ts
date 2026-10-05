import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { BudgetService } from '../../core/services/budget.service';
import { InsightService } from '../../core/services/insight.service';
import { DashboardData } from '../../core/models/dashboard.model';
import { BudgetData } from '../../core/models/budget.model';
import { Insight } from '../../core/models/insight.model';

import { BudgetSummaryComponent } from '../../shared/components/budget-summary/budget-summary.component';
import { CategoryBreakdownComponent } from '../../shared/components/category-breakdown/category-breakdown.component';
import { RecentTransactionsComponent } from '../../shared/components/recent-transactions/recent-transactions.component';
import { InsightCardComponent } from '../../shared/components/insight-card/insight-card.component';
import { SpendingChartComponent } from '../../shared/components/spending-chart/spending-chart.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BudgetSummaryComponent,
    CategoryBreakdownComponent,
    RecentTransactionsComponent,
    InsightCardComponent,
    SpendingChartComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      
      <!-- Top Bar: Greeting & Period Segment Control -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Dashboard</h2>
          <p class="text-sm text-[var(--text-secondary)] mt-0.5">Summary of your financial activity</p>
        </div>
        
        <!-- Period Switcher -->
        <div class="flex bg-[var(--bg-tertiary)] p-1 rounded-xl w-fit self-start sm:self-auto border border-[var(--border-color)]">
          @for (p of periods; track p.value) {
            <button
              (click)="setPeriod(p.value)"
              [class.bg-[var(--card-bg)]]="activePeriod() === p.value"
              [class.shadow-xs]="activePeriod() === p.value"
              [class.font-semibold]="activePeriod() === p.value"
              [class.text-[var(--text-primary)]]="activePeriod() === p.value"
              [class.text-[var(--text-secondary)]]="activePeriod() !== p.value"
              class="px-4 py-1.5 text-xs rounded-lg transition-all"
            >
              {{ p.label }}
            </button>
          }
        </div>
      </div>
      
      @if (loading()) {
        <app-loading-spinner></app-loading-spinner>
      } @else if (data()) {
        
        <!-- Main Highlight Card -->
        <div class="bg-[var(--card-bg)] rounded-3xl p-6 md:p-8 shadow-[var(--card-shadow)] border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div class="space-y-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Total Spending ({{ data()?.periodLabel }})
            </span>
            <div class="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
              {{ data()?.formattedTotal }}
            </div>
            
            <div class="flex items-center gap-2 text-xs font-medium pt-1">
              <span
                [ngClass]="data()!.comparisonPercentage > 0 ? 'text-[var(--color-danger)] bg-red-50 dark:bg-red-950/30' : 'text-[var(--color-success)] bg-green-50 dark:bg-green-950/30'"
                class="px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold"
              >
                {{ data()!.comparisonPercentage > 0 ? '↑' : '↓' }} {{ Math.abs(data()!.comparisonPercentage) }}%
              </span>
              <span class="text-[var(--text-secondary)]">compared to previous {{ activePeriod() }} ({{ data()?.formattedPreviousSpending }})</span>
            </div>
          </div>

          <!-- Quick Action on Desktop -->
          <div class="flex items-center gap-3">
            <a
              routerLink="/add"
              class="px-5 py-3 rounded-2xl bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-light)] transition-all shadow-sm flex items-center gap-2"
            >
              <span>+</span>
              <span>Add Expense</span>
            </a>
          </div>
        </div>

        <!-- Budget & Insights Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @if (budget()) {
            <app-budget-summary [budget]="budget()!"></app-budget-summary>
          }
          <app-insight-card [insights]="insights()"></app-insight-card>
        </div>

        <!-- Breakdown & Recent Transactions Row -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-7">
            @if (activePeriod() === 'year') {
              <app-spending-chart [trend]="data()!.spendingTrend"></app-spending-chart>
            } @else {
              <app-category-breakdown [breakdown]="data()!.categoryBreakdown"></app-category-breakdown>
            }
          </div>
          
          <div class="lg:col-span-5">
            <app-recent-transactions [transactions]="data()!.recentTransactions"></app-recent-transactions>
          </div>
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private budgetService = inject(BudgetService);
  private insightService = inject(InsightService);
  
  Math = Math;
  
  periods: { label: string; value: 'week' | 'month' | 'year' }[] = [
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' }
  ];
  
  activePeriod = signal<'week' | 'month' | 'year'>('month');
  loading = signal<boolean>(true);
  
  data = signal<DashboardData | null>(null);
  budget = signal<BudgetData | null>(null);
  insights = signal<Insight[]>([]);

  ngOnInit() {
    this.loadData();
    this.budgetService.getBudget().subscribe(b => this.budget.set(b));
    this.insightService.getInsights('month').subscribe(i => this.insights.set(i));
  }
  
  setPeriod(p: 'week' | 'month' | 'year') {
    this.activePeriod.set(p);
    this.loadData();
  }
  
  private loadData() {
    this.loading.set(true);
    this.dashboardService.getDashboard(this.activePeriod()).subscribe(res => {
      this.data.set(res);
      this.loading.set(false);
    });
  }
}
