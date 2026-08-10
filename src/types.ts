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
  targetHours: number; // e.g. 3.5 for 3h 30m
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

export type MainViewMode = 'showcase' | 'app' | 'mobile-preview';
export type AppTabMode = 'dashboard' | 'tasks' | 'focus' | 'stats' | 'goals' | 'schedule' | 'settings';
