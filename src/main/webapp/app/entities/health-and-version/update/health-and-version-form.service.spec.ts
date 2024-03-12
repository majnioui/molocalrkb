import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../health-and-version.test-samples';

import { HealthAndVersionFormService } from './health-and-version-form.service';

describe('HealthAndVersion Form Service', () => {
  let service: HealthAndVersionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthAndVersionFormService);
  });

  describe('Service methods', () => {
    describe('createHealthAndVersionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHealthAndVersionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            version: expect.any(Object),
            health: expect.any(Object),
            healthMsg: expect.any(Object),
          }),
        );
      });

      it('passing IHealthAndVersion should create a new form with FormGroup', () => {
        const formGroup = service.createHealthAndVersionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            version: expect.any(Object),
            health: expect.any(Object),
            healthMsg: expect.any(Object),
          }),
        );
      });
    });

    describe('getHealthAndVersion', () => {
      it('should return NewHealthAndVersion for default HealthAndVersion initial value', () => {
        const formGroup = service.createHealthAndVersionFormGroup(sampleWithNewData);

        const healthAndVersion = service.getHealthAndVersion(formGroup) as any;

        expect(healthAndVersion).toMatchObject(sampleWithNewData);
      });

      it('should return NewHealthAndVersion for empty HealthAndVersion initial value', () => {
        const formGroup = service.createHealthAndVersionFormGroup();

        const healthAndVersion = service.getHealthAndVersion(formGroup) as any;

        expect(healthAndVersion).toMatchObject({});
      });

      it('should return IHealthAndVersion', () => {
        const formGroup = service.createHealthAndVersionFormGroup(sampleWithRequiredData);

        const healthAndVersion = service.getHealthAndVersion(formGroup) as any;

        expect(healthAndVersion).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHealthAndVersion should not enable id FormControl', () => {
        const formGroup = service.createHealthAndVersionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHealthAndVersion should disable id FormControl', () => {
        const formGroup = service.createHealthAndVersionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
