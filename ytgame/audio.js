// Simple Web Audio API Synthesizer for Retro Sounds
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol = 0.1) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

function playTypingSound() {
    // Short click/noise
    playTone(Math.random() * 200 + 400, 'square', 0.05, 0.05);
}

function playSuccessSound() {
    // Two high beeps
    playTone(880, 'square', 0.1, 0.1);
    setTimeout(() => playTone(1760, 'square', 0.2, 0.1), 150);
}

function playErrorSound() {
    // Low buzz
    playTone(150, 'sawtooth', 0.3, 0.2);
}

function playAlarmSound() {
    // Urgent alarm beep
    playTone(600, 'square', 0.2, 0.1);
}

// Add global listener for buttons and inputs
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        playTypingSound();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
        // avoid playing too many overlapping sounds
        playTypingSound();
    }
});
