import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IInfraTopology, NewInfraTopology } from '../infra-topology.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInfraTopology for edit and NewInfraTopologyFormGroupInput for create.
 */
type InfraTopologyFormGroupInput = IInfraTopology | PartialWithRequiredKeyOf<NewInfraTopology>;

type InfraTopologyFormDefaults = Pick<NewInfraTopology, 'id'>;

type InfraTopologyFormGroupContent = {
  id: FormControl<IInfraTopology['id'] | NewInfraTopology['id']>;
  plugin: FormControl<IInfraTopology['plugin']>;
  label: FormControl<IInfraTopology['label']>;
  pluginId: FormControl<IInfraTopology['pluginId']>;
};

export type InfraTopologyFormGroup = FormGroup<InfraTopologyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InfraTopologyFormService {
  createInfraTopologyFormGroup(infraTopology: InfraTopologyFormGroupInput = { id: null }): InfraTopologyFormGroup {
    const infraTopologyRawValue = {
      ...this.getFormDefaults(),
      ...infraTopology,
    };
    return new FormGroup<InfraTopologyFormGroupContent>({
      id: new FormControl(
        { value: infraTopologyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      plugin: new FormControl(infraTopologyRawValue.plugin),
      label: new FormControl(infraTopologyRawValue.label),
      pluginId: new FormControl(infraTopologyRawValue.pluginId),
    });
  }

  getInfraTopology(form: InfraTopologyFormGroup): IInfraTopology | NewInfraTopology {
    return form.getRawValue() as IInfraTopology | NewInfraTopology;
  }

  resetForm(form: InfraTopologyFormGroup, infraTopology: InfraTopologyFormGroupInput): void {
    const infraTopologyRawValue = { ...this.getFormDefaults(), ...infraTopology };
    form.reset(
      {
        ...infraTopologyRawValue,
        id: { value: infraTopologyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InfraTopologyFormDefaults {
    return {
      id: null,
    };
  }
}
