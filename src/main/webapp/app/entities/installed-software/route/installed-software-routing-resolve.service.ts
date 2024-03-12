import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInstalledSoftware } from '../installed-software.model';
import { InstalledSoftwareService } from '../service/installed-software.service';

export const installedSoftwareResolve = (route: ActivatedRouteSnapshot): Observable<null | IInstalledSoftware> => {
  const id = route.params['id'];
  if (id) {
    return inject(InstalledSoftwareService)
      .find(id)
      .pipe(
        mergeMap((installedSoftware: HttpResponse<IInstalledSoftware>) => {
          if (installedSoftware.body) {
            return of(installedSoftware.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default installedSoftwareResolve;
