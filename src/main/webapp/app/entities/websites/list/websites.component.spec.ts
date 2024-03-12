import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { WebsitesService } from '../service/websites.service';

import { WebsitesComponent } from './websites.component';

describe('Websites Management Component', () => {
  let comp: WebsitesComponent;
  let fixture: ComponentFixture<WebsitesComponent>;
  let service: WebsitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'websites', component: WebsitesComponent }]),
        HttpClientTestingModule,
        WebsitesComponent,
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
      .overrideTemplate(WebsitesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WebsitesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(WebsitesService);

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
    expect(comp.websites?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to websitesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getWebsitesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getWebsitesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
