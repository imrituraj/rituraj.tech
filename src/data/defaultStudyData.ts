import { NoteItem, TodoItem, ReminderItem } from '../types/study';

export const initialNotes: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Advanced Operating Systems - Virtual Memory & Page Replacement',
    content: 'Review demand paging algorithms: Working Set Model, Clock algorithm, and Page Fault Frequency (PFF). Compare Linux CFS (Completely Fair Scheduler) with FreeBSD ULE scheduler for multi-core scaling.',
    category: 'M.Tech CSE // IIT Patna',
    tags: ['AOS', 'Kernels', 'Virtual Memory'],
    createdAt: '2026-08-15',
    isPinned: true
  },
  {
    id: 'note-2',
    title: 'Distributed Systems Consensus - Raft vs Paxos',
    content: 'Key invariants in Raft: Election Safety, Leader Append-Only, Log Matching, Leader Completeness, State Machine Safety. Term numbers act as logical clocks. Heartbeat interval: 50-100ms, Election timeout: 150-300ms.',
    category: 'Algorithms & Systems',
    tags: ['Distributed', 'Raft', 'Consensus'],
    createdAt: '2026-08-22',
    isPinned: true
  },
  {
    id: 'note-3',
    title: 'Machine Learning Research Directions - Graph Neural Networks',
    content: 'Investigate Message Passing Neural Networks (MPNN) on sparse citation graphs. Look into Weisfeiler-Lehman graph isomorphism test bounds on GNN expressive power.',
    category: 'Research & Papers',
    tags: ['GNN', 'Deep Learning', 'PyTorch'],
    createdAt: '2026-09-02',
    isPinned: false
  }
];

export const initialTodos: TodoItem[] = [
  {
    id: 'todo-1',
    title: 'Complete Distributed Systems Lab 3: Raft Leader Election',
    completed: false,
    priority: 'high',
    dueDate: '2026-09-25',
    course: 'CS502',
    createdAt: '2026-09-18'
  },
  {
    id: 'todo-2',
    title: 'Review IEEE S&P Paper: Microarchitectural Side-Channel Attacks',
    completed: false,
    priority: 'medium',
    dueDate: '2026-09-28',
    course: 'CS518',
    createdAt: '2026-09-17'
  },
  {
    id: 'todo-3',
    title: 'Submit IIT Patna Seminar Proposal on LLM Quantization Techniques',
    completed: false,
    priority: 'high',
    dueDate: '2026-10-05',
    course: 'Seminar',
    createdAt: '2026-09-16'
  },
  {
    id: 'todo-4',
    title: 'Set up CUDA 12 environment on server cluster',
    completed: true,
    priority: 'low',
    dueDate: '2026-09-12',
    course: 'Lab Setup',
    createdAt: '2026-09-10'
  }
];

export const initialReminders: ReminderItem[] = [
  {
    id: 'rem-1',
    title: 'CS502 Distributed Systems Mid-Term Exam',
    dateTime: '2026-10-14 09:30',
    type: 'exam',
    completed: false,
    notes: 'Department Auditorium, IIT Patna. Covers Raft, Vector Clocks & Byzantine Fault Tolerance.'
  },
  {
    id: 'rem-2',
    title: 'Advanced Algorithms Problem Set 2 Submission',
    dateTime: '2026-09-30 23:59',
    type: 'assignment',
    completed: false,
    notes: 'Upload PDF and code archive to Moodle portal.'
  },
  {
    id: 'rem-3',
    title: 'M.Tech Thesis Advisor Weekly Sync',
    dateTime: '2026-09-24 16:00',
    type: 'meeting',
    completed: false,
    notes: 'Faculty cabin #304, Academic Block 4.'
  }
];
