export type MascotSkinId = 'mochi-owl' | 'byte-cat' | 'spark-bot';

export type MascotMood = 'idle' | 'focus' | 'happy' | 'celebrate' | 'break' | 'thinking' | 'surprised';

export interface MascotSkin {
  id: MascotSkinId;
  name: string;
  title: string;
  species: string;
  description: string;
  primaryColor: string;
  glowColor: string;
  badgeBg: string;
}

export const MASCOT_SKINS: Record<MascotSkinId, MascotSkin> = {
  'mochi-owl': {
    id: 'mochi-owl',
    name: 'Mochi',
    title: 'The Wise Study Owl',
    species: 'Cyber Owl',
    description: 'A cozy neon owl that loves deep focus sessions, study streaks, and tea breaks.',
    primaryColor: '#a855f7', // purple-500
    glowColor: 'rgba(168, 85, 247, 0.4)',
    badgeBg: 'bg-purple-950/80 border-purple-500/40 text-purple-300',
  },
  'byte-cat': {
    id: 'byte-cat',
    name: 'Byte',
    title: 'The Hacker Cat',
    species: 'Neon Kitten',
    description: 'A swift cyber kitten that keeps your task list organized and purrs during focus time.',
    primaryColor: '#3b82f6', // blue-500
    glowColor: 'rgba(59, 130, 246, 0.4)',
    badgeBg: 'bg-blue-950/80 border-blue-500/40 text-blue-300',
  },
  'spark-bot': {
    id: 'spark-bot',
    name: 'Spark',
    title: 'The Robo Companion',
    species: 'AI Assist-Bot',
    description: 'An enthusiastic AI robot built to optimize your daily study hours and celebrate every win.',
    primaryColor: '#10b981', // emerald-500
    glowColor: 'rgba(16, 185, 129, 0.4)',
    badgeBg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
  },
};

export const TAP_REACTIONS = [
  "Hey there! Ready to crush some study goals today?",
  "Did you know? Taking 5-min breaks every 25 mins improves long-term recall by 40%!",
  "Tap me anytime you need a boost or a study tip!",
  "Drink some water and sit up straight! Good posture = good focus! 💧",
  "Consistency beats intensity every single time. Keep going!",
  "You're doing fantastic! Every completed task is a step closer to your dream degree.",
  "Need to focus? Launch a 25-minute Pomodoro timer in the Focus tab!",
  "Fun fact: Your brain consolidates memories during rest. Don't skip break time!",
  "Small daily habits turn into giant semester achievements! 🌟",
  "I believe in you! Let's get that A+ together!"
];

export const EVENT_SPEECH_MESSAGES = {
  timerStart: [
    "Locking in! 25 minutes of laser-sharp focus starting now! 🚀",
    "Focus mode activated! Put your phone away, you've got this! 🎧",
    "Time to shine! I'll be right here keeping track of your progress. ⚡"
  ],
  timerPause: [
    "Paused! Take a deep breath. Click resume when you're ready! ☕",
    "Holding your spot! Don't wander off too far! ⏳"
  ],
  timerComplete: [
    "WOOHOO! 25 minutes completed! Awesome job! Time for a break! 🎉",
    "Focus session complete! Your study streak is growing stronger! ⭐",
    "Great work! You just earned study minutes toward your daily goal! 🏆"
  ],
  taskComplete: [
    "Boom! Another task checked off your list! High five! 🙌",
    "Task crushed! Look at that checklist shrinking! 🔥",
    "One step closer to victory! Keep that momentum going! 💪"
  ],
  taskAdd: [
    "New task added! Let's conquer it step by step! 📝",
    "Got it logged! I've added it to your daily queue. ✨"
  ],
  goalComplete: [
    "GOAL ACHIEVED! 100% study goal reached today! YOU ARE UNSTOPPABLE! 🥳🎉",
    "Maximum productivity reached! I'm so proud of your dedication! 🌟"
  ],
  breakStart: [
    "Break time! Step away from the screen, stretch, and relax! 🍵",
    "Relax time! You earned this rest. Recharge your battery! 🔋"
  ]
};

export const STUDY_TIPS = [
  "💡 **Pomodoro Technique**: 25 mins focus + 5 mins break prevents brain fatigue.",
  "💡 **Feynman Technique**: Explain a complex topic in simple terms to spot gaps in knowledge.",
  "💡 **Active Recall**: Quiz yourself instead of passively re-reading notes.",
  "💡 **Spaced Repetition**: Review material at increasing intervals (Day 1, 3, 7, 14).",
  "💡 **Two-Minute Rule**: If a task takes less than 2 minutes, do it immediately!"
];

export const FUN_JOKES = [
  "Why did the student eat their homework? Because the teacher said it was a piece of cake! 🎂",
  "Why was the computer cold? It left its Windows open! 🪟",
  "Parallel lines have so much in common... it's a shame they'll never meet! 📐",
  "How do chemists solve problems? They period-ically think about them! 🧪"
];
