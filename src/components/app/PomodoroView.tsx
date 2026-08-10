import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, RotateCcw, Clock, Sparkles, Volume2, CheckCircle, Tag, Award } from 'lucide-react';
import { TimerMode } from '../../types';

export const PomodoroView: React.FC = () => {
  const {
    timerMode,
    setTimerMode,
    timerSecondsLeft,
    isTimerRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    timerSubject,
    setTimerSubject,
    sessions,
    completedSessionsToday,
    totalStudyMinutesToday,
  } = useApp();

  // Mode durations in seconds
  const modeMaxSeconds: Record<TimerMode, number> = {
    'Focus': 25 * 60,
    'Short Break': 5 * 60,
    'Long Break': 15 * 60,
  };

  const totalSecs = modeMaxSeconds[timerMode];
  const progressPercent = Math.min(100, Math.round(((totalSecs - timerSecondsLeft) / totalSecs) * 100));

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Convert study minutes into "2h 35m" format
  const hours = Math.floor(totalStudyMinutesToday / 60);
  const mins = totalStudyMinutesToday % 60;
  const formattedStudyTime = `${hours}h ${mins}m`;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-400" />
            Pomodoro Focus Timer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Boost retention using 25-minute deep focus intervals with scientific short and long breaks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Today: {formattedStudyTime}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            {completedSessionsToday} Sessions
          </div>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="p-8 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl text-center relative overflow-hidden max-w-2xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mode Switcher Tabs */}
        <div className="inline-flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 mb-6 gap-1">
          {(['Focus', 'Short Break', 'Long Break'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setTimerMode(mode)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timerMode === mode
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Subject Picker */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Tag className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs text-slate-400 font-medium">Focusing on:</span>
          <select
            value={timerSubject}
            onChange={e => setTimerSubject(e.target.value)}
            className="bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1 text-xs text-purple-300 font-semibold focus:outline-none focus:border-purple-500"
          >
            <option value="Physics">Physics</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Literature">Literature</option>
            <option value="General Study">General Study</option>
          </select>
        </div>

        {/* Huge Ring Display */}
        <div className="relative w-64 h-64 mx-auto my-4 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="112"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800/80"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="112"
              stroke="currentColor"
              strokeWidth="10"
              className="text-purple-500 transition-all duration-1000"
              fill="transparent"
              strokeDasharray={703}
              strokeDashoffset={703 - (703 * progressPercent) / 100}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-white tracking-widest font-mono">
              {formatTime(timerSecondsLeft)}
            </span>
            <span className="text-xs font-semibold text-purple-300 mt-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {timerMode === 'Focus' ? `${timerSubject} Focus` : timerMode}
            </span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={resetTimer}
            title="Reset Timer"
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white transition-all hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {isTimerRunning ? (
            <button
              onClick={pauseTimer}
              className="px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-xl shadow-amber-600/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Pause className="w-5 h-5 fill-current" />
              Pause Timer
            </button>
          ) : (
            <button
              onClick={startTimer}
              className="px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Focus Session
            </button>
          )}

          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800 text-purple-400">
            <Volume2 className="w-5 h-5" />
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-6">
          Tip: Close distracting browser tabs and put your phone face down during focus intervals.
        </p>
      </div>

      {/* Completed Sessions Log */}
      <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl">
        <h2 className="font-bold text-base text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          Today's Completed Sessions ({sessions.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sessions.map((s, idx) => (
            <div
              key={s.id || idx}
              className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <div>
                  <div className="font-semibold text-white">{s.subject}</div>
                  <div className="text-[11px] text-slate-400">{s.completedAt}</div>
                </div>
              </div>
              <span className="font-mono font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {s.durationMinutes}m
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
