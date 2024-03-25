import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StatsService } from '../services/stats.service';

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

  constructor(
    private statsService: StatsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.statsService.getHostAgentDetails().subscribe(response => {
      if (response && response.items && response.items.length > 0) {
        this.hostAgentDetails = response.items[0];
        this.cdr.detectChanges();
      }
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
    // Fetch all events
    this.statsService.getAllEvents().subscribe(
      data => {
        this.eventsData = data;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Failed to fetch all events:', error);
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

    // Fetch websites metrics
    this.statsService.getWebsiteMetrics().subscribe(
      data => {
        console.log(data);
        this.websiteMetrics = data;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Failed to fetch website metrics:', error);
      },
    );
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
}
