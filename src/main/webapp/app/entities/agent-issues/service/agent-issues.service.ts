import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAgentIssues, NewAgentIssues } from '../agent-issues.model';

export type PartialUpdateAgentIssues = Partial<IAgentIssues> & Pick<IAgentIssues, 'id'>;

type RestOf<T extends IAgentIssues | NewAgentIssues> = Omit<T, 'atTime'> & {
  atTime?: string | null;
};

export type RestAgentIssues = RestOf<IAgentIssues>;

export type NewRestAgentIssues = RestOf<NewAgentIssues>;

export type PartialUpdateRestAgentIssues = RestOf<PartialUpdateAgentIssues>;

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
    const copy = this.convertDateFromClient(agentIssues);
    return this.http
      .post<RestAgentIssues>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(agentIssues: IAgentIssues): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(agentIssues);
    return this.http
      .put<RestAgentIssues>(`${this.resourceUrl}/${this.getAgentIssuesIdentifier(agentIssues)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(agentIssues: PartialUpdateAgentIssues): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(agentIssues);
    return this.http
      .patch<RestAgentIssues>(`${this.resourceUrl}/${this.getAgentIssuesIdentifier(agentIssues)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAgentIssues>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAgentIssues[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
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

  protected convertDateFromClient<T extends IAgentIssues | NewAgentIssues | PartialUpdateAgentIssues>(agentIssues: T): RestOf<T> {
    return {
      ...agentIssues,
      atTime: agentIssues.atTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAgentIssues: RestAgentIssues): IAgentIssues {
    return {
      ...restAgentIssues,
      atTime: restAgentIssues.atTime ? dayjs(restAgentIssues.atTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAgentIssues>): HttpResponse<IAgentIssues> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAgentIssues[]>): HttpResponse<IAgentIssues[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
