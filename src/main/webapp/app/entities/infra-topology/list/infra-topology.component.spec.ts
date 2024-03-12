import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InfraTopologyService } from '../service/infra-topology.service';

import { InfraTopologyComponent } from './infra-topology.component';

describe('InfraTopology Management Component', () => {
  let comp: InfraTopologyComponent;
  let fixture: ComponentFixture<InfraTopologyComponent>;
  let service: InfraTopologyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'infra-topology', component: InfraTopologyComponent }]),
        HttpClientTestingModule,
        InfraTopologyComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(InfraTopologyComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InfraTopologyComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(InfraTopologyService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.infraTopologies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to infraTopologyService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getInfraTopologyIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getInfraTopologyIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
