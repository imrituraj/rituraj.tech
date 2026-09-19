import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckSquare,
  Bell,
  LayoutDashboard,
  ArrowLeft,
  LogOut,
  Plus,
  Trash2,
  Pin,
  Clock,
  Calendar,
  CalendarDays,
  CalendarPlus,
  Download,
  Search,
  CheckCircle2,
  Circle,
  AlertCircle,
  Copy,
  Check,
  User,
  Info,
  Database,
  Cloud
} from 'lucide-react';
import { NoteItem, TodoItem, ReminderItem, TodoPriority, ReminderType } from '../../types/study';
import { initialNotes, initialTodos, initialReminders } from '../../data/defaultStudyData';
import { weeklyTimetable, registeredCoursesSummary } from '../../data/iitpTimetable';
import { supabaseService } from '../../lib/supabaseService';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import {
  createReminderGoogleCalendarUrl,
  createTodoGoogleCalendarUrl,
  createTimetableGoogleCalendarUrl,
  downloadTimetableIcsFile
} from '../../lib/googleCalendarService';

interface StudyDashboardProps {
  onBackToPortfolio: () => void;
  onLogout: () => void;
}

type TabType = 'overview' | 'timetable' | 'notes' | 'todos' | 'reminders';

export const StudyDashboard: React.FC<StudyDashboardProps> = ({
  onBackToPortfolio,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [timetableDay, setTimetableDay] = useState<string>('ALL');

  // Days mapping
  const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
  const currentDayIndex = new Date().getDay();
  const todayDayName = daysOfWeek[currentDayIndex];
  const todayClasses = weeklyTimetable.filter((item) => item.day === todayDayName);

  // State with LocalStorage persistence
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('rituraj_study_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse notes from storage', e);
      }
    }
    return initialNotes;
  });

  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem('rituraj_study_todos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse todos from storage', e);
      }
    }
    return initialTodos;
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const saved = localStorage.getItem('rituraj_study_reminders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse reminders from storage', e);
      }
    }
    return initialReminders;
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('rituraj_study_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('rituraj_study_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('rituraj_study_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Initial Supabase Cloud Fetch on Mount
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    const fetchCloudData = async () => {
      setIsCloudSyncing(true);
      try {
        const [cloudNotes, cloudTodos, cloudReminders] = await Promise.all([
          supabaseService.getNotes(),
          supabaseService.getTodos(),
          supabaseService.getReminders()
        ]);

        if (!isMounted) return;

        if (cloudNotes && cloudNotes.length > 0) setNotes(cloudNotes);
        if (cloudTodos && cloudTodos.length > 0) setTodos(cloudTodos);
        if (cloudReminders && cloudReminders.length > 0) setReminders(cloudReminders);
      } catch (err) {
        console.warn('Cloud sync load failed:', err);
      } finally {
        if (isMounted) setIsCloudSyncing(false);
      }
    };

    fetchCloudData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Clock
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Kolkata'
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- NOTES STATE & HANDLERS ---
  const [noteSearch, setNoteSearch] = useState('');
  const [noteCategoryFilter, setNoteCategoryFilter] = useState('ALL');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('M.Tech CSE // IIT Patna');
  const [newNoteTags, setNewNoteTags] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const newNote: NoteItem = {
      id: 'note-' + Date.now(),
      title: newNoteTitle.trim(),
      category: newNoteCategory.trim() || 'General',
      content: newNoteContent.trim(),
      tags: newNoteTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString().split('T')[0],
      isPinned: false
    };

    setNotes([newNote, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteTags('');
    setIsAddingNote(false);
    if (isSupabaseConfigured) {
      supabaseService.upsertNote(newNote);
    }
  };

  const togglePinNote = (id: string) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n));
    setNotes(updated);
    if (isSupabaseConfigured) {
      const target = updated.find((n) => n.id === id);
      if (target) supabaseService.upsertNote(target);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    if (isSupabaseConfigured) {
      supabaseService.deleteNote(id);
    }
  };

  const copyNoteContent = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- TODOS STATE & HANDLERS ---
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoCourse, setNewTodoCourse] = useState('CS501');
  const [newTodoPriority, setNewTodoPriority] = useState<TodoPriority>('high');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  const [todoFilter, setTodoFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const newTodo: TodoItem = {
      id: 'todo-' + Date.now(),
      title: newTodoTitle.trim(),
      course: newTodoCourse.trim() || 'General',
      priority: newTodoPriority,
      dueDate: newTodoDueDate || new Date().toISOString().split('T')[0],
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTodos([newTodo, ...todos]);
    setNewTodoTitle('');
    setIsAddingTodo(false);
    if (isSupabaseConfigured) {
      supabaseService.upsertTodo(newTodo);
    }
  };

  const toggleTodo = (id: string) => {
    const updated = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTodos(updated);
    if (isSupabaseConfigured) {
      const target = updated.find((t) => t.id === id);
      if (target) supabaseService.upsertTodo(target);
    }
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
    if (isSupabaseConfigured) {
      supabaseService.deleteTodo(id);
    }
  };

  // --- REMINDERS STATE & HANDLERS ---
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderType, setNewReminderType] = useState<ReminderType>('exam');
  const [newReminderDateTime, setNewReminderDateTime] = useState('');
  const [newReminderNotes, setNewReminderNotes] = useState('');

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;

    const newReminder: ReminderItem = {
      id: 'rem-' + Date.now(),
      title: newReminderTitle.trim(),
      type: newReminderType,
      dateTime: newReminderDateTime || new Date().toISOString().slice(0, 16).replace('T', ' '),
      notes: newReminderNotes.trim(),
      completed: false
    };

    setReminders([newReminder, ...reminders]);
    setNewReminderTitle('');
    setNewReminderNotes('');
    setNewReminderDateTime('');
    setIsAddingReminder(false);
    if (isSupabaseConfigured) {
      supabaseService.upsertReminder(newReminder);
    }
  };

  const handleAddAndOpenGoogleCalendar = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;

    const newReminder: ReminderItem = {
      id: 'rem-' + Date.now(),
      title: newReminderTitle.trim(),
      type: newReminderType,
      dateTime: newReminderDateTime || new Date().toISOString().slice(0, 16).replace('T', ' '),
      notes: newReminderNotes.trim(),
      completed: false
    };

    setReminders([newReminder, ...reminders]);
    if (isSupabaseConfigured) {
      supabaseService.upsertReminder(newReminder);
    }

    const gcalUrl = createReminderGoogleCalendarUrl(newReminder);
    window.open(gcalUrl, '_blank', 'noopener,noreferrer');

    setNewReminderTitle('');
    setNewReminderNotes('');
    setNewReminderDateTime('');
    setIsAddingReminder(false);
  };

  const toggleReminder = (id: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r));
    setReminders(updated);
    if (isSupabaseConfigured) {
      const target = updated.find((r) => r.id === id);
      if (target) supabaseService.upsertReminder(target);
    }
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
    if (isSupabaseConfigured) {
      supabaseService.deleteReminder(id);
    }
  };

  // Derived counts
  const pendingTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);
  const pendingReminders = reminders.filter((r) => !r.completed);

  // Filtered Notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
      n.content.toLowerCase().includes(noteSearch.toLowerCase()) ||
      (n.tags && n.tags.some((t) => t.toLowerCase().includes(noteSearch.toLowerCase())));
    const matchesCat =
      noteCategoryFilter === 'ALL' ||
      n.category.toLowerCase().includes(noteCategoryFilter.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  // Categories list
  const noteCategories = ['ALL', 'IIT Patna', 'Algorithms', 'Research', 'General'];

  return (
    <div className="c-study-deck">
      {/* Top Deck Navigation Bar */}
      <header className="c-study-nav">
        <div className="c-study-nav__left">
          <button
            onClick={onBackToPortfolio}
            className="c-study-nav__back-btn"
            title="Return to Public Portfolio"
          >
            <ArrowLeft size={16} />
            <span>PORTFOLIO</span>
          </button>
          <div className="c-study-nav__brand">
            <img src="/images/iitp-logo.png" alt="IIT Patna Logo" className="c-study-nav__logo" />
            <div className="c-study-nav__brand-text">
              <span className="c-study-nav__badge">[SECURE CONSOLE]</span>
              <span className="c-study-nav__title">IIT PATNA // M.TECH CSE STUDY TOOLS</span>
            </div>
          </div>
        </div>

        <div className="c-study-nav__center">
          <div className="c-study-nav__clock">
            <span className="c-study-nav__clock-dot" />
            <span>{timeStr || 'PATNA IST'}</span>
          </div>
        </div>

        <div className="c-study-nav__right">
          <div className="c-study-nav__operator">
            <span className="c-study-nav__operator-label">OPERATOR:</span>
            <span className="c-study-nav__operator-val">ADMIN // RITU RAJ</span>
            <span 
              className={`c-study-sync-pill ${isSupabaseConfigured ? 'is-cloud' : 'is-local'}`} 
              title={isSupabaseConfigured ? 'Connected to Supabase PostgreSQL cloud database' : 'Running on local browser storage. Add Supabase keys to .env to enable multi-device Cloud Sync.'}
            >
              {isCloudSyncing ? (
                <span>SYNCING...</span>
              ) : isSupabaseConfigured ? (
                <>
                  <Database size={11} />
                  <span>SUPABASE POSTGRES</span>
                </>
              ) : (
                <>
                  <Cloud size={11} />
                  <span>LOCAL MODE</span>
                </>
              )}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="c-study-nav__logout-btn"
            title="End authenticated session"
          >
            <LogOut size={15} />
            <span>LOCK</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="c-study-deck__container">
        {/* Navigation Tabs */}
        <div className="c-study-tabs">
          <button
            className={`c-study-tab ${activeTab === 'overview' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={16} />
            <span>COMMAND COCKPIT</span>
          </button>

          <button
            className={`c-study-tab ${activeTab === 'timetable' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('timetable')}
          >
            <CalendarDays size={16} />
            <span>CLASS TIMETABLE</span>
            <span className="c-study-tab__count">IITP</span>
          </button>

          <button
            className={`c-study-tab ${activeTab === 'notes' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <BookOpen size={16} />
            <span>RESEARCH NOTES</span>
            <span className="c-study-tab__count">{notes.length}</span>
          </button>

          <button
            className={`c-study-tab ${activeTab === 'todos' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('todos')}
          >
            <CheckSquare size={16} />
            <span>ACADEMIC TASKS</span>
            <span className="c-study-tab__count">{pendingTodos.length}</span>
          </button>

          <button
            className={`c-study-tab ${activeTab === 'reminders' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('reminders')}
          >
            <Bell size={16} />
            <span>EXAMS & DEADLINES</span>
            <span className="c-study-tab__count">{pendingReminders.length}</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW COCKPIT */}
        {activeTab === 'overview' && (
          <div className="c-study-panel animate-fade-in">
            {/* Stats Row */}
            <div className="c-study-stats">
              <div className="c-study-stat-card" onClick={() => setActiveTab('todos')}>
                <div className="c-study-stat-card__top">
                  <span className="c-study-stat-card__label">PENDING TASKS</span>
                  <CheckSquare size={18} className="c-study-stat-card__icon" />
                </div>
                <div className="c-study-stat-card__val">{pendingTodos.length}</div>
                <div className="c-study-stat-card__sub">
                  {completedTodos.length} completed out of {todos.length} total
                </div>
              </div>

              <div className="c-study-stat-card" onClick={() => setActiveTab('notes')}>
                <div className="c-study-stat-card__top">
                  <span className="c-study-stat-card__label">ACTIVE NOTES</span>
                  <BookOpen size={18} className="c-study-stat-card__icon" />
                </div>
                <div className="c-study-stat-card__val">{notes.length}</div>
                <div className="c-study-stat-card__sub">
                  {pinnedNotes.length} pinned to top
                </div>
              </div>

              <div className="c-study-stat-card" onClick={() => setActiveTab('reminders')}>
                <div className="c-study-stat-card__top">
                  <span className="c-study-stat-card__label">UPCOMING DEADLINES</span>
                  <Bell size={18} className="c-study-stat-card__icon" />
                </div>
                <div className="c-study-stat-card__val">{pendingReminders.length}</div>
                <div className="c-study-stat-card__sub">
                  Exams, assignments & thesis check-ins
                </div>
              </div>

              <div className="c-study-stat-card is-highlight">
                <div className="c-study-stat-card__top">
                  <span className="c-study-stat-card__label">ACADEMIC PROGRAM</span>
                  <img src="/images/iitp-logo.png" alt="IIT Patna" className="c-study-card__logo-img" />
                </div>
                <div className="c-study-stat-card__val">M.TECH CSE</div>
                <div className="c-study-stat-card__sub">
                  Indian Institute of Technology Patna (2026-28)
                </div>
              </div>
            </div>

            {/* Quick Overview Grid */}
            <div className="c-study-overview-grid">
              {/* High Priority Tasks Quick Card */}
              <div className="c-study-box">
                <div className="c-study-box__header">
                  <div className="c-study-box__title">
                    <AlertCircle size={16} />
                    <span>PRIORITY FOCUS // TASKS</span>
                  </div>
                  <button
                    className="c-study-btn-sm"
                    onClick={() => {
                      setActiveTab('todos');
                      setIsAddingTodo(true);
                    }}
                  >
                    <Plus size={13} /> ADD TASK
                  </button>
                </div>
                <div className="c-study-box__content">
                  {pendingTodos.length === 0 ? (
                    <div className="c-study-empty">All tasks completed! Great work.</div>
                  ) : (
                    pendingTodos.slice(0, 4).map((todo) => (
                      <div key={todo.id} className="c-study-overview-item">
                        <button
                          className="c-study-check-btn"
                          onClick={() => toggleTodo(todo.id)}
                          aria-label="Toggle todo"
                        >
                          <Circle size={16} />
                        </button>
                        <div className="c-study-overview-item__body">
                          <div className="c-study-overview-item__title">{todo.title}</div>
                          <div className="c-study-overview-item__meta">
                            <span className={`c-priority-tag is-${todo.priority}`}>
                              {todo.priority.toUpperCase()}
                            </span>
                            <span className="c-study-badge">{todo.course || 'CSE'}</span>
                            <span className="c-study-date">DUE: {todo.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Deadlines Quick Card */}
              <div className="c-study-box">
                <div className="c-study-box__header">
                  <div className="c-study-box__title">
                    <Clock size={16} />
                    <span>CRITICAL DEADLINES & EXAMS</span>
                  </div>
                  <button
                    className="c-study-btn-sm"
                    onClick={() => {
                      setActiveTab('reminders');
                      setIsAddingReminder(true);
                    }}
                  >
                    <Plus size={13} /> ADD DEADLINE
                  </button>
                </div>
                <div className="c-study-box__content">
                  {pendingReminders.length === 0 ? (
                    <div className="c-study-empty">No pending deadlines scheduled.</div>
                  ) : (
                    pendingReminders.slice(0, 3).map((rem) => (
                      <div key={rem.id} className="c-study-overview-item">
                        <div className={`c-rem-type-dot is-${rem.type}`} />
                        <div className="c-study-overview-item__body">
                          <div className="c-study-overview-item__title">{rem.title}</div>
                          <div className="c-study-overview-item__meta">
                            <span className="c-study-badge is-accent">
                              {rem.type.toUpperCase()}
                            </span>
                            <span className="c-study-date">{rem.dateTime}</span>
                          </div>
                          {rem.notes && (
                            <div className="c-study-overview-item__note">{rem.notes}</div>
                          )}
                        </div>
                        <a
                          href={createReminderGoogleCalendarUrl(rem)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="c-gcal-mini-link"
                          title="Sync deadline to Google Calendar"
                        >
                          <CalendarPlus size={14} />
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Today's Classes Card */}
              <div className="c-study-box">
                <div className="c-study-box__header">
                  <div className="c-study-box__title">
                    <CalendarDays size={16} />
                    <span>TODAY'S SCHEDULE // {todayDayName}</span>
                  </div>
                  <button
                    className="c-study-btn-sm"
                    onClick={() => {
                      setTimetableDay(todayDayName);
                      setActiveTab('timetable');
                    }}
                  >
                    FULL WEEK
                  </button>
                </div>
                <div className="c-study-box__content">
                  {todayClasses.length === 0 ? (
                    <div className="c-study-empty">No lectures scheduled today. (Self Study / Project)</div>
                  ) : (
                    todayClasses.map((cls) => (
                      <div key={cls.id} className="c-study-overview-item">
                        <div className={`c-rem-type-dot is-${cls.type === 'CORE' ? 'exam' : 'assignment'}`} />
                        <div className="c-study-overview-item__body">
                          <div className="c-study-overview-item__title">{cls.courseName}</div>
                          <div className="c-study-overview-item__meta">
                            <span className="c-study-badge is-accent">{cls.courseCode}</span>
                            <span className={`c-priority-tag is-${cls.type === 'CORE' ? 'high' : 'medium'}`}>
                              {cls.type}
                            </span>
                            <span className="c-study-date">{cls.timeSlot}</span>
                          </div>
                          {cls.faculty && (
                            <div className="c-study-overview-item__note">
                              {cls.faculty} • {cls.credits}
                            </div>
                          )}
                        </div>
                        <a
                          href={createTimetableGoogleCalendarUrl(cls)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="c-gcal-mini-link"
                          title="Add class to Google Calendar"
                        >
                          <CalendarPlus size={14} />
                        </a>
                      </div>
                    ))
                  )}
                  {todayDayName === 'SATURDAY' && (
                    <div className="c-tt-notice-box">
                      <Info size={13} />
                      <span>Note: 02:00 PM – 05:00 PM slot is free / no class.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IIT PATNA TIMETABLE */}
        {activeTab === 'timetable' && (
          <div className="c-study-panel animate-fade-in">
            {/* Header Banner */}
            <div className="c-tt-banner">
              <div className="c-tt-banner__left">
                <img src="/images/iitp-logo.png" alt="IIT Patna" className="c-tt-banner__logo" />
                <div>
                  <div className="c-tt-banner__badge">INDIAN INSTITUTE OF TECHNOLOGY PATNA</div>
                  <h3 className="c-tt-banner__title">Time Table • M.Tech / MS • Semester 1</h3>
                  <p className="c-tt-banner__sub">
                    Selected Elective: <strong>Advanced Cyber Security</strong> (ECS 6101 / ECS 5103)
                  </p>
                </div>
              </div>
              <div className="c-tt-banner__right">
                <span className="c-tt-banner__chip">OFFICIAL 1-PAGE SCHEDULE</span>
                <button
                  type="button"
                  className="c-study-btn-gcal"
                  onClick={() => downloadTimetableIcsFile(weeklyTimetable)}
                  title="Download complete recurring semester schedule (.ics) for Google Calendar"
                >
                  <Download size={14} />
                  <span>EXPORT SCHEDULE TO GOOGLE CALENDAR (.ICS)</span>
                </button>
              </div>
            </div>

            {/* Day Filter Chips */}
            <div className="c-study-panel__header">
              <div className="c-study-filters">
                {['ALL', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((d) => (
                  <button
                    key={d}
                    className={`c-study-filter-chip ${timetableDay === d ? 'is-active' : ''}`}
                    onClick={() => setTimetableDay(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule Cards Grid */}
            <div className="c-tt-grid">
              {weeklyTimetable
                .filter((entry) => timetableDay === 'ALL' || entry.day === timetableDay)
                .map((entry) => (
                  <div key={entry.id} className="c-tt-card">
                    <div className="c-tt-card__top">
                      <span className="c-tt-card__day">{entry.day}</span>
                      <div className="c-tt-card__top-right">
                        <span className="c-tt-card__time">
                          <Clock size={13} />
                          {entry.timeSlot}
                        </span>
                        <a
                          href={createTimetableGoogleCalendarUrl(entry)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="c-gcal-icon-link"
                          title="Add this class to Google Calendar"
                        >
                          <CalendarPlus size={14} />
                        </a>
                      </div>
                    </div>

                    <div className="c-tt-card__body">
                      <h4 className="c-tt-card__course">{entry.courseName}</h4>
                      <div className="c-tt-card__code-wrap">
                        <span className="c-study-badge is-accent">{entry.courseCode}</span>
                        <span
                          className={`c-priority-tag is-${
                            entry.type === 'CORE' ? 'high' : entry.type === 'ELECTIVE' ? 'medium' : 'low'
                          }`}
                        >
                          {entry.type}
                        </span>
                        <span className="c-study-date">{entry.credits}</span>
                      </div>
                      {entry.faculty && (
                        <div className="c-tt-card__faculty">
                          <User size={13} />
                          <span>{entry.faculty}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Saturday Free Slot Alert */}
            {(timetableDay === 'ALL' || timetableDay === 'SATURDAY') && (
              <div className="c-tt-alert">
                <Info size={16} />
                <div>
                  <strong>SATURDAY 02:00 PM – 05:00 PM:</strong> No Class (Free slot / self-study as updated).
                </div>
              </div>
            )}

            {/* Registered Courses & Faculty Summary */}
            <div className="c-tt-summary-wrap">
              <div className="c-tt-summary-header">
                <h4>REGISTERED COURSES & FACULTY SUMMARY</h4>
                <span className="c-study-badge">SEMESTER 1 CURRICULUM</span>
              </div>
              <div className="c-tt-summary-grid">
                {registeredCoursesSummary.map((c) => (
                  <div key={c.code} className="c-tt-summary-card">
                    <div className="c-tt-summary-card__code">{c.code}</div>
                    <div className="c-tt-summary-card__name">{c.name}</div>
                    <div className="c-tt-summary-card__meta">
                      <span className={`c-priority-tag is-${c.type === 'Core' ? 'high' : 'medium'}`}>
                        {c.type.toUpperCase()}
                      </span>
                      <span className="c-study-badge">{c.credits} Credits</span>
                    </div>
                    <div className="c-tt-summary-card__faculty">
                      <User size={13} />
                      <span>{c.faculty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NOTES */}
        {activeTab === 'notes' && (
          <div className="c-study-panel animate-fade-in">
            {/* Header / Controls */}
            <div className="c-study-panel__header">
              <div className="c-study-search-wrap">
                <Search size={16} className="c-study-search-icon" />
                <input
                  type="text"
                  placeholder="Search notes by keyword or tag..."
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  className="c-study-search-input"
                />
              </div>

              <div className="c-study-filters">
                {noteCategories.map((cat) => (
                  <button
                    key={cat}
                    className={`c-study-filter-chip ${
                      noteCategoryFilter === cat ? 'is-active' : ''
                    }`}
                    onClick={() => setNoteCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                className="c-study-btn-primary"
                onClick={() => setIsAddingNote(!isAddingNote)}
              >
                <Plus size={16} />
                <span>{isAddingNote ? 'CANCEL' : 'CREATE NOTE'}</span>
              </button>
            </div>

            {/* Note Creation Form Drawer */}
            {isAddingNote && (
              <form className="c-study-form-card" onSubmit={handleAddNote}>
                <div className="c-study-form-header">
                  <h3>NEW RESEARCH / COURSE NOTE</h3>
                  <span className="c-study-badge">IIT PATNA M.TECH CSE</span>
                </div>

                <div className="c-study-form-grid">
                  <div className="c-study-form-group">
                    <label>NOTE TITLE</label>
                    <input
                      type="text"
                      placeholder="e.g., Cache Coherence Protocols (MESI / MOESI)"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="c-study-form-group">
                    <label>COURSE / CATEGORY</label>
                    <input
                      type="text"
                      placeholder="e.g., Computer Architecture // CS503"
                      value={newNoteCategory}
                      onChange={(e) => setNewNoteCategory(e.target.value)}
                    />
                  </div>

                  <div className="c-study-form-group full-width">
                    <label>TAGS (COMMA SEPARATED)</label>
                    <input
                      type="text"
                      placeholder="Architecture, Cache, Protocols"
                      value={newNoteTags}
                      onChange={(e) => setNewNoteTags(e.target.value)}
                    />
                  </div>

                  <div className="c-study-form-group full-width">
                    <label>NOTE CONTENT & ANALYSIS</label>
                    <textarea
                      rows={5}
                      placeholder="Write your findings, theoretical formulas, algorithm bounds, or notes here..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="c-study-form-actions">
                  <button
                    type="button"
                    className="c-study-btn-secondary"
                    onClick={() => setIsAddingNote(false)}
                  >
                    DISCARD
                  </button>
                  <button type="submit" className="c-study-btn-primary">
                    SAVE TO NOTEBOOK
                  </button>
                </div>
              </form>
            )}

            {/* Notes List */}
            {filteredNotes.length === 0 ? (
              <div className="c-study-empty-card">
                <BookOpen size={36} />
                <p>No notes matching your filter query.</p>
                <button
                  className="c-study-btn-sm"
                  onClick={() => {
                    setNoteSearch('');
                    setNoteCategoryFilter('ALL');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="c-notes-grid">
                {/* Pinned Notes First */}
                {pinnedNotes.map((note) => (
                  <div key={note.id} className="c-note-card is-pinned">
                    <div className="c-note-card__top">
                      <span className="c-note-card__category">{note.category}</span>
                      <div className="c-note-card__actions">
                        <button
                          onClick={() => togglePinNote(note.id)}
                          className="c-note-btn is-pinned"
                          title="Unpin Note"
                        >
                          <Pin size={14} />
                        </button>
                        <button
                          onClick={() => copyNoteContent(note.id, note.content)}
                          className="c-note-btn"
                          title="Copy Content"
                        >
                          {copiedId === note.id ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="c-note-btn is-delete"
                          title="Delete Note"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <h4 className="c-note-card__title">{note.title}</h4>
                    <p className="c-note-card__content">{note.content}</p>

                    <div className="c-note-card__bottom">
                      <div className="c-note-card__tags">
                        {note.tags &&
                          note.tags.map((tag) => (
                            <span key={tag} className="c-note-tag">
                              #{tag}
                            </span>
                          ))}
                      </div>
                      <span className="c-note-card__date">{note.createdAt}</span>
                    </div>
                  </div>
                ))}

                {/* Other Notes */}
                {otherNotes.map((note) => (
                  <div key={note.id} className="c-note-card">
                    <div className="c-note-card__top">
                      <span className="c-note-card__category">{note.category}</span>
                      <div className="c-note-card__actions">
                        <button
                          onClick={() => togglePinNote(note.id)}
                          className="c-note-btn"
                          title="Pin Note to top"
                        >
                          <Pin size={14} />
                        </button>
                        <button
                          onClick={() => copyNoteContent(note.id, note.content)}
                          className="c-note-btn"
                          title="Copy Content"
                        >
                          {copiedId === note.id ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="c-note-btn is-delete"
                          title="Delete Note"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <h4 className="c-note-card__title">{note.title}</h4>
                    <p className="c-note-card__content">{note.content}</p>

                    <div className="c-note-card__bottom">
                      <div className="c-note-card__tags">
                        {note.tags &&
                          note.tags.map((tag) => (
                            <span key={tag} className="c-note-tag">
                              #{tag}
                            </span>
                          ))}
                      </div>
                      <span className="c-note-card__date">{note.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TO-DO TASKS */}
        {activeTab === 'todos' && (
          <div className="c-study-panel animate-fade-in">
            {/* Header / Controls */}
            <div className="c-study-panel__header">
              <div className="c-study-filters">
                <button
                  className={`c-study-filter-chip ${todoFilter === 'all' ? 'is-active' : ''}`}
                  onClick={() => setTodoFilter('all')}
                >
                  ALL ({todos.length})
                </button>
                <button
                  className={`c-study-filter-chip ${
                    todoFilter === 'pending' ? 'is-active' : ''
                  }`}
                  onClick={() => setTodoFilter('pending')}
                >
                  ACTIVE ({pendingTodos.length})
                </button>
                <button
                  className={`c-study-filter-chip ${
                    todoFilter === 'completed' ? 'is-active' : ''
                  }`}
                  onClick={() => setTodoFilter('completed')}
                >
                  COMPLETED ({completedTodos.length})
                </button>
              </div>

              {/* Progress Bar */}
              <div className="c-study-progress-wrap">
                <span className="c-study-progress-label">
                  {todos.length > 0
                    ? `${Math.round((completedTodos.length / todos.length) * 100)}% COMPLETE`
                    : '0%'}
                </span>
                <div className="c-study-progress-track">
                  <div
                    className="c-study-progress-fill"
                    style={{
                      width: `${
                        todos.length > 0
                          ? Math.round((completedTodos.length / todos.length) * 100)
                          : 0
                      }%`
                    }}
                  />
                </div>
              </div>

              <button
                className="c-study-btn-primary"
                onClick={() => setIsAddingTodo(!isAddingTodo)}
              >
                <Plus size={16} />
                <span>{isAddingTodo ? 'CANCEL' : 'ADD TASK'}</span>
              </button>
            </div>

            {/* Todo Creation Form */}
            {isAddingTodo && (
              <form className="c-study-form-card" onSubmit={handleAddTodo}>
                <div className="c-study-form-header">
                  <h3>NEW ACADEMIC TO-DO ITEM</h3>
                  <span className="c-study-badge">IIT PATNA CSE</span>
                </div>

                <div className="c-study-form-grid">
                  <div className="c-study-form-group full-width">
                    <label>TASK DESCRIPTION</label>
                    <input
                      type="text"
                      placeholder="e.g. Implement Raft Consensus Algorithm in Go or Python"
                      value={newTodoTitle}
                      onChange={(e) => setNewTodoTitle(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="c-study-form-group">
                    <label>COURSE / MODULE</label>
                    <input
                      type="text"
                      placeholder="CS502 / Thesis / Seminar"
                      value={newTodoCourse}
                      onChange={(e) => setNewTodoCourse(e.target.value)}
                    />
                  </div>

                  <div className="c-study-form-group">
                    <label>PRIORITY LEVEL</label>
                    <select
                      value={newTodoPriority}
                      onChange={(e) => setNewTodoPriority(e.target.value as TodoPriority)}
                      className="c-study-select"
                    >
                      <option value="high">HIGH PRIORITY (CRITICAL)</option>
                      <option value="medium">MEDIUM PRIORITY (NORMAL)</option>
                      <option value="low">LOW PRIORITY (BACKLOG)</option>
                    </select>
                  </div>

                  <div className="c-study-form-group">
                    <label>DUE DATE</label>
                    <input
                      type="date"
                      value={newTodoDueDate}
                      onChange={(e) => setNewTodoDueDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="c-study-form-actions">
                  <button
                    type="button"
                    className="c-study-btn-secondary"
                    onClick={() => setIsAddingTodo(false)}
                  >
                    DISCARD
                  </button>
                  <button type="submit" className="c-study-btn-primary">
                    RECORD TASK
                  </button>
                </div>
              </form>
            )}

            {/* Todo List */}
            <div className="c-todo-list">
              {todos
                .filter((t) => {
                  if (todoFilter === 'pending') return !t.completed;
                  if (todoFilter === 'completed') return t.completed;
                  return true;
                })
                .map((todo) => (
                  <div
                    key={todo.id}
                    className={`c-todo-row ${todo.completed ? 'is-completed' : ''}`}
                  >
                    <button
                      className="c-todo-row__toggle"
                      onClick={() => toggleTodo(todo.id)}
                      aria-label="Toggle task completion"
                    >
                      {todo.completed ? (
                        <CheckCircle2 size={18} className="c-todo-check-icon is-done" />
                      ) : (
                        <Circle size={18} className="c-todo-check-icon" />
                      )}
                    </button>

                    <div className="c-todo-row__body">
                      <div className="c-todo-row__title">{todo.title}</div>
                      <div className="c-todo-row__meta">
                        <span className={`c-priority-tag is-${todo.priority}`}>
                          {todo.priority.toUpperCase()}
                        </span>
                        {todo.course && (
                          <span className="c-study-badge">{todo.course}</span>
                        )}
                        <span className="c-study-date">
                          <Calendar size={12} />
                          {todo.dueDate}
                        </span>
                      </div>
                    </div>

                    <div className="c-todo-row__actions">
                      <a
                        href={createTodoGoogleCalendarUrl(todo)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="c-todo-row__gcal"
                        title="Add task deadline to Google Calendar"
                      >
                        <CalendarPlus size={15} />
                      </a>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="c-todo-row__delete"
                        title="Remove task"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}

              {todos.length === 0 && (
                <div className="c-study-empty-card">
                  <CheckSquare size={36} />
                  <p>Your task list is empty. Add a study or research task above!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: REMINDERS & EXAM DEADLINES */}
        {activeTab === 'reminders' && (
          <div className="c-study-panel animate-fade-in">
            {/* Header / Controls */}
            <div className="c-study-panel__header">
              <div className="c-study-filters">
                <span className="c-study-title-tag">
                  IIT PATNA TIMELINE // CRITICAL NOTIFICATIONS
                </span>
              </div>

              <button
                className="c-study-btn-primary"
                onClick={() => setIsAddingReminder(!isAddingReminder)}
              >
                <Plus size={16} />
                <span>{isAddingReminder ? 'CANCEL' : 'ADD REMINDER'}</span>
              </button>
            </div>

            {/* Reminder Creation Form */}
            {isAddingReminder && (
              <form className="c-study-form-card" onSubmit={handleAddReminder}>
                <div className="c-study-form-header">
                  <h3>NEW ACADEMIC REMINDER / DEADLINE</h3>
                  <span className="c-study-badge">CALENDAR SYNC</span>
                </div>

                <div className="c-study-form-grid">
                  <div className="c-study-form-group full-width">
                    <label>EVENT / DEADLINE TITLE</label>
                    <input
                      type="text"
                      placeholder="e.g., End-Semester Examination: Advanced Operating Systems"
                      value={newReminderTitle}
                      onChange={(e) => setNewReminderTitle(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="c-study-form-group">
                    <label>EVENT CATEGORY</label>
                    <select
                      value={newReminderType}
                      onChange={(e) => setNewReminderType(e.target.value as ReminderType)}
                      className="c-study-select"
                    >
                      <option value="exam">EXAMINATION</option>
                      <option value="assignment">ASSIGNMENT SUBMISSION</option>
                      <option value="lab">LAB EVALUATION / VIVA</option>
                      <option value="meeting">THESIS / ADVISOR MEETING</option>
                      <option value="deadline">GENERAL DEADLINE</option>
                    </select>
                  </div>

                  <div className="c-study-form-group">
                    <label>DATE & TIME</label>
                    <input
                      type="text"
                      placeholder="2026-10-15 10:00"
                      value={newReminderDateTime}
                      onChange={(e) => setNewReminderDateTime(e.target.value)}
                      required
                    />
                  </div>

                  <div className="c-study-form-group full-width">
                    <label>ROOM / VENUE / NOTES</label>
                    <input
                      type="text"
                      placeholder="e.g., Main Auditorium, IIT Patna / Bring Calculator"
                      value={newReminderNotes}
                      onChange={(e) => setNewReminderNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="c-study-form-actions">
                  <button
                    type="button"
                    className="c-study-btn-secondary"
                    onClick={() => setIsAddingReminder(false)}
                  >
                    DISCARD
                  </button>
                  <button
                    type="button"
                    className="c-study-btn-gcal"
                    onClick={handleAddAndOpenGoogleCalendar}
                    title="Save reminder and open in Google Calendar"
                  >
                    <CalendarPlus size={14} />
                    <span>SAVE & SYNC TO GOOGLE CALENDAR</span>
                  </button>
                  <button type="submit" className="c-study-btn-primary">
                    SCHEDULE REMINDER
                  </button>
                </div>
              </form>
            )}

            {/* Reminders List */}
            <div className="c-reminders-grid">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className={`c-reminder-card ${rem.completed ? 'is-completed' : ''}`}
                >
                  <div className="c-reminder-card__top">
                    <div className="c-reminder-card__badge-wrap">
                      <span className={`c-rem-type-badge is-${rem.type}`}>
                        {rem.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="c-reminder-card__actions">
                      <a
                        href={createReminderGoogleCalendarUrl(rem)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="c-rem-action-btn c-gcal-link"
                        title="Sync deadline to Google Calendar"
                      >
                        <CalendarPlus size={16} />
                      </a>
                      <button
                        onClick={() => toggleReminder(rem.id)}
                        className={`c-rem-action-btn ${rem.completed ? 'is-done' : ''}`}
                        title={rem.completed ? 'Mark uncompleted' : 'Mark completed'}
                      >
                        {rem.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </button>
                      <button
                        onClick={() => deleteReminder(rem.id)}
                        className="c-rem-action-btn is-delete"
                        title="Delete reminder"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h4 className="c-reminder-card__title">{rem.title}</h4>

                  <div className="c-reminder-card__time">
                    <Clock size={14} />
                    <span>{rem.dateTime}</span>
                  </div>

                  {rem.notes && (
                    <p className="c-reminder-card__notes">{rem.notes}</p>
                  )}

                  <div className="c-reminder-card__footer">
                    <span className="c-study-badge">IIT PATNA CSE</span>
                    <span className="c-reminder-card__status">
                      {rem.completed ? 'RESOLVED' : 'SCHEDULED'}
                    </span>
                  </div>
                </div>
              ))}

              {reminders.length === 0 && (
                <div className="c-study-empty-card">
                  <Bell size={36} />
                  <p>No reminders scheduled. Keep your calendar organized by adding one!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
