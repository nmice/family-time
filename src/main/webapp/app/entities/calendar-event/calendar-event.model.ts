import dayjs from 'dayjs/esm';
import { IFamily } from 'app/entities/family/family.model';

export interface ICalendarEvent {
  id?: number;
  descriptor?: string;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  isExactly?: boolean | null;
  family?: IFamily | null;
}

export class CalendarEvent implements ICalendarEvent {
  constructor(
    public id?: number,
    public descriptor?: string,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public isExactly?: boolean | null,
    public family?: IFamily | null
  ) {
    this.isExactly = this.isExactly ?? false;
  }
}

export function getCalendarEventIdentifier(calendarEvent: ICalendarEvent): number | undefined {
  return calendarEvent.id;
}
