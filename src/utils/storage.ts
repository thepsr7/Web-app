import { Task, ScheduleItem, DailyGoal, UserProfile, StreakDay, PomodoroSession, UserPreferences } from '../types';

const STORAGE_KEYS = {
  TASKS: 'study_os_zero_tasks',
  SESSIONS: 'study_os_zero_sessions',
  SCHEDULE: 'study_os_zero_schedule',
  GOAL: 'study_os_zero_goal',
  USER: 'study_os_zero_user',
  USERS_LIST: 'study_os_zero_users_list',
  STREAK: 'study_os_zero_streak',
  THEME: 'study_os_zero_theme',
  PREFERENCES: 'study_os_zero_preferences',
};

export const INITIAL_USER: UserProfile = {
  id: 'usr_psr',
  name: 'PSR',
  email: 'psr@student.edu',
  isLoggedIn: true,
  isGuest: false,
  major: 'Computer Science & Engineering',
};

export const INITIAL_USERS: UserProfile[] = [INITIAL_USER];

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_SCHEDULE: ScheduleItem[] = [];

export const INITIAL_GOAL: DailyGoal = {
  targetHours: 3.0,
  targetTasks: 5,
  targetSessions: 4,
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

export const INITIAL_PREFERENCES: UserPreferences = {
  focus: {
    defaultFocusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    autoStartNextSession: true,
  },
  notifications: {
    focusReminders: true,
    breakAlerts: true,
    dailyGoalReminder: true,
    motivationalQuotes: true,
  },
  theme: 'dark',
  soundHaptics: {
    sessionStartSound: true,
    sessionEndSound: true,
    hapticFeedback: true,
  },
  showMascot: true,
};

// Helper functions for reading & saving to localStorage
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (parsed && typeof parsed === 'object' && typeof fallback === 'object' && !Array.isArray(fallback)) {
      const merged: Record<string, any> = { ...fallback, ...parsed };
      for (const k of Object.keys(fallback as Record<string, any>)) {
        const fbVal = (fallback as Record<string, any>)[k];
        const prsVal = (parsed as Record<string, any>)[k];
        if (fbVal && typeof fbVal === 'object' && fbVal !== null && !Array.isArray(fbVal)) {
          merged[k] = { ...fbVal, ...(prsVal && typeof prsVal === 'object' ? prsVal : {}) };
        }
      }
      return merged as T;
    }
    return parsed ?? fallback;
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
