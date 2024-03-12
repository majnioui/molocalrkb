import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'instana',
        data: { pageTitle: 'moLocalrKbApp.instana.home.title' },
        loadChildren: () => import('./instana/instana.routes'),
      },
      {
        path: 'agent-issues',
        data: { pageTitle: 'moLocalrKbApp.agentIssues.home.title' },
        loadChildren: () => import('./agent-issues/agent-issues.routes'),
      },
      {
        path: 'events',
        data: { pageTitle: 'moLocalrKbApp.events.home.title' },
        loadChildren: () => import('./events/events.routes'),
      },
      {
        path: 'infra-topology',
        data: { pageTitle: 'moLocalrKbApp.infraTopology.home.title' },
        loadChildren: () => import('./infra-topology/infra-topology.routes'),
      },
      {
        path: 'installed-software',
        data: { pageTitle: 'moLocalrKbApp.installedSoftware.home.title' },
        loadChildren: () => import('./installed-software/installed-software.routes'),
      },
      {
        path: 'health-and-version',
        data: { pageTitle: 'moLocalrKbApp.healthAndVersion.home.title' },
        loadChildren: () => import('./health-and-version/health-and-version.routes'),
      },
      {
        path: 'websites',
        data: { pageTitle: 'moLocalrKbApp.websites.home.title' },
        loadChildren: () => import('./websites/websites.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
