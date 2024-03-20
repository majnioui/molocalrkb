import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AppServicesService } from '../service/app-services.service';
import { IAppServices } from '../app-services.model';
import { AppServicesFormService } from './app-services-form.service';

import { AppServicesUpdateComponent } from './app-services-update.component';

describe('AppServices Management Update Component', () => {
  let comp: AppServicesUpdateComponent;
  let fixture: ComponentFixture<AppServicesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let appServicesFormService: AppServicesFormService;
  let appServicesService: AppServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), AppServicesUpdateComponent],
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
      .overrideTemplate(AppServicesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AppServicesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    appServicesFormService = TestBed.inject(AppServicesFormService);
    appServicesService = TestBed.inject(AppServicesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const appServices: IAppServices = { id: 456 };

      activatedRoute.data = of({ appServices });
      comp.ngOnInit();

      expect(comp.appServices).toEqual(appServices);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppServices>>();
      const appServices = { id: 123 };
      jest.spyOn(appServicesFormService, 'getAppServices').mockReturnValue(appServices);
      jest.spyOn(appServicesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appServices });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: appServices }));
      saveSubject.complete();

      // THEN
      expect(appServicesFormService.getAppServices).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(appServicesService.update).toHaveBeenCalledWith(expect.objectContaining(appServices));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppServices>>();
      const appServices = { id: 123 };
      jest.spyOn(appServicesFormService, 'getAppServices').mockReturnValue({ id: null });
      jest.spyOn(appServicesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appServices: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: appServices }));
      saveSubject.complete();

      // THEN
      expect(appServicesFormService.getAppServices).toHaveBeenCalled();
      expect(appServicesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppServices>>();
      const appServices = { id: 123 };
      jest.spyOn(appServicesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appServices });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(appServicesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
