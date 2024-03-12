import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IWebsites } from '../websites.model';
import { WebsitesService } from '../service/websites.service';
import { WebsitesFormService, WebsitesFormGroup } from './websites-form.service';

@Component({
  standalone: true,
  selector: 'jhi-websites-update',
  templateUrl: './websites-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class WebsitesUpdateComponent implements OnInit {
  isSaving = false;
  websites: IWebsites | null = null;

  editForm: WebsitesFormGroup = this.websitesFormService.createWebsitesFormGroup();

  constructor(
    protected websitesService: WebsitesService,
    protected websitesFormService: WebsitesFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ websites }) => {
      this.websites = websites;
      if (websites) {
        this.updateForm(websites);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const websites = this.websitesFormService.getWebsites(this.editForm);
    if (websites.id !== null) {
      this.subscribeToSaveResponse(this.websitesService.update(websites));
    } else {
      this.subscribeToSaveResponse(this.websitesService.create(websites));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWebsites>>): void {
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

  protected updateForm(websites: IWebsites): void {
    this.websites = websites;
    this.websitesFormService.resetForm(this.editForm, websites);
  }
}
