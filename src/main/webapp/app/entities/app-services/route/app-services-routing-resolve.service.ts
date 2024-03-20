import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAppServices } from '../app-services.model';
import { AppServicesService } from '../service/app-services.service';

export const appServicesResolve = (route: ActivatedRouteSnapshot): Observable<null | IAppServices> => {
  const id = route.params['id'];
  if (id) {
    return inject(AppServicesService)
      .find(id)
      .pipe(
        mergeMap((appServices: HttpResponse<IAppServices>) => {
          if (appServices.body) {
            return of(appServices.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default appServicesResolve;
