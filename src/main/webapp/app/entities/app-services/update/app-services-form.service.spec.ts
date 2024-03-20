import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../app-services.test-samples';

import { AppServicesFormService } from './app-services-form.service';

describe('AppServices Form Service', () => {
  let service: AppServicesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppServicesFormService);
  });

  describe('Service methods', () => {
    describe('createAppServicesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAppServicesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            servId: expect.any(Object),
            label: expect.any(Object),
            types: expect.any(Object),
            technologies: expect.any(Object),
            entityType: expect.any(Object),
            erronCalls: expect.any(Object),
            calls: expect.any(Object),
            latency: expect.any(Object),
            date: expect.any(Object),
          }),
        );
      });

      it('passing IAppServices should create a new form with FormGroup', () => {
        const formGroup = service.createAppServicesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            servId: expect.any(Object),
            label: expect.any(Object),
            types: expect.any(Object),
            technologies: expect.any(Object),
            entityType: expect.any(Object),
            erronCalls: expect.any(Object),
            calls: expect.any(Object),
            latency: expect.any(Object),
            date: expect.any(Object),
          }),
        );
      });
    });

    describe('getAppServices', () => {
      it('should return NewAppServices for default AppServices initial value', () => {
        const formGroup = service.createAppServicesFormGroup(sampleWithNewData);

        const appServices = service.getAppServices(formGroup) as any;

        expect(appServices).toMatchObject(sampleWithNewData);
      });

      it('should return NewAppServices for empty AppServices initial value', () => {
        const formGroup = service.createAppServicesFormGroup();

        const appServices = service.getAppServices(formGroup) as any;

        expect(appServices).toMatchObject({});
      });

      it('should return IAppServices', () => {
        const formGroup = service.createAppServicesFormGroup(sampleWithRequiredData);

        const appServices = service.getAppServices(formGroup) as any;

        expect(appServices).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAppServices should not enable id FormControl', () => {
        const formGroup = service.createAppServicesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAppServices should disable id FormControl', () => {
        const formGroup = service.createAppServicesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
