import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IInstalledSoftware } from '../installed-software.model';
import { InstalledSoftwareService } from '../service/installed-software.service';
import { InstalledSoftwareFormService, InstalledSoftwareFormGroup } from './installed-software-form.service';

@Component({
  standalone: true,
  selector: 'jhi-installed-software-update',
  templateUrl: './installed-software-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InstalledSoftwareUpdateComponent implements OnInit {
  isSaving = false;
  installedSoftware: IInstalledSoftware | null = null;

  editForm: InstalledSoftwareFormGroup = this.installedSoftwareFormService.createInstalledSoftwareFormGroup();

  constructor(
    protected installedSoftwareService: InstalledSoftwareService,
    protected installedSoftwareFormService: InstalledSoftwareFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ installedSoftware }) => {
      this.installedSoftware = installedSoftware;
      if (installedSoftware) {
        this.updateForm(installedSoftware);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const installedSoftware = this.installedSoftwareFormService.getInstalledSoftware(this.editForm);
    if (installedSoftware.id !== null) {
      this.subscribeToSaveResponse(this.installedSoftwareService.update(installedSoftware));
    } else {
      this.subscribeToSaveResponse(this.installedSoftwareService.create(installedSoftware));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInstalledSoftware>>): void {
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

  protected updateForm(installedSoftware: IInstalledSoftware): void {
    this.installedSoftware = installedSoftware;
    this.installedSoftwareFormService.resetForm(this.editForm, installedSoftware);
  }
}
