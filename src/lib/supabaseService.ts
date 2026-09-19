import { supabase, isSupabaseConfigured } from './supabaseClient';
import { NoteItem, TodoItem, ReminderItem } from '../types/study';

export const supabaseService = {
  // NOTES
  async getNotes(): Promise<NoteItem[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('study_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase getNotes warning:', error.message);
        return null;
      }
      if (!data || data.length === 0) return null;

      return data.map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        category: row.category,
        tags: row.tags || [],
        createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        updatedAt: row.updated_at ? row.updated_at.split('T')[0] : undefined,
        isPinned: Boolean(row.is_pinned)
      }));
    } catch (err) {
      console.warn('Failed to fetch notes from Supabase:', err);
      return null;
    }
  },

  async upsertNote(note: NoteItem) {
    if (!isSupabaseConfigured) return;
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const payload: Record<string, unknown> = {
        user_id: user.id,
        title: note.title,
        content: note.content,
        category: note.category,
        tags: note.tags || [],
        is_pinned: Boolean(note.isPinned),
        updated_at: new Date().toISOString()
      };

      // If note.id is a valid UUID, include it for update
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(note.id)) {
        payload.id = note.id;
      }

      await supabase.from('study_notes').upsert(payload);
    } catch (err) {
      console.warn('Failed to upsert note in Supabase:', err);
    }
  },

  async deleteNote(id: string) {
    if (!isSupabaseConfigured) return;
    try {
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        await supabase.from('study_notes').delete().eq('id', id);
      }
    } catch (err) {
      console.warn('Failed to delete note from Supabase:', err);
    }
  },

  // TODOS
  async getTodos(): Promise<TodoItem[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('study_todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase getTodos warning:', error.message);
        return null;
      }
      if (!data || data.length === 0) return null;

      return data.map((row) => ({
        id: row.id,
        title: row.title,
        completed: Boolean(row.completed),
        priority: row.priority || 'medium',
        dueDate: row.due_date || '',
        course: row.course || '',
        createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
      }));
    } catch (err) {
      console.warn('Failed to fetch todos from Supabase:', err);
      return null;
    }
  },

  async upsertTodo(todo: TodoItem) {
    if (!isSupabaseConfigured) return;
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const payload: Record<string, unknown> = {
        user_id: user.id,
        title: todo.title,
        completed: todo.completed,
        priority: todo.priority,
        due_date: todo.dueDate,
        course: todo.course
      };

      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(todo.id)) {
        payload.id = todo.id;
      }

      await supabase.from('study_todos').upsert(payload);
    } catch (err) {
      console.warn('Failed to upsert todo in Supabase:', err);
    }
  },

  async deleteTodo(id: string) {
    if (!isSupabaseConfigured) return;
    try {
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        await supabase.from('study_todos').delete().eq('id', id);
      }
    } catch (err) {
      console.warn('Failed to delete todo from Supabase:', err);
    }
  },

  // REMINDERS
  async getReminders(): Promise<ReminderItem[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('study_reminders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase getReminders warning:', error.message);
        return null;
      }
      if (!data || data.length === 0) return null;

      return data.map((row) => ({
        id: row.id,
        title: row.title,
        dateTime: row.date_time,
        type: row.type || 'deadline',
        completed: Boolean(row.completed),
        notes: row.notes || ''
      }));
    } catch (err) {
      console.warn('Failed to fetch reminders from Supabase:', err);
      return null;
    }
  },

  async upsertReminder(reminder: ReminderItem) {
    if (!isSupabaseConfigured) return;
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const payload: Record<string, unknown> = {
        user_id: user.id,
        title: reminder.title,
        date_time: reminder.dateTime,
        type: reminder.type,
        completed: reminder.completed,
        notes: reminder.notes
      };

      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(reminder.id)) {
        payload.id = reminder.id;
      }

      await supabase.from('study_reminders').upsert(payload);
    } catch (err) {
      console.warn('Failed to upsert reminder in Supabase:', err);
    }
  },

  async deleteReminder(id: string) {
    if (!isSupabaseConfigured) return;
    try {
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        await supabase.from('study_reminders').delete().eq('id', id);
      }
    } catch (err) {
      console.warn('Failed to delete reminder from Supabase:', err);
    }
  }
};
