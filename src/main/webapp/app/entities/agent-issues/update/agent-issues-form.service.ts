import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAgentIssues, NewAgentIssues } from '../agent-issues.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAgentIssues for edit and NewAgentIssuesFormGroupInput for create.
 */
type AgentIssuesFormGroupInput = IAgentIssues | PartialWithRequiredKeyOf<NewAgentIssues>;

type AgentIssuesFormDefaults = Pick<NewAgentIssues, 'id'>;

type AgentIssuesFormGroupContent = {
  id: FormControl<IAgentIssues['id'] | NewAgentIssues['id']>;
  type: FormControl<IAgentIssues['type']>;
  state: FormControl<IAgentIssues['state']>;
  problem: FormControl<IAgentIssues['problem']>;
  detail: FormControl<IAgentIssues['detail']>;
  severity: FormControl<IAgentIssues['severity']>;
  entityName: FormControl<IAgentIssues['entityName']>;
  entityLabel: FormControl<IAgentIssues['entityLabel']>;
  entityType: FormControl<IAgentIssues['entityType']>;
  fix: FormControl<IAgentIssues['fix']>;
};

export type AgentIssuesFormGroup = FormGroup<AgentIssuesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AgentIssuesFormService {
  createAgentIssuesFormGroup(agentIssues: AgentIssuesFormGroupInput = { id: null }): AgentIssuesFormGroup {
    const agentIssuesRawValue = {
      ...this.getFormDefaults(),
      ...agentIssues,
    };
    return new FormGroup<AgentIssuesFormGroupContent>({
      id: new FormControl(
        { value: agentIssuesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      type: new FormControl(agentIssuesRawValue.type),
      state: new FormControl(agentIssuesRawValue.state),
      problem: new FormControl(agentIssuesRawValue.problem),
      detail: new FormControl(agentIssuesRawValue.detail),
      severity: new FormControl(agentIssuesRawValue.severity),
      entityName: new FormControl(agentIssuesRawValue.entityName),
      entityLabel: new FormControl(agentIssuesRawValue.entityLabel),
      entityType: new FormControl(agentIssuesRawValue.entityType),
      fix: new FormControl(agentIssuesRawValue.fix),
    });
  }

  getAgentIssues(form: AgentIssuesFormGroup): IAgentIssues | NewAgentIssues {
    return form.getRawValue() as IAgentIssues | NewAgentIssues;
  }

  resetForm(form: AgentIssuesFormGroup, agentIssues: AgentIssuesFormGroupInput): void {
    const agentIssuesRawValue = { ...this.getFormDefaults(), ...agentIssues };
    form.reset(
      {
        ...agentIssuesRawValue,
        id: { value: agentIssuesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AgentIssuesFormDefaults {
    return {
      id: null,
    };
  }
}
