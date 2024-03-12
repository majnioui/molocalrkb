import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HealthAndVersionService } from '../service/health-and-version.service';

import { HealthAndVersionComponent } from './health-and-version.component';

describe('HealthAndVersion Management Component', () => {
  let comp: HealthAndVersionComponent;
  let fixture: ComponentFixture<HealthAndVersionComponent>;
  let service: HealthAndVersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'health-and-version', component: HealthAndVersionComponent }]),
        HttpClientTestingModule,
        HealthAndVersionComponent,
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
      .overrideTemplate(HealthAndVersionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HealthAndVersionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(HealthAndVersionService);

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
    expect(comp.healthAndVersions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to healthAndVersionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getHealthAndVersionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getHealthAndVersionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
