import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IInstana, NewInstana } from '../instana.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInstana for edit and NewInstanaFormGroupInput for create.
 */
type InstanaFormGroupInput = IInstana | PartialWithRequiredKeyOf<NewInstana>;

type InstanaFormDefaults = Pick<NewInstana, 'id'>;

type InstanaFormGroupContent = {
  id: FormControl<IInstana['id'] | NewInstana['id']>;
  apitoken: FormControl<IInstana['apitoken']>;
  baseurl: FormControl<IInstana['baseurl']>;
};

export type InstanaFormGroup = FormGroup<InstanaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InstanaFormService {
  createInstanaFormGroup(instana: InstanaFormGroupInput = { id: null }): InstanaFormGroup {
    const instanaRawValue = {
      ...this.getFormDefaults(),
      ...instana,
    };
    return new FormGroup<InstanaFormGroupContent>({
      id: new FormControl(
        { value: instanaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      apitoken: new FormControl(instanaRawValue.apitoken),
      baseurl: new FormControl(instanaRawValue.baseurl),
    });
  }

  getInstana(form: InstanaFormGroup): IInstana | NewInstana {
    return form.getRawValue() as IInstana | NewInstana;
  }

  resetForm(form: InstanaFormGroup, instana: InstanaFormGroupInput): void {
    const instanaRawValue = { ...this.getFormDefaults(), ...instana };
    form.reset(
      {
        ...instanaRawValue,
        id: { value: instanaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InstanaFormDefaults {
    return {
      id: null,
    };
  }
}
