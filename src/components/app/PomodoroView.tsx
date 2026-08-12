import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Sprout,
  Lightbulb,
  BarChart2,
  Clock,
  Music,
  Volume2,
  VolumeX,
  Sparkles,
  Headphones
} from 'lucide-react';
import { TimerMode } from '../../types';
import { startAmbientSound, stopAmbientSound, setAmbientVolume, AmbientPreset } from '../../utils/audio';

export const PomodoroView: React.FC = () => {
  const {
    timerMode,
    setTimerMode,
    timerSecondsLeft,
    isTimerRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    sessions,
    setActiveTab
  } = useApp();

  // Ambient Study Sound state
  const [ambientPreset, setAmbientPreset] = useState<AmbientPreset>('none');
  const [volume, setVolume] = useState<number>(0.3);

  // Sync volume or stop ambient sound when component unmounts
  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  const handleSelectPreset = (pId: AmbientPreset) => {
    setAmbientPreset(pId);
    if (pId === 'none') {
      stopAmbientSound();
    } else {
      startAmbientSound(pId, volume);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setAmbientVolume(newVol);
  };

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

  // SVG Circle Parameters
  const size = 260;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Focus</h1>
        
        <button
          onClick={() => setActiveTab('stats')}
          className="p-2.5 rounded-2xl bg-[#141726] border border-[#2A2A40] text-[#9CA3AF] hover:text-white transition-all shadow-md"
          title="View Progress & Stats"
        >
          <BarChart2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Timer Display */}
      <div className="p-8 sm:p-10 rounded-[22px] bg-[#141726] border border-[#2A2A40] flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden shadow-2xl">
        
        {/* Animated Circular Progress Ring */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#2A2A40"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="url(#purpleGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
            <span className="text-5xl sm:text-6xl font-black text-white tracking-tight font-mono">
              {formatTime(timerSecondsLeft)}
            </span>
            <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
              {timerMode} Time
            </span>
            <div className="pt-1 text-[#22C55E]">
              <Sprout className="w-5 h-5 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-5 pt-2">
          
          {/* Reset Button */}
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-[#9CA3AF] hover:text-white hover:border-[#8B5CF6]/50 transition-all shadow-md"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Play / Pause Primary CTA Button */}
          {isTimerRunning ? (
            <button
              onClick={pauseTimer}
              className="p-5 rounded-3xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white shadow-xl shadow-[#8B5CF6]/40 hover:scale-105 active:scale-95 transition-all"
              title="Pause Focus Session"
            >
              <Pause className="w-7 h-7 fill-white" />
            </button>
          ) : (
            <button
              onClick={startTimer}
              className="p-5 rounded-3xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white shadow-xl shadow-[#8B5CF6]/40 hover:scale-105 active:scale-95 transition-all"
              title="Start Focus Session"
            >
              <Play className="w-7 h-7 fill-white ml-0.5" />
            </button>
          )}

          {/* Stop / Reset Button */}
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-[#9CA3AF] hover:text-white hover:border-[#8B5CF6]/50 transition-all shadow-md"
            title="Stop Timer"
          >
            <Square className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full pt-2">
          {(['Focus', 'Short Break', 'Long Break'] as const).map(mode => {
            const isSel = timerMode === mode;
            const duration = mode === 'Focus' ? '25 min' : mode === 'Short Break' ? '5 min' : '15 min';
            return (
              <button
                key={mode}
                onClick={() => setTimerMode(mode)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSel
                    ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white shadow-md'
                    : 'bg-[#09090F] border-[#2A2A40] text-[#9CA3AF] hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-extrabold">{mode}</div>
                <div className="text-[10px] text-[#9CA3AF]">{duration}</div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Ambient Study Audio Sound Player */}
      <div className="p-5 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold text-white">
            <Headphones className="w-4 h-4 text-[#8B5CF6]" />
            <span>Ambient Study Sounds</span>
            {ambientPreset !== 'none' && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#8B5CF6] text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
                Playing
              </span>
            )}
          </div>
          {ambientPreset !== 'none' && (
            <div className="flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-[#9CA3AF]" />
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={volume}
                onChange={e => handleVolumeChange(Number(e.target.value))}
                className="w-16 accent-[#8B5CF6] h-1 bg-[#2A2A40] rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {[
            { id: 'none', label: 'Mute' },
            { id: 'lofi', label: '🎵 Lofi Chords' },
            { id: 'rain', label: '🌧 Soft Rain' },
            { id: 'waves', label: '⚡ Focus Beta' },
            { id: 'cafe', label: '☕ Cafe Ambience' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.id as AmbientPreset)}
              className={`p-2.5 rounded-xl border font-bold text-center transition-all text-[11px] ${
                ambientPreset === p.id
                  ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-md shadow-[#8B5CF6]/30'
                  : 'bg-[#09090F] border-[#2A2A40] text-[#9CA3AF] hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Focus Tip Card */}
      <div className="p-4 sm:p-5 rounded-[22px] bg-[#141726] border border-[#2A2A40] flex items-start gap-3.5 shadow-md">
        <div className="p-2.5 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-white">Focus Tip</h4>
          <p className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">
            Eliminate distractions and give your best to your goals. Micro-breaks restore cognitive focus.
          </p>
        </div>
      </div>

      {/* Session History */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-[#9CA3AF] uppercase tracking-wider">
          Today's Focus History
        </h3>

        {sessions.length === 0 ? (
          <div className="p-6 rounded-[22px] bg-[#141726] border border-[#2A2A40] text-center space-y-2">
            <Clock className="w-8 h-8 text-[#9CA3AF] mx-auto opacity-50" />
            <p className="text-xs font-bold text-[#9CA3AF]">No focus sessions completed yet.</p>
            <p className="text-[11px] text-[#9CA3AF]/70">Press Play above to start your first session!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map(s => (
              <div
                key={s.id}
                className="p-3.5 rounded-2xl bg-[#141726] border border-[#2A2A40] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span className="font-bold text-white">{s.subject}</span>
                </div>
                <span className="text-[#9CA3AF]">{s.durationMinutes} min</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
