import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../models/category.model';
import { MOCK_CATEGORIES } from '../mocks/mock-categories';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categories = signal<Category[]>(MOCK_CATEGORIES);

  getCategories(): Observable<Category[]> {
    return of(this.categories());
  }
}
