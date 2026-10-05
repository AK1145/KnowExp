import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Insight } from '../models/insight.model';

@Injectable({
  providedIn: 'root'
})
export class InsightService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'https://knowexp.onrender.com/api/insights';

  getInsights(period: string): Observable<Insight[]> {
    const params = new HttpParams().set('period', period);

    return this.http.get<Insight[]>(this.apiUrl, { params });
  }
}