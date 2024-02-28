import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InstanaService } from '../service/instana.service';

import { InstanaComponent } from './instana.component';

describe('Instana Management Component', () => {
  let comp: InstanaComponent;
  let fixture: ComponentFixture<InstanaComponent>;
  let service: InstanaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'instana', component: InstanaComponent }]),
        HttpClientTestingModule,
        InstanaComponent,
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
      .overrideTemplate(InstanaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InstanaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(InstanaService);

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
    expect(comp.instanas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to instanaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getInstanaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getInstanaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
