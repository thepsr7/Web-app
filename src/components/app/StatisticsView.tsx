import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Clock, CheckCircle2, Flame, Award, TrendingUp, Calendar, BookOpen } from 'lucide-react';

export const StatisticsView: React.FC = () => {
  const {
    tasks,
    sessions,
    streakDays,
    totalStudyMinutesToday,
    progressPercentage,
    totalTasksCompleted,
  } = useApp();

  const hours = Math.floor(totalStudyMinutesToday / 60);
  const mins = totalStudyMinutesToday % 60;
  const formattedStudyTime = `${hours}h ${mins}m`;

  // Weekly data calculations
  const totalWeeklyHours = streakDays.reduce((acc, curr) => acc + curr.hoursStudied, 0).toFixed(1);
  const maxWeeklyHour = Math.max(...streakDays.map(d => d.hoursStudied), 5);

  // Subject distribution
  const subjectCounts: Record<string, number> = {};
  tasks.forEach(t => {
    subjectCounts[t.subject] = (subjectCounts[t.subject] || 0) + 1;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            Study Statistics & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track total focus hours, daily trends, task velocity, and weekly productivity charts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 bg-purple-500/10 px-3.5 py-1.5 rounded-xl border border-purple-500/20">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>+14% Productivity vs Last Week</span>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
          <div className="flex items-center gap-3 text-purple-400 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-semibold text-slate-400">Total Study Time</span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{formattedStudyTime}</div>
          <p className="text-[11px] text-slate-400 mt-1">Today's recorded focus</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
          <div className="flex items-center gap-3 text-emerald-400 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-semibold text-slate-400">Tasks Completed</span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{totalTasksCompleted} / {tasks.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">{Math.round((totalTasksCompleted / Math.max(1, tasks.length)) * 100)}% completion rate</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
          <div className="flex items-center gap-3 text-amber-400 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-xs font-semibold text-slate-400">Focus Sessions</span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{sessions.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Pomodoro intervals</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
          <div className="flex items-center gap-3 text-blue-400 mb-2">
            <Flame className="w-5 h-5" />
            <span className="text-xs font-semibold text-slate-400">Weekly Goal Progress</span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{progressPercentage}%</div>
          <p className="text-[11px] text-slate-400 mt-1">On track for target</p>
        </div>
      </div>

      {/* Main Weekly Study Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              Weekly Study Hours Chart
            </h2>
            <p className="text-xs text-slate-400">Hours spent studying each day from Monday to Sunday</p>
          </div>
          <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
            Total: {totalWeeklyHours} Hours This Week
          </span>
        </div>

        {/* Bar Chart Representation */}
        <div className="h-56 pt-8 pb-4 flex items-end justify-between gap-3 border-b border-slate-800">
          {streakDays.map((d, idx) => {
            const heightPercent = Math.max(8, Math.round((d.hoursStudied / maxWeeklyHour) * 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                
                {/* Hover Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-2 py-1 rounded bg-slate-800 text-purple-300 text-[10px] font-bold border border-slate-700 shadow pointer-events-none whitespace-nowrap">
                  {d.hoursStudied} Hours
                </div>

                {/* Bar */}
                <div className="w-full max-w-[36px] bg-slate-800 rounded-xl overflow-hidden flex flex-col justify-end h-40">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full transition-all duration-700 rounded-t-xl ${
                      d.completed
                        ? 'bg-gradient-to-t from-purple-600 to-indigo-500 shadow-lg shadow-purple-500/20'
                        : 'bg-slate-700'
                    }`}
                  />
                </div>

                {/* Day Label */}
                <span className="text-xs font-bold text-slate-400 uppercase">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject Distribution */}
      <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-4">
        <h2 className="font-bold text-base text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          Subject Task Distribution
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(subjectCounts).map(([sub, count]) => {
            const pct = Math.round((count / tasks.length) * 100);
            return (
              <div key={sub} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">{sub}</span>
                  <span className="text-purple-300">{count} Tasks ({pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
