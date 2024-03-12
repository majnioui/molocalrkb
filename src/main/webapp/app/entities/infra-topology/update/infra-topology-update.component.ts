import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IInfraTopology } from '../infra-topology.model';
import { InfraTopologyService } from '../service/infra-topology.service';
import { InfraTopologyFormService, InfraTopologyFormGroup } from './infra-topology-form.service';

@Component({
  standalone: true,
  selector: 'jhi-infra-topology-update',
  templateUrl: './infra-topology-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InfraTopologyUpdateComponent implements OnInit {
  isSaving = false;
  infraTopology: IInfraTopology | null = null;

  editForm: InfraTopologyFormGroup = this.infraTopologyFormService.createInfraTopologyFormGroup();

  constructor(
    protected infraTopologyService: InfraTopologyService,
    protected infraTopologyFormService: InfraTopologyFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ infraTopology }) => {
      this.infraTopology = infraTopology;
      if (infraTopology) {
        this.updateForm(infraTopology);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const infraTopology = this.infraTopologyFormService.getInfraTopology(this.editForm);
    if (infraTopology.id !== null) {
      this.subscribeToSaveResponse(this.infraTopologyService.update(infraTopology));
    } else {
      this.subscribeToSaveResponse(this.infraTopologyService.create(infraTopology));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInfraTopology>>): void {
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

  protected updateForm(infraTopology: IInfraTopology): void {
    this.infraTopology = infraTopology;
    this.infraTopologyFormService.resetForm(this.editForm, infraTopology);
  }
}
