import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../installed-software.test-samples';

import { InstalledSoftwareFormService } from './installed-software-form.service';

describe('InstalledSoftware Form Service', () => {
  let service: InstalledSoftwareFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstalledSoftwareFormService);
  });

  describe('Service methods', () => {
    describe('createInstalledSoftwareFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInstalledSoftwareFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            version: expect.any(Object),
            type: expect.any(Object),
            usedBy: expect.any(Object),
          }),
        );
      });

      it('passing IInstalledSoftware should create a new form with FormGroup', () => {
        const formGroup = service.createInstalledSoftwareFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            version: expect.any(Object),
            type: expect.any(Object),
            usedBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getInstalledSoftware', () => {
      it('should return NewInstalledSoftware for default InstalledSoftware initial value', () => {
        const formGroup = service.createInstalledSoftwareFormGroup(sampleWithNewData);

        const installedSoftware = service.getInstalledSoftware(formGroup) as any;

        expect(installedSoftware).toMatchObject(sampleWithNewData);
      });

      it('should return NewInstalledSoftware for empty InstalledSoftware initial value', () => {
        const formGroup = service.createInstalledSoftwareFormGroup();

        const installedSoftware = service.getInstalledSoftware(formGroup) as any;

        expect(installedSoftware).toMatchObject({});
      });

      it('should return IInstalledSoftware', () => {
        const formGroup = service.createInstalledSoftwareFormGroup(sampleWithRequiredData);

        const installedSoftware = service.getInstalledSoftware(formGroup) as any;

        expect(installedSoftware).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInstalledSoftware should not enable id FormControl', () => {
        const formGroup = service.createInstalledSoftwareFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInstalledSoftware should disable id FormControl', () => {
        const formGroup = service.createInstalledSoftwareFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
