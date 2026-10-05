import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, MobileNavComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-[var(--bg-secondary)]">
      <app-sidebar class="hidden md:block w-60 border-r border-[var(--border-color)] flex-shrink-0 bg-[var(--bg-primary)]"></app-sidebar>
      <div class="flex-1 flex flex-col h-full relative overflow-y-auto pb-16 md:pb-0">
        <main class="flex-1 overflow-x-hidden">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-mobile-nav class="md:hidden fixed bottom-0 left-0 right-0 z-50"></app-mobile-nav>
    </div>
  `
})
export class ShellComponent {}
