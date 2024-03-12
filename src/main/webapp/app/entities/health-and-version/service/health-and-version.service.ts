import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHealthAndVersion, NewHealthAndVersion } from '../health-and-version.model';

export type PartialUpdateHealthAndVersion = Partial<IHealthAndVersion> & Pick<IHealthAndVersion, 'id'>;

export type EntityResponseType = HttpResponse<IHealthAndVersion>;
export type EntityArrayResponseType = HttpResponse<IHealthAndVersion[]>;

@Injectable({ providedIn: 'root' })
export class HealthAndVersionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/health-and-versions');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(healthAndVersion: NewHealthAndVersion): Observable<EntityResponseType> {
    return this.http.post<IHealthAndVersion>(this.resourceUrl, healthAndVersion, { observe: 'response' });
  }

  update(healthAndVersion: IHealthAndVersion): Observable<EntityResponseType> {
    return this.http.put<IHealthAndVersion>(
      `${this.resourceUrl}/${this.getHealthAndVersionIdentifier(healthAndVersion)}`,
      healthAndVersion,
      { observe: 'response' },
    );
  }

  partialUpdate(healthAndVersion: PartialUpdateHealthAndVersion): Observable<EntityResponseType> {
    return this.http.patch<IHealthAndVersion>(
      `${this.resourceUrl}/${this.getHealthAndVersionIdentifier(healthAndVersion)}`,
      healthAndVersion,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHealthAndVersion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHealthAndVersion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHealthAndVersionIdentifier(healthAndVersion: Pick<IHealthAndVersion, 'id'>): number {
    return healthAndVersion.id;
  }

  compareHealthAndVersion(o1: Pick<IHealthAndVersion, 'id'> | null, o2: Pick<IHealthAndVersion, 'id'> | null): boolean {
    return o1 && o2 ? this.getHealthAndVersionIdentifier(o1) === this.getHealthAndVersionIdentifier(o2) : o1 === o2;
  }

  addHealthAndVersionToCollectionIfMissing<Type extends Pick<IHealthAndVersion, 'id'>>(
    healthAndVersionCollection: Type[],
    ...healthAndVersionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const healthAndVersions: Type[] = healthAndVersionsToCheck.filter(isPresent);
    if (healthAndVersions.length > 0) {
      const healthAndVersionCollectionIdentifiers = healthAndVersionCollection.map(
        healthAndVersionItem => this.getHealthAndVersionIdentifier(healthAndVersionItem)!,
      );
      const healthAndVersionsToAdd = healthAndVersions.filter(healthAndVersionItem => {
        const healthAndVersionIdentifier = this.getHealthAndVersionIdentifier(healthAndVersionItem);
        if (healthAndVersionCollectionIdentifiers.includes(healthAndVersionIdentifier)) {
          return false;
        }
        healthAndVersionCollectionIdentifiers.push(healthAndVersionIdentifier);
        return true;
      });
      return [...healthAndVersionsToAdd, ...healthAndVersionCollection];
    }
    return healthAndVersionCollection;
  }
}
