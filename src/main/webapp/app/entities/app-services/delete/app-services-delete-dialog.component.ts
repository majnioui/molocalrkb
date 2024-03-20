import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAppServices } from '../app-services.model';
import { AppServicesService } from '../service/app-services.service';

@Component({
  standalone: true,
  templateUrl: './app-services-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AppServicesDeleteDialogComponent {
  appServices?: IAppServices;

  constructor(
    protected appServicesService: AppServicesService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.appServicesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
