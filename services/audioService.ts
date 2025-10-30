// A simple audio service to play sounds using the Web Audio API.

// A single AudioContext can be reused for all sounds.
let audioContext: AudioContext;

function getAudioContext(): AudioContext {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
}

/**
 * Plays a short, high-pitched "tick" sound.
 */
export function playCountdownTick() {
    try {
        const ctx = getAudioContext();
        // Resume context if it's suspended (e.g., due to browser autoplay policies)
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.5, ctx.currentTime);

        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    } catch (e) {
        console.error("Could not play countdown tick sound:", e);
    }
}

/**
 * Plays a short, low-pitched "boo" sound.
 */
export function playBooSound() {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);

        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
    } catch (e) {
        console.error("Could not play boo sound:", e);
    }
}
