import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { HealthAndVersionComponent } from './list/health-and-version.component';
import { HealthAndVersionDetailComponent } from './detail/health-and-version-detail.component';
import { HealthAndVersionUpdateComponent } from './update/health-and-version-update.component';
import HealthAndVersionResolve from './route/health-and-version-routing-resolve.service';

const healthAndVersionRoute: Routes = [
  {
    path: '',
    component: HealthAndVersionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HealthAndVersionDetailComponent,
    resolve: {
      healthAndVersion: HealthAndVersionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HealthAndVersionUpdateComponent,
    resolve: {
      healthAndVersion: HealthAndVersionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HealthAndVersionUpdateComponent,
    resolve: {
      healthAndVersion: HealthAndVersionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default healthAndVersionRoute;
