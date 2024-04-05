import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StatsService } from '../services/stats.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'jhi-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  hostAgentDetails: any = {
    data: {
      memory: {},
    },
  };
  installedSoftware: any;
  infrastructureTopology: any;
  eventsData: any[] = [];
  agentRelatedIssues: any[] = [];
  instanaVersion: any;
  instanaHealth: any;
  servicesData: any[] = [];
  websiteMetrics: any[] = [];
  snapshotDetails: any[] = [];
  baseUrl: string = '';

  constructor(
    private statsService: StatsService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadWebsiteMetrics(300000);

    this.loadEventsData(300000, 'ISSUE');

    this.statsService.getAppConfig().subscribe(config => {
      this.baseUrl = config.baseUrl;
    });

    this.statsService.getHostAgentDetails().subscribe(response => {
      if (response && response.items && response.items.length > 0) {
        this.hostAgentDetails = response.items[0];
        this.cdr.detectChanges();
      }
    });

    this.statsService.getSnapshotDetails().subscribe(data => {
      this.snapshotDetails = data;
    });

    // Fetch installed software versions
    this.statsService.getInstalledSoftware().subscribe(
      data => {
        this.installedSoftware = data;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Failed to fetch installed software:', error);
      },
    );

    // Fetch infrastructure topology
    this.statsService.getInfrastructureTopology().subscribe(
      data => {
        this.infrastructureTopology = data.nodes.map((node: any) => ({
          plugin: node.plugin,
          label: node.label,
          pluginId: node.entityId.pluginId,
        }));
        this.cdr.detectChanges();
      },
      error => {
        console.error('Failed to fetch infra topology:', error);
      },
    );

    // Fetch all services
    this.statsService.getServices().subscribe(
      data => {
        this.servicesData = data.items;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Failed to fetch services:', error);
      },
    );

    // Agent related issues
    this.statsService.getAgentRelaltedIssues().subscribe(
      agentIssues => {
        this.agentRelatedIssues = agentIssues;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Failed to agent related issues:', error);
      },
    );

    // Instana health and version
    this.statsService.getInstanaVersion().subscribe(version => {
      this.instanaVersion = version;
    });
    this.statsService.getInstanaHealth().subscribe(health => {
      this.instanaHealth = health;
    });
  }

  // get health status as emojis
  getHealthStatusEmoji(healthStatus: string): string {
    switch (healthStatus) {
      case 'GREEN':
        return '🟢';
      case 'YELLOW':
        return '🟡';
      case 'RED':
        return '🔴';
      default:
        return healthStatus;
    }
  }
  // Host snapshot goto page
  openHostDetails(snapshotId: string) {
    const url = `${this.baseUrl?.trim()}/#/table;view=physical;plugin=host/dashboard?snapshotId=${snapshotId}`;
    window.open(url, '_blank');
  }

  // Websites
  updateMetricsTimeFrame(windowSize: string) {
    // Convert windowSize to a number and reload metrics
    this.loadWebsiteMetrics(Number(windowSize));
  }

  private loadWebsiteMetrics(windowSize: number) {
    this.statsService.getWebsiteMetrics(windowSize).subscribe(
      data => {
        this.websiteMetrics = data;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Failed to fetch website metrics:', error);
      },
    );
  }

  openWebsiteSummary(websiteId: string) {
    const url = `${this.baseUrl?.trim()}/#/websiteMonitoring/website;websiteId=${websiteId}/summary`;
    window.open(url, '_blank');
  }

  // All Events
  updateEventsTimeFrame(windowSize: string, eventTypeFilters: string) {
    const numWindowSize = Number(windowSize);
    this.loadEventsData(numWindowSize, eventTypeFilters);
  }

  private loadEventsData(windowSize: number, eventTypeFilters: string) {
    this.statsService.getAllEvents(windowSize, eventTypeFilters).subscribe(
      data => {
        this.eventsData = data;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Failed to fetch all events:', error);
      },
    );
  }

  openEventLink(eventId: string): void {
    const url = `${this.baseUrl?.trim()}/#/events;orderDirection=DESC;orderBy=start;eventId=${eventId}`;
    window.open(url, '_blank');
  }
}
