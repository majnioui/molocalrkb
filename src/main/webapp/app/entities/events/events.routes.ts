import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { EventsComponent } from './list/events.component';
import { EventsDetailComponent } from './detail/events-detail.component';
import { EventsUpdateComponent } from './update/events-update.component';
import EventsResolve from './route/events-routing-resolve.service';

const eventsRoute: Routes = [
  {
    path: '',
    component: EventsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventsDetailComponent,
    resolve: {
      events: EventsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventsUpdateComponent,
    resolve: {
      events: EventsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventsUpdateComponent,
    resolve: {
      events: EventsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default eventsRoute;
