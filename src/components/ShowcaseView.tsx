import React from 'react';
import { useApp } from '../context/AppContext';
import { AppTabMode } from '../types';
import {
  GraduationCap,
  Code,
  CheckCircle2,
  Clock,
  BarChart3,
  Target,
  Flame,
  Calendar,
  Moon,
  ShieldCheck,
  Rocket,
  Github,
  Linkedin,
  Globe,
  Plus,
  Play,
  ArrowRight,
  User,
  Mail,
  Lock,
  Sparkles,
  Check,
  Circle,
  Database
} from 'lucide-react';

export const ShowcaseView: React.FC = () => {
  const {
    user,
    tasks,
    toggleTaskComplete,
    timerSecondsLeft,
    isTimerRunning,
    startTimer,
    pauseTimer,
    completedSessionsToday,
    schedule,
    streakDays,
    currentStreak,
    totalStudyMinutesToday,
    progressPercentage,
    goal,
    setMainView,
    setActiveTab,
    login,
    signup,
    loginAsGuest,
    openAuthModal,
    registeredUsers,
    quickLoginUser,
  } = useApp();

  const handleLaunchApp = (tab?: AppTabMode) => {
    if (!user.isLoggedIn) {
      openAuthModal('signup');
    } else {
      if (tab) setActiveTab(tab);
      setMainView('app');
    }
  };

  const [authName, setAuthName] = React.useState('');
  const [authEmail, setAuthEmail] = React.useState('');
  const [authPassword, setAuthPassword] = React.useState('');
  const [authMessage, setAuthMessage] = React.useState<string | null>(null);

  const handleShowcaseSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const res = signup(authName, authEmail, authPassword, 'Computer Science');
    if (res.success) {
      setAuthMessage(res.message || 'Account created!');
    } else {
      setAuthMessage(res.error || 'Failed to create account');
    }
  };

  const handleShowcaseLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(authEmail, authPassword);
    if (res.success) {
      setAuthMessage(res.message || 'Logged in!');
    } else {
      setAuthMessage(res.error || 'Login failed');
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const hours = Math.floor(totalStudyMinutesToday / 60);
  const mins = totalStudyMinutesToday % 60;
  const formattedStudyTime = `${hours}h ${mins}m`;

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn">
      
      {/* Top Launch Banner */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-violet-900/40 via-slate-900 to-indigo-900/40 border border-violet-500/30">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-violet-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-slate-200">
            Welcome to Study Productivity OS! Sign up, log in, or continue as guest to launch your study workspace.
          </span>
        </div>
        <button
          onClick={() => handleLaunchApp()}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 shrink-0 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Launch Full Web App
        </button>
      </div>

      {/* Main 3-Column SaaS Layout */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (3 Cols): Hero, Features, Quote */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Main Title & Tagline Card */}
          <div className="p-6 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Study <br />
                  <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Productivity</span> OS
                  <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded bg-emerald-600 text-white align-top">Web App</span>
                </h1>
              </div>
            </div>

            <p className="text-sm font-extrabold text-purple-300 tracking-wide uppercase">
              Plan. Focus. Improve.
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              A lightweight student productivity web app to plan your tasks, stay focused with Pomodoro timer, and track your study progress — all in one place.
            </p>

            {/* Developer Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-semibold">
              <Code className="w-4 h-4 text-purple-400" />
              <span>Developer: PSR (Prem Singh Rajput)</span>
            </div>
          </div>

          {/* FEATURES LIST SECTION */}
          <div className="p-6 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-xs font-extrabold tracking-wider uppercase text-purple-400">
              FEATURES
            </h2>

            <div className="space-y-4 text-xs">
              
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Task Management</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">Add, edit, delete and mark tasks as complete with priorities.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Pomodoro Focus Timer</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">25min focus sessions, short breaks and long breaks to boost focus.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Study Statistics</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">Track your study time, tasks completed and sessions.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Daily Goals & Progress</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">Set daily goals and track your progress visually.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                  <Flame className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Study Streak</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">Build consistency and grow your study streak.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Schedule</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">Plan your study schedule for the day.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Dark / Light Mode</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">Switch between dark and light mode anytime.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Authentication (Optional)</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">Sign up, login and save your productivity data locally.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Motivational Quote Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-tr from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/40 shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-1">
              <p className="text-sm font-semibold text-white italic">
                "Discipline today leads to success tomorrow."
              </p>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-20 pointer-events-none">
              <GraduationCap className="w-32 h-32 text-purple-400" />
            </div>
          </div>

        </div>

        {/* CENTER COLUMN (6 Cols): Dashboard Overview & Mobile Previews */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* DASHBOARD OVERVIEW SECTION HEADER */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300">
              DASHBOARD OVERVIEW
            </span>
          </div>

          {/* CENTRAL INTERACTIVE DASHBOARD CONTAINER */}
          <div className="p-5 rounded-2xl bg-[#090b16] border border-slate-800 shadow-2xl space-y-5">
            
            {/* Embedded OS App Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-white">Study OS Lite</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <button onClick={() => handleLaunchApp()} className="text-purple-400 font-bold hover:underline">
                  Open Full Screen OS ↗
                </button>
              </div>
            </div>

            {/* Personalized Greeting */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">
                  Good evening, <span className="text-purple-300">{user.name}!</span> 👋
                </h3>
                <p className="text-xs text-slate-400">Let's make today productive.</p>
              </div>
            </div>

            {/* 4 Summary Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <div className="text-lg font-bold text-white">{tasks.length}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Tasks</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <div className="text-lg font-bold text-white">{formattedStudyTime}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Study Time</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400/20 shrink-0" />
                <div>
                  <div className="text-lg font-bold text-white">{currentStreak}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Day Streak</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                <Target className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-lg font-bold text-white">{progressPercentage}%</div>
                  <div className="text-[10px] text-slate-400 font-medium">Daily Goal</div>
                </div>
              </div>
            </div>

            {/* Tasks + Timer + Progress Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Today's Tasks */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span>Today's Tasks</span>
                  <button onClick={() => handleLaunchApp('tasks')} className="text-purple-400 hover:underline text-[10px]">+ Add Task</button>
                </div>
                <div className="space-y-2 text-xs">
                  {tasks.slice(0, 4).map(t => (
                    <div
                      key={t.id}
                      onClick={() => toggleTaskComplete(t.id)}
                      className="p-2 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {t.status === 'Completed' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Circle className="w-4 h-4 text-slate-500 shrink-0" />}
                        <span className={`truncate ${t.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}`}>{t.title}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        t.priority === 'High' ? 'text-red-400 bg-red-500/10' : t.priority === 'Medium' ? 'text-amber-400 bg-amber-500/10' : 'text-blue-400 bg-blue-500/10'
                      }`}>{t.priority}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Focus Timer Widget */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <div className="text-xs font-bold text-white">Focus Timer</div>
                <div className="w-28 h-28 mx-auto rounded-full border-4 border-purple-500 flex flex-col items-center justify-center bg-slate-950 shadow-lg shadow-purple-500/20">
                  <span className="text-xl font-bold font-mono text-white">{formatTime(timerSecondsLeft)}</span>
                  <span className="text-[9px] text-purple-300">Focus Time</span>
                </div>
                {isTimerRunning ? (
                  <button onClick={pauseTimer} className="w-full py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs">Pause</button>
                ) : (
                  <button onClick={startTimer} className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs">Start Focus</button>
                )}
                <div className="text-[10px] text-slate-400">Sessions Today: {completedSessionsToday}</div>
              </div>

              {/* Today's Progress */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-center">
                <div className="text-xs font-bold text-white">Today's Progress</div>
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" className="text-slate-800" fill="transparent" />
                    <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" className="text-emerald-400" fill="transparent" strokeDasharray={201} strokeDashoffset={201 - (201 * progressPercentage) / 100} strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-sm font-bold text-white">{progressPercentage}%</span>
                </div>
                <div className="text-[11px] text-slate-300">{formattedStudyTime} / {goal.targetHours}h Goal</div>
                <div className="p-2 rounded bg-purple-950/30 border border-purple-800/40 text-[10px] text-purple-200 italic">
                  "Discipline today leads to success tomorrow."
                </div>
              </div>

            </div>

            {/* Schedule + Streak Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white flex justify-between">
                  <span>Today's Schedule</span>
                  <button onClick={() => handleLaunchApp('schedule')} className="text-purple-400 text-[10px]">View Full Schedule</button>
                </div>
                {schedule.slice(0, 4).map(s => (
                  <div key={s.id} className="flex justify-between items-center p-2 rounded bg-slate-850 border border-slate-800 text-[11px]">
                    <span className="font-mono text-purple-300 font-bold">{s.time}</span>
                    <span className="font-semibold text-white">{s.subject}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="font-bold text-white">Study Streak (Keep it up!)</div>
                <div className="grid grid-cols-7 gap-1">
                  {streakDays.map((d, i) => (
                    <div key={i} className={`p-1.5 rounded text-center border ${d.completed ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                      <div className="text-[8px] uppercase font-bold">{d.day}</div>
                      <Flame className={`w-3.5 h-3.5 mx-auto my-0.5 ${d.completed ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (3 Cols): Auth, Tech Stack, Why OS, Developer */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* AUTHENTICATION (OPTIONAL) HEADER */}
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300">
              AUTHENTICATION (OPTIONAL)
            </span>
          </div>

          {/* Dual Auth Cards (Sign Up & Login) */}
          <div className="grid grid-cols-1 gap-4">
            
            {authMessage && (
              <div className="p-3 rounded-xl bg-violet-950/80 border border-violet-800 text-xs text-violet-200 text-center animate-fadeIn">
                {authMessage}
              </div>
            )}

            {/* Sign Up Card */}
            <div className="p-5 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-slate-800 shadow-xl space-y-3">
              <div className="text-center">
                <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mx-auto mb-1">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Sign Up</h3>
                <p className="text-[10px] text-slate-400">Create your student account</p>
              </div>

              <form onSubmit={handleShowcaseSignup} className="space-y-2 text-xs">
                <input
                  type="text"
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-[11px] focus:outline-none focus:border-violet-500"
                />
                <input
                  type="email"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-[11px] focus:outline-none focus:border-violet-500"
                />
                <input
                  type="password"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-[11px] focus:outline-none focus:border-violet-500"
                />
                <button type="submit" className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-600/30 transition-all">
                  Sign Up
                </button>
              </form>

              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-violet-300 text-[11px] font-semibold border border-slate-700 transition-all"
              >
                Open Full Sign Up Dialog
              </button>
            </div>

            {/* Login Card */}
            <div className="p-5 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-slate-800 shadow-xl space-y-3">
              <div className="text-center">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto mb-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Login</h3>
                <p className="text-[10px] text-slate-400">Welcome back!</p>
              </div>

              <form onSubmit={handleShowcaseLogin} className="space-y-2 text-xs">
                <input
                  type="email"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-[11px] focus:outline-none focus:border-violet-500"
                />
                <input
                  type="password"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-[11px] focus:outline-none focus:border-violet-500"
                />
                <button type="submit" className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all">
                  Login
                </button>
              </form>

              <div className="flex gap-2 pt-1">
                <button onClick={() => openAuthModal('login')} className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 transition-all">
                  Sign In Modal
                </button>
                <button onClick={loginAsGuest} className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 transition-all">
                  Guest
                </button>
              </div>
            </div>

          </div>

          {/* Prototype Local Storage Note Box */}
          <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/50 text-[11px] text-purple-200/90 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> This is a prototype. Data is stored in your browser using <code>localStorage</code>. No database required.
            </span>
          </div>

          {/* TECH STACK SECTION */}
          <div className="p-5 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-slate-800 shadow-xl space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-purple-400">
              TECH STACK
            </h2>

            <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                <div className="text-purple-400 font-bold">React</div>
                <div className="text-[8px] text-slate-400">(Vite)</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                <div className="text-blue-400 font-bold">Tailwind</div>
                <div className="text-[8px] text-slate-400">CSS</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                <div className="text-amber-400 font-bold">Lucide</div>
                <div className="text-[8px] text-slate-400">Icons</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                <div className="text-emerald-400 font-bold">local</div>
                <div className="text-[8px] text-slate-400">Storage</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                <div className="text-indigo-400 font-bold">Vercel</div>
                <div className="text-[8px] text-slate-400">(Deploy)</div>
              </div>
            </div>
          </div>

          {/* WHY STUDY PRODUCTIVITY OS LITE? SECTION */}
          <div className="p-5 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-purple-400">
              WHY STUDY PRODUCTIVITY OS LITE?
            </h2>

            <ul className="space-y-2 text-xs">
              {[
                "Simple, beautiful and easy to use",
                "Works offline - No database required",
                "Helps you stay focused and productive",
                "Track progress and build consistency",
                "Optional authentication - your data, your choice",
                "Lightweight, fast and responsive",
                "Privacy-friendly local storage"
              ].map((reason, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex justify-end">
              <Rocket className="w-12 h-12 text-purple-500/30 transform rotate-45" />
            </div>
          </div>

          {/* DEVELOPER SECTION */}
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-800/50 shadow-xl space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-purple-400">
              DEVELOPER
            </h2>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-purple-600/30">
                PSR
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Prem Singh Rajput (PSR)</h3>
                <p className="text-xs text-purple-300 font-medium">
                  Passionate Developer | Building useful things for students.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-xs">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://portfolio.dev"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portfolio</span>
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
