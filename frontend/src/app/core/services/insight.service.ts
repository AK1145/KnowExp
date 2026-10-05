import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Insight } from '../models/insight.model';
import { MOCK_INSIGHTS } from '../mocks/mock-insights';

@Injectable({
  providedIn: 'root'
})
export class InsightService {
  getInsights(period: string): Observable<Insight[]> {
    return of(MOCK_INSIGHTS);
  }
}
