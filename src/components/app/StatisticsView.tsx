import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  BookOpen,
  Target,
  CheckCircle2,
  Flame,
  Trophy,
  Clock
} from 'lucide-react';

export const StatisticsView: React.FC = () => {
  const {
    tasks,
    sessions,
    currentStreak,
    totalStudyMinutesToday,
    progressPercentage,
    totalTasksCompleted
  } = useApp();

  const [activeRange, setActiveRange] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Progress</h1>
        
        <div className="p-2.5 rounded-2xl bg-[#141726] border border-[#2A2A40] text-[#9CA3AF]">
          <Calendar className="w-5 h-5" />
        </div>
      </div>

      {/* Tabs: Daily, Weekly, Monthly */}
      <div className="p-1.5 rounded-2xl bg-[#141726] border border-[#2A2A40] grid grid-cols-3 gap-1.5 shadow-md">
        {(['Daily', 'Weekly', 'Monthly'] as const).map(range => {
          const isSel = activeRange === range;
          return (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all text-center ${
                isSel
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white shadow-md shadow-[#8B5CF6]/30'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#2A2A40]/50'
              }`}
            >
              {range}
            </button>
          );
        })}
      </div>

      {/* Circular Progress Gauge matching mockup */}
      <div className="p-8 sm:p-10 rounded-[22px] bg-[#141726] border border-[#2A2A40] flex flex-col items-center justify-center text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="relative w-52 h-52 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="104"
              cy="104"
              r="86"
              stroke="#2A2A40"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="104"
              cy="104"
              r="86"
              stroke="url(#progressPurple)"
              strokeWidth="12"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={540}
              strokeDashoffset={540 - (540 * progressPercentage) / 100}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="progressPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-white tracking-tight">{progressPercentage}%</span>
            <span className="text-xs font-semibold text-[#9CA3AF] mt-1">Overall Progress</span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards matching mockup */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        
        {/* Study Time */}
        <div className="p-5 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-2">
          <div className="flex items-center gap-2 text-[#9CA3AF] text-xs font-semibold">
            <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
            <span>Study Time</span>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white tracking-tight">{totalStudyMinutesToday}m</div>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">Total</p>
          </div>
        </div>

        {/* Sessions */}
        <div className="p-5 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-2">
          <div className="flex items-center gap-2 text-[#9CA3AF] text-xs font-semibold">
            <Target className="w-4 h-4 text-[#A855F7]" />
            <span>Sessions</span>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white tracking-tight">{sessions.length}</div>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">Total</p>
          </div>
        </div>

        {/* Tasks Completed */}
        <div className="p-5 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-2">
          <div className="flex items-center gap-2 text-[#9CA3AF] text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>Tasks Completed</span>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white tracking-tight">{totalTasksCompleted}</div>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">Total</p>
          </div>
        </div>

        {/* Current Streak */}
        <div className="p-5 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-2">
          <div className="flex items-center gap-2 text-[#9CA3AF] text-xs font-semibold">
            <Flame className="w-4 h-4 text-[#F59E0B]" />
            <span>Current Streak</span>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white tracking-tight">{currentStreak}</div>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">Days</p>
          </div>
        </div>

      </div>

      {/* Keep Going Banner / Achievements Card matching mockup */}
      <div className="p-5 sm:p-6 rounded-[22px] bg-[#141726] border border-[#2A2A40] flex items-start gap-4 shadow-lg">
        <div className="p-3 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] shrink-0">
          <Trophy className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-white">Keep going!</h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            {totalStudyMinutesToday > 0 || tasks.length > 0
              ? 'Great start! Continue completing tasks and focus sessions to unlock milestone badges.'
              : 'Your progress will appear here as you start studying.'}
          </p>
        </div>
      </div>

    </div>
  );
};
