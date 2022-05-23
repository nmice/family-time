import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICalendarEvent, getCalendarEventIdentifier } from '../calendar-event.model';

export type EntityResponseType = HttpResponse<ICalendarEvent>;
export type EntityArrayResponseType = HttpResponse<ICalendarEvent[]>;

@Injectable({ providedIn: 'root' })
export class CalendarEventService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/calendar-events');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(calendarEvent: ICalendarEvent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(calendarEvent);
    return this.http
      .post<ICalendarEvent>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(calendarEvent: ICalendarEvent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(calendarEvent);
    return this.http
      .put<ICalendarEvent>(`${this.resourceUrl}/${getCalendarEventIdentifier(calendarEvent) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(calendarEvent: ICalendarEvent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(calendarEvent);
    return this.http
      .patch<ICalendarEvent>(`${this.resourceUrl}/${getCalendarEventIdentifier(calendarEvent) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICalendarEvent>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICalendarEvent[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCalendarEventToCollectionIfMissing(
    calendarEventCollection: ICalendarEvent[],
    ...calendarEventsToCheck: (ICalendarEvent | null | undefined)[]
  ): ICalendarEvent[] {
    const calendarEvents: ICalendarEvent[] = calendarEventsToCheck.filter(isPresent);
    if (calendarEvents.length > 0) {
      const calendarEventCollectionIdentifiers = calendarEventCollection.map(
        calendarEventItem => getCalendarEventIdentifier(calendarEventItem)!
      );
      const calendarEventsToAdd = calendarEvents.filter(calendarEventItem => {
        const calendarEventIdentifier = getCalendarEventIdentifier(calendarEventItem);
        if (calendarEventIdentifier == null || calendarEventCollectionIdentifiers.includes(calendarEventIdentifier)) {
          return false;
        }
        calendarEventCollectionIdentifiers.push(calendarEventIdentifier);
        return true;
      });
      return [...calendarEventsToAdd, ...calendarEventCollection];
    }
    return calendarEventCollection;
  }

  protected convertDateFromClient(calendarEvent: ICalendarEvent): ICalendarEvent {
    return Object.assign({}, calendarEvent, {
      startDate: calendarEvent.startDate?.isValid() ? calendarEvent.startDate.toJSON() : undefined,
      endDate: calendarEvent.endDate?.isValid() ? calendarEvent.endDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate ? dayjs(res.body.startDate) : undefined;
      res.body.endDate = res.body.endDate ? dayjs(res.body.endDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((calendarEvent: ICalendarEvent) => {
        calendarEvent.startDate = calendarEvent.startDate ? dayjs(calendarEvent.startDate) : undefined;
        calendarEvent.endDate = calendarEvent.endDate ? dayjs(calendarEvent.endDate) : undefined;
      });
    }
    return res;
  }
}
