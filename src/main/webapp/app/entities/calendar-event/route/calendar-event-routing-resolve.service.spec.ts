import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ICalendarEvent, CalendarEvent } from '../calendar-event.model';
import { CalendarEventService } from '../service/calendar-event.service';

import { CalendarEventRoutingResolveService } from './calendar-event-routing-resolve.service';

describe('CalendarEvent routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: CalendarEventRoutingResolveService;
  let service: CalendarEventService;
  let resultCalendarEvent: ICalendarEvent | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(CalendarEventRoutingResolveService);
    service = TestBed.inject(CalendarEventService);
    resultCalendarEvent = undefined;
  });

  describe('resolve', () => {
    it('should return ICalendarEvent returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCalendarEvent = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCalendarEvent).toEqual({ id: 123 });
    });

    it('should return new ICalendarEvent if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCalendarEvent = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultCalendarEvent).toEqual(new CalendarEvent());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CalendarEvent })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCalendarEvent = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCalendarEvent).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
