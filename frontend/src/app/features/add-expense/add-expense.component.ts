import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';
import { ExpenseService } from '../../core/services/expense.service';
import { Category } from '../../core/models/category.model';
import { ExpenseRequest } from '../../core/models/expense.model';

interface ExpenseForm {
  amount: FormControl<number | null>;
  categoryId: FormControl<number | null>;
  expenseDate: FormControl<string | null>;
  note: FormControl<string | null>;
}

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-4 md:p-8 max-w-lg mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-[var(--text-primary)]">Add Expense</h2>
          <p class="text-xs text-[var(--text-secondary)] mt-0.5">Quickly record your spending</p>
        </div>
        <button (click)="cancel()" class="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">✕</button>
      </div>

      <div class="bg-[var(--card-bg)] rounded-3xl shadow-[var(--card-shadow)] border border-[var(--border-color)] overflow-hidden">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 md:p-8 space-y-6">
          
          <!-- Amount Input - Large & Focused -->
          <div class="text-center py-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">Enter Amount</label>
            <div class="flex items-center justify-center text-4xl sm:text-5xl font-bold text-[var(--text-primary)]">
              <span class="mr-1 text-[var(--text-secondary)]">₹</span>
              <input
                type="number"
                formControlName="amount" 
                class="w-48 bg-transparent border-none outline-none text-center font-bold placeholder-[var(--text-tertiary)]" 
                placeholder="0"
                autofocus
              />
            </div>
            @if (form.controls.amount.invalid && form.controls.amount.touched) {
              <p class="text-xs text-[var(--color-danger)] font-medium mt-2">
                Please enter a valid amount greater than ₹0
              </p>
            }
          </div>

          <!-- Category Selection -->
          <div>
            <div class="flex items-center justify-between mb-2.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Select Category</label>
              @if (form.controls.categoryId.invalid && form.controls.categoryId.touched) {
                <span class="text-xs text-[var(--color-danger)]">Category required</span>
              }
            </div>

            <div class="grid grid-cols-3 gap-2.5">
              @for (cat of categories; track cat.id) {
                <button
                  type="button" 
                  (click)="selectCategory(cat.id)"
                  [class.ring-2]="selectedCategoryId === cat.id"
                  [class.ring-[var(--color-primary)]]="selectedCategoryId === cat.id"
                  [class.bg-[var(--bg-secondary)]]="selectedCategoryId !== cat.id"
                  [class.bg-blue-50]="selectedCategoryId === cat.id"
                  [class.dark:bg-blue-950/30]="selectedCategoryId === cat.id"
                  class="flex flex-col items-center justify-center p-3 rounded-2xl border border-[var(--border-color)] transition-all hover:scale-[1.02]"
                >
                  <span class="text-2xl mb-1">{{ cat.icon }}</span>
                  <span
                    class="text-xs font-medium"
                    [class.text-[var(--color-primary)]]="selectedCategoryId === cat.id"
                    [class.text-[var(--text-primary)]]="selectedCategoryId !== cat.id"
                  >
                    {{ cat.name }}
                  </span>
                </button>
              }
            </div>
          </div>

          <!-- Date Picker -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Expense Date</label>
            <input
              type="date"
              formControlName="expenseDate"
              class="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          <!-- Note (Optional) -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Note (Optional)</label>
            <input
              type="text"
              formControlName="note"
              placeholder="What was this expense for? (e.g. Lunch with team)"
              class="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              [disabled]="form.invalid || loading"
              class="w-full py-3.5 rounded-2xl bg-[var(--color-primary)] text-white font-semibold text-base shadow-md hover:bg-[var(--color-primary-light)] transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {{ loading ? 'Saving Expense...' : 'Add Expense' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AddExpenseComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private expenseService = inject(ExpenseService);
  private router = inject(Router);

  categories: Category[] = [];
  loading = false;

  form: FormGroup<ExpenseForm> = this.fb.group<ExpenseForm>({
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    categoryId: new FormControl<number | null>(null, [Validators.required]),
    expenseDate: new FormControl<string | null>(new Date().toISOString().split('T')[0], [Validators.required]),
    note: new FormControl<string | null>('')
  });

  get selectedCategoryId(): number | null {
    return this.form.controls.categoryId.value;
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats.filter(c => c.isActive);
      if (this.categories.length > 0 && !this.form.controls.categoryId.value) {
        this.selectCategory(this.categories[0].id);
      }
    });
  }

  selectCategory(id: number) {
    this.form.controls.categoryId.setValue(id);
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const val = this.form.value;
      const request: ExpenseRequest = {
        amount: Number(val.amount),
        categoryId: Number(val.categoryId),
        expenseDate: val.expenseDate || new Date().toISOString().split('T')[0],
        note: val.note || ''
      };

      this.expenseService.createExpense(request).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
