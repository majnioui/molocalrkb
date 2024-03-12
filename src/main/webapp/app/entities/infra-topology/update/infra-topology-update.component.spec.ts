import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InfraTopologyService } from '../service/infra-topology.service';
import { IInfraTopology } from '../infra-topology.model';
import { InfraTopologyFormService } from './infra-topology-form.service';

import { InfraTopologyUpdateComponent } from './infra-topology-update.component';

describe('InfraTopology Management Update Component', () => {
  let comp: InfraTopologyUpdateComponent;
  let fixture: ComponentFixture<InfraTopologyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let infraTopologyFormService: InfraTopologyFormService;
  let infraTopologyService: InfraTopologyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), InfraTopologyUpdateComponent],
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
      .overrideTemplate(InfraTopologyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InfraTopologyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    infraTopologyFormService = TestBed.inject(InfraTopologyFormService);
    infraTopologyService = TestBed.inject(InfraTopologyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const infraTopology: IInfraTopology = { id: 456 };

      activatedRoute.data = of({ infraTopology });
      comp.ngOnInit();

      expect(comp.infraTopology).toEqual(infraTopology);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInfraTopology>>();
      const infraTopology = { id: 123 };
      jest.spyOn(infraTopologyFormService, 'getInfraTopology').mockReturnValue(infraTopology);
      jest.spyOn(infraTopologyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ infraTopology });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: infraTopology }));
      saveSubject.complete();

      // THEN
      expect(infraTopologyFormService.getInfraTopology).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(infraTopologyService.update).toHaveBeenCalledWith(expect.objectContaining(infraTopology));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInfraTopology>>();
      const infraTopology = { id: 123 };
      jest.spyOn(infraTopologyFormService, 'getInfraTopology').mockReturnValue({ id: null });
      jest.spyOn(infraTopologyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ infraTopology: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: infraTopology }));
      saveSubject.complete();

      // THEN
      expect(infraTopologyFormService.getInfraTopology).toHaveBeenCalled();
      expect(infraTopologyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInfraTopology>>();
      const infraTopology = { id: 123 };
      jest.spyOn(infraTopologyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ infraTopology });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(infraTopologyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
