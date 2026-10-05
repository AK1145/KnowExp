import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardData } from '../models/dashboard.model';
import { MOCK_DASHBOARD_WEEK, MOCK_DASHBOARD_MONTH, MOCK_DASHBOARD_YEAR } from '../mocks/mock-dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  getDashboard(period: 'week' | 'month' | 'year'): Observable<DashboardData> {
    switch (period) {
      case 'week': return of(MOCK_DASHBOARD_WEEK);
      case 'month': return of(MOCK_DASHBOARD_MONTH);
      case 'year': return of(MOCK_DASHBOARD_YEAR);
      default: return of(MOCK_DASHBOARD_MONTH);
    }
  }
}
