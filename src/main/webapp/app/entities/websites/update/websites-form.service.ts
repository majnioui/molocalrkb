import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IWebsites, NewWebsites } from '../websites.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IWebsites for edit and NewWebsitesFormGroupInput for create.
 */
type WebsitesFormGroupInput = IWebsites | PartialWithRequiredKeyOf<NewWebsites>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IWebsites | NewWebsites> = Omit<T, 'date'> & {
  date?: string | null;
};

type WebsitesFormRawValue = FormValueOf<IWebsites>;

type NewWebsitesFormRawValue = FormValueOf<NewWebsites>;

type WebsitesFormDefaults = Pick<NewWebsites, 'id' | 'date'>;

type WebsitesFormGroupContent = {
  id: FormControl<WebsitesFormRawValue['id'] | NewWebsites['id']>;
  website: FormControl<WebsitesFormRawValue['website']>;
  websiteId: FormControl<WebsitesFormRawValue['websiteId']>;
  cls: FormControl<WebsitesFormRawValue['cls']>;
  pageViews: FormControl<WebsitesFormRawValue['pageViews']>;
  pageLoads: FormControl<WebsitesFormRawValue['pageLoads']>;
  onLoadTime: FormControl<WebsitesFormRawValue['onLoadTime']>;
  date: FormControl<WebsitesFormRawValue['date']>;
};

export type WebsitesFormGroup = FormGroup<WebsitesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class WebsitesFormService {
  createWebsitesFormGroup(websites: WebsitesFormGroupInput = { id: null }): WebsitesFormGroup {
    const websitesRawValue = this.convertWebsitesToWebsitesRawValue({
      ...this.getFormDefaults(),
      ...websites,
    });
    return new FormGroup<WebsitesFormGroupContent>({
      id: new FormControl(
        { value: websitesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      website: new FormControl(websitesRawValue.website),
      websiteId: new FormControl(websitesRawValue.websiteId),
      cls: new FormControl(websitesRawValue.cls),
      pageViews: new FormControl(websitesRawValue.pageViews),
      pageLoads: new FormControl(websitesRawValue.pageLoads),
      onLoadTime: new FormControl(websitesRawValue.onLoadTime),
      date: new FormControl(websitesRawValue.date),
    });
  }

  getWebsites(form: WebsitesFormGroup): IWebsites | NewWebsites {
    return this.convertWebsitesRawValueToWebsites(form.getRawValue() as WebsitesFormRawValue | NewWebsitesFormRawValue);
  }

  resetForm(form: WebsitesFormGroup, websites: WebsitesFormGroupInput): void {
    const websitesRawValue = this.convertWebsitesToWebsitesRawValue({ ...this.getFormDefaults(), ...websites });
    form.reset(
      {
        ...websitesRawValue,
        id: { value: websitesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): WebsitesFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertWebsitesRawValueToWebsites(rawWebsites: WebsitesFormRawValue | NewWebsitesFormRawValue): IWebsites | NewWebsites {
    return {
      ...rawWebsites,
      date: dayjs(rawWebsites.date, DATE_TIME_FORMAT),
    };
  }

  private convertWebsitesToWebsitesRawValue(
    websites: IWebsites | (Partial<NewWebsites> & WebsitesFormDefaults),
  ): WebsitesFormRawValue | PartialWithRequiredKeyOf<NewWebsitesFormRawValue> {
    return {
      ...websites,
      date: websites.date ? websites.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
