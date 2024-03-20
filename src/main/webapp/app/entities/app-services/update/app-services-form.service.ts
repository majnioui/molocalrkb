import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAppServices, NewAppServices } from '../app-services.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAppServices for edit and NewAppServicesFormGroupInput for create.
 */
type AppServicesFormGroupInput = IAppServices | PartialWithRequiredKeyOf<NewAppServices>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAppServices | NewAppServices> = Omit<T, 'date'> & {
  date?: string | null;
};

type AppServicesFormRawValue = FormValueOf<IAppServices>;

type NewAppServicesFormRawValue = FormValueOf<NewAppServices>;

type AppServicesFormDefaults = Pick<NewAppServices, 'id' | 'date'>;

type AppServicesFormGroupContent = {
  id: FormControl<AppServicesFormRawValue['id'] | NewAppServices['id']>;
  servId: FormControl<AppServicesFormRawValue['servId']>;
  label: FormControl<AppServicesFormRawValue['label']>;
  types: FormControl<AppServicesFormRawValue['types']>;
  technologies: FormControl<AppServicesFormRawValue['technologies']>;
  entityType: FormControl<AppServicesFormRawValue['entityType']>;
  erronCalls: FormControl<AppServicesFormRawValue['erronCalls']>;
  calls: FormControl<AppServicesFormRawValue['calls']>;
  latency: FormControl<AppServicesFormRawValue['latency']>;
  date: FormControl<AppServicesFormRawValue['date']>;
};

export type AppServicesFormGroup = FormGroup<AppServicesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AppServicesFormService {
  createAppServicesFormGroup(appServices: AppServicesFormGroupInput = { id: null }): AppServicesFormGroup {
    const appServicesRawValue = this.convertAppServicesToAppServicesRawValue({
      ...this.getFormDefaults(),
      ...appServices,
    });
    return new FormGroup<AppServicesFormGroupContent>({
      id: new FormControl(
        { value: appServicesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      servId: new FormControl(appServicesRawValue.servId),
      label: new FormControl(appServicesRawValue.label),
      types: new FormControl(appServicesRawValue.types),
      technologies: new FormControl(appServicesRawValue.technologies),
      entityType: new FormControl(appServicesRawValue.entityType),
      erronCalls: new FormControl(appServicesRawValue.erronCalls),
      calls: new FormControl(appServicesRawValue.calls),
      latency: new FormControl(appServicesRawValue.latency),
      date: new FormControl(appServicesRawValue.date),
    });
  }

  getAppServices(form: AppServicesFormGroup): IAppServices | NewAppServices {
    return this.convertAppServicesRawValueToAppServices(form.getRawValue() as AppServicesFormRawValue | NewAppServicesFormRawValue);
  }

  resetForm(form: AppServicesFormGroup, appServices: AppServicesFormGroupInput): void {
    const appServicesRawValue = this.convertAppServicesToAppServicesRawValue({ ...this.getFormDefaults(), ...appServices });
    form.reset(
      {
        ...appServicesRawValue,
        id: { value: appServicesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AppServicesFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertAppServicesRawValueToAppServices(
    rawAppServices: AppServicesFormRawValue | NewAppServicesFormRawValue,
  ): IAppServices | NewAppServices {
    return {
      ...rawAppServices,
      date: dayjs(rawAppServices.date, DATE_TIME_FORMAT),
    };
  }

  private convertAppServicesToAppServicesRawValue(
    appServices: IAppServices | (Partial<NewAppServices> & AppServicesFormDefaults),
  ): AppServicesFormRawValue | PartialWithRequiredKeyOf<NewAppServicesFormRawValue> {
    return {
      ...appServices,
      date: appServices.date ? appServices.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
