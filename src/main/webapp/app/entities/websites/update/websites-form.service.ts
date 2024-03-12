import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

type WebsitesFormDefaults = Pick<NewWebsites, 'id'>;

type WebsitesFormGroupContent = {
  id: FormControl<IWebsites['id'] | NewWebsites['id']>;
  website: FormControl<IWebsites['website']>;
  websiteId: FormControl<IWebsites['websiteId']>;
};

export type WebsitesFormGroup = FormGroup<WebsitesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class WebsitesFormService {
  createWebsitesFormGroup(websites: WebsitesFormGroupInput = { id: null }): WebsitesFormGroup {
    const websitesRawValue = {
      ...this.getFormDefaults(),
      ...websites,
    };
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
    });
  }

  getWebsites(form: WebsitesFormGroup): IWebsites | NewWebsites {
    return form.getRawValue() as IWebsites | NewWebsites;
  }

  resetForm(form: WebsitesFormGroup, websites: WebsitesFormGroupInput): void {
    const websitesRawValue = { ...this.getFormDefaults(), ...websites };
    form.reset(
      {
        ...websitesRawValue,
        id: { value: websitesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): WebsitesFormDefaults {
    return {
      id: null,
    };
  }
}
