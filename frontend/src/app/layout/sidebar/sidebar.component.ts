import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="h-full flex flex-col py-6">
      <!-- App Brand / Logo -->
      <div class="px-6 mb-8 flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg shadow-sm">
          K
        </div>
        <div>
          <h1 class="text-xl font-bold tracking-tight text-[var(--text-primary)]">KnowExp</h1>
          <p class="text-[11px] text-[var(--text-secondary)] font-medium">Expense Tracker</p>
        </div>
      </div>
      
      <!-- Navigation Links -->
      <nav class="flex-1 px-4 space-y-1.5">
        <a routerLink="/dashboard" routerLinkActive="bg-[var(--color-primary)] text-white shadow-xs" 
           [routerLinkActiveOptions]="{exact: true}"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all">
          <span class="text-lg">📊</span>
          <span>Dashboard</span>
        </a>
        
        <a routerLink="/transactions" routerLinkActive="bg-[var(--color-primary)] text-white shadow-xs"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all">
          <span class="text-lg">📋</span>
          <span>Transactions</span>
        </a>
        
        <a routerLink="/settings" routerLinkActive="bg-[var(--color-primary)] text-white shadow-xs"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all">
          <span class="text-lg">⚙️</span>
          <span>Settings</span>
        </a>
      </nav>
      
      <!-- Prominent Add Expense Button -->
      <div class="px-4 mt-auto">
        <a routerLink="/add" class="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-light)] transition-all active:scale-[0.98] shadow-sm">
          <span class="text-lg leading-none">+</span>
          <span>Add Expense</span>
        </a>
      </div>
    </div>
  `
})
export class SidebarComponent {}
