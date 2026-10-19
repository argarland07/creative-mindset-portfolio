// Web Audio API ambient chime synthesizer
class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.pentatonicFrequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playHover(index = 0) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.value = 1800;

      const note = this.pentatonicFrequencies[index % this.pentatonicFrequencies.length];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.06, this.ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch {
      // Audio context might fail silently if user hasn't interacted
    }
  }

  playSlideTransition() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [329.63, 440.00, 659.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + idx * 0.07 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.07 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.07);
        osc.stop(this.ctx.currentTime + idx * 0.07 + 0.65);
      });
    } catch {
      // Audio context graceful fallback
    }
  }

  playClick() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880.0, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {
      // Graceful fallback
    }
  }

  playSliderTick() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Graceful fallback
    }
  }

  playLevelUp() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const chord = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        const startTime = this.ctx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch {
      // Graceful fallback
    }
  }

  playDialogueSelect() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      [587.33, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const st = this.ctx.currentTime + idx * 0.06;
        osc.frequency.setValueAtTime(freq, st);
        gain.gain.setValueAtTime(0.04, st);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(st);
        osc.stop(st + 0.2);
      });
    } catch {
      // Graceful fallback
    }
  }

  playInsightUnlocked() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const st = this.ctx.currentTime + idx * 0.05;
        osc.frequency.setValueAtTime(freq, st);
        gain.gain.setValueAtTime(0.001, st);
        gain.gain.exponentialRampToValueAtTime(0.07, st + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(st);
        osc.stop(st + 0.5);
      });
    } catch {
      // Graceful fallback
    }
  }

  playMarbleRoll() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      [300, 340, 380, 420].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const st = this.ctx.currentTime + idx * 0.05;
        osc.frequency.setValueAtTime(freq, st);
        gain.gain.setValueAtTime(0.03, st);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(st);
        osc.stop(st + 0.09);
      });
    } catch {
      // Graceful fallback
    }
  }

  playDominoTopple() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      [520, 480, 440, 400, 360].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const st = this.ctx.currentTime + idx * 0.04;
        osc.frequency.setValueAtTime(freq, st);
        gain.gain.setValueAtTime(0.04, st);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(st);
        osc.stop(st + 0.07);
      });
    } catch {
      // Graceful fallback
    }
  }

  playPulleySwoosh() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 0.25);
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.32);
    } catch {
      // Graceful fallback
    }
  }

  playBalloonPop() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      // Pop sound
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);

      // Fanfare after pop
      setTimeout(() => {
        this.playLevelUp();
      }, 120);
    } catch {
      // Graceful fallback
    }
  }

  playFlashlightSwitch() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Graceful fallback
    }
  }

  playCameraShutter() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      // Click 1: Shutter open
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1400, this.ctx.currentTime);
      gain1.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(this.ctx.currentTime);
      osc1.stop(this.ctx.currentTime + 0.04);

      // Click 2: Shutter curtain close + mechanical clack
      const tClose = this.ctx.currentTime + 0.06;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(800, tClose);
      osc2.frequency.exponentialRampToValueAtTime(200, tClose + 0.06);
      gain2.gain.setValueAtTime(0.09, tClose);
      gain2.gain.exponentialRampToValueAtTime(0.0001, tClose + 0.08);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(tClose);
      osc2.stop(tClose + 0.09);

      // Shutter motor winder whir
      const tWhir = this.ctx.currentTime + 0.12;
      const osc3 = this.ctx.createOscillator();
      const gain3 = this.ctx.createGain();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(600, tWhir);
      osc3.frequency.exponentialRampToValueAtTime(1200, tWhir + 0.08);
      gain3.gain.setValueAtTime(0.03, tWhir);
      gain3.gain.exponentialRampToValueAtTime(0.0001, tWhir + 0.1);
      osc3.connect(gain3);
      gain3.connect(this.ctx.destination);
      osc3.start(tWhir);
      osc3.stop(tWhir + 0.11);
    } catch {
      // Graceful fallback
    }
  }

  playHeartbeat() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      // Lub-dub
      const beats = [0, 0.14];
      beats.forEach((offset) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const t = this.ctx.currentTime + offset;
        osc.frequency.setValueAtTime(65, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);

        gain.gain.setValueAtTime(0.09, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.11);
      });
    } catch {
      // Graceful fallback
    }
  }

  playApproach() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      // Quick brisk step swoosh
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // Graceful fallback
    }
  }

  playComfortExpansion() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const freqs = [392.0, 523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const t = this.ctx.currentTime + idx * 0.06;
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.exponentialRampToValueAtTime(0.07, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.55);
      });
    } catch {
      // Graceful fallback
    }
  }
}

export const soundManager = new SoundManager();
