import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IHealthAndVersion } from '../health-and-version.model';
import { HealthAndVersionService } from '../service/health-and-version.service';
import { HealthAndVersionFormService, HealthAndVersionFormGroup } from './health-and-version-form.service';

@Component({
  standalone: true,
  selector: 'jhi-health-and-version-update',
  templateUrl: './health-and-version-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class HealthAndVersionUpdateComponent implements OnInit {
  isSaving = false;
  healthAndVersion: IHealthAndVersion | null = null;

  editForm: HealthAndVersionFormGroup = this.healthAndVersionFormService.createHealthAndVersionFormGroup();

  constructor(
    protected healthAndVersionService: HealthAndVersionService,
    protected healthAndVersionFormService: HealthAndVersionFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ healthAndVersion }) => {
      this.healthAndVersion = healthAndVersion;
      if (healthAndVersion) {
        this.updateForm(healthAndVersion);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const healthAndVersion = this.healthAndVersionFormService.getHealthAndVersion(this.editForm);
    if (healthAndVersion.id !== null) {
      this.subscribeToSaveResponse(this.healthAndVersionService.update(healthAndVersion));
    } else {
      this.subscribeToSaveResponse(this.healthAndVersionService.create(healthAndVersion));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHealthAndVersion>>): void {
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

  protected updateForm(healthAndVersion: IHealthAndVersion): void {
    this.healthAndVersion = healthAndVersion;
    this.healthAndVersionFormService.resetForm(this.editForm, healthAndVersion);
  }
}
