import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardData } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'https://knowexp.onrender.com/api/dashboard';

  getDashboard(period: 'week' | 'month' | 'year'): Observable<DashboardData> {
    const params = new HttpParams().set('period', period);

    return this.http.get<DashboardData>(this.apiUrl, { params });
  }
}