import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { InfraTopologyComponent } from './list/infra-topology.component';
import { InfraTopologyDetailComponent } from './detail/infra-topology-detail.component';
import { InfraTopologyUpdateComponent } from './update/infra-topology-update.component';
import InfraTopologyResolve from './route/infra-topology-routing-resolve.service';

const infraTopologyRoute: Routes = [
  {
    path: '',
    component: InfraTopologyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InfraTopologyDetailComponent,
    resolve: {
      infraTopology: InfraTopologyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InfraTopologyUpdateComponent,
    resolve: {
      infraTopology: InfraTopologyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InfraTopologyUpdateComponent,
    resolve: {
      infraTopology: InfraTopologyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default infraTopologyRoute;
