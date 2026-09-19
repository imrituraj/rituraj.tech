import { TimeTableEntry, ReminderItem, TodoItem } from '../types/study';

// ==============================================================================
// GOOGLE CALENDAR & iCAL (.ICS) INTEGRATION SUITE
// ==============================================================================

export interface GoogleCalendarEventPayload {
  title: string;
  details?: string;
  location?: string;
  startTime: string | Date; // ISO string or Date
  endTime?: string | Date;
  allDay?: boolean;
}

/**
 * Format a Date object or ISO string to Google Calendar web intent format:
 * Format: YYYYMMDDTHHmmssZ (UTC)
 */
export const formatGoogleDate = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    const now = new Date();
    return now.toISOString().replace(/-|:|\.\d+/g, '');
  }
  return date.toISOString().replace(/-|:|\.\d+/g, '');
};

/**
 * Generates an instant, zero-setup 1-click Google Calendar Web Intent URL.
 * Opens Google Calendar in the browser with title, date/time, venue, and description pre-filled.
 */
export const createGoogleCalendarIntentUrl = ({
  title,
  details = '',
  location = 'Indian Institute of Technology Patna (IIT Patna)',
  startTime,
  endTime,
  allDay = false
}: GoogleCalendarEventPayload): string => {
  const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
  let end: Date;

  if (endTime) {
    end = typeof endTime === 'string' ? new Date(endTime) : endTime;
  } else {
    // Default duration: 1 hour if not specified
    end = new Date(start.getTime() + 60 * 60 * 1000);
  }

  let datesParam: string;
  if (allDay) {
    const y = start.getFullYear();
    const m = String(start.getMonth() + 1).padStart(2, '0');
    const d = String(start.getDate()).padStart(2, '0');
    datesParam = `${y}${m}${d}/${y}${m}${d}`;
  } else {
    datesParam = `${formatGoogleDate(start)}/${formatGoogleDate(end)}`;
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: datesParam,
    details: `${details}\n\nSynced from Ritu Raj Study Suite // IIT Patna CSE (rituraj.tech)`,
    location: location
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Generates an instant Google Calendar link for a Study Reminder
 */
export const createReminderGoogleCalendarUrl = (reminder: ReminderItem): string => {
  let eventDate = new Date(reminder.dateTime);
  if (isNaN(eventDate.getTime())) {
    // Attempt parsing "YYYY-MM-DD HH:mm"
    eventDate = new Date(reminder.dateTime.replace(' ', 'T'));
  }
  if (isNaN(eventDate.getTime())) {
    eventDate = new Date();
  }

  return createGoogleCalendarIntentUrl({
    title: `[IIT Patna] ${reminder.title}`,
    details: `Category: ${reminder.type.toUpperCase()}\nNotes: ${reminder.notes || 'No extra notes.'}`,
    location: 'IIT Patna Campus, Bihta, Bihar',
    startTime: eventDate,
    endTime: new Date(eventDate.getTime() + 60 * 60 * 1000)
  });
};

/**
 * Generates an instant Google Calendar link for a Study Todo with due date
 */
export const createTodoGoogleCalendarUrl = (todo: TodoItem): string => {
  const dueDate = todo.dueDate ? new Date(`${todo.dueDate}T09:00:00`) : new Date();
  return createGoogleCalendarIntentUrl({
    title: `[TODO] ${todo.title} (${todo.course || 'CSE'})`,
    details: `Priority: ${todo.priority.toUpperCase()}\nStatus: ${todo.completed ? 'Completed' : 'Pending'}`,
    location: 'IIT Patna',
    startTime: dueDate,
    endTime: new Date(dueDate.getTime() + 60 * 60 * 1000)
  });
};

/**
 * Generates an instant Google Calendar link for a weekly TimeTable class
 */
export const createTimetableGoogleCalendarUrl = (item: TimeTableEntry): string => {
  // Parse time slot, e.g., "10:00 AM - 11:00 AM" or "02:00 PM - 03:00 PM"
  const now = new Date();
  const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const targetDayIndex = dayNames.indexOf(item.day);
  const currentDayIndex = now.getDay();

  let daysUntilTarget = targetDayIndex - currentDayIndex;
  if (daysUntilTarget < 0) daysUntilTarget += 7;

  const targetDate = new Date(now.getTime() + daysUntilTarget * 24 * 60 * 60 * 1000);
  
  // Try to parse slot times
  const parts = item.timeSlot.split('-');
  const startTimeStr = parts[0]?.trim() || '10:00 AM';
  const endTimeStr = parts[1]?.trim() || '11:00 AM';

  const parseSlotTime = (baseDate: Date, timeStr: string): Date => {
    const d = new Date(baseDate);
    const [time, modifier] = timeStr.split(' ');
    if (!time) return d;
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    d.setHours(hours, minutes || 0, 0, 0);
    return d;
  };

  const startTime = parseSlotTime(targetDate, startTimeStr);
  const endTime = parseSlotTime(targetDate, endTimeStr);

  return createGoogleCalendarIntentUrl({
    title: `[Class] ${item.courseCode}: ${item.courseName}`,
    details: `Course: ${item.courseName} (${item.courseCode})\nType: ${item.type}\nFaculty: ${item.faculty || 'IIT Patna Faculty'}\nCredits: ${item.credits}`,
    location: 'Dept. of Computer Science & Engineering, IIT Patna',
    startTime,
    endTime
  });
};

/**
 * Generates and triggers the download of a standard RFC 5545 iCalendar (.ics) file
 * containing the complete weekly IIT Patna M.Tech CSE timetable.
 * Can be imported into Google Calendar, Apple Calendar, or Outlook with 1 click.
 */
export const downloadTimetableIcsFile = (timetable: TimeTableEntry[]): void => {
  const dayToIcsMap: Record<string, string> = {
    MONDAY: 'MO',
    TUESDAY: 'TU',
    WEDNESDAY: 'WE',
    THURSDAY: 'TH',
    FRIDAY: 'FR',
    SATURDAY: 'SA',
    SUNDAY: 'SU'
  };

  // Find next Monday as recurrence start anchor
  const now = new Date();
  const nextMonday = new Date(now);
  const dayDiff = (1 + 7 - now.getDay()) % 7 || 7;
  nextMonday.setDate(now.getDate() + dayDiff);
  nextMonday.setHours(0, 0, 0, 0);

  const icsLines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ritu Raj//IIT Patna Study Suite//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:IIT Patna M.Tech CSE Schedule',
    'X-WR-TIMEZONE:Asia/Kolkata'
  ];

  timetable.forEach((entry, idx) => {
    const icsDay = dayToIcsMap[entry.day] || 'MO';
    const dayOffset = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].indexOf(icsDay);
    const eventDate = new Date(nextMonday);
    eventDate.setDate(nextMonday.getDate() + dayOffset);

    // Parse time slot
    const parts = entry.timeSlot.split('-');
    const parseSlot = (tStr: string) => {
      const [t, mod] = tStr.trim().split(' ');
      let [h, m] = (t || '10:00').split(':').map(Number);
      if (mod === 'PM' && h < 12) h += 12;
      if (mod === 'AM' && h === 12) h = 0;
      return { h, m: m || 0 };
    };

    const startSlot = parseSlot(parts[0] || '10:00 AM');
    const endSlot = parseSlot(parts[1] || '11:00 AM');

    const dtStart = new Date(eventDate);
    dtStart.setHours(startSlot.h, startSlot.m, 0, 0);

    const dtEnd = new Date(eventDate);
    dtEnd.setHours(endSlot.h, endSlot.m, 0, 0);

    const formatIcsDate = (d: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    };

    icsLines.push('BEGIN:VEVENT');
    icsLines.push(`UID:iitp-${entry.id || idx}-${Date.now()}@rituraj.tech`);
    icsLines.push(`DTSTAMP:${formatGoogleDate(now)}`);
    icsLines.push(`DTSTART;TZID=Asia/Kolkata:${formatIcsDate(dtStart)}`);
    icsLines.push(`DTEND;TZID=Asia/Kolkata:${formatIcsDate(dtEnd)}`);
    icsLines.push(`RRULE:FREQ=WEEKLY;BYDAY=${icsDay}`);
    icsLines.push(`SUMMARY:[IIT Patna] ${entry.courseCode} - ${entry.courseName}`);
    icsLines.push(`DESCRIPTION:Type: ${entry.type}\\nFaculty: ${entry.faculty || 'IITP'}\\nCredits: ${entry.credits}`);
    icsLines.push('LOCATION:Dept. of Computer Science & Engineering\\, IIT Patna');
    icsLines.push('STATUS:CONFIRMED');
    icsLines.push('END:VEVENT');
  });

  icsLines.push('END:VCALENDAR');

  const icsBlob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(icsBlob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'iit_patna_mtech_schedule.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
};

// ==============================================================================
// GOOGLE CALENDAR REST API CLIENT (OAUTH 2.0 VIA GOOGLE IDENTITY SERVICES)
// ==============================================================================

export const GOOGLE_CALENDAR_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/**
 * Creates an event directly in the user's primary Google Calendar via Google Calendar API v3
 */
export const createGoogleCalendarApiEvent = async (
  accessToken: string,
  event: GoogleCalendarEventPayload
): Promise<boolean> => {
  try {
    const start = typeof event.startTime === 'string' ? new Date(event.startTime) : event.startTime;
    const end = event.endTime
      ? typeof event.endTime === 'string' ? new Date(event.endTime) : event.endTime
      : new Date(start.getTime() + 60 * 60 * 1000);

    const body = {
      summary: event.title,
      description: `${event.details || ''}\n\nSynced from Ritu Raj Study Suite // IIT Patna`,
      location: event.location || 'IIT Patna Campus, Bihta, Bihar',
      start: {
        dateTime: start.toISOString(),
        timeZone: 'Asia/Kolkata'
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: 'Asia/Kolkata'
      }
    };

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    return response.ok;
  } catch (err) {
    console.error('Failed to create event in Google Calendar API:', err);
    return false;
  }
};
