import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, Trophy, Award, Sparkles, Check, Flame } from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { goal, updateGoal, totalStudyMinutesToday, progressPercentage } = useApp();

  const [inputHours, setInputHours] = useState<number>(goal.targetHours);
  const [inputTasks, setInputTasks] = useState<number>(goal.targetTasks);
  const [isSaved, setIsSaved] = useState(false);

  const hours = Math.floor(totalStudyMinutesToday / 60);
  const mins = totalStudyMinutesToday % 60;
  const formattedStudyTime = `${hours}h ${mins}m`;

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoal({
      targetHours: inputHours,
      targetTasks: inputTasks,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-400" />
          Daily Goals & Progress
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Set ambitious daily targets to maintain steady academic momentum.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Goal Progress Ring & Metrics */}
        <div className="p-8 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Today's Target Progress
          </h2>

          {/* Big Progress Circle */}
          <div className="relative w-52 h-52 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="104"
                cy="104"
                r="90"
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="104"
                cy="104"
                r="90"
                stroke="currentColor"
                strokeWidth="12"
                className="text-emerald-400 transition-all duration-1000"
                fill="transparent"
                strokeDasharray={565}
                strokeDashoffset={565 - (565 * progressPercentage) / 100}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white">{progressPercentage}%</span>
              <span className="text-xs text-emerald-300 font-semibold mt-1">Goal Completed</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-center">
              <div className="text-xs text-slate-400">Hours Studied</div>
              <div className="text-lg font-bold text-white mt-0.5">{formattedStudyTime}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-center">
              <div className="text-xs text-slate-400">Target Hours</div>
              <div className="text-lg font-bold text-purple-300 mt-0.5">{goal.targetHours} Hours</div>
            </div>
          </div>

          {progressPercentage >= 100 ? (
            <div className="w-full p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Goal Achieved! Outstanding work today! 🎉</span>
            </div>
          ) : (
            <div className="w-full p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 text-purple-300 text-xs text-center font-medium">
              You need {Math.max(0, (goal.targetHours - totalStudyMinutesToday / 60)).toFixed(1)} more hours to complete today's goal!
            </div>
          )}
        </div>

        {/* Edit Goals Settings Form */}
        <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Set Daily Targets
          </h2>

          <form onSubmit={handleGoalSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Study Hours (per day)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="16"
                value={inputHours}
                onChange={e => setInputHours(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">Recommended for students: 3.5 to 5 hours daily.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Tasks Completed (per day)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={inputTasks}
                onChange={e => setInputTasks(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Goals Saved!</span>
                </>
              ) : (
                <span>Update Daily Goals</span>
              )}
            </button>
          </form>

          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              Productivity Advice
            </h3>
            <p className="text-xs text-slate-400">
              Divide long study sessions into 25-minute Pomodoro focus blocks. Micro-breaks improve long-term memory retention and protect against burnout.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
