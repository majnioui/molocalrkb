import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IHealthAndVersion } from '../health-and-version.model';
import { HealthAndVersionService } from '../service/health-and-version.service';

@Component({
  standalone: true,
  templateUrl: './health-and-version-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class HealthAndVersionDeleteDialogComponent {
  healthAndVersion?: IHealthAndVersion;

  constructor(
    protected healthAndVersionService: HealthAndVersionService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.healthAndVersionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
