import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../infra-topology.test-samples';

import { InfraTopologyFormService } from './infra-topology-form.service';

describe('InfraTopology Form Service', () => {
  let service: InfraTopologyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfraTopologyFormService);
  });

  describe('Service methods', () => {
    describe('createInfraTopologyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInfraTopologyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            plugin: expect.any(Object),
            label: expect.any(Object),
            pluginId: expect.any(Object),
          }),
        );
      });

      it('passing IInfraTopology should create a new form with FormGroup', () => {
        const formGroup = service.createInfraTopologyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            plugin: expect.any(Object),
            label: expect.any(Object),
            pluginId: expect.any(Object),
          }),
        );
      });
    });

    describe('getInfraTopology', () => {
      it('should return NewInfraTopology for default InfraTopology initial value', () => {
        const formGroup = service.createInfraTopologyFormGroup(sampleWithNewData);

        const infraTopology = service.getInfraTopology(formGroup) as any;

        expect(infraTopology).toMatchObject(sampleWithNewData);
      });

      it('should return NewInfraTopology for empty InfraTopology initial value', () => {
        const formGroup = service.createInfraTopologyFormGroup();

        const infraTopology = service.getInfraTopology(formGroup) as any;

        expect(infraTopology).toMatchObject({});
      });

      it('should return IInfraTopology', () => {
        const formGroup = service.createInfraTopologyFormGroup(sampleWithRequiredData);

        const infraTopology = service.getInfraTopology(formGroup) as any;

        expect(infraTopology).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInfraTopology should not enable id FormControl', () => {
        const formGroup = service.createInfraTopologyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInfraTopology should disable id FormControl', () => {
        const formGroup = service.createInfraTopologyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
