import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { InstalledSoftwareComponent } from './list/installed-software.component';
import { InstalledSoftwareDetailComponent } from './detail/installed-software-detail.component';
import { InstalledSoftwareUpdateComponent } from './update/installed-software-update.component';
import InstalledSoftwareResolve from './route/installed-software-routing-resolve.service';

const installedSoftwareRoute: Routes = [
  {
    path: '',
    component: InstalledSoftwareComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InstalledSoftwareDetailComponent,
    resolve: {
      installedSoftware: InstalledSoftwareResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InstalledSoftwareUpdateComponent,
    resolve: {
      installedSoftware: InstalledSoftwareResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InstalledSoftwareUpdateComponent,
    resolve: {
      installedSoftware: InstalledSoftwareResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default installedSoftwareRoute;
