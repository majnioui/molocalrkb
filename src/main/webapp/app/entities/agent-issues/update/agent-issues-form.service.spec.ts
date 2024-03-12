import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../agent-issues.test-samples';

import { AgentIssuesFormService } from './agent-issues-form.service';

describe('AgentIssues Form Service', () => {
  let service: AgentIssuesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentIssuesFormService);
  });

  describe('Service methods', () => {
    describe('createAgentIssuesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAgentIssuesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            state: expect.any(Object),
            problem: expect.any(Object),
            detail: expect.any(Object),
            severity: expect.any(Object),
            entityName: expect.any(Object),
            entityLabel: expect.any(Object),
            entityType: expect.any(Object),
            fix: expect.any(Object),
          }),
        );
      });

      it('passing IAgentIssues should create a new form with FormGroup', () => {
        const formGroup = service.createAgentIssuesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            state: expect.any(Object),
            problem: expect.any(Object),
            detail: expect.any(Object),
            severity: expect.any(Object),
            entityName: expect.any(Object),
            entityLabel: expect.any(Object),
            entityType: expect.any(Object),
            fix: expect.any(Object),
          }),
        );
      });
    });

    describe('getAgentIssues', () => {
      it('should return NewAgentIssues for default AgentIssues initial value', () => {
        const formGroup = service.createAgentIssuesFormGroup(sampleWithNewData);

        const agentIssues = service.getAgentIssues(formGroup) as any;

        expect(agentIssues).toMatchObject(sampleWithNewData);
      });

      it('should return NewAgentIssues for empty AgentIssues initial value', () => {
        const formGroup = service.createAgentIssuesFormGroup();

        const agentIssues = service.getAgentIssues(formGroup) as any;

        expect(agentIssues).toMatchObject({});
      });

      it('should return IAgentIssues', () => {
        const formGroup = service.createAgentIssuesFormGroup(sampleWithRequiredData);

        const agentIssues = service.getAgentIssues(formGroup) as any;

        expect(agentIssues).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAgentIssues should not enable id FormControl', () => {
        const formGroup = service.createAgentIssuesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAgentIssues should disable id FormControl', () => {
        const formGroup = service.createAgentIssuesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
