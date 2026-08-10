import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, LayoutDashboard, Clock, CheckSquare, BarChart2, Target, CheckCircle2, Circle, Flame, Play, ArrowRight } from 'lucide-react';

export const MobileSimulator: React.FC = () => {
  const [mobileTab, setMobileTab] = useState<'dashboard' | 'focus' | 'tasks' | 'stats' | 'goals'>('dashboard');
  const { user, tasks, timerSecondsLeft, progressPercentage, goal, totalStudyMinutesToday, streakDays, currentStreak, toggleTaskComplete } = useApp();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const hours = Math.floor(totalStudyMinutesToday / 60);
  const mins = totalStudyMinutesToday % 60;
  const formattedStudyTime = `${hours}h ${mins}m`;

  return (
    <div className="space-y-6 animate-fadeIn py-6">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <Smartphone className="w-4 h-4 text-purple-400" />
          <span>REALISTIC MOBILE PREVIEWS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Mobile Responsive Design
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Study Productivity OS Lite is fully optimized for mobile devices so students can track tasks and run focus timers on any smartphone.
        </p>

        {/* Tab Pills */}
        <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
            { id: 'focus', label: 'Focus Timer', icon: <Clock className="w-3.5 h-3.5" /> },
            { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-3.5 h-3.5" /> },
            { id: 'stats', label: 'Statistics', icon: <BarChart2 className="w-3.5 h-3.5" /> },
            { id: 'goals', label: 'Goals', icon: <Target className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id as typeof mobileTab)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mobileTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of All 5 Mobile Previews OR Interactive Single Phone Frame */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 pt-4">
        
        {/* Phone Frame Mockup */}
        <div className="w-[310px] h-[620px] bg-[#000000] rounded-[48px] p-3 border-[6px] border-slate-700 shadow-2xl relative flex flex-col justify-between overflow-hidden shrink-0">
          
          {/* Top Notch / Camera Island */}
          <div className="w-32 h-5 bg-black rounded-b-2xl mx-auto z-30 flex items-center justify-center">
            <div className="w-10 h-1 bg-slate-800 rounded-full" />
          </div>

          {/* Phone Screen Area */}
          <div className="flex-1 bg-[#090b16] rounded-[36px] overflow-y-auto p-3.5 text-slate-100 flex flex-col justify-between relative mt-1">
            
            {/* Screen Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3 text-[11px] font-bold text-slate-300">
              <span>9:41</span>
              <span className="text-purple-400 font-extrabold uppercase text-[10px]">Study OS</span>
              <span>100%</span>
            </div>

            {/* Screen Content based on mobileTab */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              
              {/* 1. Mobile Dashboard */}
              {mobileTab === 'dashboard' && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50">
                    <div className="text-[10px] text-purple-300 font-semibold">Good evening,</div>
                    <div className="text-sm font-bold text-white">{user.name}! 👋</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Let's make today productive.</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-300">
                      <span>Today's Progress</span>
                      <span className="text-emerald-400">{progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800">
                      <div style={{ width: `${progressPercentage}%` }} className="h-full bg-emerald-400 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400">
                      <span>{formattedStudyTime} Studied</span>
                      <span>Goal: {goal.targetHours}h</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Today's Tasks</div>
                    {tasks.slice(0, 3).map(t => (
                      <div key={t.id} className="p-2 rounded-lg bg-slate-850 border border-slate-800 flex items-center gap-2 text-[10px]">
                        {t.status === 'Completed' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                        <span className={`truncate ${t.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}`}>{t.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Mobile Focus Timer */}
              {mobileTab === 'focus' && (
                <div className="space-y-4 animate-fadeIn text-center py-2">
                  <div className="text-[11px] font-bold text-purple-400">Pomodoro Focus</div>
                  <div className="w-36 h-36 mx-auto rounded-full border-4 border-purple-500 flex flex-col items-center justify-center bg-slate-900 shadow-lg shadow-purple-500/20">
                    <span className="text-2xl font-black font-mono text-white">{formatTime(timerSecondsLeft)}</span>
                    <span className="text-[9px] text-purple-300 mt-0.5">Focus Time</span>
                  </div>

                  <button className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Start Focus
                  </button>

                  <div className="text-[10px] text-slate-400">
                    Sessions Completed Today: <strong className="text-white">3</strong>
                  </div>
                </div>
              )}

              {/* 3. Mobile Tasks */}
              {mobileTab === 'tasks' && (
                <div className="space-y-2 animate-fadeIn">
                  <div className="flex justify-between items-center text-[11px] font-bold text-white">
                    <span>Tasks</span>
                    <span className="text-purple-400 text-[10px]">+ Add Task</span>
                  </div>

                  <div className="space-y-1.5">
                    {tasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => toggleTaskComplete(t.id)}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-[10px] cursor-pointer"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          {t.status === 'Completed' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Circle className="w-4 h-4 text-slate-500 shrink-0" />}
                          <span className={`truncate ${t.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-200 font-semibold'}`}>{t.title}</span>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 shrink-0">{t.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Mobile Statistics */}
              {mobileTab === 'stats' && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="text-[11px] font-bold text-white">Weekly Statistics</div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[9px] text-slate-400">Total Study Time</div>
                      <div className="text-sm font-bold text-purple-300">{formattedStudyTime}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[9px] text-slate-400">Completed</div>
                      <div className="text-sm font-bold text-emerald-400">{tasks.filter(t => t.status === 'Completed').length} Tasks</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[9px] text-slate-400 mb-2">Weekly Chart</div>
                    <div className="h-20 flex items-end justify-between gap-1">
                      {streakDays.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-purple-600 rounded-t" style={{ height: `${d.hoursStudied * 12}px` }} />
                          <span className="text-[7px] text-slate-400 uppercase">{d.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Mobile Goals */}
              {mobileTab === 'goals' && (
                <div className="space-y-3 animate-fadeIn text-center">
                  <div className="text-[11px] font-bold text-white">Daily Target</div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-2xl font-black text-emerald-400">{progressPercentage}%</div>
                    <div className="text-[10px] text-slate-300">{formattedStudyTime} of {goal.targetHours}h Goal</div>
                    <div className="w-full h-2 rounded-full bg-slate-800">
                      <div style={{ width: `${progressPercentage}%` }} className="h-full bg-emerald-400 rounded-full" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 flex items-center justify-center gap-1.5 font-bold">
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{currentStreak} Day Study Streak!</span>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Mobile Navigation Bar */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-around text-[9px] font-medium text-slate-400">
              <button onClick={() => setMobileTab('dashboard')} className={mobileTab === 'dashboard' ? 'text-purple-400 font-bold' : ''}>
                Dash
              </button>
              <button onClick={() => setMobileTab('focus')} className={mobileTab === 'focus' ? 'text-purple-400 font-bold' : ''}>
                Focus
              </button>
              <button onClick={() => setMobileTab('tasks')} className={mobileTab === 'tasks' ? 'text-purple-400 font-bold' : ''}>
                Tasks
              </button>
              <button onClick={() => setMobileTab('stats')} className={mobileTab === 'stats' ? 'text-purple-400 font-bold' : ''}>
                Stats
              </button>
              <button onClick={() => setMobileTab('goals')} className={mobileTab === 'goals' ? 'text-purple-400 font-bold' : ''}>
                Goals
              </button>
            </div>

          </div>
        </div>

        {/* Feature Explanations alongside mobile phone frame */}
        <div className="space-y-4 max-w-md">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-purple-400" />
            Responsive Student Workspace
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Students can seamlessly access their task list, pomodoro timer, and streak calendar from their mobile browser without installing any heavy native apps.
          </p>

          <div className="space-y-2.5">
            {[
              { title: "Touch-Friendly Timers", desc: "Large start/pause buttons and circular progress rings designed for mobile screens." },
              { title: "Instant Local Sync", desc: "Tasks modified on mobile instantly persist in local storage." },
              { title: "No Battery Drain", desc: "Zero heavy background servers or continuous database polling." },
              { title: "PWA Ready", desc: "Can be saved to Home Screen as a web application." }
            ].map((f, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">{f.title}</div>
                  <div className="text-[11px] text-slate-400">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
