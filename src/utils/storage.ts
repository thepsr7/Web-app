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

export const INITIAL_USERS: UserProfile[] = [];

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_SCHEDULE: ScheduleItem[] = [];

export const INITIAL_GOAL: DailyGoal = {
  targetHours: 3.0,
  targetTasks: 5,
  targetSessions: 4,
};

export const INITIAL_USER: UserProfile = {
  id: '',
  name: 'Student User',
  email: '',
  isLoggedIn: false,
  isGuest: false,
};

export const INITIAL_STREAK: StreakDay[] = [
  { day: 'Mon', completed: false, hoursStudied: 0 },
  { day: 'Tue', completed: false, hoursStudied: 0 },
  { day: 'Wed', completed: false, hoursStudied: 0 },
  { day: 'Thu', completed: false, hoursStudied: 0 },
  { day: 'Fri', completed: false, hoursStudied: 0 },
  { day: 'Sat', completed: false, hoursStudied: 0 },
  { day: 'Sun', completed: false, hoursStudied: 0 },
];

export const INITIAL_SESSIONS: PomodoroSession[] = [];

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
