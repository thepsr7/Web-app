import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MascotAvatar } from './MascotAvatar';
import {
  MascotSkinId,
  MascotMood,
  MASCOT_SKINS,
  TAP_REACTIONS,
  EVENT_SPEECH_MESSAGES,
  STUDY_TIPS,
  FUN_JOKES,
} from './mascotData';
import { playChime } from '../../utils/audio';
import {
  MessageSquare,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Settings,
  Lightbulb,
  Flame,
  Smile,
  Heart,
  RotateCcw,
  GripVertical,
  Move,
} from 'lucide-react';

export const MascotWidget: React.FC = () => {
  const {
    isTimerRunning,
    timerMode,
    timerSecondsLeft,
    tasks,
    goal,
    totalTasksCompleted,
    progressPercentage,
    user,
  } = useApp();

  // Local Mascot State
  const [skin, setSkin] = useState<MascotSkinId>(() => {
    return (localStorage.getItem('study_mascot_skin') as MascotSkinId) || 'mochi-owl';
  });

  const [mood, setMood] = useState<MascotMood>('idle');
  const [speech, setSpeech] = useState<string>("Let's start your first study session!");
  const [isSpeechVisible, setIsSpeechVisible] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [tapCount, setTapCount] = useState<number>(0);

  // Position & Drag State
  const [position, setPosition] = useState<{ x: number; y: number } | null>(() => {
    const saved = localStorage.getItem('study_mascot_position');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialWidgetPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragDistance = useRef<number>(0);
  const widgetRef = useRef<HTMLDivElement>(null);

  const currentSkinInfo = MASCOT_SKINS[skin] || MASCOT_SKINS['mochi-owl'];

  // Save skin setting
  useEffect(() => {
    localStorage.setItem('study_mascot_skin', skin);
  }, [skin]);

  // Save position setting
  useEffect(() => {
    if (position) {
      localStorage.setItem('study_mascot_position', JSON.stringify(position));
    }
  }, [position]);

  // Handle window resize to keep mascot on-screen
  useEffect(() => {
    const handleResize = () => {
      if (position) {
        const maxX = Math.max(10, window.innerWidth - 320);
        const maxY = Math.max(10, window.innerHeight - 180);
        setPosition({
          x: Math.min(Math.max(10, position.x), maxX),
          y: Math.min(Math.max(10, position.y), maxY),
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  // Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only allow left click or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const widget = widgetRef.current;
    if (!widget) return;

    const rect = widget.getBoundingClientRect();
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    initialWidgetPos.current = { x: rect.left, y: rect.top };
    dragDistance.current = 0;
    setIsDragging(true);

    if (!position) {
      setPosition({ x: rect.left, y: rect.top });
    }

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    dragDistance.current = Math.hypot(dx, dy);

    const maxX = Math.max(10, window.innerWidth - 100);
    const maxY = Math.max(10, window.innerHeight - 100);

    const newX = Math.min(Math.max(10, initialWidgetPos.current.x + dx), maxX);
    const newY = Math.min(Math.max(10, initialWidgetPos.current.y + dy), maxY);

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }
  };

  const resetPosition = () => {
    setPosition(null);
    localStorage.removeItem('study_mascot_position');
    if (!isMuted) playChime('click');
  };

  // Reactive Mood Updates based on Pomodoro & Task states
  useEffect(() => {
    if (isTimerRunning) {
      if (timerMode === 'Focus') {
        setMood('focus');
      } else {
        setMood('break');
      }
    } else if (progressPercentage >= 100) {
      setMood('celebrate');
    } else {
      setMood('idle');
    }
  }, [isTimerRunning, timerMode, progressPercentage]);

  // Handle Mascot Tap Reaction (only trigger if not dragging)
  const handleMascotTap = (e: React.MouseEvent) => {
    if (dragDistance.current > 5) {
      // User dragged mascot, so skip tap interaction
      return;
    }

    if (!isMuted) playChime('click');

    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    // Set temporary excited / happy reaction mood
    const nextMood: MascotMood = nextCount % 3 === 0 ? 'surprised' : 'happy';
    setMood(nextMood);

    // Select random reaction message
    const randomMsg = TAP_REACTIONS[Math.floor(Math.random() * TAP_REACTIONS.length)];
    setSpeech(randomMsg);
    setIsSpeechVisible(true);

    // Reset back to idle/focus mood after 3s
    setTimeout(() => {
      setMood(isTimerRunning ? (timerMode === 'Focus' ? 'focus' : 'break') : 'idle');
    }, 3000);
  };

  const triggerTip = () => {
    if (!isMuted) playChime('click');
    const randomTip = STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)];
    setMood('thinking');
    setSpeech(randomTip);
    setIsSpeechVisible(true);
  };

  const triggerMotivation = () => {
    if (!isMuted) playChime('click');
    setMood('happy');
    setSpeech(`🔥 You got this, ${user.name || 'Student'}! Keep pushing! High effort yields high results!`);
    setIsSpeechVisible(true);
  };

  const triggerJoke = () => {
    if (!isMuted) playChime('click');
    const randomJoke = FUN_JOKES[Math.floor(Math.random() * FUN_JOKES.length)];
    setMood('celebrate');
    setSpeech(randomJoke);
    setIsSpeechVisible(true);
  };

  // Style positioning logic
  const containerStyle: React.CSSProperties = position
    ? {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
      }
    : {};

  return (
    <>
      {/* Floating Mascot Companion Widget */}
      <div
        ref={widgetRef}
        style={containerStyle}
        className={`z-50 flex flex-col items-end gap-2 max-w-[340px] pointer-events-auto select-none transition-shadow ${
          !position ? 'fixed bottom-16 sm:bottom-6 right-4 sm:right-6' : ''
        }`}
      >
        {/* Speech Bubble */}
        {!isCollapsed && isSpeechVisible && (
          <div className="relative p-3.5 rounded-2xl bg-slate-900/95 border border-purple-500/40 text-slate-100 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
            {/* Top Bar of Speech Bubble with Drag Handle */}
            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800 text-[11px]">
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="flex items-center gap-1.5 font-bold text-purple-300 cursor-grab active:cursor-grabbing flex-1 py-0.5"
                title="Hold and drag to move mascot!"
              >
                <GripVertical className="w-3.5 h-3.5 text-slate-500 hover:text-purple-400" />
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                <span>{currentSkinInfo.name}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300">
                  {mood.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {position && (
                  <button
                    onClick={resetPosition}
                    className="p-1 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 transition-all"
                    title="Reset Position to Bottom Right"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 transition-all"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 transition-all"
                  title="Change Mascot Skin"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsSpeechVisible(false)}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Speech Content */}
            <p className="text-xs font-medium leading-relaxed text-slate-200 mb-2.5">
              {speech}
            </p>

            {/* Quick Interactive Prompt Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <button
                onClick={triggerTip}
                className="px-2 py-1 rounded-lg bg-purple-950/80 border border-purple-500/30 hover:border-purple-400 text-purple-200 text-[10px] font-semibold flex items-center gap-1 hover:scale-105 active:scale-95 transition-all"
              >
                <Lightbulb className="w-3 h-3 text-amber-400" />
                Study Tip
              </button>
              <button
                onClick={triggerMotivation}
                className="px-2 py-1 rounded-lg bg-purple-950/80 border border-purple-500/30 hover:border-purple-400 text-purple-200 text-[10px] font-semibold flex items-center gap-1 hover:scale-105 active:scale-95 transition-all"
              >
                <Flame className="w-3 h-3 text-rose-400" />
                Motivate
              </button>
              <button
                onClick={triggerJoke}
                className="px-2 py-1 rounded-lg bg-purple-950/80 border border-purple-500/30 hover:border-purple-400 text-purple-200 text-[10px] font-semibold flex items-center gap-1 hover:scale-105 active:scale-95 transition-all"
              >
                <Smile className="w-3 h-3 text-cyan-400" />
                Joke
              </button>
            </div>

            {/* Bubble Tail Arrow */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-slate-900 border-r border-b border-purple-500/40 transform rotate-45" />
          </div>
        )}

        {/* Mascot Avatar Container with Drag Control */}
        <div className="relative group flex items-center gap-2">
          {/* Collapse/Expand Toggle Pill */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800 shadow-md backdrop-blur-md transition-all"
            title={isCollapsed ? 'Expand Companion' : 'Minimize Companion'}
          >
            {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Draggable & Clickable Mascot Circle */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClick={handleMascotTap}
            className={`relative cursor-grab active:cursor-grabbing transition-transform ${
              isDragging ? 'scale-105 opacity-90' : 'hover:scale-110 active:scale-95'
            }`}
            title="Drag to move mascot • Click to chat!"
          >
            <MascotAvatar skin={skin} mood={mood} size={isCollapsed ? 'md' : 'lg'} />

            {/* Move Handle Overlay Badge on Hover */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 border border-purple-500/40 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 text-[9px] text-purple-300 font-bold shadow-md">
              <Move className="w-2.5 h-2.5" />
              <span>Drag</span>
            </div>

            {/* Live Status Indicator Pill */}
            {isTimerRunning && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-600 text-white animate-pulse border border-purple-300 shadow-md">
                FOCUSING
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mascot Settings Modal / Skin Chooser */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-purple-500/40 text-slate-100 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-extrabold text-white">Choose Your Study Mascot</h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mascot Skin Cards */}
            <div className="grid grid-cols-1 gap-3">
              {(Object.keys(MASCOT_SKINS) as MascotSkinId[]).map(skinId => {
                const s = MASCOT_SKINS[skinId];
                const isSelected = skin === skinId;
                return (
                  <div
                    key={skinId}
                    onClick={() => {
                      setSkin(skinId);
                      if (!isMuted) playChime('click');
                      setSpeech(`Yay! I am now ${s.name}, ${s.title}! Drag me anywhere you want! 🎉`);
                      setIsSettingsOpen(false);
                      setIsSpeechVisible(true);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                      isSelected
                        ? 'bg-purple-950/60 border-purple-500 shadow-lg shadow-purple-500/20 ring-1 ring-purple-500'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="shrink-0">
                      <MascotAvatar skin={skinId} mood={isSelected ? 'happy' : 'idle'} size="md" isAnimated={isSelected} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-white">{s.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.badgeBg}`}>
                          {s.species}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{s.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all"
              >
                Save Mascot Choice
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
