/**
 * Play a short tone using Web Audio API (no external files).
 * Browsers require a user gesture before playing audio; calling from a click handler is fine.
 */
function playTone(
  frequency: number,
  durationMs: number,
  type: OscillatorType = 'sine',
  volume = 0.15
): void {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durationMs / 1000);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // Ignore if AudioContext is not supported or blocked
  }
}

/** Play when the player guesses a letter that is in the word */
export function playCorrectGuess(): void {
  playTone(523.25, 120, 'sine', 0.12);  // C5
  setTimeout(() => playTone(659.25, 140, 'sine', 0.1), 80);  // E5
}

/** Play when the player guesses a letter that is not in the word */
export function playWrongGuess(): void {
  playTone(200, 180, 'sawtooth', 0.08);
  setTimeout(() => playTone(150, 220, 'sawtooth', 0.06), 100);
}
