import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IHealthAndVersion, NewHealthAndVersion } from '../health-and-version.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHealthAndVersion for edit and NewHealthAndVersionFormGroupInput for create.
 */
type HealthAndVersionFormGroupInput = IHealthAndVersion | PartialWithRequiredKeyOf<NewHealthAndVersion>;

type HealthAndVersionFormDefaults = Pick<NewHealthAndVersion, 'id'>;

type HealthAndVersionFormGroupContent = {
  id: FormControl<IHealthAndVersion['id'] | NewHealthAndVersion['id']>;
  version: FormControl<IHealthAndVersion['version']>;
  health: FormControl<IHealthAndVersion['health']>;
  healthMsg: FormControl<IHealthAndVersion['healthMsg']>;
};

export type HealthAndVersionFormGroup = FormGroup<HealthAndVersionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HealthAndVersionFormService {
  createHealthAndVersionFormGroup(healthAndVersion: HealthAndVersionFormGroupInput = { id: null }): HealthAndVersionFormGroup {
    const healthAndVersionRawValue = {
      ...this.getFormDefaults(),
      ...healthAndVersion,
    };
    return new FormGroup<HealthAndVersionFormGroupContent>({
      id: new FormControl(
        { value: healthAndVersionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      version: new FormControl(healthAndVersionRawValue.version),
      health: new FormControl(healthAndVersionRawValue.health),
      healthMsg: new FormControl(healthAndVersionRawValue.healthMsg),
    });
  }

  getHealthAndVersion(form: HealthAndVersionFormGroup): IHealthAndVersion | NewHealthAndVersion {
    return form.getRawValue() as IHealthAndVersion | NewHealthAndVersion;
  }

  resetForm(form: HealthAndVersionFormGroup, healthAndVersion: HealthAndVersionFormGroupInput): void {
    const healthAndVersionRawValue = { ...this.getFormDefaults(), ...healthAndVersion };
    form.reset(
      {
        ...healthAndVersionRawValue,
        id: { value: healthAndVersionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): HealthAndVersionFormDefaults {
    return {
      id: null,
    };
  }
}
