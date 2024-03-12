import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInfraTopology } from '../infra-topology.model';
import { InfraTopologyService } from '../service/infra-topology.service';

export const infraTopologyResolve = (route: ActivatedRouteSnapshot): Observable<null | IInfraTopology> => {
  const id = route.params['id'];
  if (id) {
    return inject(InfraTopologyService)
      .find(id)
      .pipe(
        mergeMap((infraTopology: HttpResponse<IInfraTopology>) => {
          if (infraTopology.body) {
            return of(infraTopology.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default infraTopologyResolve;
