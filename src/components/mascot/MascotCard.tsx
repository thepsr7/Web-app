import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MascotAvatar } from './MascotAvatar';
import { MascotSkinId, MASCOT_SKINS, STUDY_TIPS, TAP_REACTIONS } from './mascotData';
import { Sparkles, Flame, Lightbulb, Heart, ArrowRight, Play, Trophy } from 'lucide-react';
import { playChime } from '../../utils/audio';

export const MascotCard: React.FC = () => {
  const { user, currentStreak, totalStudyMinutesToday, progressPercentage, isTimerRunning, setMainView, setActiveTab } = useApp();

  const [skin] = useState<MascotSkinId>(() => {
    return (localStorage.getItem('study_mascot_skin') as MascotSkinId) || 'mochi-owl';
  });

  const [speech, setSpeech] = useState<string>(() => {
    if (progressPercentage >= 100) {
      return "🌟 WOW! You hit 100% of your daily study goal! Outstanding work!";
    }
    if (totalStudyMinutesToday > 0) {
      return `Great job studying ${totalStudyMinutesToday} minutes today! Let's keep that streak going! 🔥`;
    }
    return `Welcome back, ${user.name || 'Student'}! Ready to smash your study targets today?`;
  });

  const currentSkinInfo = MASCOT_SKINS[skin] || MASCOT_SKINS['mochi-owl'];

  const getNewTip = () => {
    playChime('click');
    const tip = STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)];
    setSpeech(tip);
  };

  const getMotivation = () => {
    playChime('click');
    const msg = TAP_REACTIONS[Math.floor(Math.random() * TAP_REACTIONS.length)];
    setSpeech(msg);
  };

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 text-slate-100 shadow-xl backdrop-blur-md relative overflow-hidden group">
      {/* Background Neon Accent Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-600/20 rounded-full blur-2xl group-hover:bg-purple-600/30 transition-all pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 relative z-10">
        {/* Mascot Avatar Display */}
        <div className="shrink-0 flex flex-col items-center gap-1">
          <MascotAvatar skin={skin} mood={isTimerRunning ? 'focus' : progressPercentage >= 100 ? 'celebrate' : 'idle'} size="xl" />
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950/90 border border-purple-500/40 text-purple-300">
            {currentSkinInfo.name} • {currentSkinInfo.title}
          </span>
        </div>

        {/* Companion Dialogue & Action Panel */}
        <div className="flex-1 space-y-3 text-center sm:text-left min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Study Companion
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
              {currentStreak} Day Streak
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/20 text-slate-200 text-xs font-medium leading-relaxed shadow-inner">
            "{speech}"
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <button
              onClick={() => setActiveTab('focus')}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Focus Session
            </button>

            <button
              onClick={getNewTip}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-200 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Study Tip
            </button>

            <button
              onClick={getMotivation}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-200 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
              Cheer Me On
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
