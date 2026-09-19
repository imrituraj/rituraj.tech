export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  isPinned?: boolean;
}

export type TodoPriority = 'high' | 'medium' | 'low';

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  dueDate: string;
  course?: string;
  createdAt: string;
  gcalEventId?: string;
}

export type ReminderType = 'exam' | 'assignment' | 'lab' | 'deadline' | 'meeting';

export interface ReminderItem {
  id: string;
  title: string;
  dateTime: string;
  type: ReminderType;
  completed: boolean;
  notes?: string;
  gcalEventId?: string;
}

export interface GCalEventItem {
  id: string;
  summary: string;
  start: string;
  end: string;
  htmlLink?: string;
  location?: string;
}

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface TimeTableEntry {
  id: string;
  day: DayOfWeek;
  timeSlot: string;
  courseName: string;
  courseCode: string;
  type: 'CORE' | 'ELECTIVE' | 'SELF STUDY';
  credits: string;
  faculty?: string;
}

export interface CourseSummary {
  code: string;
  name: string;
  type: 'Core' | 'Elective';
  credits: number;
  faculty: string;
}
