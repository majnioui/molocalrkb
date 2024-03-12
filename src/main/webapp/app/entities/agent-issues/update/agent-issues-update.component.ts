import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAgentIssues } from '../agent-issues.model';
import { AgentIssuesService } from '../service/agent-issues.service';
import { AgentIssuesFormService, AgentIssuesFormGroup } from './agent-issues-form.service';

@Component({
  standalone: true,
  selector: 'jhi-agent-issues-update',
  templateUrl: './agent-issues-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AgentIssuesUpdateComponent implements OnInit {
  isSaving = false;
  agentIssues: IAgentIssues | null = null;

  editForm: AgentIssuesFormGroup = this.agentIssuesFormService.createAgentIssuesFormGroup();

  constructor(
    protected agentIssuesService: AgentIssuesService,
    protected agentIssuesFormService: AgentIssuesFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ agentIssues }) => {
      this.agentIssues = agentIssues;
      if (agentIssues) {
        this.updateForm(agentIssues);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const agentIssues = this.agentIssuesFormService.getAgentIssues(this.editForm);
    if (agentIssues.id !== null) {
      this.subscribeToSaveResponse(this.agentIssuesService.update(agentIssues));
    } else {
      this.subscribeToSaveResponse(this.agentIssuesService.create(agentIssues));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAgentIssues>>): void {
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

  protected updateForm(agentIssues: IAgentIssues): void {
    this.agentIssues = agentIssues;
    this.agentIssuesFormService.resetForm(this.editForm, agentIssues);
  }
}
