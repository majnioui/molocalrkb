import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { WebsitesService } from '../service/websites.service';
import { IWebsites } from '../websites.model';
import { WebsitesFormService } from './websites-form.service';

import { WebsitesUpdateComponent } from './websites-update.component';

describe('Websites Management Update Component', () => {
  let comp: WebsitesUpdateComponent;
  let fixture: ComponentFixture<WebsitesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let websitesFormService: WebsitesFormService;
  let websitesService: WebsitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), WebsitesUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(WebsitesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WebsitesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    websitesFormService = TestBed.inject(WebsitesFormService);
    websitesService = TestBed.inject(WebsitesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const websites: IWebsites = { id: 456 };

      activatedRoute.data = of({ websites });
      comp.ngOnInit();

      expect(comp.websites).toEqual(websites);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWebsites>>();
      const websites = { id: 123 };
      jest.spyOn(websitesFormService, 'getWebsites').mockReturnValue(websites);
      jest.spyOn(websitesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ websites });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: websites }));
      saveSubject.complete();

      // THEN
      expect(websitesFormService.getWebsites).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(websitesService.update).toHaveBeenCalledWith(expect.objectContaining(websites));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWebsites>>();
      const websites = { id: 123 };
      jest.spyOn(websitesFormService, 'getWebsites').mockReturnValue({ id: null });
      jest.spyOn(websitesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ websites: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: websites }));
      saveSubject.complete();

      // THEN
      expect(websitesFormService.getWebsites).toHaveBeenCalled();
      expect(websitesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWebsites>>();
      const websites = { id: 123 };
      jest.spyOn(websitesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ websites });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(websitesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
