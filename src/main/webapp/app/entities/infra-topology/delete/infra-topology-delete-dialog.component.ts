import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IInfraTopology } from '../infra-topology.model';
import { InfraTopologyService } from '../service/infra-topology.service';

@Component({
  standalone: true,
  templateUrl: './infra-topology-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class InfraTopologyDeleteDialogComponent {
  infraTopology?: IInfraTopology;

  constructor(
    protected infraTopologyService: InfraTopologyService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.infraTopologyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
