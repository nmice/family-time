import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CalendarEventService } from '../service/calendar-event.service';
import { ICalendarEvent, CalendarEvent } from '../calendar-event.model';
import { IFamily } from 'app/entities/family/family.model';
import { FamilyService } from 'app/entities/family/service/family.service';

import { CalendarEventUpdateComponent } from './calendar-event-update.component';

describe('CalendarEvent Management Update Component', () => {
  let comp: CalendarEventUpdateComponent;
  let fixture: ComponentFixture<CalendarEventUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let calendarEventService: CalendarEventService;
  let familyService: FamilyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CalendarEventUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CalendarEventUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CalendarEventUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    calendarEventService = TestBed.inject(CalendarEventService);
    familyService = TestBed.inject(FamilyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Family query and add missing value', () => {
      const calendarEvent: ICalendarEvent = { id: 456 };
      const family: IFamily = { id: 9078 };
      calendarEvent.family = family;

      const familyCollection: IFamily[] = [{ id: 8558 }];
      jest.spyOn(familyService, 'query').mockReturnValue(of(new HttpResponse({ body: familyCollection })));
      const additionalFamilies = [family];
      const expectedCollection: IFamily[] = [...additionalFamilies, ...familyCollection];
      jest.spyOn(familyService, 'addFamilyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ calendarEvent });
      comp.ngOnInit();

      expect(familyService.query).toHaveBeenCalled();
      expect(familyService.addFamilyToCollectionIfMissing).toHaveBeenCalledWith(familyCollection, ...additionalFamilies);
      expect(comp.familiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const calendarEvent: ICalendarEvent = { id: 456 };
      const family: IFamily = { id: 65138 };
      calendarEvent.family = family;

      activatedRoute.data = of({ calendarEvent });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(calendarEvent));
      expect(comp.familiesSharedCollection).toContain(family);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CalendarEvent>>();
      const calendarEvent = { id: 123 };
      jest.spyOn(calendarEventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ calendarEvent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: calendarEvent }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(calendarEventService.update).toHaveBeenCalledWith(calendarEvent);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CalendarEvent>>();
      const calendarEvent = new CalendarEvent();
      jest.spyOn(calendarEventService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ calendarEvent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: calendarEvent }));
      saveSubject.complete();

      // THEN
      expect(calendarEventService.create).toHaveBeenCalledWith(calendarEvent);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CalendarEvent>>();
      const calendarEvent = { id: 123 };
      jest.spyOn(calendarEventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ calendarEvent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(calendarEventService.update).toHaveBeenCalledWith(calendarEvent);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFamilyById', () => {
      it('Should return tracked Family primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFamilyById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
