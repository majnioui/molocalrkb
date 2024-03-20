import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AppServicesService } from '../service/app-services.service';

import { AppServicesComponent } from './app-services.component';

describe('AppServices Management Component', () => {
  let comp: AppServicesComponent;
  let fixture: ComponentFixture<AppServicesComponent>;
  let service: AppServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'app-services', component: AppServicesComponent }]),
        HttpClientTestingModule,
        AppServicesComponent,
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
      .overrideTemplate(AppServicesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AppServicesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AppServicesService);

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
    expect(comp.appServices?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to appServicesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAppServicesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAppServicesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
