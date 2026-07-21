(() => {
  "use strict";

  /** Web Audio SFX — không cần file mp3 */
  const SFX = {
    ctx: null,
    muted: localStorage.getItem("typhu-muted") === "1",
    unlocked: false,

    ensure() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      this.unlocked = true;
      return this.ctx;
    },

    setMuted(on) {
      this.muted = on;
      localStorage.setItem("typhu-muted", on ? "1" : "0");
    },

    toggle() {
      this.setMuted(!this.muted);
      if (!this.muted) {
        this.ensure();
        this.click();
      }
      return this.muted;
    },

    /** @param {number} freq @param {number} dur @param {string} type @param {number} vol @param {number} delay */
    tone(freq, dur = 0.12, type = "sine", vol = 0.12, delay = 0) {
      if (this.muted) return;
      const ctx = this.ensure();
      if (!ctx) return;
      const t0 = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    },

    /** Noise burst (xúc xắc, build) */
    noise(dur = 0.08, vol = 0.08, delay = 0) {
      if (this.muted) return;
      const ctx = this.ensure();
      if (!ctx) return;
      const t0 = ctx.currentTime + delay;
      const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1200;
      filter.Q.value = 0.6;
      src.buffer = buffer;
      gain.gain.setValueAtTime(vol, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start(t0);
      src.stop(t0 + dur + 0.02);
    },

    click() {
      this.tone(520, 0.06, "square", 0.05);
      this.tone(780, 0.05, "square", 0.03, 0.04);
    },

    roll() {
      for (let i = 0; i < 6; i++) {
        this.noise(0.05, 0.07, i * 0.045);
        this.tone(180 + Math.random() * 220, 0.04, "triangle", 0.04, i * 0.045);
      }
    },

    diceLand(isDouble) {
      this.tone(440, 0.08, "triangle", 0.08);
      this.tone(660, 0.1, "triangle", 0.06, 0.06);
      if (isDouble) {
        this.tone(880, 0.12, "sine", 0.08, 0.12);
        this.tone(1100, 0.16, "sine", 0.07, 0.2);
      }
    },

    move() {
      this.tone(320 + Math.random() * 80, 0.06, "triangle", 0.05);
      this.noise(0.03, 0.03);
    },

    buy() {
      this.tone(523, 0.1, "sine", 0.09);
      this.tone(659, 0.1, "sine", 0.08, 0.08);
      this.tone(784, 0.16, "sine", 0.09, 0.16);
    },

    skip() {
      this.tone(280, 0.1, "triangle", 0.05);
      this.tone(220, 0.12, "triangle", 0.04, 0.07);
    },

    rent() {
      this.tone(400, 0.1, "sawtooth", 0.05);
      this.tone(300, 0.12, "sawtooth", 0.045, 0.08);
      this.tone(200, 0.16, "sawtooth", 0.04, 0.16);
    },

    money() {
      this.tone(880, 0.07, "sine", 0.07);
      this.tone(1175, 0.08, "sine", 0.06, 0.06);
      this.tone(1568, 0.12, "sine", 0.05, 0.12);
    },

    jail() {
      this.tone(160, 0.2, "square", 0.07);
      this.tone(120, 0.25, "square", 0.06, 0.12);
      this.noise(0.15, 0.05, 0.05);
    },

    card() {
      this.tone(600, 0.08, "sine", 0.06);
      this.tone(900, 0.1, "sine", 0.05, 0.07);
      this.tone(750, 0.12, "triangle", 0.05, 0.14);
      this.noise(0.06, 0.03, 0.02);
    },

    build() {
      this.noise(0.06, 0.06);
      this.tone(350, 0.08, "square", 0.05, 0.04);
      this.tone(520, 0.1, "square", 0.05, 0.1);
    },

    tax() {
      this.tone(240, 0.14, "sawtooth", 0.05);
      this.tone(180, 0.18, "sawtooth", 0.04, 0.1);
    },

    park() {
      this.tone(392, 0.12, "sine", 0.05);
      this.tone(494, 0.14, "sine", 0.04, 0.1);
    },

    turn() {
      this.tone(500, 0.08, "triangle", 0.05);
      this.tone(700, 0.1, "triangle", 0.04, 0.08);
    },

    bankrupt() {
      this.tone(300, 0.15, "sawtooth", 0.06);
      this.tone(220, 0.18, "sawtooth", 0.05, 0.12);
      this.tone(140, 0.28, "sawtooth", 0.05, 0.24);
    },

    win() {
      const notes = [523, 659, 784, 1047, 784, 1047];
      notes.forEach((f, i) => this.tone(f, 0.16, "sine", 0.08, i * 0.11));
    },

    start() {
      this.tone(392, 0.1, "sine", 0.07);
      this.tone(523, 0.1, "sine", 0.07, 0.08);
      this.tone(659, 0.14, "sine", 0.08, 0.16);
      this.tone(784, 0.2, "sine", 0.07, 0.26);
    },

    modal() {
      this.tone(640, 0.07, "sine", 0.04);
      this.tone(860, 0.08, "sine", 0.035, 0.05);
    },

    free() {
      this.tone(700, 0.08, "triangle", 0.05);
      this.tone(950, 0.12, "triangle", 0.05, 0.07);
    },
  };

  window.TyPhuSFX = SFX;
})();
