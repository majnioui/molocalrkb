import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWebsites, NewWebsites } from '../websites.model';

export type PartialUpdateWebsites = Partial<IWebsites> & Pick<IWebsites, 'id'>;

type RestOf<T extends IWebsites | NewWebsites> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestWebsites = RestOf<IWebsites>;

export type NewRestWebsites = RestOf<NewWebsites>;

export type PartialUpdateRestWebsites = RestOf<PartialUpdateWebsites>;

export type EntityResponseType = HttpResponse<IWebsites>;
export type EntityArrayResponseType = HttpResponse<IWebsites[]>;

@Injectable({ providedIn: 'root' })
export class WebsitesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/websites');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(websites: NewWebsites): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(websites);
    return this.http
      .post<RestWebsites>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(websites: IWebsites): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(websites);
    return this.http
      .put<RestWebsites>(`${this.resourceUrl}/${this.getWebsitesIdentifier(websites)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(websites: PartialUpdateWebsites): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(websites);
    return this.http
      .patch<RestWebsites>(`${this.resourceUrl}/${this.getWebsitesIdentifier(websites)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestWebsites>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestWebsites[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getWebsitesIdentifier(websites: Pick<IWebsites, 'id'>): number {
    return websites.id;
  }

  compareWebsites(o1: Pick<IWebsites, 'id'> | null, o2: Pick<IWebsites, 'id'> | null): boolean {
    return o1 && o2 ? this.getWebsitesIdentifier(o1) === this.getWebsitesIdentifier(o2) : o1 === o2;
  }

  addWebsitesToCollectionIfMissing<Type extends Pick<IWebsites, 'id'>>(
    websitesCollection: Type[],
    ...websitesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const websites: Type[] = websitesToCheck.filter(isPresent);
    if (websites.length > 0) {
      const websitesCollectionIdentifiers = websitesCollection.map(websitesItem => this.getWebsitesIdentifier(websitesItem)!);
      const websitesToAdd = websites.filter(websitesItem => {
        const websitesIdentifier = this.getWebsitesIdentifier(websitesItem);
        if (websitesCollectionIdentifiers.includes(websitesIdentifier)) {
          return false;
        }
        websitesCollectionIdentifiers.push(websitesIdentifier);
        return true;
      });
      return [...websitesToAdd, ...websitesCollection];
    }
    return websitesCollection;
  }

  protected convertDateFromClient<T extends IWebsites | NewWebsites | PartialUpdateWebsites>(websites: T): RestOf<T> {
    return {
      ...websites,
      date: websites.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restWebsites: RestWebsites): IWebsites {
    return {
      ...restWebsites,
      date: restWebsites.date ? dayjs(restWebsites.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestWebsites>): HttpResponse<IWebsites> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestWebsites[]>): HttpResponse<IWebsites[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
