import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InstalledSoftwareService } from '../service/installed-software.service';
import { IInstalledSoftware } from '../installed-software.model';
import { InstalledSoftwareFormService } from './installed-software-form.service';

import { InstalledSoftwareUpdateComponent } from './installed-software-update.component';

describe('InstalledSoftware Management Update Component', () => {
  let comp: InstalledSoftwareUpdateComponent;
  let fixture: ComponentFixture<InstalledSoftwareUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let installedSoftwareFormService: InstalledSoftwareFormService;
  let installedSoftwareService: InstalledSoftwareService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), InstalledSoftwareUpdateComponent],
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
      .overrideTemplate(InstalledSoftwareUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InstalledSoftwareUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    installedSoftwareFormService = TestBed.inject(InstalledSoftwareFormService);
    installedSoftwareService = TestBed.inject(InstalledSoftwareService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const installedSoftware: IInstalledSoftware = { id: 456 };

      activatedRoute.data = of({ installedSoftware });
      comp.ngOnInit();

      expect(comp.installedSoftware).toEqual(installedSoftware);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInstalledSoftware>>();
      const installedSoftware = { id: 123 };
      jest.spyOn(installedSoftwareFormService, 'getInstalledSoftware').mockReturnValue(installedSoftware);
      jest.spyOn(installedSoftwareService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ installedSoftware });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: installedSoftware }));
      saveSubject.complete();

      // THEN
      expect(installedSoftwareFormService.getInstalledSoftware).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(installedSoftwareService.update).toHaveBeenCalledWith(expect.objectContaining(installedSoftware));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInstalledSoftware>>();
      const installedSoftware = { id: 123 };
      jest.spyOn(installedSoftwareFormService, 'getInstalledSoftware').mockReturnValue({ id: null });
      jest.spyOn(installedSoftwareService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ installedSoftware: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: installedSoftware }));
      saveSubject.complete();

      // THEN
      expect(installedSoftwareFormService.getInstalledSoftware).toHaveBeenCalled();
      expect(installedSoftwareService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInstalledSoftware>>();
      const installedSoftware = { id: 123 };
      jest.spyOn(installedSoftwareService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ installedSoftware });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(installedSoftwareService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
