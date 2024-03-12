import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AgentIssuesComponent } from './list/agent-issues.component';
import { AgentIssuesDetailComponent } from './detail/agent-issues-detail.component';
import { AgentIssuesUpdateComponent } from './update/agent-issues-update.component';
import AgentIssuesResolve from './route/agent-issues-routing-resolve.service';

const agentIssuesRoute: Routes = [
  {
    path: '',
    component: AgentIssuesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AgentIssuesDetailComponent,
    resolve: {
      agentIssues: AgentIssuesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AgentIssuesUpdateComponent,
    resolve: {
      agentIssues: AgentIssuesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AgentIssuesUpdateComponent,
    resolve: {
      agentIssues: AgentIssuesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default agentIssuesRoute;
