import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEvents } from '../events.model';
import { EventsService } from '../service/events.service';

@Component({
  standalone: true,
  templateUrl: './events-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EventsDeleteDialogComponent {
  events?: IEvents;

  constructor(
    protected eventsService: EventsService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
