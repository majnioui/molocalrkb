import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IWebsites } from '../websites.model';
import { WebsitesService } from '../service/websites.service';

@Component({
  standalone: true,
  templateUrl: './websites-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class WebsitesDeleteDialogComponent {
  websites?: IWebsites;

  constructor(
    protected websitesService: WebsitesService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.websitesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
