import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IInstana } from '../instana.model';
import { InstanaService } from '../service/instana.service';
import { InstanaFormService, InstanaFormGroup } from './instana-form.service';

@Component({
  standalone: true,
  selector: 'jhi-instana-update',
  templateUrl: './instana-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InstanaUpdateComponent implements OnInit {
  isSaving = false;
  instana: IInstana | null = null;

  editForm: InstanaFormGroup = this.instanaFormService.createInstanaFormGroup();

  constructor(
    protected instanaService: InstanaService,
    protected instanaFormService: InstanaFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ instana }) => {
      this.instana = instana;
      if (instana) {
        this.updateForm(instana);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const instana = this.instanaFormService.getInstana(this.editForm);
    if (instana.id !== null) {
      this.subscribeToSaveResponse(this.instanaService.update(instana));
    } else {
      this.subscribeToSaveResponse(this.instanaService.create(instana));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInstana>>): void {
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

  protected updateForm(instana: IInstana): void {
    this.instana = instana;
    this.instanaFormService.resetForm(this.editForm, instana);
  }
}
