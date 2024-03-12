import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEvents, NewEvents } from '../events.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEvents for edit and NewEventsFormGroupInput for create.
 */
type EventsFormGroupInput = IEvents | PartialWithRequiredKeyOf<NewEvents>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEvents | NewEvents> = Omit<T, 'date'> & {
  date?: string | null;
};

type EventsFormRawValue = FormValueOf<IEvents>;

type NewEventsFormRawValue = FormValueOf<NewEvents>;

type EventsFormDefaults = Pick<NewEvents, 'id' | 'date'>;

type EventsFormGroupContent = {
  id: FormControl<EventsFormRawValue['id'] | NewEvents['id']>;
  type: FormControl<EventsFormRawValue['type']>;
  state: FormControl<EventsFormRawValue['state']>;
  problem: FormControl<EventsFormRawValue['problem']>;
  detail: FormControl<EventsFormRawValue['detail']>;
  severity: FormControl<EventsFormRawValue['severity']>;
  entityName: FormControl<EventsFormRawValue['entityName']>;
  entityLabel: FormControl<EventsFormRawValue['entityLabel']>;
  entityType: FormControl<EventsFormRawValue['entityType']>;
  fix: FormControl<EventsFormRawValue['fix']>;
  date: FormControl<EventsFormRawValue['date']>;
};

export type EventsFormGroup = FormGroup<EventsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EventsFormService {
  createEventsFormGroup(events: EventsFormGroupInput = { id: null }): EventsFormGroup {
    const eventsRawValue = this.convertEventsToEventsRawValue({
      ...this.getFormDefaults(),
      ...events,
    });
    return new FormGroup<EventsFormGroupContent>({
      id: new FormControl(
        { value: eventsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      type: new FormControl(eventsRawValue.type),
      state: new FormControl(eventsRawValue.state),
      problem: new FormControl(eventsRawValue.problem),
      detail: new FormControl(eventsRawValue.detail),
      severity: new FormControl(eventsRawValue.severity),
      entityName: new FormControl(eventsRawValue.entityName),
      entityLabel: new FormControl(eventsRawValue.entityLabel),
      entityType: new FormControl(eventsRawValue.entityType),
      fix: new FormControl(eventsRawValue.fix),
      date: new FormControl(eventsRawValue.date),
    });
  }

  getEvents(form: EventsFormGroup): IEvents | NewEvents {
    return this.convertEventsRawValueToEvents(form.getRawValue() as EventsFormRawValue | NewEventsFormRawValue);
  }

  resetForm(form: EventsFormGroup, events: EventsFormGroupInput): void {
    const eventsRawValue = this.convertEventsToEventsRawValue({ ...this.getFormDefaults(), ...events });
    form.reset(
      {
        ...eventsRawValue,
        id: { value: eventsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EventsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertEventsRawValueToEvents(rawEvents: EventsFormRawValue | NewEventsFormRawValue): IEvents | NewEvents {
    return {
      ...rawEvents,
      date: dayjs(rawEvents.date, DATE_TIME_FORMAT),
    };
  }

  private convertEventsToEventsRawValue(
    events: IEvents | (Partial<NewEvents> & EventsFormDefaults),
  ): EventsFormRawValue | PartialWithRequiredKeyOf<NewEventsFormRawValue> {
    return {
      ...events,
      date: events.date ? events.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
