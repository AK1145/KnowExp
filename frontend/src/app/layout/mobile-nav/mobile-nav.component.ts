import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="bg-[var(--bg-primary)] border-t border-[var(--border-color)] shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
      <nav class="flex justify-around items-center h-16 px-2">
        <a routerLink="/dashboard" routerLinkActive="text-[var(--color-primary)]" 
           [routerLinkActiveOptions]="{exact: true}"
           class="flex flex-col items-center justify-center w-16 text-[var(--text-secondary)]">
          <span class="text-2xl mb-1">🏠</span>
          <span class="text-[10px] font-medium">Home</span>
        </a>
        
        <a routerLink="/add"
           class="flex items-center justify-center w-12 h-12 -mt-6 rounded-full bg-[var(--color-primary)] text-white shadow-lg border-4 border-[var(--bg-secondary)] hover:scale-105 transition-transform">
          <span class="text-2xl leading-none mb-1">+</span>
        </a>
        
        <a routerLink="/transactions" routerLinkActive="text-[var(--color-primary)]"
           class="flex flex-col items-center justify-center w-16 text-[var(--text-secondary)]">
          <span class="text-2xl mb-1">📋</span>
          <span class="text-[10px] font-medium">Transactions</span>
        </a>
        
        <a routerLink="/settings" routerLinkActive="text-[var(--color-primary)]"
           class="flex flex-col items-center justify-center w-16 text-[var(--text-secondary)]">
          <span class="text-2xl mb-1">⚙️</span>
          <span class="text-[10px] font-medium">Settings</span>
        </a>
      </nav>
    </div>
  `
})
export class MobileNavComponent {}
