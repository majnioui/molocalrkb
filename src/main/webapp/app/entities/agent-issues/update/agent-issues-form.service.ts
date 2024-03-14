import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
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

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAgentIssues | NewAgentIssues> = Omit<T, 'atTime'> & {
  atTime?: string | null;
};

type AgentIssuesFormRawValue = FormValueOf<IAgentIssues>;

type NewAgentIssuesFormRawValue = FormValueOf<NewAgentIssues>;

type AgentIssuesFormDefaults = Pick<NewAgentIssues, 'id' | 'atTime'>;

type AgentIssuesFormGroupContent = {
  id: FormControl<AgentIssuesFormRawValue['id'] | NewAgentIssues['id']>;
  type: FormControl<AgentIssuesFormRawValue['type']>;
  state: FormControl<AgentIssuesFormRawValue['state']>;
  problem: FormControl<AgentIssuesFormRawValue['problem']>;
  detail: FormControl<AgentIssuesFormRawValue['detail']>;
  severity: FormControl<AgentIssuesFormRawValue['severity']>;
  entityName: FormControl<AgentIssuesFormRawValue['entityName']>;
  entityLabel: FormControl<AgentIssuesFormRawValue['entityLabel']>;
  entityType: FormControl<AgentIssuesFormRawValue['entityType']>;
  fix: FormControl<AgentIssuesFormRawValue['fix']>;
  atTime: FormControl<AgentIssuesFormRawValue['atTime']>;
};

export type AgentIssuesFormGroup = FormGroup<AgentIssuesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AgentIssuesFormService {
  createAgentIssuesFormGroup(agentIssues: AgentIssuesFormGroupInput = { id: null }): AgentIssuesFormGroup {
    const agentIssuesRawValue = this.convertAgentIssuesToAgentIssuesRawValue({
      ...this.getFormDefaults(),
      ...agentIssues,
    });
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
      atTime: new FormControl(agentIssuesRawValue.atTime),
    });
  }

  getAgentIssues(form: AgentIssuesFormGroup): IAgentIssues | NewAgentIssues {
    return this.convertAgentIssuesRawValueToAgentIssues(form.getRawValue() as AgentIssuesFormRawValue | NewAgentIssuesFormRawValue);
  }

  resetForm(form: AgentIssuesFormGroup, agentIssues: AgentIssuesFormGroupInput): void {
    const agentIssuesRawValue = this.convertAgentIssuesToAgentIssuesRawValue({ ...this.getFormDefaults(), ...agentIssues });
    form.reset(
      {
        ...agentIssuesRawValue,
        id: { value: agentIssuesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AgentIssuesFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      atTime: currentTime,
    };
  }

  private convertAgentIssuesRawValueToAgentIssues(
    rawAgentIssues: AgentIssuesFormRawValue | NewAgentIssuesFormRawValue,
  ): IAgentIssues | NewAgentIssues {
    return {
      ...rawAgentIssues,
      atTime: dayjs(rawAgentIssues.atTime, DATE_TIME_FORMAT),
    };
  }

  private convertAgentIssuesToAgentIssuesRawValue(
    agentIssues: IAgentIssues | (Partial<NewAgentIssues> & AgentIssuesFormDefaults),
  ): AgentIssuesFormRawValue | PartialWithRequiredKeyOf<NewAgentIssuesFormRawValue> {
    return {
      ...agentIssues,
      atTime: agentIssues.atTime ? agentIssues.atTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
