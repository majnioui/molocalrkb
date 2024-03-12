import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInstalledSoftware, NewInstalledSoftware } from '../installed-software.model';

export type PartialUpdateInstalledSoftware = Partial<IInstalledSoftware> & Pick<IInstalledSoftware, 'id'>;

export type EntityResponseType = HttpResponse<IInstalledSoftware>;
export type EntityArrayResponseType = HttpResponse<IInstalledSoftware[]>;

@Injectable({ providedIn: 'root' })
export class InstalledSoftwareService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/installed-softwares');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(installedSoftware: NewInstalledSoftware): Observable<EntityResponseType> {
    return this.http.post<IInstalledSoftware>(this.resourceUrl, installedSoftware, { observe: 'response' });
  }

  update(installedSoftware: IInstalledSoftware): Observable<EntityResponseType> {
    return this.http.put<IInstalledSoftware>(
      `${this.resourceUrl}/${this.getInstalledSoftwareIdentifier(installedSoftware)}`,
      installedSoftware,
      { observe: 'response' },
    );
  }

  partialUpdate(installedSoftware: PartialUpdateInstalledSoftware): Observable<EntityResponseType> {
    return this.http.patch<IInstalledSoftware>(
      `${this.resourceUrl}/${this.getInstalledSoftwareIdentifier(installedSoftware)}`,
      installedSoftware,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInstalledSoftware>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInstalledSoftware[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInstalledSoftwareIdentifier(installedSoftware: Pick<IInstalledSoftware, 'id'>): number {
    return installedSoftware.id;
  }

  compareInstalledSoftware(o1: Pick<IInstalledSoftware, 'id'> | null, o2: Pick<IInstalledSoftware, 'id'> | null): boolean {
    return o1 && o2 ? this.getInstalledSoftwareIdentifier(o1) === this.getInstalledSoftwareIdentifier(o2) : o1 === o2;
  }

  addInstalledSoftwareToCollectionIfMissing<Type extends Pick<IInstalledSoftware, 'id'>>(
    installedSoftwareCollection: Type[],
    ...installedSoftwaresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const installedSoftwares: Type[] = installedSoftwaresToCheck.filter(isPresent);
    if (installedSoftwares.length > 0) {
      const installedSoftwareCollectionIdentifiers = installedSoftwareCollection.map(
        installedSoftwareItem => this.getInstalledSoftwareIdentifier(installedSoftwareItem)!,
      );
      const installedSoftwaresToAdd = installedSoftwares.filter(installedSoftwareItem => {
        const installedSoftwareIdentifier = this.getInstalledSoftwareIdentifier(installedSoftwareItem);
        if (installedSoftwareCollectionIdentifiers.includes(installedSoftwareIdentifier)) {
          return false;
        }
        installedSoftwareCollectionIdentifiers.push(installedSoftwareIdentifier);
        return true;
      });
      return [...installedSoftwaresToAdd, ...installedSoftwareCollection];
    }
    return installedSoftwareCollection;
  }
}
