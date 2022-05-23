import { IUserf } from 'app/entities/userf/userf.model';
import { ICalendarEvent } from 'app/entities/calendar-event/calendar-event.model';

export interface IFamily {
  id?: number;
  name?: string;
  userfs?: IUserf[] | null;
  calendarEvents?: ICalendarEvent[] | null;
}

export class Family implements IFamily {
  constructor(public id?: number, public name?: string, public userfs?: IUserf[] | null, public calendarEvents?: ICalendarEvent[] | null) {}
}

export function getFamilyIdentifier(family: IFamily): number | undefined {
  return family.id;
}
