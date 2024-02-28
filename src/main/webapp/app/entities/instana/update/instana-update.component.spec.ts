import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InstanaService } from '../service/instana.service';
import { IInstana } from '../instana.model';
import { InstanaFormService } from './instana-form.service';

import { InstanaUpdateComponent } from './instana-update.component';

describe('Instana Management Update Component', () => {
  let comp: InstanaUpdateComponent;
  let fixture: ComponentFixture<InstanaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let instanaFormService: InstanaFormService;
  let instanaService: InstanaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), InstanaUpdateComponent],
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
      .overrideTemplate(InstanaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InstanaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    instanaFormService = TestBed.inject(InstanaFormService);
    instanaService = TestBed.inject(InstanaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const instana: IInstana = { id: 456 };

      activatedRoute.data = of({ instana });
      comp.ngOnInit();

      expect(comp.instana).toEqual(instana);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInstana>>();
      const instana = { id: 123 };
      jest.spyOn(instanaFormService, 'getInstana').mockReturnValue(instana);
      jest.spyOn(instanaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ instana });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: instana }));
      saveSubject.complete();

      // THEN
      expect(instanaFormService.getInstana).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(instanaService.update).toHaveBeenCalledWith(expect.objectContaining(instana));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInstana>>();
      const instana = { id: 123 };
      jest.spyOn(instanaFormService, 'getInstana').mockReturnValue({ id: null });
      jest.spyOn(instanaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ instana: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: instana }));
      saveSubject.complete();

      // THEN
      expect(instanaFormService.getInstana).toHaveBeenCalled();
      expect(instanaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInstana>>();
      const instana = { id: 123 };
      jest.spyOn(instanaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ instana });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(instanaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
