const GAME_TIME = 300;
let currentStage = 1;
const MAX_STAGES = 10;
let timeRemaining = GAME_TIME;
let timerInterval = null;

// DOM Elements
const screens = {
    start: document.getElementById('start-screen'),
    gameplay: document.getElementById('gameplay-screen'),
    gameOver: document.getElementById('game-over-screen'),
    victory: document.getElementById('victory-screen')
};

const UI = {
    timer: document.getElementById('timer'),
    stageNumber: document.getElementById('stage-number'),
    statusText: document.getElementById('status-text'),
    puzzleTitle: document.getElementById('puzzle-title'),
    puzzleDesc: document.getElementById('puzzle-desc'),
    puzzleArea: document.getElementById('puzzle-area'),
    feedbackArea: document.getElementById('feedback-area'),
    consoleOut: document.getElementById('console-output'),
    hintBtn: document.getElementById('hint-btn'),
    hintText: document.getElementById('hint-text')
};

// Language selector
document.getElementById('lang-select').addEventListener('change', (e) => {
    currentLang = e.target.value;
    updateLang();
});

// Hint Button
UI.hintBtn.addEventListener('click', () => {
    UI.hintText.textContent = t(`hint_${currentStage}`);
    UI.hintText.style.display = 'block';
});

// Buttons
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', resetGame);
document.getElementById('play-again-btn').addEventListener('click', resetGame);

// Utilities
function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function updateConsole(msg) {
    UI.consoleOut.textContent = `>_ ${msg}`;
}

function showFeedback(msg, isError = false) {
    UI.feedbackArea.textContent = msg;
    UI.feedbackArea.className = isError ? 'error' : 'success';
    if (isError) {
        if (typeof playErrorSound === 'function') playErrorSound();
        document.getElementById('terminal').classList.add('shake');
        setTimeout(() => document.getElementById('terminal').classList.remove('shake'), 400);
    } else if (msg) {
        if (typeof playSuccessSound === 'function') playSuccessSound();
    }
}

// Game Flow
function startGame() {
    currentStage = 1;
    timeRemaining = GAME_TIME;
    showScreen('gameplay');
    UI.statusText.textContent = t('status_intrusion');
    UI.statusText.style.color = "var(--warn-color)";
    loadStage(currentStage);
}

function resetGame() {
    showScreen('start');
    UI.statusText.textContent = t('status_secure');
    UI.statusText.style.color = "var(--text-color)";
    updateConsole('root@attacker:~# ./breach.sh');
}

function loadStage(stage) {
    UI.stageNumber.textContent = stage;
    UI.puzzleArea.innerHTML = ''; // Clear previous puzzle
    showFeedback('');
    UI.hintText.style.display = 'none'; // Hide hint for new stage
    
    // Reset Timer for the stage
    timeRemaining = GAME_TIME;
    updateTimerDisplay();
    clearInterval(timerInterval);
    timerInterval = setInterval(tick, 1000);

    // Initial setup of headers before specific logic overwrites it
    UI.puzzleTitle.textContent = t('connecting');
    UI.puzzleDesc.textContent = t('standby');

    // Load specific stage logic
    switch(stage) {
        case 1: initStage1(); break;
        case 2: initStage2(); break;
        case 3: initStage3(); break;
        case 4: initStage4(); break;
        case 5: initStage5(); break;
        case 6: initStage6(); break;
        case 7: initStage7(); break;
        case 8: initStage8(); break;
        case 9: initStage9(); break;
        case 10: initStage10(); break;
        default:
            stageComplete();
            break;
    }
}

function tick() {
    timeRemaining--;
    updateTimerDisplay();
    
    if (timeRemaining <= 0) {
        gameOver();
    }
}

function updateTimerDisplay() {
    UI.timer.textContent = timeRemaining;
    if (timeRemaining < 30) {
        UI.timer.classList.add('blink');
        UI.timer.style.color = 'var(--alert-color)';
        if (timeRemaining % 2 === 0 && typeof playAlarmSound === 'function') playAlarmSound();
    } else {
        UI.timer.classList.remove('blink');
        UI.timer.style.color = 'inherit';
    }
}

function stageComplete() {
    clearInterval(timerInterval);
    updateConsole(`Stage ${currentStage} bypassed.`);
    
    if (currentStage >= MAX_STAGES) {
        gameWin();
    } else {
        currentStage++;
        // Short delay before next stage
        showFeedback(t('stage_complete_msg'), false);
        setTimeout(() => {
            loadStage(currentStage);
        }, 1500);
    }
}

function gameOver() {
    clearInterval(timerInterval);
    showScreen('gameOver');
    UI.statusText.textContent = t('status_lockdown');
    UI.statusText.style.color = "var(--alert-color)";
    updateConsole('Connection terminated by host.');
}

function gameWin() {
    clearInterval(timerInterval);
    showScreen('victory');
    UI.statusText.textContent = t('status_compromised');
    UI.statusText.style.color = "var(--text-color)";
    updateConsole('Access granted. Downloading data...');
}

// Initial language update
updateLang();

// ==========================================
// PUZZLE IMPLEMENTATIONS MOVED TO stages.js
// ==========================================
