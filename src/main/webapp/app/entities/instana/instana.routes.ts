import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { InstanaComponent } from './list/instana.component';
import { InstanaDetailComponent } from './detail/instana-detail.component';
import { InstanaUpdateComponent } from './update/instana-update.component';
import InstanaResolve from './route/instana-routing-resolve.service';

const instanaRoute: Routes = [
  {
    path: '',
    component: InstanaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InstanaDetailComponent,
    resolve: {
      instana: InstanaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InstanaUpdateComponent,
    resolve: {
      instana: InstanaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InstanaUpdateComponent,
    resolve: {
      instana: InstanaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default instanaRoute;
