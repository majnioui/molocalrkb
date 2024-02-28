import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInstana } from '../instana.model';
import { InstanaService } from '../service/instana.service';

export const instanaResolve = (route: ActivatedRouteSnapshot): Observable<null | IInstana> => {
  const id = route.params['id'];
  if (id) {
    return inject(InstanaService)
      .find(id)
      .pipe(
        mergeMap((instana: HttpResponse<IInstana>) => {
          if (instana.body) {
            return of(instana.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default instanaResolve;
