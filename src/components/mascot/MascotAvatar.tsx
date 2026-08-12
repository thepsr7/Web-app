import React from 'react';
import { MascotSkinId, MascotMood } from './mascotData';

interface MascotAvatarProps {
  skin?: MascotSkinId;
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  isAnimated?: boolean;
}

const SIZE_MAP = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
  '2xl': 'w-40 h-40',
};

export const MascotAvatar: React.FC<MascotAvatarProps> = ({
  skin = 'mochi-owl',
  mood = 'idle',
  size = 'lg',
  className = '',
  isAnimated = true,
}) => {
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.lg;

  // Render Mochi Owl
  if (skin === 'mochi-owl') {
    return (
      <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className}`}>
        {/* Glow Aura */}
        <div
          className={`absolute inset-0 rounded-full blur-lg opacity-60 transition-all duration-500 ${
            mood === 'focus'
              ? 'bg-purple-500/80 animate-pulse'
              : mood === 'celebrate' || mood === 'happy'
              ? 'bg-amber-400/80 animate-ping'
              : 'bg-purple-600/40'
          }`}
        />

        <svg
          viewBox="0 0 200 200"
          className={`w-full h-full relative z-10 drop-shadow-[0_10px_20px_rgba(168,85,247,0.4)] ${
            isAnimated ? (mood === 'celebrate' ? 'animate-bounce' : mood === 'focus' ? 'animate-pulse' : 'animate-float') : ''
          }`}
        >
          <defs>
            {/* Body Gradient */}
            <linearGradient id="owlBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>

            {/* Belly Gradient */}
            <linearGradient id="owlBelly" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fae8ff" />
              <stop offset="100%" stopColor="#e9d5ff" />
            </linearGradient>

            {/* Wing Gradient */}
            <linearGradient id="owlWing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7e22ce" />
              <stop offset="100%" stopColor="#3b0764" />
            </linearGradient>

            {/* Beak Gradient */}
            <linearGradient id="owlBeak" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            {/* Headphones Gradient */}
            <linearGradient id="headphoneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>

          {/* Headphones Band (When in focus mood) */}
          {(mood === 'focus' || mood === 'idle') && (
            <path
              d="M 40 85 A 65 65 0 0 1 160 85"
              fill="none"
              stroke="url(#headphoneGrad)"
              strokeWidth="12"
              strokeLinecap="round"
            />
          )}

          {/* Ear Tufts / Feather Horns */}
          <path d="M 50 50 Q 30 15 75 40 Z" fill="#7e22ce" />
          <path d="M 150 50 Q 170 15 125 40 Z" fill="#7e22ce" />

          {/* Main Body */}
          <ellipse cx="100" cy="115" rx="70" ry="75" fill="url(#owlBody)" />

          {/* Belly Feather Patch */}
          <ellipse cx="100" cy="130" rx="42" ry="48" fill="url(#owlBelly)" />
          {/* Belly feather heart/v pattern */}
          <path d="M 90 115 Q 100 122 110 115" stroke="#c084fc" strokeWidth="3" fill="none" />
          <path d="M 85 130 Q 100 138 115 130" stroke="#c084fc" strokeWidth="3" fill="none" />
          <path d="M 90 145 Q 100 152 110 145" stroke="#c084fc" strokeWidth="3" fill="none" />

          {/* Left & Right Wings */}
          <path
            d="M 32 110 Q 15 140 45 155 Q 40 130 32 110 Z"
            fill="url(#owlWing)"
            className={mood === 'celebrate' || mood === 'happy' ? 'animate-wiggle origin-top-left' : ''}
          />
          <path
            d="M 168 110 Q 185 140 155 155 Q 160 130 168 110 Z"
            fill="url(#owlWing)"
            className={mood === 'celebrate' || mood === 'happy' ? 'animate-wiggle origin-top-right' : ''}
          />

          {/* Eye Rings / Feathers Background */}
          <circle cx="70" cy="85" r="32" fill="#3b0764" />
          <circle cx="130" cy="85" r="32" fill="#3b0764" />

          <circle cx="70" cy="85" r="28" fill="#ffffff" />
          <circle cx="130" cy="85" r="28" fill="#ffffff" />

          {/* EYES based on Mood */}
          {mood === 'happy' || mood === 'celebrate' ? (
            <>
              {/* Happy Arcs ^ ^ */}
              <path d="M 55 88 Q 70 68 85 88" stroke="#581c87" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M 115 88 Q 130 68 145 88" stroke="#581c87" strokeWidth="6" fill="none" strokeLinecap="round" />
              {/* Star sparkles */}
              <polygon points="100,35 103,42 110,43 105,48 106,55 100,51 94,55 95,48 90,43 97,42" fill="#fbbf24" />
            </>
          ) : mood === 'focus' ? (
            <>
              {/* Cyber Glasses / Focus Goggles */}
              <rect x="42" y="68" width="56" height="34" rx="10" fill="#0f172a" stroke="#818cf8" strokeWidth="3" />
              <rect x="102" y="68" width="56" height="34" rx="10" fill="#0f172a" stroke="#818cf8" strokeWidth="3" />
              <line x1="98" y1="85" x2="102" y2="85" stroke="#818cf8" strokeWidth="4" />

              {/* Glowing Blue Pupil */}
              <circle cx="70" cy="85" r="8" fill="#38bdf8" />
              <circle cx="72" cy="83" r="3" fill="#ffffff" />
              <circle cx="130" cy="85" r="8" fill="#38bdf8" />
              <circle cx="132" cy="83" r="3" fill="#ffffff" />
            </>
          ) : mood === 'break' ? (
            <>
              {/* Sleeping / Relaxing eyelids */}
              <path d="M 55 82 Q 70 95 85 82" stroke="#581c87" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M 115 82 Q 130 95 145 82" stroke="#581c87" strokeWidth="5" fill="none" strokeLinecap="round" />
              {/* Zzz floating */}
              <text x="155" y="55" fill="#a855f7" className="text-xs font-bold animate-pulse">Zzz</text>
            </>
          ) : mood === 'surprised' ? (
            <>
              <circle cx="70" cy="85" r="14" fill="#0f172a" />
              <circle cx="74" cy="80" r="5" fill="#ffffff" />
              <circle cx="130" cy="85" r="14" fill="#0f172a" />
              <circle cx="134" cy="80" r="5" fill="#ffffff" />
            </>
          ) : (
            <>
              {/* Idle Normal Eyes with Light Shine */}
              <g className={isAnimated ? 'animate-blink origin-center' : ''}>
                <circle cx="70" cy="85" r="16" fill="#0f172a" />
                <circle cx="75" cy="80" r="6" fill="#ffffff" />
                <circle cx="66" cy="90" r="2.5" fill="#ffffff" />

                <circle cx="130" cy="85" r="16" fill="#0f172a" />
                <circle cx="135" cy="80" r="6" fill="#ffffff" />
                <circle cx="126" cy="90" r="2.5" fill="#ffffff" />
              </g>
            </>
          )}

          {/* Cute Rosy Cheeks */}
          <ellipse cx="48" cy="98" rx="8" ry="5" fill="#f43f5e" opacity="0.6" />
          <ellipse cx="152" cy="98" rx="8" ry="5" fill="#f43f5e" opacity="0.6" />

          {/* Cute Golden Beak */}
          <polygon points="100,92 90,105 110,105" fill="url(#owlBeak)" />

          {/* Headphone Ear Cups */}
          {(mood === 'focus' || mood === 'idle') && (
            <>
              <rect x="28" y="72" width="16" height="28" rx="8" fill="#38bdf8" />
              <rect x="156" y="72" width="16" height="28" rx="8" fill="#38bdf8" />
            </>
          )}

          {/* Tiny Graduation Cap or Bow Tie */}
          <path d="M 100 25 L 130 38 L 100 50 L 70 38 Z" fill="#020617" stroke="#a855f7" strokeWidth="2" />
          <rect x="93" y="20" width="14" height="8" rx="2" fill="#a855f7" />
          <line x1="130" y1="38" x2="135" y2="52" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="135" cy="54" r="3" fill="#fbbf24" />

          {/* Feet */}
          <path d="M 80 185 Q 85 195 90 185" stroke="#f59e0b" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 110 185 Q 115 195 120 185" stroke="#f59e0b" strokeWidth="5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Render Byte Cat
  if (skin === 'byte-cat') {
    return (
      <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className}`}>
        <div
          className={`absolute inset-0 rounded-full blur-lg opacity-60 transition-all duration-500 ${
            mood === 'focus'
              ? 'bg-blue-500/80 animate-pulse'
              : mood === 'celebrate' || mood === 'happy'
              ? 'bg-cyan-400/80 animate-ping'
              : 'bg-blue-600/40'
          }`}
        />

        <svg
          viewBox="0 0 200 200"
          className={`w-full h-full relative z-10 drop-shadow-[0_10px_20px_rgba(59,130,246,0.4)] ${
            isAnimated ? (mood === 'celebrate' ? 'animate-bounce' : 'animate-float') : ''
          }`}
        >
          <defs>
            <linearGradient id="catBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
            <linearGradient id="catVisor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Cat Ears */}
          <polygon points="40,70 20,20 80,45" fill="#1e40af" stroke="#60a5fa" strokeWidth="3" />
          <polygon points="45,60 30,30 75,45" fill="#f472b6" />

          <polygon points="160,70 180,20 120,45" fill="#1e40af" stroke="#60a5fa" strokeWidth="3" />
          <polygon points="155,60 170,30 125,45" fill="#f472b6" />

          {/* Body Head Circle */}
          <ellipse cx="100" cy="110" rx="68" ry="60" fill="url(#catBody)" />

          {/* Cyber Visor Screen */}
          <rect x="42" y="80" width="116" height="50" rx="20" fill="#0f172a" stroke="url(#catVisor)" strokeWidth="4" />

          {/* Visor Eyes based on Mood */}
          {mood === 'happy' || mood === 'celebrate' ? (
            <>
              <path d="M 60 105 Q 75 90 90 105" stroke="#38bdf8" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M 110 105 Q 125 90 140 105" stroke="#38bdf8" strokeWidth="6" fill="none" strokeLinecap="round" />
            </>
          ) : mood === 'focus' ? (
            <>
              <text x="60" y="112" fill="#38bdf8" className="text-xl font-mono font-bold">&gt;_</text>
              <text x="115" y="112" fill="#38bdf8" className="text-xl font-mono font-bold">&lt;_</text>
            </>
          ) : (
            <g className={isAnimated ? 'animate-blink origin-center' : ''}>
              <circle cx="75" cy="105" r="12" fill="#38bdf8" />
              <circle cx="78" cy="101" r="4" fill="#ffffff" />
              <circle cx="125" cy="105" r="12" fill="#38bdf8" />
              <circle cx="128" cy="101" r="4" fill="#ffffff" />
            </g>
          )}

          {/* Cute Nose and Whiskers */}
          <polygon points="100,132 95,138 105,138" fill="#f472b6" />
          <path d="M 95 142 Q 100 148 105 142" stroke="#60a5fa" strokeWidth="2" fill="none" />

          {/* Whiskers */}
          <line x1="20" y1="110" x2="40" y2="112" stroke="#60a5fa" strokeWidth="2" />
          <line x1="18" y1="125" x2="40" y2="122" stroke="#60a5fa" strokeWidth="2" />
          <line x1="180" y1="110" x2="160" y2="112" stroke="#60a5fa" strokeWidth="2" />
          <line x1="182" y1="125" x2="160" y2="122" stroke="#60a5fa" strokeWidth="2" />

          {/* Tail */}
          <path d="M 160 145 C 190 150, 195 100, 175 90" stroke="#3b82f6" strokeWidth="10" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Render Spark Bot
  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      <div
        className={`absolute inset-0 rounded-full blur-lg opacity-60 transition-all duration-500 ${
          mood === 'focus'
            ? 'bg-emerald-500/80 animate-pulse'
            : mood === 'celebrate' || mood === 'happy'
            ? 'bg-yellow-400/80 animate-ping'
            : 'bg-emerald-600/40'
        }`}
      />

      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full relative z-10 drop-shadow-[0_10px_20px_rgba(16,185,129,0.4)] ${
          isAnimated ? (mood === 'celebrate' ? 'animate-bounce' : 'animate-float') : ''
        }`}
      >
        <defs>
          <linearGradient id="botHead" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#065f46" />
          </linearGradient>
        </defs>

        {/* Antenna */}
        <line x1="100" y1="40" x2="100" y2="10" stroke="#34d399" strokeWidth="5" />
        <circle cx="100" cy="10" r="8" fill={mood === 'focus' ? '#f59e0b' : '#34d399'} className="animate-pulse" />

        {/* Ears */}
        <rect x="25" y="80" width="15" height="30" rx="5" fill="#065f46" stroke="#34d399" strokeWidth="2" />
        <rect x="160" y="80" width="15" height="30" rx="5" fill="#065f46" stroke="#34d399" strokeWidth="2" />

        {/* Robot Head Body */}
        <rect x="38" y="40" width="124" height="110" rx="28" fill="url(#botHead)" stroke="#6ee7b7" strokeWidth="4" />

        {/* Screen Face */}
        <rect x="52" y="58" width="96" height="74" rx="18" fill="#020617" stroke="#10b981" strokeWidth="3" />

        {/* Screen Eyes */}
        {mood === 'happy' || mood === 'celebrate' ? (
          <>
            <path d="M 66 90 Q 78 76 90 90" stroke="#34d399" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 110 90 Q 122 76 134 90" stroke="#34d399" strokeWidth="6" fill="none" strokeLinecap="round" />
          </>
        ) : mood === 'focus' ? (
          <>
            <rect x="66" y="82" width="22" height="12" rx="4" fill="#34d399" />
            <rect x="112" y="82" width="22" height="12" rx="4" fill="#34d399" />
          </>
        ) : (
          <g className={isAnimated ? 'animate-blink origin-center' : ''}>
            <circle cx="78" cy="88" r="10" fill="#34d399" />
            <circle cx="81" cy="85" r="3" fill="#ffffff" />
            <circle cx="122" cy="88" r="10" fill="#34d399" />
            <circle cx="125" cy="85" r="3" fill="#ffffff" />
          </g>
        )}

        {/* LED Smile */}
        <path d="M 85 112 Q 100 122 115 112" stroke="#34d399" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
};
