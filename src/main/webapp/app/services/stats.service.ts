import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private resourceUrl = '/api/all-websites';

  constructor(private http: HttpClient) {}

  getHostAgentDetails(): Observable<any> {
    return this.http.get('/api/hostAgent');
  }

  getInstalledSoftware(): Observable<any> {
    return this.http.get('/api/installedSoftware');
  }

  getInfrastructureTopology(): Observable<any> {
    return this.http.get('/api/infraTopology');
  }

  getAllEvents(windowSize: number, eventTypeFilters: string): Observable<any> {
    return this.http.get('/api/allEvents', {
      params: {
        windowSize: windowSize.toString(),
        eventTypeFilters: eventTypeFilters,
      },
    });
  }

  getServices(): Observable<any> {
    return this.http.get('/api/services');
  }

  getAgentRelaltedIssues(): Observable<any> {
    return this.http.get('/api/agentRelatedIssues');
  }

  getInstanaVersion(): Observable<any> {
    return this.http.get('/api/instanaVersion');
  }
  getInstanaHealth(): Observable<any> {
    return this.http.get('/api/instanaHealth');
  }

  getWebsiteMetrics(windowSize: number): Observable<any> {
    return this.http.get<any>('/api/websiteMetrics', { params: { windowSize } });
  }

  getSnapshotDetails(): Observable<any> {
    return this.http.get('/api/snapshotDetails');
  }

  getAppConfig(): Observable<{ baseUrl: string }> {
    return this.http.get<{ baseUrl: string }>('/api/config');
  }
}
