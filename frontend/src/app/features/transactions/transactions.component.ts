import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ExpenseService } from '../../core/services/expense.service';
import { CategoryService } from '../../core/services/category.service';
import { Expense, ExpenseRequest } from '../../core/models/expense.model';
import { Category } from '../../core/models/category.model';
import { IndianCurrencyPipe } from '../../shared/pipes/indian-currency.pipe';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IndianCurrencyPipe,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  template: `
    <div class="p-4 md:p-8 max-w-4xl mx-auto flex flex-col h-full space-y-6">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Transactions</h2>
          <p class="text-sm text-[var(--text-secondary)] mt-0.5">All your recorded expenses</p>
        </div>
      </div>

      <!-- Main Container Card -->
      <div class="bg-[var(--card-bg)] rounded-2xl shadow-[var(--card-shadow)] border border-[var(--border-color)] overflow-hidden flex flex-col">
        
        <!-- Search and Filters Bar -->
        <div class="p-4 border-b border-[var(--border-color)] space-y-3">
          <!-- Search Input -->
          <div class="relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[var(--text-secondary)]">🔍</span>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onFilterChange()"
              placeholder="Search by note, category or amount..." 
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] outline-none text-[var(--text-primary)] placeholder-[var(--text-tertiary)] text-sm focus:border-[var(--color-primary)] transition-colors"
            />
            @if (searchQuery) {
              <button (click)="clearSearch()" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">✕</button>
            }
          </div>

          <!-- Category Filter Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              (click)="selectCategory(0)"
              [class.bg-[var(--color-primary)]]="selectedCategoryId() === 0"
              [class.text-white]="selectedCategoryId() === 0"
              [class.bg-[var(--bg-secondary)]]="selectedCategoryId() !== 0"
              [class.text-[var(--text-secondary)]]="selectedCategoryId() !== 0"
              class="px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all hover:opacity-90 border border-transparent"
            >
              All Categories
            </button>
            @for (cat of categories(); track cat.id) {
              <button
                (click)="selectCategory(cat.id)"
                [class.bg-[var(--color-primary)]]="selectedCategoryId() === cat.id"
                [class.text-white]="selectedCategoryId() === cat.id"
                [class.bg-[var(--bg-secondary)]]="selectedCategoryId() !== cat.id"
                [class.text-[var(--text-secondary)]]="selectedCategoryId() !== cat.id"
                class="px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all hover:opacity-90 flex items-center gap-1.5"
              >
                <span>{{ cat.icon }}</span>
                <span>{{ cat.name }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Transactions List -->
        @if (loading()) {
          <app-loading-spinner></app-loading-spinner>
        } @else if (expenses().length > 0) {
          <div class="divide-y divide-[var(--border-color)] max-h-[65vh] overflow-y-auto">
            @for (group of groupedExpenses(); track group.date) {
              <!-- Date Header -->
              <div class="px-5 py-2.5 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] sticky top-0 z-10 flex items-center justify-between">
                <span class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{{ formatGroupDate(group.date) }}</span>
                <span class="text-xs text-[var(--text-tertiary)] font-medium">{{ group.total | indianCurrency }}</span>
              </div>
              
              <!-- Group Items -->
              <div class="divide-y divide-[var(--border-color)]">
                @for (tx of group.items; track tx.id) {
                  <div class="p-4 sm:px-6 flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors group">
                    <div class="flex items-center gap-3.5">
                      <div class="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-xl shadow-xs border border-[var(--border-color)]">
                        {{ tx.category.icon }}
                      </div>
                      <div>
                        <p class="font-medium text-[var(--text-primary)] text-sm leading-tight">{{ tx.category.name }}</p>
                        <p class="text-xs text-[var(--text-secondary)] mt-0.5">
                          {{ tx.expenseDate }}
                          @if (tx.note) {
                            <span> · {{ tx.note }}</span>
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-3">
                      <div class="text-right">
                        <span class="font-semibold text-[var(--text-primary)] text-sm">{{ tx.amount | indianCurrency }}</span>
                      </div>
                      
                      <!-- Action Buttons -->
                      <div class="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          (click)="openEditModal(tx)"
                          title="Edit"
                          class="p-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          (click)="deleteExpense(tx.id)"
                          title="Delete"
                          class="p-1.5 text-xs text-[var(--color-danger)] hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        } @else {
          <div class="py-12">
            <app-empty-state message="No transactions found" icon="💸"></app-empty-state>
          </div>
        }
      </div>

      <!-- Edit Expense Modal -->
      @if (editingExpense()) {
        <div class="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div class="bg-[var(--card-bg)] rounded-2xl shadow-xl border border-[var(--border-color)] max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div class="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
              <h3 class="font-semibold text-lg text-[var(--text-primary)]">Edit Expense</h3>
              <button (click)="closeEditModal()" class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-lg">✕</button>
            </div>

            <form [formGroup]="editForm" (ngSubmit)="saveEdit()" class="p-6 space-y-5">
              <!-- Amount -->
              <div>
                <label class="block text-xs font-medium text-[var(--text-secondary)] mb-1">Amount (₹)</label>
                <input
                  type="number"
                  formControlName="amount"
                  class="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-lg font-semibold outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <!-- Category -->
              <div>
                <label class="block text-xs font-medium text-[var(--text-secondary)] mb-2">Category</label>
                <div class="grid grid-cols-3 gap-2">
                  @for (cat of categories(); track cat.id) {
                    <button
                      type="button"
                      (click)="editForm.patchValue({ categoryId: cat.id })"
                      [class.ring-2]="editForm.get('categoryId')?.value === cat.id"
                      [class.ring-[var(--color-primary)]]="editForm.get('categoryId')?.value === cat.id"
                      [class.bg-[var(--bg-secondary)]]="editForm.get('categoryId')?.value !== cat.id"
                      [class.bg-blue-50]="editForm.get('categoryId')?.value === cat.id"
                      class="p-2.5 rounded-xl border border-[var(--border-color)] flex flex-col items-center justify-center gap-1 transition-all"
                    >
                      <span class="text-lg">{{ cat.icon }}</span>
                      <span class="text-xs font-medium text-[var(--text-primary)]">{{ cat.name }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Date -->
              <div>
                <label class="block text-xs font-medium text-[var(--text-secondary)] mb-1">Date</label>
                <input
                  type="date"
                  formControlName="expenseDate"
                  class="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <!-- Note -->
              <div>
                <label class="block text-xs font-medium text-[var(--text-secondary)] mb-1">Note (Optional)</label>
                <input
                  type="text"
                  formControlName="note"
                  placeholder="Optional description"
                  class="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  (click)="closeEditModal()"
                  class="flex-1 py-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="editForm.invalid"
                  class="flex-1 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class TransactionsComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);
  
  loading = signal(true);
  expenses = signal<Expense[]>([]);
  categories = signal<Category[]>([]);
  selectedCategoryId = signal<number>(0);
  searchQuery = '';

  editingExpense = signal<Expense | null>(null);

  editForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
    categoryId: [1, Validators.required],
    expenseDate: ['', Validators.required],
    note: ['']
  });

  ngOnInit() {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories.set(cats.filter(c => c.isActive));
    });
    this.loadExpenses();
  }

  loadExpenses() {
    this.loading.set(true);
    const filter = {
      search: this.searchQuery,
      categoryId: this.selectedCategoryId() > 0 ? this.selectedCategoryId() : undefined
    };

    this.expenseService.getExpenses(filter).subscribe(res => {
      this.expenses.set(res.content);
      this.loading.set(false);
    });
  }

  onFilterChange() {
    this.loadExpenses();
  }

  selectCategory(catId: number) {
    this.selectedCategoryId.set(catId);
    this.loadExpenses();
  }

  clearSearch() {
    this.searchQuery = '';
    this.loadExpenses();
  }

  deleteExpense(id: number) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe(() => {
        this.loadExpenses();
      });
    }
  }

  openEditModal(expense: Expense) {
    this.editingExpense.set(expense);
    this.editForm.patchValue({
      amount: expense.amount,
      categoryId: expense.category.id,
      expenseDate: expense.expenseDate,
      note: expense.note || ''
    });
  }

  closeEditModal() {
    this.editingExpense.set(null);
  }

  saveEdit() {
    const current = this.editingExpense();
    if (current && this.editForm.valid) {
      const formVal = this.editForm.value;
      const request: ExpenseRequest = {
        amount: Number(formVal.amount),
        categoryId: Number(formVal.categoryId),
        expenseDate: formVal.expenseDate!,
        note: formVal.note || ''
      };

      this.expenseService.updateExpense(current.id, request).subscribe(() => {
        this.closeEditModal();
        this.loadExpenses();
      });
    }
  }

  groupedExpenses(): { date: string; items: Expense[]; total: number }[] {
    const groups: { [key: string]: Expense[] } = {};
    
    for (const exp of this.expenses()) {
      if (!groups[exp.expenseDate]) groups[exp.expenseDate] = [];
      groups[exp.expenseDate].push(exp);
    }
    
    const dates = Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    return dates.map(date => {
      const items = groups[date];
      const total = items.reduce((sum, item) => sum + item.amount, 0);
      return { date, items, total };
    });
  }
  
  formatGroupDate(dateString: string): string {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (dateString === today) return 'Today';
    if (dateString === yesterday) return 'Yesterday';
    
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
