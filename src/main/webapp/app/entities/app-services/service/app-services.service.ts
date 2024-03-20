import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAppServices, NewAppServices } from '../app-services.model';

export type PartialUpdateAppServices = Partial<IAppServices> & Pick<IAppServices, 'id'>;

type RestOf<T extends IAppServices | NewAppServices> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestAppServices = RestOf<IAppServices>;

export type NewRestAppServices = RestOf<NewAppServices>;

export type PartialUpdateRestAppServices = RestOf<PartialUpdateAppServices>;

export type EntityResponseType = HttpResponse<IAppServices>;
export type EntityArrayResponseType = HttpResponse<IAppServices[]>;

@Injectable({ providedIn: 'root' })
export class AppServicesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/app-services');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(appServices: NewAppServices): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(appServices);
    return this.http
      .post<RestAppServices>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(appServices: IAppServices): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(appServices);
    return this.http
      .put<RestAppServices>(`${this.resourceUrl}/${this.getAppServicesIdentifier(appServices)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(appServices: PartialUpdateAppServices): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(appServices);
    return this.http
      .patch<RestAppServices>(`${this.resourceUrl}/${this.getAppServicesIdentifier(appServices)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAppServices>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAppServices[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAppServicesIdentifier(appServices: Pick<IAppServices, 'id'>): number {
    return appServices.id;
  }

  compareAppServices(o1: Pick<IAppServices, 'id'> | null, o2: Pick<IAppServices, 'id'> | null): boolean {
    return o1 && o2 ? this.getAppServicesIdentifier(o1) === this.getAppServicesIdentifier(o2) : o1 === o2;
  }

  addAppServicesToCollectionIfMissing<Type extends Pick<IAppServices, 'id'>>(
    appServicesCollection: Type[],
    ...appServicesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const appServices: Type[] = appServicesToCheck.filter(isPresent);
    if (appServices.length > 0) {
      const appServicesCollectionIdentifiers = appServicesCollection.map(
        appServicesItem => this.getAppServicesIdentifier(appServicesItem)!,
      );
      const appServicesToAdd = appServices.filter(appServicesItem => {
        const appServicesIdentifier = this.getAppServicesIdentifier(appServicesItem);
        if (appServicesCollectionIdentifiers.includes(appServicesIdentifier)) {
          return false;
        }
        appServicesCollectionIdentifiers.push(appServicesIdentifier);
        return true;
      });
      return [...appServicesToAdd, ...appServicesCollection];
    }
    return appServicesCollection;
  }

  protected convertDateFromClient<T extends IAppServices | NewAppServices | PartialUpdateAppServices>(appServices: T): RestOf<T> {
    return {
      ...appServices,
      date: appServices.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAppServices: RestAppServices): IAppServices {
    return {
      ...restAppServices,
      date: restAppServices.date ? dayjs(restAppServices.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAppServices>): HttpResponse<IAppServices> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAppServices[]>): HttpResponse<IAppServices[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
