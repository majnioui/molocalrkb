import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEvents } from '../events.model';
import { EventsService } from '../service/events.service';

export const eventsResolve = (route: ActivatedRouteSnapshot): Observable<null | IEvents> => {
  const id = route.params['id'];
  if (id) {
    return inject(EventsService)
      .find(id)
      .pipe(
        mergeMap((events: HttpResponse<IEvents>) => {
          if (events.body) {
            return of(events.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default eventsResolve;
