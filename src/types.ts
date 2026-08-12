export type Priority = 'High' | 'Medium' | 'Low';

export type TaskStatus = 'Pending' | 'Completed';

export interface Task {
  id: string;
  title: string;
  subject: string;
  priority: Priority;
  status: TaskStatus;
  estimatedMinutes: number;
  dueDate?: string;
  completedAt?: string;
}

export interface PomodoroSession {
  id: string;
  subject: string;
  durationMinutes: number;
  completedAt: string;
  type: 'Focus' | 'Short Break' | 'Long Break';
}

export interface ScheduleItem {
  id: string;
  time: string;
  subject: string;
  description: string;
  completed: boolean;
}

export interface DailyGoal {
  targetHours: number; // e.g. 3.0
  targetTasks: number;
  targetSessions: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  isGuest: boolean;
  avatarUrl?: string;
  major?: string;
  avatarBg?: string;
  role?: string;
  password?: string;
  registeredAt?: string;
}

export interface StreakDay {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  completed: boolean;
  hoursStudied: number;
}

export type TimerMode = 'Focus' | 'Short Break' | 'Long Break';

export type MainViewMode = 'showcase' | 'app';
export type AppTabMode = 'dashboard' | 'tasks' | 'focus' | 'stats' | 'goals' | 'schedule' | 'settings';

// Preferences Interfaces matching user request screenshot
export interface FocusPreferences {
  defaultFocusDuration: number; // in minutes (e.g., 25)
  shortBreakDuration: number; // in minutes (e.g., 5)
  longBreakDuration: number; // in minutes (e.g., 15)
  sessionsBeforeLongBreak: number; // e.g., 4
  autoStartNextSession: boolean;
}

export interface NotificationPreferences {
  focusReminders: boolean;
  breakAlerts: boolean;
  dailyGoalReminder: boolean;
  motivationalQuotes: boolean;
}

export type ThemeOption = 'light' | 'dark' | 'system';

export interface SoundHapticsPreferences {
  sessionStartSound: boolean;
  sessionEndSound: boolean;
  hapticFeedback: boolean;
}

export interface UserPreferences {
  focus: FocusPreferences;
  notifications: NotificationPreferences;
  theme: ThemeOption;
  soundHaptics: SoundHapticsPreferences;
  showMascot: boolean;
}
