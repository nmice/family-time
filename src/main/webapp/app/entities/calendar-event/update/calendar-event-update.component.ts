import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ICalendarEvent, CalendarEvent } from '../calendar-event.model';
import { CalendarEventService } from '../service/calendar-event.service';
import { IFamily } from 'app/entities/family/family.model';
import { FamilyService } from 'app/entities/family/service/family.service';

@Component({
  selector: 'jhi-calendar-event-update',
  templateUrl: './calendar-event-update.component.html',
})
export class CalendarEventUpdateComponent implements OnInit {
  isSaving = false;

  familiesSharedCollection: IFamily[] = [];

  editForm = this.fb.group({
    id: [],
    descriptor: [null, [Validators.required]],
    startDate: [],
    endDate: [],
    isExactly: [],
    family: [],
  });

  constructor(
    protected calendarEventService: CalendarEventService,
    protected familyService: FamilyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ calendarEvent }) => {
      if (calendarEvent.id === undefined) {
        const today = dayjs().startOf('day');
        calendarEvent.startDate = today;
        calendarEvent.endDate = today;
      }

      this.updateForm(calendarEvent);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const calendarEvent = this.createFromForm();
    if (calendarEvent.id !== undefined) {
      this.subscribeToSaveResponse(this.calendarEventService.update(calendarEvent));
    } else {
      this.subscribeToSaveResponse(this.calendarEventService.create(calendarEvent));
    }
  }

  trackFamilyById(_index: number, item: IFamily): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICalendarEvent>>): void {
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

  protected updateForm(calendarEvent: ICalendarEvent): void {
    this.editForm.patchValue({
      id: calendarEvent.id,
      descriptor: calendarEvent.descriptor,
      startDate: calendarEvent.startDate ? calendarEvent.startDate.format(DATE_TIME_FORMAT) : null,
      endDate: calendarEvent.endDate ? calendarEvent.endDate.format(DATE_TIME_FORMAT) : null,
      isExactly: calendarEvent.isExactly,
      family: calendarEvent.family,
    });

    this.familiesSharedCollection = this.familyService.addFamilyToCollectionIfMissing(this.familiesSharedCollection, calendarEvent.family);
  }

  protected loadRelationshipsOptions(): void {
    this.familyService
      .query()
      .pipe(map((res: HttpResponse<IFamily[]>) => res.body ?? []))
      .pipe(map((families: IFamily[]) => this.familyService.addFamilyToCollectionIfMissing(families, this.editForm.get('family')!.value)))
      .subscribe((families: IFamily[]) => (this.familiesSharedCollection = families));
  }

  protected createFromForm(): ICalendarEvent {
    return {
      ...new CalendarEvent(),
      id: this.editForm.get(['id'])!.value,
      descriptor: this.editForm.get(['descriptor'])!.value,
      startDate: this.editForm.get(['startDate'])!.value ? dayjs(this.editForm.get(['startDate'])!.value, DATE_TIME_FORMAT) : undefined,
      endDate: this.editForm.get(['endDate'])!.value ? dayjs(this.editForm.get(['endDate'])!.value, DATE_TIME_FORMAT) : undefined,
      isExactly: this.editForm.get(['isExactly'])!.value,
      family: this.editForm.get(['family'])!.value,
    };
  }
}
