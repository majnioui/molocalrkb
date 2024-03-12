import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAgentIssues } from '../agent-issues.model';
import { AgentIssuesService } from '../service/agent-issues.service';

export const agentIssuesResolve = (route: ActivatedRouteSnapshot): Observable<null | IAgentIssues> => {
  const id = route.params['id'];
  if (id) {
    return inject(AgentIssuesService)
      .find(id)
      .pipe(
        mergeMap((agentIssues: HttpResponse<IAgentIssues>) => {
          if (agentIssues.body) {
            return of(agentIssues.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default agentIssuesResolve;
