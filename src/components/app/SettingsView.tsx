import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Bell,
  Sun,
  Moon,
  Monitor,
  Volume2,
  VolumeX,
  Vibrate,
  Info,
  HelpCircle,
  Shield,
  ChevronRight,
  LogOut,
  RotateCcw,
  Target,
  Sparkles,
  Check,
  ChevronDown,
  User,
  X,
  Mail,
  MessageSquare,
  AlertCircle,
  Zap,
  Flame,
  CheckCircle2,
  Edit2
} from 'lucide-react';
import { ThemeOption } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    user,
    updateProfile,
    openAuthModal,
    logout,
    resetAllData,
    goal,
    updateGoal,
    preferences,
    updatePreferences
  } = useApp();

  // Profile Edit Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profileMajor, setProfileMajor] = useState(user.major || '');
  const [profileSavedMessage, setProfileSavedMessage] = useState('');

  // Daily Goal Target state
  const [targetHours, setTargetHours] = useState<number>(goal.targetHours);
  const [targetTasks, setTargetTasks] = useState<number>(goal.targetTasks);
  const [targetSessions, setTargetSessions] = useState<number>(goal.targetSessions);
  const [isGoalSaved, setIsGoalSaved] = useState(false);

  // Accordion Expand States for More section
  const [expandedMore, setExpandedMore] = useState<'about' | 'help' | 'privacy' | null>(null);

  // Help & Support Modals
  const [activeSupportModal, setActiveSupportModal] = useState<'faqs' | 'contact' | 'report' | null>(null);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [resetNotification, setResetNotification] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      email: profileEmail,
      major: profileMajor,
    });
    setProfileSavedMessage('Profile updated successfully!');
    setTimeout(() => {
      setProfileSavedMessage('');
      setIsEditProfileOpen(false);
    }, 1500);
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoal({
      targetHours,
      targetTasks,
      targetSessions,
    });
    setIsGoalSaved(true);
    setTimeout(() => setIsGoalSaved(false), 2000);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSupportSubmitted(true);
    setTimeout(() => {
      setSupportSubmitted(false);
      setSupportMessage('');
      setActiveSupportModal(null);
    }, 2000);
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-[#8B5CF6]' : 'bg-[#2A2A40]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-xs text-[#9CA3AF] mt-1">Configure your study environment and preferences</p>
      </div>

      {/* User Profile Card */}
      <div
        onClick={() => {
          if (user.isLoggedIn && !user.isGuest) {
            setProfileName(user.name);
            setProfileEmail(user.email);
            setProfileMajor(user.major || '');
            setIsEditProfileOpen(true);
          } else {
            openAuthModal('login');
          }
        }}
        className="p-4 sm:p-5 rounded-[22px] bg-[#141726] border border-[#2A2A40] flex items-center justify-between gap-4 cursor-pointer hover:border-[#8B5CF6]/50 transition-all shadow-md group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] p-0.5 shrink-0 flex items-center justify-center text-white font-black text-lg shadow-md shadow-[#8B5CF6]/20">
            {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white group-hover:text-[#8B5CF6] transition-colors">
                {user.isLoggedIn && !user.isGuest ? user.name : 'Guest Student'}
              </h3>
              {user.isLoggedIn && !user.isGuest && (
                <Edit2 className="w-3.5 h-3.5 text-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              {user.isLoggedIn && !user.isGuest
                ? user.email + (user.major ? ` • ${user.major}` : '')
                : 'Click to log in and sync your account'}
            </p>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
      </div>

      {/* Profile Edit Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 rounded-[22px] bg-[#141726] border border-[#2A2A40] w-full max-w-md space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#2A2A40] pb-3">
              <h3 className="text-sm font-extrabold text-white">Edit Student Profile</h3>
              <button onClick={() => setIsEditProfileOpen(false)} className="p-1 rounded-xl text-[#9CA3AF] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {profileSavedMessage ? (
              <div className="p-4 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-center font-bold text-xs">
                {profileSavedMessage}
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#9CA3AF] font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-white focus:outline-none focus:border-[#8B5CF6]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#9CA3AF] font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={e => setProfileEmail(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-white focus:outline-none focus:border-[#8B5CF6]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#9CA3AF] font-bold mb-1">Major / Course of Study</label>
                  <input
                    type="text"
                    value={profileMajor}
                    onChange={e => setProfileMajor(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="flex-1 py-3 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-[#9CA3AF] font-extrabold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-extrabold shadow-lg shadow-[#8B5CF6]/30"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FOCUS SETTINGS - Matching Screenshot */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-extrabold text-[#9CA3AF] uppercase tracking-wider px-1">
          FOCUS SETTINGS
        </h3>

        <div className="p-4 sm:p-5 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-5 shadow-md">
          
          {/* Default Focus Duration */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Default Focus Duration</h4>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Set your default Pomodoro focus time.</p>
              </div>
            </div>

            <div className="relative">
              <select
                value={preferences.focus.defaultFocusDuration}
                onChange={e => {
                  const val = Number(e.target.value);
                  updatePreferences(prev => ({
                    ...prev,
                    focus: { ...prev.focus, defaultFocusDuration: val }
                  }));
                }}
                className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-[#09090F] border border-[#2A2A40] text-[#8B5CF6] text-xs font-extrabold focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
              >
                <option value={15}>15 min</option>
                <option value={20}>20 min</option>
                <option value={25}>25 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8B5CF6] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Short Break Duration */}
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#2A2A40]/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Short Break Duration</h4>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Set short break time between focus sessions.</p>
              </div>
            </div>

            <div className="relative">
              <select
                value={preferences.focus.shortBreakDuration}
                onChange={e => {
                  const val = Number(e.target.value);
                  updatePreferences(prev => ({
                    ...prev,
                    focus: { ...prev.focus, shortBreakDuration: val }
                  }));
                }}
                className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-[#09090F] border border-[#2A2A40] text-[#8B5CF6] text-xs font-extrabold focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
              >
                <option value={3}>3 min</option>
                <option value={5}>5 min</option>
                <option value={10}>10 min</option>
                <option value={15}>15 min</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8B5CF6] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Long Break Duration */}
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#2A2A40]/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Long Break Duration</h4>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Set long break time after multiple sessions.</p>
              </div>
            </div>

            <div className="relative">
              <select
                value={preferences.focus.longBreakDuration}
                onChange={e => {
                  const val = Number(e.target.value);
                  updatePreferences(prev => ({
                    ...prev,
                    focus: { ...prev.focus, longBreakDuration: val }
                  }));
                }}
                className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-[#09090F] border border-[#2A2A40] text-[#8B5CF6] text-xs font-extrabold focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
              >
                <option value={10}>10 min</option>
                <option value={15}>15 min</option>
                <option value={20}>20 min</option>
                <option value={30}>30 min</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8B5CF6] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Sessions Before Long Break */}
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#2A2A40]/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Sessions Before Long Break</h4>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Number of focus sessions before a long break.</p>
              </div>
            </div>

            <div className="relative">
              <select
                value={preferences.focus.sessionsBeforeLongBreak}
                onChange={e => {
                  const val = Number(e.target.value);
                  updatePreferences(prev => ({
                    ...prev,
                    focus: { ...prev.focus, sessionsBeforeLongBreak: val }
                  }));
                }}
                className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-[#09090F] border border-[#2A2A40] text-[#8B5CF6] text-xs font-extrabold focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
              >
                <option value={2}>2 sessions</option>
                <option value={3}>3 sessions</option>
                <option value={4}>4 sessions</option>
                <option value={5}>5 sessions</option>
                <option value={6}>6 sessions</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8B5CF6] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Auto Start Next Session */}
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#2A2A40]/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Auto Start Next Session</h4>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Automatically start next session after break.</p>
              </div>
            </div>

            <ToggleSwitch
              checked={preferences.focus.autoStartNextSession}
              onChange={val => {
                updatePreferences(prev => ({
                  ...prev,
                  focus: { ...prev.focus, autoStartNextSession: val }
                }));
              }}
            />
          </div>

        </div>
      </div>

      {/* NOTIFICATIONS - Matching Screenshot */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-extrabold text-[#9CA3AF] uppercase tracking-wider px-1">
          NOTIFICATIONS
        </h3>

        <div className="p-4 sm:p-5 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-5 shadow-md">
          
          {/* Focus Reminders */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Focus Reminders</h4>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Get reminded to start focus sessions.</p>
              </div>
            </div>

            <ToggleSwitch
              checked={preferences.notifications.focusReminders}
              onChange={val => {
                if (val && typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
                  Notification.requestPermission();
                }
                updatePreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, focusReminders: val }
                }));
              }}
            />
          </div>

          {/* Break Alerts */}
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#2A2A40]/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Break Alerts</h4>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Get notified when break time starts.</p>
              </div>
            </div>

            <ToggleSwitch
              checked={preferences.notifications.breakAlerts}
              onChange={val => {
                updatePreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, breakAlerts: val }
                }));
              }}
            />
          </div>

          {/* Daily Goal Reminder */}
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#2A2A40]/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Daily Goal Reminder</h4>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Get reminded about your daily study goal.</p>
              </div>
            </div>

            <ToggleSwitch
              checked={preferences.notifications.dailyGoalReminder}
              onChange={val => {
                updatePreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, dailyGoalReminder: val }
                }));
              }}
            />
          </div>

          {/* Motivational Quotes */}
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#2A2A40]/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Motivational Quotes</h4>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Receive motivational quotes daily.</p>
              </div>
            </div>

            <ToggleSwitch
              checked={preferences.notifications.motivationalQuotes}
              onChange={val => {
                updatePreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, motivationalQuotes: val }
                }));
              }}
            />
          </div>

        </div>
      </div>

      {/* THEME - Matching Screenshot */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-extrabold text-[#9CA3AF] uppercase tracking-wider px-1">
          THEME
        </h3>

        <div className="p-2 sm:p-3 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-1 shadow-md">
          
          {/* Light Theme Option */}
          <div
            onClick={() => {
              updatePreferences(prev => ({ ...prev, theme: 'light' }));
            }}
            className="p-3.5 rounded-2xl hover:bg-[#2A2A40]/30 flex items-center justify-between cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3.5 text-xs font-extrabold text-white">
              <Sun className="w-5 h-5 text-[#9CA3AF]" />
              <span>Light</span>
            </div>
            
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              preferences.theme === 'light' ? 'border-[#8B5CF6] bg-[#8B5CF6]' : 'border-[#2A2A40]'
            }`}>
              {preferences.theme === 'light' && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
          </div>

          {/* Dark Theme Option */}
          <div
            onClick={() => {
              updatePreferences(prev => ({ ...prev, theme: 'dark' }));
            }}
            className="p-3.5 rounded-2xl hover:bg-[#2A2A40]/30 flex items-center justify-between cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3.5 text-xs font-extrabold text-[#8B5CF6]">
              <Moon className="w-5 h-5 text-[#8B5CF6]" />
              <span>Dark</span>
            </div>
            
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              preferences.theme === 'dark' ? 'border-[#8B5CF6] bg-[#8B5CF6]' : 'border-[#2A2A40]'
            }`}>
              {preferences.theme === 'dark' && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
          </div>

          {/* System Default Option */}
          <div
            onClick={() => {
              updatePreferences(prev => ({ ...prev, theme: 'system' }));
            }}
            className="p-3.5 rounded-2xl hover:bg-[#2A2A40]/30 flex items-center justify-between cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3.5 text-xs font-extrabold text-white">
              <Monitor className="w-5 h-5 text-[#9CA3AF]" />
              <span>System Default</span>
            </div>
            
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              preferences.theme === 'system' ? 'border-[#8B5CF6] bg-[#8B5CF6]' : 'border-[#2A2A40]'
            }`}>
              {preferences.theme === 'system' && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
          </div>

        </div>
      </div>

      {/* SOUND & HAPTICS - Matching Screenshot */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-extrabold text-[#9CA3AF] uppercase tracking-wider px-1">
          SOUND & HAPTICS
        </h3>

        <div className="p-4 sm:p-5 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-5 shadow-md">
          
          {/* Session Start Sound */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Session Start Sound</h4>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Play sound when session starts.</p>
              </div>
            </div>

            <ToggleSwitch
              checked={preferences.soundHaptics.sessionStartSound}
              onChange={val => {
                updatePreferences(prev => ({
                  ...prev,
                  soundHaptics: { ...prev.soundHaptics, sessionStartSound: val }
                }));
              }}
            />
          </div>

          {/* Session End Sound */}
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#2A2A40]/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Session End Sound</h4>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Play sound when session ends.</p>
              </div>
            </div>

            <ToggleSwitch
              checked={preferences.soundHaptics.sessionEndSound}
              onChange={val => {
                updatePreferences(prev => ({
                  ...prev,
                  soundHaptics: { ...prev.soundHaptics, sessionEndSound: val }
                }));
              }}
            />
          </div>

          {/* Haptic Feedback */}
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#2A2A40]/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <Vibrate className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Haptic Feedback</h4>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Vibration feedback for actions.</p>
              </div>
            </div>

            <ToggleSwitch
              checked={preferences.soundHaptics.hapticFeedback}
              onChange={val => {
                updatePreferences(prev => ({
                  ...prev,
                  soundHaptics: { ...prev.soundHaptics, hapticFeedback: val }
                }));
              }}
            />
          </div>

        </div>
      </div>

      {/* DAILY STUDY TARGET GOAL FORM */}
      <div className="p-5 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-4 shadow-md">
        <div className="flex items-center gap-2 text-xs font-extrabold text-white">
          <Target className="w-4 h-4 text-[#8B5CF6]" />
          <span>DAILY TARGET GOALS</span>
        </div>

        <form onSubmit={handleGoalSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] text-[#9CA3AF] font-bold mb-1 uppercase">Target Hours</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="16"
                value={targetHours}
                onChange={e => setTargetHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#09090F] border border-[#2A2A40] text-white text-xs focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#9CA3AF] font-bold mb-1 uppercase">Target Tasks</label>
              <input
                type="number"
                min="1"
                max="30"
                value={targetTasks}
                onChange={e => setTargetTasks(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#09090F] border border-[#2A2A40] text-white text-xs focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#9CA3AF] font-bold mb-1 uppercase">Sessions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={targetSessions}
                onChange={e => setTargetSessions(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#09090F] border border-[#2A2A40] text-white text-xs focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-extrabold text-xs shadow-lg shadow-[#8B5CF6]/30 flex items-center justify-center gap-2"
          >
            {isGoalSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Goals Saved Successfully!</span>
              </>
            ) : (
              <span>Save Daily Goals</span>
            )}
          </button>
        </form>
      </div>

      {/* MORE SECTION */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-extrabold text-[#9CA3AF] uppercase tracking-wider px-1">
          MORE
        </h3>

        <div className="space-y-2.5">
          
          {/* About Accordion */}
          <div className="rounded-[22px] bg-[#141726] border border-[#2A2A40] overflow-hidden transition-all shadow-md">
            <button
              onClick={() => setExpandedMore(prev => prev === 'about' ? null : 'about')}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[#2A2A40]/30 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">About Study Productivity OS</h4>
                  <p className="text-[11px] text-[#9CA3AF]">Learn more about the app</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-[#9CA3AF] transition-transform ${expandedMore === 'about' ? 'rotate-180' : ''}`} />
            </button>

            {expandedMore === 'about' && (
              <div className="p-5 border-t border-[#2A2A40] bg-[#09090F]/50 space-y-3 text-xs animate-fadeIn">
                <div className="font-extrabold text-white text-sm">Version 1.0.0</div>
                <p className="text-[#9CA3AF] leading-relaxed">
                  Study Productivity OS is your all-in-one platform to help you stay focused, manage tasks, build study habits, and track your progress.
                </p>
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2.5 text-white font-medium">
                    <div className="w-4 h-4 rounded-full bg-[#8B5CF6] flex items-center justify-center shrink-0 text-white">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Focus better with Pomodoro sessions</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-white font-medium">
                    <div className="w-4 h-4 rounded-full bg-[#8B5CF6] flex items-center justify-center shrink-0 text-white">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Stay organized with tasks and goals</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-white font-medium">
                    <div className="w-4 h-4 rounded-full bg-[#8B5CF6] flex items-center justify-center shrink-0 text-white">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Track your progress and build consistency</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-white font-medium">
                    <div className="w-4 h-4 rounded-full bg-[#8B5CF6] flex items-center justify-center shrink-0 text-white">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Designed for students and lifelong learners</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help & Support Accordion */}
          <div className="rounded-[22px] bg-[#141726] border border-[#2A2A40] overflow-hidden transition-all shadow-md">
            <button
              onClick={() => setExpandedMore(prev => prev === 'help' ? null : 'help')}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[#2A2A40]/30 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">Help & Support</h4>
                  <p className="text-[11px] text-[#9CA3AF]">Get help and find answers</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-[#9CA3AF] transition-transform ${expandedMore === 'help' ? 'rotate-180' : ''}`} />
            </button>

            {expandedMore === 'help' && (
              <div className="p-5 border-t border-[#2A2A40] bg-[#09090F]/50 space-y-3 text-xs animate-fadeIn">
                <p className="text-[#9CA3AF] leading-relaxed">
                  We're here to help you make the most out of Study Productivity OS.
                </p>

                <div className="space-y-2 pt-1">
                  <div
                    onClick={() => setActiveSupportModal('faqs')}
                    className="p-3.5 rounded-2xl bg-[#141726] border border-[#2A2A40] hover:border-[#8B5CF6] flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-[#8B5CF6]" />
                      <div>
                        <div className="font-bold text-white">FAQs</div>
                        <div className="text-[11px] text-[#9CA3AF]">Find answers to common questions.</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                  </div>

                  <div
                    onClick={() => setActiveSupportModal('contact')}
                    className="p-3.5 rounded-2xl bg-[#141726] border border-[#2A2A40] hover:border-[#8B5CF6] flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4 text-[#8B5CF6]" />
                      <div>
                        <div className="font-bold text-white">Contact Support</div>
                        <div className="text-[11px] text-[#9CA3AF]">Get a touch with our support team.</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                  </div>

                  <div
                    onClick={() => setActiveSupportModal('report')}
                    className="p-3.5 rounded-2xl bg-[#141726] border border-[#2A2A40] hover:border-[#8B5CF6] flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 text-[#8B5CF6]" />
                      <div>
                        <div className="font-bold text-white">Report a Problem</div>
                        <div className="text-[11px] text-[#9CA3AF]">Let us know if something isn't working.</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                  </div>

                  <div className="flex items-center gap-2 pt-2 text-[#9CA3AF] font-medium">
                    <Mail className="w-4 h-4 text-[#8B5CF6]" />
                    <span>Email: <strong className="text-[#8B5CF6]">support@studyos.app</strong></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Privacy Policy Accordion */}
          <div className="rounded-[22px] bg-[#141726] border border-[#2A2A40] overflow-hidden transition-all shadow-md">
            <button
              onClick={() => setExpandedMore(prev => prev === 'privacy' ? null : 'privacy')}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[#2A2A40]/30 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6]">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">Privacy Policy</h4>
                  <p className="text-[11px] text-[#9CA3AF]">Read our privacy policy</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-[#9CA3AF] transition-transform ${expandedMore === 'privacy' ? 'rotate-180' : ''}`} />
            </button>

            {expandedMore === 'privacy' && (
              <div className="p-5 border-t border-[#2A2A40] bg-[#09090F]/50 space-y-3 text-xs animate-fadeIn">
                <div className="text-[11px] font-bold text-[#9CA3AF]">Last updated: May 12, 2024</div>
                <p className="text-[#9CA3AF] leading-relaxed">
                  Your privacy is important to us. This policy explains what data we collect, how we use it, and the choices you have.
                </p>

                <div className="space-y-2 pt-1">
                  <div className="p-3 rounded-2xl bg-[#141726] border border-[#2A2A40] space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      <span>Information We Collect</span>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF]">We collect only the data needed to provide better experience.</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#141726] border border-[#2A2A40] space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      <span>How We Use Your Data</span>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF]">We use your data to improve the app, personalize content, and keep your account secure.</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#141726] border border-[#2A2A40] space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      <span>Your Rights</span>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF]">You can access, update, or delete your data anytime.</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#141726] border border-[#2A2A40] space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      <span>Data Security</span>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF]">We use industry-standard measures to keep your data safe and secure.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* RESET & ACCOUNT ACTIONS */}
      <div className="space-y-3 pt-2">
        {resetNotification && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs text-center animate-fadeIn">
            ✓ All app statistics, tasks, timer logs, and progress have been reset to zero!
          </div>
        )}

        <button
          onClick={() => {
            if (window.confirm('Reset all tasks, study history, and timer logs to initial zero states?')) {
              resetAllData();
              setResetNotification(true);
              setTimeout(() => setResetNotification(false), 3500);
            }
          }}
          className="w-full p-4 rounded-[22px] bg-[#141726] border border-[#2A2A40] hover:border-rose-500/50 text-rose-400 font-extrabold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md"
        >
          <RotateCcw className="w-4 h-4 text-rose-400" />
          <span>Reset App Data to Zero</span>
        </button>

        {user.isLoggedIn && !user.isGuest && (
          <button
            onClick={logout}
            className="w-full p-4 rounded-[22px] bg-[#141726] border border-[#2A2A40] hover:border-[#8B5CF6]/50 text-[#9CA3AF] hover:text-white font-extrabold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      {/* Support Modals */}
      {activeSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 rounded-[22px] bg-[#141726] border border-[#2A2A40] w-full max-w-md space-y-4 shadow-2xl animate-scaleUp">
            
            <div className="flex items-center justify-between pb-2 border-b border-[#2A2A40]">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                {activeSupportModal === 'faqs' && 'Frequently Asked Questions'}
                {activeSupportModal === 'contact' && 'Contact Support Team'}
                {activeSupportModal === 'report' && 'Report an Issue'}
              </h3>
              <button onClick={() => setActiveSupportModal(null)} className="p-1 rounded-xl text-[#9CA3AF] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeSupportModal === 'faqs' && (
              <div className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
                <div className="p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40]">
                  <h4 className="font-extrabold text-white">How does the Pomodoro timer work?</h4>
                  <p className="text-[#9CA3AF] mt-1">Study for 25 minutes, then take a 5-minute break. After 4 sessions, take a 15-minute long break!</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40]">
                  <h4 className="font-extrabold text-white">Is my data saved safely?</h4>
                  <p className="text-[#9CA3AF] mt-1">Yes! All your study logs and tasks are saved securely in your browser storage and offline cache.</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40]">
                  <h4 className="font-extrabold text-white">How do I build my study streak?</h4>
                  <p className="text-[#9CA3AF] mt-1">Complete at least one focus session or finish a task each day to maintain your streak!</p>
                </div>
              </div>
            )}

            {(activeSupportModal === 'contact' || activeSupportModal === 'report') && (
              <form onSubmit={handleSupportSubmit} className="space-y-3 text-xs">
                {supportSubmitted ? (
                  <div className="p-4 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-center font-bold">
                    Thank you! Your message has been sent to support@studyos.app.
                  </div>
                ) : (
                  <>
                    <textarea
                      rows={4}
                      value={supportMessage}
                      onChange={e => setSupportMessage(e.target.value)}
                      placeholder={activeSupportModal === 'contact' ? 'How can we help you today?' : 'Describe what happened or what isn\'t working...'}
                      className="w-full p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-white focus:outline-none focus:border-[#8B5CF6]"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-extrabold shadow-lg shadow-[#8B5CF6]/30"
                    >
                      Send Message
                    </button>
                  </>
                )}
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
