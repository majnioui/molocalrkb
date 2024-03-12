import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IInstalledSoftware } from '../installed-software.model';
import { InstalledSoftwareService } from '../service/installed-software.service';

@Component({
  standalone: true,
  templateUrl: './installed-software-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class InstalledSoftwareDeleteDialogComponent {
  installedSoftware?: IInstalledSoftware;

  constructor(
    protected installedSoftwareService: InstalledSoftwareService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.installedSoftwareService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
