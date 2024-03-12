import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWebsites } from '../websites.model';
import { WebsitesService } from '../service/websites.service';

export const websitesResolve = (route: ActivatedRouteSnapshot): Observable<null | IWebsites> => {
  const id = route.params['id'];
  if (id) {
    return inject(WebsitesService)
      .find(id)
      .pipe(
        mergeMap((websites: HttpResponse<IWebsites>) => {
          if (websites.body) {
            return of(websites.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default websitesResolve;
