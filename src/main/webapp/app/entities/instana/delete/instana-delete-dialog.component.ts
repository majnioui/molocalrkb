import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IInstana } from '../instana.model';
import { InstanaService } from '../service/instana.service';

@Component({
  standalone: true,
  templateUrl: './instana-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class InstanaDeleteDialogComponent {
  instana?: IInstana;

  constructor(
    protected instanaService: InstanaService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.instanaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
