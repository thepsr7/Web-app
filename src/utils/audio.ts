// Web Audio API utility for pleasant notification chimes, haptics & ambient study sounds

let soundStartEnabled = true;
let soundEndEnabled = true;
let hapticsEnabled = true;

export function setAudioPreferences(prefs: { soundStart?: boolean; soundEnd?: boolean; haptics?: boolean }) {
  if (prefs.soundStart !== undefined) soundStartEnabled = prefs.soundStart;
  if (prefs.soundEnd !== undefined) soundEndEnabled = prefs.soundEnd;
  if (prefs.haptics !== undefined) hapticsEnabled = prefs.haptics;
}

export function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light') {
  if (!hapticsEnabled) return;
  if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
    try {
      if (type === 'light') navigator.vibrate(10);
      else if (type === 'medium') navigator.vibrate([15, 30, 15]);
      else if (type === 'heavy') navigator.vibrate([30, 50, 30]);
    } catch {
      // Ignore vibration errors
    }
  }
}

export function playChime(type: 'complete' | 'start' | 'click' | 'tick' = 'complete') {
  triggerHaptic(type === 'complete' ? 'heavy' : type === 'start' ? 'medium' : 'light');

  if (type === 'start' && !soundStartEnabled) return;
  if (type === 'complete' && !soundEndEnabled) return;

  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    
    if (type === 'complete') {
      // Pleasant double-chime (E5 -> A5)
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now); // E5
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.25); // A5
      gain2.gain.setValueAtTime(0.2, now + 0.25);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.25);
      osc2.stop(now + 0.85);
    } else if (type === 'start') {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.2); // E5
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'click') {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'tick') {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.02);
    }
  } catch (e) {
    console.warn('Audio playback error:', e);
  }
}

// Ambient Study Sound Synthesizer Engine
export type AmbientPreset = 'none' | 'lofi' | 'rain' | 'waves' | 'cafe';

let ambientCtx: AudioContext | null = null;
let ambientNodes: (OscillatorNode | AudioBufferSourceNode | BiquadFilterNode | GainNode)[] = null!;
let ambientGainNode: GainNode | null = null;
let currentAmbientPreset: AmbientPreset = 'none';

export function startAmbientSound(preset: AmbientPreset, volume: number = 0.3) {
  stopAmbientSound();
  if (preset === 'none') return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    ambientCtx = new AudioContextClass();
    ambientGainNode = ambientCtx.createGain();
    ambientGainNode.gain.setValueAtTime(volume, ambientCtx.currentTime);
    ambientGainNode.connect(ambientCtx.destination);
    ambientNodes = [];
    currentAmbientPreset = preset;

    if (preset === 'rain') {
      // Synthesize pink noise rain
      const bufferSize = 2 * ambientCtx.sampleRate;
      const noiseBuffer = ambientCtx.createBuffer(1, bufferSize, ambientCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoise = ambientCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ambientCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ambientCtx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(ambientGainNode);
      whiteNoise.start();
      ambientNodes.push(whiteNoise, filter);

    } else if (preset === 'waves' || preset === 'lofi') {
      // Warm chord / binaural focus drone
      const freqs = preset === 'waves' ? [110, 220, 330, 440] : [130.81, 164.81, 196.00, 246.94]; // C chord / Cmaj7
      freqs.forEach((freq, idx) => {
        if (!ambientCtx || !ambientGainNode) return;
        const osc = ambientCtx.createOscillator();
        const gain = ambientCtx.createGain();
        osc.type = preset === 'waves' ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq + (idx * 0.5), ambientCtx.currentTime);
        
        gain.gain.setValueAtTime(0.08 / freqs.length, ambientCtx.currentTime);
        osc.connect(gain);
        gain.connect(ambientGainNode);
        osc.start();
        ambientNodes.push(osc, gain);
      });
    } else if (preset === 'cafe') {
      // Soft ambient atmosphere drone
      const osc1 = ambientCtx.createOscillator();
      const osc2 = ambientCtx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(174, ambientCtx.currentTime); // Solfeggio 174Hz Pain/Stress relief
      osc2.frequency.setValueAtTime(285, ambientCtx.currentTime);
      
      const gain1 = ambientCtx.createGain();
      gain1.gain.setValueAtTime(0.06, ambientCtx.currentTime);

      osc1.connect(gain1);
      osc2.connect(gain1);
      gain1.connect(ambientGainNode);
      osc1.start();
      osc2.start();
      ambientNodes.push(osc1, osc2, gain1);
    }
  } catch (err) {
    console.warn('Error starting ambient sound:', err);
  }
}

export function setAmbientVolume(volume: number) {
  if (ambientGainNode && ambientCtx) {
    ambientGainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), ambientCtx.currentTime);
  }
}

export function stopAmbientSound() {
  if (ambientNodes) {
    ambientNodes.forEach(node => {
      try {
        if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch {
        // Node already stopped
      }
    });
    ambientNodes = [];
  }
  if (ambientCtx) {
    try {
      ambientCtx.close();
    } catch {
      // Context already closed
    }
    ambientCtx = null;
    ambientGainNode = null;
  }
  currentAmbientPreset = 'none';
}

export function getCurrentAmbientPreset() {
  return currentAmbientPreset;
}
