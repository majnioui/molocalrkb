import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AppServicesComponent } from './list/app-services.component';
import { AppServicesDetailComponent } from './detail/app-services-detail.component';
import { AppServicesUpdateComponent } from './update/app-services-update.component';
import AppServicesResolve from './route/app-services-routing-resolve.service';

const appServicesRoute: Routes = [
  {
    path: '',
    component: AppServicesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AppServicesDetailComponent,
    resolve: {
      appServices: AppServicesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AppServicesUpdateComponent,
    resolve: {
      appServices: AppServicesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AppServicesUpdateComponent,
    resolve: {
      appServices: AppServicesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default appServicesRoute;
