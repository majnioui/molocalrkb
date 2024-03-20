import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAppServices } from '../app-services.model';
import { AppServicesService } from '../service/app-services.service';
import { AppServicesFormService, AppServicesFormGroup } from './app-services-form.service';

@Component({
  standalone: true,
  selector: 'jhi-app-services-update',
  templateUrl: './app-services-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AppServicesUpdateComponent implements OnInit {
  isSaving = false;
  appServices: IAppServices | null = null;

  editForm: AppServicesFormGroup = this.appServicesFormService.createAppServicesFormGroup();

  constructor(
    protected appServicesService: AppServicesService,
    protected appServicesFormService: AppServicesFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appServices }) => {
      this.appServices = appServices;
      if (appServices) {
        this.updateForm(appServices);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const appServices = this.appServicesFormService.getAppServices(this.editForm);
    if (appServices.id !== null) {
      this.subscribeToSaveResponse(this.appServicesService.update(appServices));
    } else {
      this.subscribeToSaveResponse(this.appServicesService.create(appServices));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAppServices>>): void {
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

  protected updateForm(appServices: IAppServices): void {
    this.appServices = appServices;
    this.appServicesFormService.resetForm(this.editForm, appServices);
  }
}
