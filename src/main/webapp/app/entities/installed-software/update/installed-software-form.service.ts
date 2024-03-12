import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IInstalledSoftware, NewInstalledSoftware } from '../installed-software.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInstalledSoftware for edit and NewInstalledSoftwareFormGroupInput for create.
 */
type InstalledSoftwareFormGroupInput = IInstalledSoftware | PartialWithRequiredKeyOf<NewInstalledSoftware>;

type InstalledSoftwareFormDefaults = Pick<NewInstalledSoftware, 'id'>;

type InstalledSoftwareFormGroupContent = {
  id: FormControl<IInstalledSoftware['id'] | NewInstalledSoftware['id']>;
  name: FormControl<IInstalledSoftware['name']>;
  version: FormControl<IInstalledSoftware['version']>;
  type: FormControl<IInstalledSoftware['type']>;
  usedBy: FormControl<IInstalledSoftware['usedBy']>;
};

export type InstalledSoftwareFormGroup = FormGroup<InstalledSoftwareFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InstalledSoftwareFormService {
  createInstalledSoftwareFormGroup(installedSoftware: InstalledSoftwareFormGroupInput = { id: null }): InstalledSoftwareFormGroup {
    const installedSoftwareRawValue = {
      ...this.getFormDefaults(),
      ...installedSoftware,
    };
    return new FormGroup<InstalledSoftwareFormGroupContent>({
      id: new FormControl(
        { value: installedSoftwareRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(installedSoftwareRawValue.name),
      version: new FormControl(installedSoftwareRawValue.version),
      type: new FormControl(installedSoftwareRawValue.type),
      usedBy: new FormControl(installedSoftwareRawValue.usedBy),
    });
  }

  getInstalledSoftware(form: InstalledSoftwareFormGroup): IInstalledSoftware | NewInstalledSoftware {
    return form.getRawValue() as IInstalledSoftware | NewInstalledSoftware;
  }

  resetForm(form: InstalledSoftwareFormGroup, installedSoftware: InstalledSoftwareFormGroupInput): void {
    const installedSoftwareRawValue = { ...this.getFormDefaults(), ...installedSoftware };
    form.reset(
      {
        ...installedSoftwareRawValue,
        id: { value: installedSoftwareRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InstalledSoftwareFormDefaults {
    return {
      id: null,
    };
  }
}
