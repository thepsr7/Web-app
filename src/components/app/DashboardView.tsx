import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Calendar,
  Flame,
  Clock,
  CheckCircle2,
  TrendingUp,
  Plus,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Sparkles,
  ArrowRight,
  Info,
  HelpCircle,
  Shield,
  RotateCcw,
  LogOut,
  GraduationCap,
  Check,
  MessageSquare,
  AlertCircle,
  Mail,
  X,
  Zap
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    user,
    tasks,
    toggleTaskComplete,
    currentStreak,
    totalStudyMinutesToday,
    progressPercentage,
    setActiveTab,
    openAddTaskModal,
    resetAllData,
    logout,
    preferences
  } = useApp();

  // Selected date state
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Expanded Accordion States for MORE section
  const [expandedSection, setExpandedSection] = useState<'about' | 'help' | 'privacy' | null>(null);

  // Modal states for Help & Support sub-items
  const [activeSupportModal, setActiveSupportModal] = useState<'faqs' | 'contact' | 'report' | null>(null);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [resetNotification, setResetNotification] = useState(false);

  // Time-based greeting helper
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good Morning!' : hour < 17 ? 'Good Afternoon!' : 'Good Evening!';

  // Format today's date for display
  const formattedSelectedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    weekday: 'long',
  });

  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending');

  const toggleAccordion = (section: 'about' | 'help' | 'privacy') => {
    setExpandedSection(prev => prev === section ? null : section);
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

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto animate-fadeIn">
      
      {/* Top Banner Card matching screenshot */}
      <div className="p-4 sm:p-5 rounded-[22px] bg-[#141726] border border-[#2A2A40] flex items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] p-0.5 shrink-0 flex items-center justify-center text-white shadow-md shadow-[#8B5CF6]/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Study</span>
              <span className="text-[#8B5CF6]">Productivity OS</span>
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">Plan. Focus. Improve.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('settings')}
            className="p-2.5 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-[#9CA3AF] hover:text-white hover:border-[#8B5CF6]/50 transition-all shadow-md relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
          
          <div className="w-9 h-9 rounded-2xl bg-[#8B5CF6] text-white font-black text-xs flex items-center justify-center shadow-md shadow-[#8B5CF6]/30">
            {user?.name ? user.name.slice(0, 3).toUpperCase() : 'GOO'}
          </div>
        </div>
      </div>

      {/* Greeting Header */}
      <div className="pt-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>{timeGreeting}</span>
          <span className="text-xl">👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1 font-medium">
          Let's make today productive.
        </p>
      </div>

      {/* Motivational Quote Banner - Toggleable in Settings */}
      {preferences.notifications.motivationalQuotes && (
        <div className="p-4 rounded-[22px] bg-gradient-to-r from-[#8B5CF6]/15 via-[#A855F7]/10 to-[#141726] border border-[#8B5CF6]/30 flex items-center gap-3.5 shadow-md animate-fadeIn">
          <div className="p-2.5 rounded-2xl bg-[#8B5CF6] text-white shrink-0 shadow-md shadow-[#8B5CF6]/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#8B5CF6]">Daily Motivation</div>
            <p className="text-xs font-semibold text-white mt-0.5 italic">
              "Small daily improvements over time lead to stunning, long-lasting results."
            </p>
          </div>
        </div>
      )}

      {/* Select Date Card matching screenshot */}
      <div
        onClick={() => setIsDatePickerOpen(true)}
        className="p-4 rounded-[22px] bg-[#141726] border border-[#2A2A40] hover:border-[#8B5CF6]/50 flex items-center justify-between text-xs font-semibold text-white shadow-md cursor-pointer transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[#9CA3AF] text-[10px] block uppercase tracking-wider font-extrabold">Select Date</span>
            <span className="text-xs font-extrabold text-white">{formattedSelectedDate}</span>
          </div>
        </div>
        <span className="text-[#8B5CF6] text-xs font-bold hover:underline">Choose a date →</span>
      </div>

      {/* Date Picker Modal */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 rounded-[22px] bg-[#141726] border border-[#2A2A40] w-full max-w-sm space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white">Choose Study Date</h3>
              <button onClick={() => setIsDatePickerOpen(false)} className="p-1 rounded-xl text-[#9CA3AF] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) setSelectedDate(e.target.value);
              }}
              className="w-full p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-white text-xs focus:outline-none focus:border-[#8B5CF6]"
            />
            <button
              onClick={() => setIsDatePickerOpen(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-extrabold text-xs shadow-lg shadow-[#8B5CF6]/30"
            >
              Confirm Date
            </button>
          </div>
        </div>
      )}

      {/* Overview 4 Stat Cards matching screenshot */}
      <div className="space-y-3">
        <h2 className="text-xs font-extrabold text-[#9CA3AF] uppercase tracking-wider px-1">
          Overview
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          
          {/* 1. Study Streak */}
          <div className="p-4 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-2 relative overflow-hidden group hover:border-[#8B5CF6]/50 transition-all shadow-md">
            <div className="flex items-center gap-2 text-[#9CA3AF] text-xs font-bold">
              <Flame className="w-4 h-4 text-[#8B5CF6]" />
              <span>Study Streak</span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{currentStreak} <span className="text-xs font-bold text-[#9CA3AF]">days</span></div>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                {currentStreak > 0 ? "Keep it up!" : "Start your first focus session"}
              </p>
            </div>
            <div className="w-full h-1 bg-[#2A2A40] rounded-full overflow-hidden mt-1">
              <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7]" style={{ width: `${currentStreak > 0 ? Math.min(100, currentStreak * 20) : 0}%` }} />
            </div>
          </div>

          {/* 2. Focus Time */}
          <div className="p-4 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-2 relative overflow-hidden group hover:border-[#8B5CF6]/50 transition-all shadow-md">
            <div className="flex items-center gap-2 text-[#9CA3AF] text-xs font-bold">
              <Clock className="w-4 h-4 text-[#22C55E]" />
              <span>Focus Time</span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{totalStudyMinutesToday} <span className="text-xs font-bold text-[#9CA3AF]">min</span></div>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                {totalStudyMinutesToday > 0 ? "Today" : "Start your first focus session"}
              </p>
            </div>
            <div className="w-full h-1 bg-[#2A2A40] rounded-full overflow-hidden mt-1">
              <div className="h-full bg-[#22C55E]" style={{ width: `${totalStudyMinutesToday > 0 ? Math.min(100, (totalStudyMinutesToday / 120) * 100) : 0}%` }} />
            </div>
          </div>

          {/* 3. Tasks Done */}
          <div className="p-4 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-2 relative overflow-hidden group hover:border-[#8B5CF6]/50 transition-all shadow-md">
            <div className="flex items-center gap-2 text-[#9CA3AF] text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />
              <span>Tasks Done</span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{completedTasksCount}/{totalTasks}</div>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                {completedTasksCount > 0 ? "Complete your tasks!" : "Complete your first task"}
              </p>
            </div>
            <div className="w-full h-1 bg-[#2A2A40] rounded-full overflow-hidden mt-1">
              <div className="h-full bg-[#3B82F6]" style={{ width: `${totalTasks > 0 && completedTasksCount > 0 ? (completedTasksCount / totalTasks) * 100 : 0}%` }} />
            </div>
          </div>

          {/* 4. Progress */}
          <div className="p-4 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-2 relative overflow-hidden group hover:border-[#8B5CF6]/50 transition-all shadow-md">
            <div className="flex items-center gap-2 text-[#9CA3AF] text-xs font-bold">
              <TrendingUp className="w-4 h-4 text-[#A855F7]" />
              <span>Progress</span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{progressPercentage}%</div>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                {progressPercentage > 0 ? "Keep progressing!" : "Your progress will appear here."}
              </p>
            </div>
            <div className="w-full h-1 bg-[#2A2A40] rounded-full overflow-hidden mt-1">
              <div className="h-full bg-[#A855F7]" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area: Empty State Card OR Task / Focus List */}
      {totalStudyMinutesToday === 0 && tasks.length === 0 ? (
        /* Empty State Card matching screenshot */
        <div className="p-8 sm:p-10 rounded-[22px] bg-[#141726] border border-[#2A2A40] flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
          <div className="relative w-20 h-20 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center">
            <ClipboardList className="w-10 h-10 text-[#8B5CF6]" />
            <Sparkles className="w-4 h-4 text-[#A855F7] absolute -top-1 -right-1 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-white">No study data yet.</h3>
            <p className="text-xs text-[#9CA3AF] max-w-sm leading-relaxed">
              Start your first task or focus session to see your progress here.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={openAddTaskModal}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-[#8B5CF6]/30 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Task</span>
            </button>
            <button
              onClick={() => setActiveTab('focus')}
              className="px-5 py-2.5 rounded-2xl bg-[#09090F] border border-[#2A2A40] hover:border-[#8B5CF6] text-white font-extrabold text-xs flex items-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 text-[#8B5CF6]" />
              <span>Start Focus Timer</span>
            </button>
          </div>
        </div>
      ) : (
        /* Task list if tasks exist */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-white">Active Study Tasks</h3>
            <button onClick={openAddTaskModal} className="text-xs text-[#8B5CF6] font-bold hover:underline">+ Add Task</button>
          </div>
          <div className="space-y-2">
            {pendingTasks.map(t => (
              <div key={t.id} onClick={() => toggleTaskComplete(t.id)} className="p-4 rounded-[22px] bg-[#141726] border border-[#2A2A40] flex items-center justify-between cursor-pointer hover:border-[#8B5CF6]/50">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-[#2A2A40]" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.title}</h4>
                    <p className="text-[11px] text-[#9CA3AF]">{t.subject}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#8B5CF6]">{t.priority}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MORE Accordion Section matching screenshot */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-extrabold text-[#9CA3AF] uppercase tracking-wider px-1">
          MORE
        </h3>

        <div className="space-y-2.5">
          
          {/* 1. About Study Productivity OS */}
          <div className="rounded-[22px] bg-[#141726] border border-[#2A2A40] overflow-hidden transition-all shadow-md">
            <button
              onClick={() => toggleAccordion('about')}
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
              {expandedSection === 'about' ? (
                <ChevronUp className="w-5 h-5 text-[#9CA3AF]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
              )}
            </button>

            {/* Expanded Accordion Body matching screenshot */}
            {expandedSection === 'about' && (
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

          {/* 2. Help & Support */}
          <div className="rounded-[22px] bg-[#141726] border border-[#2A2A40] overflow-hidden transition-all shadow-md">
            <button
              onClick={() => toggleAccordion('help')}
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
              {expandedSection === 'help' ? (
                <ChevronUp className="w-5 h-5 text-[#9CA3AF]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
              )}
            </button>

            {/* Expanded Help Body matching screenshot */}
            {expandedSection === 'help' && (
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
                    <ChevronDown className="w-4 h-4 text-[#9CA3AF] -rotate-90" />
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
                    <ChevronDown className="w-4 h-4 text-[#9CA3AF] -rotate-90" />
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
                    <ChevronDown className="w-4 h-4 text-[#9CA3AF] -rotate-90" />
                  </div>

                  <div className="flex items-center gap-2 pt-2 text-[#9CA3AF] font-medium">
                    <Mail className="w-4 h-4 text-[#8B5CF6]" />
                    <span>Email: <strong className="text-[#8B5CF6]">support@studyos.app</strong></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Privacy Policy */}
          <div className="rounded-[22px] bg-[#141726] border border-[#2A2A40] overflow-hidden transition-all shadow-md">
            <button
              onClick={() => toggleAccordion('privacy')}
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
              {expandedSection === 'privacy' ? (
                <ChevronUp className="w-5 h-5 text-[#9CA3AF]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
              )}
            </button>

            {/* Expanded Privacy Body matching screenshot */}
            {expandedSection === 'privacy' && (
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

        {/* Action Buttons: Reset & Sign Out matching screenshot */}
        <div className="space-y-2.5 pt-3">
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

          <button
            onClick={logout}
            className="w-full p-4 rounded-[22px] bg-[#141726] border border-[#2A2A40] hover:border-[#8B5CF6]/50 text-[#9CA3AF] hover:text-white font-extrabold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

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
