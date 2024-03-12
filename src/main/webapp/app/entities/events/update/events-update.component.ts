import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEvents } from '../events.model';
import { EventsService } from '../service/events.service';
import { EventsFormService, EventsFormGroup } from './events-form.service';

@Component({
  standalone: true,
  selector: 'jhi-events-update',
  templateUrl: './events-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EventsUpdateComponent implements OnInit {
  isSaving = false;
  events: IEvents | null = null;

  editForm: EventsFormGroup = this.eventsFormService.createEventsFormGroup();

  constructor(
    protected eventsService: EventsService,
    protected eventsFormService: EventsFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ events }) => {
      this.events = events;
      if (events) {
        this.updateForm(events);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const events = this.eventsFormService.getEvents(this.editForm);
    if (events.id !== null) {
      this.subscribeToSaveResponse(this.eventsService.update(events));
    } else {
      this.subscribeToSaveResponse(this.eventsService.create(events));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvents>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(events: IEvents): void {
    this.events = events;
    this.eventsFormService.resetForm(this.editForm, events);
  }
}
