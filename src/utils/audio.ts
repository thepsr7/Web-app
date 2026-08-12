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
    if (ambientCtx.state === 'suspended') {
      ambientCtx.resume().catch(() => {});
    }

    ambientGainNode = ambientCtx.createGain();
    ambientGainNode.gain.setValueAtTime(volume, ambientCtx.currentTime);
    ambientGainNode.connect(ambientCtx.destination);
    ambientNodes = [];
    currentAmbientPreset = preset;

    if (preset === 'rain') {
      // Synthesize realistic soft rain using filtered brownian noise
      const bufferSize = 2 * ambientCtx.sampleRate;
      const noiseBuffer = ambientCtx.createBuffer(1, bufferSize, ambientCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const noiseSource = ambientCtx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = ambientCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, ambientCtx.currentTime);

      noiseSource.connect(filter);
      filter.connect(ambientGainNode);
      noiseSource.start();
      ambientNodes.push(noiseSource, filter);

    } else if (preset === 'lofi') {
      // Warm Cmaj7 / Am7 lo-fi ambient chord pad with soft lowpass filter
      const freqs = [130.81, 164.81, 196.00, 246.94, 261.63, 329.63]; // C3, E3, G3, B3, C4, E4
      freqs.forEach((freq, idx) => {
        if (!ambientCtx || !ambientGainNode) return;
        const osc = ambientCtx.createOscillator();
        const gain = ambientCtx.createGain();
        const filter = ambientCtx.createBiquadFilter();

        osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq + (idx * 0.4), ambientCtx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, ambientCtx.currentTime);

        gain.gain.setValueAtTime(0.25 / freqs.length, ambientCtx.currentTime);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ambientGainNode);
        osc.start();
        ambientNodes.push(osc, filter, gain);
      });

    } else if (preset === 'waves') {
      // Binaural Beta / Alpha Focus Drone (14Hz difference for cognitive focus)
      const oscL = ambientCtx.createOscillator();
      const oscR = ambientCtx.createOscillator();
      const gain = ambientCtx.createGain();
      const filter = ambientCtx.createBiquadFilter();

      oscL.type = 'sine';
      oscR.type = 'sine';
      oscL.frequency.setValueAtTime(200, ambientCtx.currentTime);
      oscR.frequency.setValueAtTime(214, ambientCtx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, ambientCtx.currentTime);

      gain.gain.setValueAtTime(0.3, ambientCtx.currentTime);

      oscL.connect(filter);
      oscR.connect(filter);
      filter.connect(gain);
      gain.connect(ambientGainNode);

      oscL.start();
      oscR.start();
      ambientNodes.push(oscL, oscR, filter, gain);

    } else if (preset === 'cafe') {
      // Warm cozy cafe background atmosphere
      const bufferSize = 2 * ambientCtx.sampleRate;
      const noiseBuffer = ambientCtx.createBuffer(1, bufferSize, ambientCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.1;
        output[i] = (b0 + b1) * 0.4;
      }

      const noiseSource = ambientCtx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = ambientCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, ambientCtx.currentTime);
      filter.Q.setValueAtTime(1.2, ambientCtx.currentTime);

      const gain = ambientCtx.createGain();
      gain.gain.setValueAtTime(0.35, ambientCtx.currentTime);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ambientGainNode);

      noiseSource.start();
      ambientNodes.push(noiseSource, filter, gain);
    }
  } catch (err) {
    console.warn('Error starting ambient sound:', err);
  }
}

export function setAmbientVolume(volume: number) {
  if (ambientGainNode && ambientCtx) {
    if (ambientCtx.state === 'suspended') {
      ambientCtx.resume().catch(() => {});
    }
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
