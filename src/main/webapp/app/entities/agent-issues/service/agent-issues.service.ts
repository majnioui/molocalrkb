import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAgentIssues, NewAgentIssues } from '../agent-issues.model';

export type PartialUpdateAgentIssues = Partial<IAgentIssues> & Pick<IAgentIssues, 'id'>;

export type EntityResponseType = HttpResponse<IAgentIssues>;
export type EntityArrayResponseType = HttpResponse<IAgentIssues[]>;

@Injectable({ providedIn: 'root' })
export class AgentIssuesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/agent-issues');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(agentIssues: NewAgentIssues): Observable<EntityResponseType> {
    return this.http.post<IAgentIssues>(this.resourceUrl, agentIssues, { observe: 'response' });
  }

  update(agentIssues: IAgentIssues): Observable<EntityResponseType> {
    return this.http.put<IAgentIssues>(`${this.resourceUrl}/${this.getAgentIssuesIdentifier(agentIssues)}`, agentIssues, {
      observe: 'response',
    });
  }

  partialUpdate(agentIssues: PartialUpdateAgentIssues): Observable<EntityResponseType> {
    return this.http.patch<IAgentIssues>(`${this.resourceUrl}/${this.getAgentIssuesIdentifier(agentIssues)}`, agentIssues, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAgentIssues>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAgentIssues[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAgentIssuesIdentifier(agentIssues: Pick<IAgentIssues, 'id'>): number {
    return agentIssues.id;
  }

  compareAgentIssues(o1: Pick<IAgentIssues, 'id'> | null, o2: Pick<IAgentIssues, 'id'> | null): boolean {
    return o1 && o2 ? this.getAgentIssuesIdentifier(o1) === this.getAgentIssuesIdentifier(o2) : o1 === o2;
  }

  addAgentIssuesToCollectionIfMissing<Type extends Pick<IAgentIssues, 'id'>>(
    agentIssuesCollection: Type[],
    ...agentIssuesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const agentIssues: Type[] = agentIssuesToCheck.filter(isPresent);
    if (agentIssues.length > 0) {
      const agentIssuesCollectionIdentifiers = agentIssuesCollection.map(
        agentIssuesItem => this.getAgentIssuesIdentifier(agentIssuesItem)!,
      );
      const agentIssuesToAdd = agentIssues.filter(agentIssuesItem => {
        const agentIssuesIdentifier = this.getAgentIssuesIdentifier(agentIssuesItem);
        if (agentIssuesCollectionIdentifiers.includes(agentIssuesIdentifier)) {
          return false;
        }
        agentIssuesCollectionIdentifiers.push(agentIssuesIdentifier);
        return true;
      });
      return [...agentIssuesToAdd, ...agentIssuesCollection];
    }
    return agentIssuesCollection;
  }
}
