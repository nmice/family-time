import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICalendarEvent, CalendarEvent } from '../calendar-event.model';

import { CalendarEventService } from './calendar-event.service';

describe('CalendarEvent Service', () => {
  let service: CalendarEventService;
  let httpMock: HttpTestingController;
  let elemDefault: ICalendarEvent;
  let expectedResult: ICalendarEvent | ICalendarEvent[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CalendarEventService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      descriptor: 'AAAAAAA',
      startDate: currentDate,
      endDate: currentDate,
      isExactly: false,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          startDate: currentDate.format(DATE_TIME_FORMAT),
          endDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a CalendarEvent', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          startDate: currentDate.format(DATE_TIME_FORMAT),
          endDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.create(new CalendarEvent()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CalendarEvent', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          descriptor: 'BBBBBB',
          startDate: currentDate.format(DATE_TIME_FORMAT),
          endDate: currentDate.format(DATE_TIME_FORMAT),
          isExactly: true,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CalendarEvent', () => {
      const patchObject = Object.assign(
        {
          descriptor: 'BBBBBB',
          isExactly: true,
        },
        new CalendarEvent()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CalendarEvent', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          descriptor: 'BBBBBB',
          startDate: currentDate.format(DATE_TIME_FORMAT),
          endDate: currentDate.format(DATE_TIME_FORMAT),
          isExactly: true,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a CalendarEvent', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCalendarEventToCollectionIfMissing', () => {
      it('should add a CalendarEvent to an empty array', () => {
        const calendarEvent: ICalendarEvent = { id: 123 };
        expectedResult = service.addCalendarEventToCollectionIfMissing([], calendarEvent);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(calendarEvent);
      });

      it('should not add a CalendarEvent to an array that contains it', () => {
        const calendarEvent: ICalendarEvent = { id: 123 };
        const calendarEventCollection: ICalendarEvent[] = [
          {
            ...calendarEvent,
          },
          { id: 456 },
        ];
        expectedResult = service.addCalendarEventToCollectionIfMissing(calendarEventCollection, calendarEvent);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CalendarEvent to an array that doesn't contain it", () => {
        const calendarEvent: ICalendarEvent = { id: 123 };
        const calendarEventCollection: ICalendarEvent[] = [{ id: 456 }];
        expectedResult = service.addCalendarEventToCollectionIfMissing(calendarEventCollection, calendarEvent);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(calendarEvent);
      });

      it('should add only unique CalendarEvent to an array', () => {
        const calendarEventArray: ICalendarEvent[] = [{ id: 123 }, { id: 456 }, { id: 51880 }];
        const calendarEventCollection: ICalendarEvent[] = [{ id: 123 }];
        expectedResult = service.addCalendarEventToCollectionIfMissing(calendarEventCollection, ...calendarEventArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const calendarEvent: ICalendarEvent = { id: 123 };
        const calendarEvent2: ICalendarEvent = { id: 456 };
        expectedResult = service.addCalendarEventToCollectionIfMissing([], calendarEvent, calendarEvent2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(calendarEvent);
        expect(expectedResult).toContain(calendarEvent2);
      });

      it('should accept null and undefined values', () => {
        const calendarEvent: ICalendarEvent = { id: 123 };
        expectedResult = service.addCalendarEventToCollectionIfMissing([], null, calendarEvent, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(calendarEvent);
      });

      it('should return initial array if no CalendarEvent is added', () => {
        const calendarEventCollection: ICalendarEvent[] = [{ id: 123 }];
        expectedResult = service.addCalendarEventToCollectionIfMissing(calendarEventCollection, undefined, null);
        expect(expectedResult).toEqual(calendarEventCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
