import { Task, ScheduleItem, DailyGoal, UserProfile, StreakDay, PomodoroSession } from '../types';

const STORAGE_KEYS = {
  TASKS: 'study_os_tasks',
  SESSIONS: 'study_os_sessions',
  SCHEDULE: 'study_os_schedule',
  GOAL: 'study_os_goal',
  USER: 'study_os_user',
  USERS_LIST: 'study_os_users_list',
  STREAK: 'study_os_streak',
  THEME: 'study_os_theme',
};

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Prem Singh Rajput',
    email: 'prem.singh@student.edu',
    isLoggedIn: false,
    isGuest: false,
    major: 'Computer Science & AI',
    role: 'Lead Developer',
    password: 'password123',
    registeredAt: '2024-01-15',
  },
  {
    id: 'usr-2',
    name: 'Sarah Chen',
    email: 'sarah.c@biology.edu',
    isLoggedIn: false,
    isGuest: false,
    major: 'Bioengineering',
    role: 'Honor Student',
    password: 'password123',
    registeredAt: '2024-02-01',
  },
  {
    id: 'usr-3',
    name: 'Alex Rivers',
    email: 'alex.rivers@mit.edu',
    isLoggedIn: false,
    isGuest: false,
    major: 'Mechanical Engineering',
    role: 'Research Scholar',
    password: 'password123',
    registeredAt: '2024-03-10',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Physics Assignment',
    subject: 'Physics',
    priority: 'High',
    status: 'Completed',
    estimatedMinutes: 45,
    completedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Math Homework',
    subject: 'Mathematics',
    priority: 'Medium',
    status: 'Pending',
    estimatedMinutes: 60,
  },
  {
    id: '3',
    title: 'Chemistry Revision',
    subject: 'Chemistry',
    priority: 'Medium',
    status: 'Pending',
    estimatedMinutes: 30,
  },
  {
    id: '4',
    title: 'Read Chapter 5',
    subject: 'Physics',
    priority: 'Low',
    status: 'Pending',
    estimatedMinutes: 40,
  },
  {
    id: '5',
    title: 'Computer Science Algorithm Practice',
    subject: 'Computer Science',
    priority: 'High',
    status: 'Completed',
    estimatedMinutes: 50,
  },
  {
    id: '6',
    title: 'Literature Essay Outline',
    subject: 'Literature',
    priority: 'Low',
    status: 'Completed',
    estimatedMinutes: 30,
  },
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  { id: '1', time: '04:00 PM', subject: 'Physics', description: 'Quantum mechanics & electromagnetism notes', completed: true },
  { id: '2', time: '05:30 PM', subject: 'Mathematics', description: 'Differential equations & matrix algebra', completed: false },
  { id: '3', time: '07:00 PM', subject: 'Chemistry', description: 'Organic chemistry reactions review', completed: false },
  { id: '4', time: '08:30 PM', subject: 'Self Study', description: 'Review weekly progress & plan tomorrow', completed: false },
];

export const INITIAL_GOAL: DailyGoal = {
  targetHours: 3.5, // 3h 30m
  targetTasks: 6,
  targetSessions: 5,
};

export const INITIAL_USER: UserProfile = {
  id: 'psr-01',
  name: 'Prem Singh Rajput',
  email: 'prem.singh@student.edu',
  isLoggedIn: true,
  isGuest: false,
};

export const INITIAL_STREAK: StreakDay[] = [
  { day: 'Mon', completed: true, hoursStudied: 3.2 },
  { day: 'Tue', completed: true, hoursStudied: 4.0 },
  { day: 'Wed', completed: true, hoursStudied: 2.8 },
  { day: 'Thu', completed: true, hoursStudied: 3.5 },
  { day: 'Fri', completed: true, hoursStudied: 2.58 }, // ~ 2h 35m
  { day: 'Sat', completed: false, hoursStudied: 0 },
  { day: 'Sun', completed: false, hoursStudied: 0 },
];

export const INITIAL_SESSIONS: PomodoroSession[] = [
  { id: 's1', subject: 'Physics', durationMinutes: 25, completedAt: 'Today, 02:15 PM', type: 'Focus' },
  { id: 's2', subject: 'Physics', durationMinutes: 25, completedAt: 'Today, 03:00 PM', type: 'Focus' },
  { id: 's3', subject: 'Mathematics', durationMinutes: 25, completedAt: 'Today, 04:30 PM', type: 'Focus' },
];

// Helper functions for reading & saving to localStorage
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error loading key ${key} from storage:`, e);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error saving key ${key} to storage:`, e);
  }
}

export { STORAGE_KEYS };
