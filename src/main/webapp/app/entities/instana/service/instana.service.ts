import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInstana, NewInstana } from '../instana.model';

export type PartialUpdateInstana = Partial<IInstana> & Pick<IInstana, 'id'>;

export type EntityResponseType = HttpResponse<IInstana>;
export type EntityArrayResponseType = HttpResponse<IInstana[]>;

@Injectable({ providedIn: 'root' })
export class InstanaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/instanas');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(instana: NewInstana): Observable<EntityResponseType> {
    return this.http.post<IInstana>(this.resourceUrl, instana, { observe: 'response' });
  }

  update(instana: IInstana): Observable<EntityResponseType> {
    return this.http.put<IInstana>(`${this.resourceUrl}/${this.getInstanaIdentifier(instana)}`, instana, { observe: 'response' });
  }

  partialUpdate(instana: PartialUpdateInstana): Observable<EntityResponseType> {
    return this.http.patch<IInstana>(`${this.resourceUrl}/${this.getInstanaIdentifier(instana)}`, instana, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInstana>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInstana[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInstanaIdentifier(instana: Pick<IInstana, 'id'>): number {
    return instana.id;
  }

  compareInstana(o1: Pick<IInstana, 'id'> | null, o2: Pick<IInstana, 'id'> | null): boolean {
    return o1 && o2 ? this.getInstanaIdentifier(o1) === this.getInstanaIdentifier(o2) : o1 === o2;
  }

  addInstanaToCollectionIfMissing<Type extends Pick<IInstana, 'id'>>(
    instanaCollection: Type[],
    ...instanasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const instanas: Type[] = instanasToCheck.filter(isPresent);
    if (instanas.length > 0) {
      const instanaCollectionIdentifiers = instanaCollection.map(instanaItem => this.getInstanaIdentifier(instanaItem)!);
      const instanasToAdd = instanas.filter(instanaItem => {
        const instanaIdentifier = this.getInstanaIdentifier(instanaItem);
        if (instanaCollectionIdentifiers.includes(instanaIdentifier)) {
          return false;
        }
        instanaCollectionIdentifiers.push(instanaIdentifier);
        return true;
      });
      return [...instanasToAdd, ...instanaCollection];
    }
    return instanaCollection;
  }
}
