import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../instana.test-samples';

import { InstanaFormService } from './instana-form.service';

describe('Instana Form Service', () => {
  let service: InstanaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstanaFormService);
  });

  describe('Service methods', () => {
    describe('createInstanaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInstanaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            apitoken: expect.any(Object),
            baseurl: expect.any(Object),
          }),
        );
      });

      it('passing IInstana should create a new form with FormGroup', () => {
        const formGroup = service.createInstanaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            apitoken: expect.any(Object),
            baseurl: expect.any(Object),
          }),
        );
      });
    });

    describe('getInstana', () => {
      it('should return NewInstana for default Instana initial value', () => {
        const formGroup = service.createInstanaFormGroup(sampleWithNewData);

        const instana = service.getInstana(formGroup) as any;

        expect(instana).toMatchObject(sampleWithNewData);
      });

      it('should return NewInstana for empty Instana initial value', () => {
        const formGroup = service.createInstanaFormGroup();

        const instana = service.getInstana(formGroup) as any;

        expect(instana).toMatchObject({});
      });

      it('should return IInstana', () => {
        const formGroup = service.createInstanaFormGroup(sampleWithRequiredData);

        const instana = service.getInstana(formGroup) as any;

        expect(instana).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInstana should not enable id FormControl', () => {
        const formGroup = service.createInstanaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInstana should disable id FormControl', () => {
        const formGroup = service.createInstanaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
