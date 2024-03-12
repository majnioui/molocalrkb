import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HealthAndVersionService } from '../service/health-and-version.service';
import { IHealthAndVersion } from '../health-and-version.model';
import { HealthAndVersionFormService } from './health-and-version-form.service';

import { HealthAndVersionUpdateComponent } from './health-and-version-update.component';

describe('HealthAndVersion Management Update Component', () => {
  let comp: HealthAndVersionUpdateComponent;
  let fixture: ComponentFixture<HealthAndVersionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let healthAndVersionFormService: HealthAndVersionFormService;
  let healthAndVersionService: HealthAndVersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), HealthAndVersionUpdateComponent],
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
      .overrideTemplate(HealthAndVersionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HealthAndVersionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    healthAndVersionFormService = TestBed.inject(HealthAndVersionFormService);
    healthAndVersionService = TestBed.inject(HealthAndVersionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const healthAndVersion: IHealthAndVersion = { id: 456 };

      activatedRoute.data = of({ healthAndVersion });
      comp.ngOnInit();

      expect(comp.healthAndVersion).toEqual(healthAndVersion);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHealthAndVersion>>();
      const healthAndVersion = { id: 123 };
      jest.spyOn(healthAndVersionFormService, 'getHealthAndVersion').mockReturnValue(healthAndVersion);
      jest.spyOn(healthAndVersionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ healthAndVersion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: healthAndVersion }));
      saveSubject.complete();

      // THEN
      expect(healthAndVersionFormService.getHealthAndVersion).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(healthAndVersionService.update).toHaveBeenCalledWith(expect.objectContaining(healthAndVersion));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHealthAndVersion>>();
      const healthAndVersion = { id: 123 };
      jest.spyOn(healthAndVersionFormService, 'getHealthAndVersion').mockReturnValue({ id: null });
      jest.spyOn(healthAndVersionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ healthAndVersion: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: healthAndVersion }));
      saveSubject.complete();

      // THEN
      expect(healthAndVersionFormService.getHealthAndVersion).toHaveBeenCalled();
      expect(healthAndVersionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHealthAndVersion>>();
      const healthAndVersion = { id: 123 };
      jest.spyOn(healthAndVersionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ healthAndVersion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(healthAndVersionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
