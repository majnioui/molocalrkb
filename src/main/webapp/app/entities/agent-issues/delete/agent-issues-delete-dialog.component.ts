import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAgentIssues } from '../agent-issues.model';
import { AgentIssuesService } from '../service/agent-issues.service';

@Component({
  standalone: true,
  templateUrl: './agent-issues-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AgentIssuesDeleteDialogComponent {
  agentIssues?: IAgentIssues;

  constructor(
    protected agentIssuesService: AgentIssuesService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.agentIssuesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
