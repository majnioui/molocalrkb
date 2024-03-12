import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInfraTopology, NewInfraTopology } from '../infra-topology.model';

export type PartialUpdateInfraTopology = Partial<IInfraTopology> & Pick<IInfraTopology, 'id'>;

export type EntityResponseType = HttpResponse<IInfraTopology>;
export type EntityArrayResponseType = HttpResponse<IInfraTopology[]>;

@Injectable({ providedIn: 'root' })
export class InfraTopologyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/infra-topologies');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(infraTopology: NewInfraTopology): Observable<EntityResponseType> {
    return this.http.post<IInfraTopology>(this.resourceUrl, infraTopology, { observe: 'response' });
  }

  update(infraTopology: IInfraTopology): Observable<EntityResponseType> {
    return this.http.put<IInfraTopology>(`${this.resourceUrl}/${this.getInfraTopologyIdentifier(infraTopology)}`, infraTopology, {
      observe: 'response',
    });
  }

  partialUpdate(infraTopology: PartialUpdateInfraTopology): Observable<EntityResponseType> {
    return this.http.patch<IInfraTopology>(`${this.resourceUrl}/${this.getInfraTopologyIdentifier(infraTopology)}`, infraTopology, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInfraTopology>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInfraTopology[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInfraTopologyIdentifier(infraTopology: Pick<IInfraTopology, 'id'>): number {
    return infraTopology.id;
  }

  compareInfraTopology(o1: Pick<IInfraTopology, 'id'> | null, o2: Pick<IInfraTopology, 'id'> | null): boolean {
    return o1 && o2 ? this.getInfraTopologyIdentifier(o1) === this.getInfraTopologyIdentifier(o2) : o1 === o2;
  }

  addInfraTopologyToCollectionIfMissing<Type extends Pick<IInfraTopology, 'id'>>(
    infraTopologyCollection: Type[],
    ...infraTopologiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const infraTopologies: Type[] = infraTopologiesToCheck.filter(isPresent);
    if (infraTopologies.length > 0) {
      const infraTopologyCollectionIdentifiers = infraTopologyCollection.map(
        infraTopologyItem => this.getInfraTopologyIdentifier(infraTopologyItem)!,
      );
      const infraTopologiesToAdd = infraTopologies.filter(infraTopologyItem => {
        const infraTopologyIdentifier = this.getInfraTopologyIdentifier(infraTopologyItem);
        if (infraTopologyCollectionIdentifiers.includes(infraTopologyIdentifier)) {
          return false;
        }
        infraTopologyCollectionIdentifiers.push(infraTopologyIdentifier);
        return true;
      });
      return [...infraTopologiesToAdd, ...infraTopologyCollection];
    }
    return infraTopologyCollection;
  }
}
