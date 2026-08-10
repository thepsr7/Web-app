import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, PomodoroSession, ScheduleItem, DailyGoal, UserProfile, StreakDay, MainViewMode, AppTabMode, TimerMode } from '../types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS, INITIAL_TASKS, INITIAL_SCHEDULE, INITIAL_GOAL, INITIAL_USER, INITIAL_STREAK, INITIAL_SESSIONS, INITIAL_USERS } from '../utils/storage';
import { playChime } from '../utils/audio';

export interface AuthResult {
  success: boolean;
  error?: string;
  message?: string;
}

interface AppContextType {
  // Navigation & Theme
  mainView: MainViewMode;
  setMainView: (view: MainViewMode) => void;
  activeTab: AppTabMode;
  setActiveTab: (tab: AppTabMode) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  editTask: (id: string, updated: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  
  // Schedule
  schedule: ScheduleItem[];
  addScheduleItem: (item: Omit<ScheduleItem, 'id' | 'completed'>) => void;
  toggleScheduleItem: (id: string) => void;
  deleteScheduleItem: (id: string) => void;

  // Goals
  goal: DailyGoal;
  updateGoal: (newGoal: Partial<DailyGoal>) => void;

  // Streak
  streakDays: StreakDay[];
  currentStreak: number;

  // Sessions & Timer
  sessions: PomodoroSession[];
  timerMode: TimerMode;
  setTimerMode: (mode: TimerMode) => void;
  timerSubject: string;
  setTimerSubject: (subject: string) => void;
  timerSecondsLeft: number;
  isTimerRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  completedSessionsToday: number;

  // User Profile & Auth
  user: UserProfile;
  registeredUsers: UserProfile[];
  login: (email: string, password?: string) => AuthResult;
  signup: (name: string, email: string, password?: string, major?: string) => AuthResult;
  loginAsGuest: () => void;
  quickLoginUser: (userId: string) => void;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  resetPassword: (email: string, newPass: string) => AuthResult;
  isAuthModalOpen: boolean;
  openAuthModal: (initialMode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'signup';

  // Derived Stats
  totalStudyMinutesToday: number;
  progressPercentage: number;
  totalTasksCompleted: number;

  // Reset to default sample data
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const TIMER_PRESETS: Record<TimerMode, number> = {
  'Focus': 25 * 60,
  'Short Break': 5 * 60,
  'Long Break': 15 * 60,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Theme
  const [mainView, setMainView] = useState<MainViewMode>('showcase');
  const [activeTab, setActiveTab] = useState<AppTabMode>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => loadFromStorage(STORAGE_KEYS.THEME, true));

  // Data States
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS));
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => loadFromStorage(STORAGE_KEYS.SCHEDULE, INITIAL_SCHEDULE));
  const [goal, setGoal] = useState<DailyGoal>(() => loadFromStorage(STORAGE_KEYS.GOAL, INITIAL_GOAL));
  const [user, setUser] = useState<UserProfile>(() => loadFromStorage(STORAGE_KEYS.USER, INITIAL_USER));
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => loadFromStorage(STORAGE_KEYS.USERS_LIST, INITIAL_USERS));
  const [streakDays, setStreakDays] = useState<StreakDay[]>(() => loadFromStorage(STORAGE_KEYS.STREAK, INITIAL_STREAK));
  const [sessions, setSessions] = useState<PomodoroSession[]>(() => loadFromStorage(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS));

  // Timer State
  const [timerMode, setTimerModeState] = useState<TimerMode>('Focus');
  const [timerSubject, setTimerSubject] = useState<string>('Physics');
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(TIMER_PRESETS['Focus']);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Persistence Effects
  useEffect(() => { saveToStorage(STORAGE_KEYS.THEME, isDarkMode); }, [isDarkMode]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TASKS, tasks); }, [tasks]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.SCHEDULE, schedule); }, [schedule]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.GOAL, goal); }, [goal]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.USER, user); }, [user]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.USERS_LIST, registeredUsers); }, [registeredUsers]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.STREAK, streakDays); }, [streakDays]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.SESSIONS, sessions); }, [sessions]);

  // Handle dark mode class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Pomodoro Countdown effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timerSecondsLeft === 0) {
      setIsTimerRunning(false);
      playChime('complete');
      
      if (timerMode === 'Focus') {
        const newSession: PomodoroSession = {
          id: Date.now().toString(),
          subject: timerSubject || 'General Study',
          durationMinutes: 25,
          completedAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          type: 'Focus',
        };
        setSessions(prev => [newSession, ...prev]);

        setStreakDays(prev => prev.map(d => {
          if (d.day === 'Fri') {
            return { ...d, hoursStudied: Number((d.hoursStudied + 0.416).toFixed(2)), completed: true };
          }
          return d;
        }));
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsLeft, timerMode, timerSubject]);

  // Actions
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const setTimerMode = (mode: TimerMode) => {
    setTimerModeState(mode);
    setIsTimerRunning(false);
    setTimerSecondsLeft(TIMER_PRESETS[mode]);
  };

  const startTimer = () => {
    playChime('start');
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    playChime('click');
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    playChime('click');
    setIsTimerRunning(false);
    setTimerSecondsLeft(TIMER_PRESETS[timerMode]);
  };

  const addTask = (newTaskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now().toString(),
    };
    setTasks(prev => [newTask, ...prev]);
    playChime('click');
  };

  const editTask = (id: string, updated: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    playChime('click');
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isComp = t.status === 'Completed';
        return {
          ...t,
          status: isComp ? 'Pending' : 'Completed',
          completedAt: !isComp ? new Date().toISOString() : undefined,
        };
      }
      return t;
    }));
  };

  const addScheduleItem = (item: Omit<ScheduleItem, 'id' | 'completed'>) => {
    const newItem: ScheduleItem = {
      ...item,
      id: Date.now().toString(),
      completed: false,
    };
    setSchedule(prev => [...prev, newItem]);
    playChime('click');
  };

  const toggleScheduleItem = (id: string) => {
    setSchedule(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const deleteScheduleItem = (id: string) => {
    setSchedule(prev => prev.filter(s => s.id !== id));
  };

  const updateGoal = (newGoal: Partial<DailyGoal>) => {
    setGoal(prev => ({ ...prev, ...newGoal }));
  };

  // Auth Methods
  const login = (email: string, password?: string): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check against registered users
    const existingUser = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (existingUser) {
      if (password && existingUser.password && existingUser.password !== password) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      const activeUser: UserProfile = {
        ...existingUser,
        isLoggedIn: true,
        isGuest: false,
      };

      setUser(activeUser);
      setMainView('app');
      setIsAuthModalOpen(false);
      playChime('click');
      return { success: true, message: `Welcome back, ${existingUser.name}!` };
    }

    // Default fallback for unregistered email
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0].replace('.', ' ') || 'Student User',
      email: cleanEmail,
      isLoggedIn: true,
      isGuest: false,
      major: 'Computer Science',
      password: password || 'password123',
    };

    setUser(newUser);
    setRegisteredUsers(prev => [...prev, newUser]);
    setMainView('app');
    setIsAuthModalOpen(false);
    playChime('click');
    return { success: true, message: 'Account created & logged in!' };
  };

  const signup = (name: string, email: string, password?: string, major?: string): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName) {
      return { success: false, error: 'Please provide your full name.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (password && password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Check duplicate email
    const duplicate = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (duplicate) {
      return { success: false, error: 'An account with this email address already exists. Please log in instead.' };
    }

    const newUserProfile: UserProfile = {
      id: 'usr-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      isLoggedIn: true,
      isGuest: false,
      major: major || 'General Studies',
      role: 'Student Member',
      password: password || 'password123',
      registeredAt: new Date().toISOString().split('T')[0],
    };

    setRegisteredUsers(prev => [newUserProfile, ...prev]);
    setUser(newUserProfile);
    setMainView('app');
    setIsAuthModalOpen(false);
    playChime('click');
    return { success: true, message: 'Account created successfully!' };
  };

  const loginAsGuest = () => {
    setUser({
      id: 'guest-' + Date.now(),
      name: 'Guest Student',
      email: 'guest@studyos.local',
      isLoggedIn: true,
      isGuest: true,
      major: 'Guest Explorer',
      role: 'Guest Session',
    });
    setMainView('app');
    setIsAuthModalOpen(false);
    playChime('click');
  };

  const quickLoginUser = (userId: string) => {
    const target = registeredUsers.find(u => u.id === userId);
    if (target) {
      setUser({ ...target, isLoggedIn: true, isGuest: false });
      setMainView('app');
      setIsAuthModalOpen(false);
      playChime('click');
    }
  };

  const logout = () => {
    setUser({
      id: '',
      name: 'Logged Out',
      email: '',
      isLoggedIn: false,
      isGuest: false,
    });
    playChime('click');
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser(prev => {
      const next = { ...prev, ...updated };
      setRegisteredUsers(users => users.map(u => u.id === next.id ? { ...u, ...updated } : u));
      return next;
    });
    playChime('click');
  };

  const resetPassword = (email: string, newPass: string): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();
    const existingIndex = registeredUsers.findIndex(u => u.email.toLowerCase() === cleanEmail);
    
    if (existingIndex === -1) {
      return { success: false, error: 'No student account found with this email.' };
    }

    setRegisteredUsers(prev => {
      const copy = [...prev];
      copy[existingIndex] = { ...copy[existingIndex], password: newPass };
      return copy;
    });

    return { success: true, message: 'Password updated successfully! You can now log in.' };
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const resetAllData = () => {
    setTasks(INITIAL_TASKS);
    setSchedule(INITIAL_SCHEDULE);
    setGoal(INITIAL_GOAL);
    setUser(INITIAL_USER);
    setRegisteredUsers(INITIAL_USERS);
    setStreakDays(INITIAL_STREAK);
    setSessions(INITIAL_SESSIONS);
    setTimerModeState('Focus');
    setTimerSecondsLeft(TIMER_PRESETS['Focus']);
    setIsTimerRunning(false);
  };

  // Derived Calculations
  const focusSessionsList = sessions.filter(s => s.type === 'Focus');
  const focusSessionsTodayCount = focusSessionsList.length;
  const totalStudyMinutesToday = focusSessionsList.reduce((sum, s) => sum + (s.durationMinutes || 25), 0);
  const totalHoursToday = totalStudyMinutesToday / 60;

  const progressPercentage = goal.targetHours > 0 ? Math.min(100, Math.round((totalHoursToday / goal.targetHours) * 100)) : 0;

  const currentStreak = streakDays.filter(d => d.completed).length;
  const totalTasksCompleted = tasks.filter(t => t.status === 'Completed').length;

  return (
    <AppContext.Provider
      value={{
        mainView,
        setMainView,
        activeTab,
        setActiveTab,
        isDarkMode,
        toggleTheme,
        tasks,
        addTask,
        editTask,
        deleteTask,
        toggleTaskComplete,
        schedule,
        addScheduleItem,
        toggleScheduleItem,
        deleteScheduleItem,
        goal,
        updateGoal,
        streakDays,
        currentStreak,
        sessions,
        timerMode,
        setTimerMode,
        timerSubject,
        setTimerSubject,
        timerSecondsLeft,
        isTimerRunning,
        startTimer,
        pauseTimer,
        resetTimer,
        completedSessionsToday: focusSessionsTodayCount,
        user,
        registeredUsers,
        login,
        signup,
        loginAsGuest,
        quickLoginUser,
        logout,
        updateProfile,
        resetPassword,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        totalStudyMinutesToday,
        progressPercentage,
        totalTasksCompleted,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
