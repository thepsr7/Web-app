import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, Plus, CheckCircle2, Circle, Flame, Clock, Target, Calendar, ArrowRight, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    tasks, 
    toggleTaskComplete, 
    addTask,
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
    setActiveTab,
    openAuthModal
  } = useApp();

  const [isQuickTaskModalOpen, setIsQuickTaskModalOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickSubject, setQuickSubject] = useState('Physics');
  const [quickPriority, setQuickPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // Time-based greeting helper
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Format timer seconds left into MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Convert study minutes into "2h 35m" format
  const hours = Math.floor(totalStudyMinutesToday / 60);
  const mins = totalStudyMinutesToday % 60;
  const formattedStudyTime = `${hours}h ${mins}m`;

  const handleQuickTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addTask({
      title: quickTitle,
      subject: quickSubject,
      priority: quickPriority,
      status: 'Pending',
      estimatedMinutes: 30,
    });
    setQuickTitle('');
    setIsQuickTaskModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner & Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-purple-950/40 to-slate-900/90 border border-slate-800/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STUDY OS DASHBOARD OVERVIEW</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {timeGreeting}, <span className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">{user.name}!</span> 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Let's make today productive. Stay focused and reach your goals.
          </p>
        </div>

        {/* Quick actions buttons */}
        <div className="relative z-10 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsQuickTaskModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
          <button
            onClick={() => setActiveTab('focus')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all hover:scale-105"
          >
            <Clock className="w-4 h-4 text-purple-400" />
            Focus Session
          </button>
        </div>
      </div>

      {/* Prototype Local Storage Note Banner */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200/90">
        <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
        <span>
          <strong>Prototype Note:</strong> Data is stored safely in your browser using <code>localStorage</code>. No external database required.
        </span>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Tasks Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-lg flex items-center gap-4 hover:border-slate-700/80 transition-all">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">{tasks.length}</div>
            <div className="text-xs font-medium text-slate-400">Total Tasks</div>
          </div>
        </div>

        {/* Study Time Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-lg flex items-center gap-4 hover:border-slate-700/80 transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">{formattedStudyTime}</div>
            <div className="text-xs font-medium text-slate-400">Study Time</div>
          </div>
        </div>

        {/* Study Streak Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-lg flex items-center gap-4 hover:border-slate-700/80 transition-all">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-amber-400/20" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">{currentStreak} Days</div>
            <div className="text-xs font-medium text-slate-400">Day Streak</div>
          </div>
        </div>

        {/* Daily Progress Goal Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-lg flex items-center gap-4 hover:border-slate-700/80 transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-sm">
            {progressPercentage}%
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">{progressPercentage}%</div>
            <div className="text-xs font-medium text-slate-400">Daily Goal</div>
          </div>
        </div>

      </div>

      {/* Main Grid: Today's Tasks, Quick Focus Timer, Today's Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Tasks List */}
        <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Today's Tasks
              </h2>
              <button
                onClick={() => setIsQuickTaskModalOpen(true)}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                + Add Task
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 4).map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTaskComplete(task.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    task.status === 'Completed'
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button className="text-purple-400 shrink-0">
                      {task.status === 'Completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-purple-400" />
                      )}
                    </button>
                    <div className="truncate">
                      <div className={`text-xs font-semibold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {task.title}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{task.subject}</span>
                        <span>•</span>
                        <span className={`font-semibold ${
                          task.priority === 'High' ? 'text-red-400' : task.priority === 'Medium' ? 'text-amber-400' : 'text-blue-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('tasks')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>View All Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Focus Timer */}
        <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl flex flex-col justify-between text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                Focus Timer
              </h2>
              <span className="text-xs font-medium text-slate-400">25 Min Focus</span>
            </div>

            {/* Circular Timer Visual */}
            <div className="relative w-44 h-44 mx-auto my-3 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="78"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="78"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-purple-500 transition-all duration-1000"
                  fill="transparent"
                  strokeDasharray={490}
                  strokeDashoffset={490 - (490 * (25 * 60 - timerSecondsLeft)) / (25 * 60)}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white tracking-wider font-mono">
                  {formatTime(timerSecondsLeft)}
                </span>
                <span className="text-[11px] font-medium text-purple-300/80 mt-1">Focus Time</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-2">
              {isTimerRunning ? (
                <button
                  onClick={pauseTimer}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={startTimer}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Start Focus
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-2">
            <span>Sessions Today: <strong className="text-white">{completedSessionsToday}</strong></span>
          </div>
        </div>

        {/* Today's Progress Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Today's Progress
              </h2>
              <button
                onClick={() => setActiveTab('goals')}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300"
              >
                Edit Goal
              </button>
            </div>

            {/* Circular Progress Gauge */}
            <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-800 flex items-center justify-around">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-emerald-400 transition-all duration-1000"
                    fill="transparent"
                    strokeDasharray={238}
                    strokeDashoffset={238 - (238 * progressPercentage) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base font-extrabold text-white">{progressPercentage}%</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 font-medium">Daily Goal</div>
                <div className="text-lg font-bold text-white">{goal.targetHours}h Target</div>
                <div className="text-xs text-purple-300 mt-1 font-semibold">{formattedStudyTime} Studied</div>
                <div className="text-[11px] text-slate-400">{completedSessionsToday} Focus Sessions</div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs text-purple-200 font-medium italic text-center">
              "Discipline today leads to success tomorrow."
            </div>
          </div>

          <button
            onClick={() => setActiveTab('stats')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>View Full Statistics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Schedule & Streak Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Today's Schedule Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              Today's Schedule
            </h2>
            <button
              onClick={() => setActiveTab('schedule')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              View Full Schedule
            </button>
          </div>

          <div className="space-y-2.5">
            {schedule.slice(0, 4).map(item => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20">
                    {item.time}
                  </span>
                  <div>
                    <div className="font-semibold text-white">{item.subject}</div>
                    <div className="text-[11px] text-slate-400">{item.description}</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  item.completed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
                }`}>
                  {item.completed ? 'Done' : 'Upcoming'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Study Streak Calendar Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                Study Streak ({currentStreak} Days)
              </h2>
              <span className="text-xs text-amber-300 font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                On Fire 🔥
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Keep it up! Consistency build habits that drive high test scores and deep mastery.
            </p>

            {/* Weekly Days Bar */}
            <div className="grid grid-cols-7 gap-2">
              {streakDays.map((d, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-between transition-all ${
                    d.completed
                      ? 'bg-gradient-to-b from-amber-500/20 to-purple-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-500'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">{d.day}</span>
                  <Flame className={`w-5 h-5 my-1.5 ${d.completed ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                  <span className="text-[9px] font-mono font-medium">
                    {d.completed ? `${d.hoursStudied}h` : '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 flex items-center justify-between">
            <span>Weekly Goal: 5/7 Days Completed</span>
            <span className="font-bold text-amber-400">85% Complete</span>
          </div>
        </div>

      </div>

      {/* Quick Add Task Modal */}
      {isQuickTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add Quick Task</h3>
            <form onSubmit={handleQuickTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Physics Assignment"
                  value={quickTitle}
                  onChange={e => setQuickTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <select
                    value={quickSubject}
                    onChange={e => setQuickSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Literature">Literature</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={quickPriority}
                    onChange={e => setQuickPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuickTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
