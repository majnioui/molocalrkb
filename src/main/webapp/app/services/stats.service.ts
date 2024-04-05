import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private resourceUrl = '/api/all-websites';

  constructor(private http: HttpClient) {}

  getHostAgentDetails(): Observable<any> {
    return this.http.get('/api/host-agent');
  }

  getInstalledSoftware(): Observable<any> {
    return this.http.get('/api/installed-software');
  }

  getInfrastructureTopology(): Observable<any> {
    return this.http.get('/api/infra-topology');
  }

  getAllEvents(windowSize: number, eventTypeFilters: string): Observable<any> {
    return this.http.get('/api/all-events', {
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
    return this.http.get('/api/agent-related-issues');
  }

  getInstanaVersion(): Observable<any> {
    return this.http.get('/api/instana-version');
  }
  getInstanaHealth(): Observable<any> {
    return this.http.get('/api/instana-health');
  }

  getWebsiteMetrics(windowSize: number): Observable<any> {
    return this.http.get<any>('/api/website-metrics', { params: { windowSize } });
  }

  getSnapshotDetails(): Observable<any> {
    return this.http.get('/api/snapshot-details');
  }

  getAppConfig(): Observable<{ baseUrl: string }> {
    return this.http.get<{ baseUrl: string }>('/api/config');
  }
}
