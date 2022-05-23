import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUserf, Userf } from '../userf.model';
import { UserfService } from '../service/userf.service';
import { IFamily } from 'app/entities/family/family.model';
import { FamilyService } from 'app/entities/family/service/family.service';

@Component({
  selector: 'jhi-userf-update',
  templateUrl: './userf-update.component.html',
})
export class UserfUpdateComponent implements OnInit {
  isSaving = false;

  familiesSharedCollection: IFamily[] = [];

  editForm = this.fb.group({
    id: [],
    login: [null, [Validators.required]],
    pass: [],
    name: [],
    family: [],
  });

  constructor(
    protected userfService: UserfService,
    protected familyService: FamilyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userf }) => {
      this.updateForm(userf);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userf = this.createFromForm();
    if (userf.id !== undefined) {
      this.subscribeToSaveResponse(this.userfService.update(userf));
    } else {
      this.subscribeToSaveResponse(this.userfService.create(userf));
    }
  }

  trackFamilyById(_index: number, item: IFamily): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserf>>): void {
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

  protected updateForm(userf: IUserf): void {
    this.editForm.patchValue({
      id: userf.id,
      login: userf.login,
      pass: userf.pass,
      name: userf.name,
      family: userf.family,
    });

    this.familiesSharedCollection = this.familyService.addFamilyToCollectionIfMissing(this.familiesSharedCollection, userf.family);
  }

  protected loadRelationshipsOptions(): void {
    this.familyService
      .query()
      .pipe(map((res: HttpResponse<IFamily[]>) => res.body ?? []))
      .pipe(map((families: IFamily[]) => this.familyService.addFamilyToCollectionIfMissing(families, this.editForm.get('family')!.value)))
      .subscribe((families: IFamily[]) => (this.familiesSharedCollection = families));
  }

  protected createFromForm(): IUserf {
    return {
      ...new Userf(),
      id: this.editForm.get(['id'])!.value,
      login: this.editForm.get(['login'])!.value,
      pass: this.editForm.get(['pass'])!.value,
      name: this.editForm.get(['name'])!.value,
      family: this.editForm.get(['family'])!.value,
    };
  }
}
