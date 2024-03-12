import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWebsites, NewWebsites } from '../websites.model';

export type PartialUpdateWebsites = Partial<IWebsites> & Pick<IWebsites, 'id'>;

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
    return this.http.post<IWebsites>(this.resourceUrl, websites, { observe: 'response' });
  }

  update(websites: IWebsites): Observable<EntityResponseType> {
    return this.http.put<IWebsites>(`${this.resourceUrl}/${this.getWebsitesIdentifier(websites)}`, websites, { observe: 'response' });
  }

  partialUpdate(websites: PartialUpdateWebsites): Observable<EntityResponseType> {
    return this.http.patch<IWebsites>(`${this.resourceUrl}/${this.getWebsitesIdentifier(websites)}`, websites, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IWebsites>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IWebsites[]>(this.resourceUrl, { params: options, observe: 'response' });
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
}
