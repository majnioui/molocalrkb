import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { WebsitesComponent } from './list/websites.component';
import { WebsitesDetailComponent } from './detail/websites-detail.component';
import { WebsitesUpdateComponent } from './update/websites-update.component';
import WebsitesResolve from './route/websites-routing-resolve.service';

const websitesRoute: Routes = [
  {
    path: '',
    component: WebsitesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WebsitesDetailComponent,
    resolve: {
      websites: WebsitesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WebsitesUpdateComponent,
    resolve: {
      websites: WebsitesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WebsitesUpdateComponent,
    resolve: {
      websites: WebsitesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default websitesRoute;
