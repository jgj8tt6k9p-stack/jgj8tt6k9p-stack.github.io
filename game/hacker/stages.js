// Helper for inputs
function createTerminalInput(type = 'text', width = '200px') {
    const input = document.createElement('input');
    input.type = type;
    input.style.background = 'transparent';
    input.style.border = '1px solid var(--border-color)';
    input.style.color = 'var(--text-color)';
    input.style.fontFamily = 'var(--font-family)';
    input.style.fontSize = '1.5rem';
    input.style.padding = '5px';
    input.style.width = width;
    input.style.textAlign = 'center';
    input.style.outline = 'none';
    input.style.textTransform = 'uppercase';
    return input;
}

function createTerminalButton(text) {
    const btn = document.createElement('button');
    btn.className = 'terminal-btn';
    btn.textContent = text;
    btn.style.marginTop = '0';
    btn.style.marginLeft = '10px';
    return btn;
}

// ==========================================
// STAGE 1: Pattern Matching (Sequence)
// ==========================================
function initStage1() {
    UI.puzzleTitle.textContent = t('stage1_title');
    UI.puzzleDesc.textContent = t('stage1_desc');
    updateConsole('Analyzing firewall patterns...');

    const container = document.createElement('div');
    container.className = 'puzzle-container';
    
    // Simple sequence: 2, 4, 8, 16, ?
    const sequences = [
        { seq: [2, 4, 8, 16], ans: 32 },
        { seq: [1, 1, 2, 3, 5], ans: 8 },
        { seq: [3, 9, 27], ans: 81 }
    ];
    const challenge = sequences[Math.floor(Math.random() * sequences.length)];

    const seqDisplay = document.createElement('h2');
    seqDisplay.style.letterSpacing = '5px';
    seqDisplay.textContent = challenge.seq.join(' - ') + ' - [?]';
    
    const inputContainer = document.createElement('div');
    const input = createTerminalInput('number', '100px');
    const submitBtn = createTerminalButton(t('btn_inject'));

    inputContainer.appendChild(input);
    inputContainer.appendChild(submitBtn);

    container.appendChild(seqDisplay);
    container.appendChild(inputContainer);
    UI.puzzleArea.appendChild(container);

    input.focus();

    const check = () => {
        if (parseInt(input.value) === challenge.ans) {
            showFeedback(t('pattern_accept'));
            stageComplete();
        } else {
            showFeedback(t('pattern_fail'), true);
            input.value = '';
        }
    };

    submitBtn.addEventListener('click', check);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') check(); });
}

// ==========================================
// STAGE 2: Memory Access (Simon Says / Order)
// ==========================================
function initStage2() {
    UI.puzzleTitle.textContent = t('stage2_title');
    UI.puzzleDesc.textContent = t('stage2_desc');
    updateConsole('Connecting to memory registers...');

    const container = document.createElement('div');
    container.className = 'puzzle-container';
    
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    grid.style.gap = '10px';
    grid.style.margin = '20px 0';

    const buttons = [];
    const sequence = [];
    let playerSequence = [];
    let isShowingSequence = true;

    for (let i = 0; i < 9; i++) {
        const btn = document.createElement('button');
        btn.style.width = '60px';
        btn.style.height = '60px';
        btn.style.background = 'transparent';
        btn.style.border = '2px solid var(--dim-color)';
        btn.style.cursor = 'pointer';
        btn.dataset.index = i;
        btn.addEventListener('click', () => handleNodeClick(i, btn));
        grid.appendChild(btn);
        buttons.push(btn);
    }

    container.appendChild(grid);
    
    const statusText = document.createElement('p');
    statusText.textContent = t('watch');
    container.appendChild(statusText);
    
    UI.puzzleArea.appendChild(container);

    // Generate sequence of 5 nodes
    for(let i=0; i<5; i++) {
        sequence.push(Math.floor(Math.random() * 9));
    }

    // Play sequence
    let step = 0;
    setTimeout(playNextNode, 1000);

    function playNextNode() {
        if (step < sequence.length) {
            const index = sequence[step];
            flashNode(buttons[index]);
            step++;
            setTimeout(playNextNode, 800);
        } else {
            isShowingSequence = false;
            statusText.textContent = t('reproduce');
        }
    }

    function flashNode(btn) {
        btn.style.background = 'var(--text-color)';
        setTimeout(() => {
            btn.style.background = 'transparent';
        }, 400);
    }

    function handleNodeClick(index, btn) {
        if (isShowingSequence) return;
        
        flashNode(btn);
        playerSequence.push(index);
        
        // Check current step
        const currentStep = playerSequence.length - 1;
        if (playerSequence[currentStep] !== sequence[currentStep]) {
            // Failed
            showFeedback(t('mem_corrupt'), true);
            isShowingSequence = true; // prevent clicks
            statusText.textContent = "SEQUENCE FAILED. RESTARTING...";
            setTimeout(() => {
                playerSequence = [];
                step = 0;
                playNextNode();
            }, 1500);
            return;
        }

        // Check if finished
        if (playerSequence.length === sequence.length) {
            showFeedback(t('mem_success'));
            isShowingSequence = true;
            setTimeout(stageComplete, 1000);
        }
    }
}

// ==========================================
// STAGE 3: Basic Logic (Mastermind / PIN Code)
// ==========================================
function initStage3() {
    UI.puzzleTitle.textContent = t('stage3_title');
    UI.puzzleDesc.textContent = t('stage3_desc');
    updateConsole('Brute-forcing access PIN...');

    const container = document.createElement('div');
    container.className = 'puzzle-container';

    // Generate PIN (3 digits, 1-6)
    const pin = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
    ];
    
    const historyDiv = document.createElement('div');
    historyDiv.style.fontFamily = 'var(--font-family)';
    historyDiv.style.fontSize = '1.2rem';
    historyDiv.style.height = '150px';
    historyDiv.style.overflowY = 'auto';
    historyDiv.style.width = '300px';
    historyDiv.style.textAlign = 'left';
    historyDiv.style.border = '1px solid var(--dim-color)';
    historyDiv.style.padding = '10px';
    historyDiv.style.marginBottom = '10px';

    const inputContainer = document.createElement('div');
    const input = createTerminalInput('number', '100px');
    input.placeholder = "123";
    input.maxLength = 3;
    
    // limit input to 3 digits
    input.addEventListener('input', () => {
        if(input.value.length > 3) input.value = input.value.slice(0, 3);
    });

    const submitBtn = createTerminalButton(t('btn_crack'));

    inputContainer.appendChild(input);
    inputContainer.appendChild(submitBtn);

    container.appendChild(historyDiv);
    container.appendChild(inputContainer);
    UI.puzzleArea.appendChild(container);
    input.focus();

    const check = () => {
        const val = input.value;
        if (val.length !== 3) {
            showFeedback(t('pin_len_err'), true);
            return;
        }

        const guess = val.split('').map(Number);
        let correctPos = 0;
        let correctNum = 0;
        
        // Copy arrays to modify during check
        let tempPin = [...pin];
        let tempGuess = [...guess];

        // Check correct position
        for (let i = 0; i < 3; i++) {
            if (tempGuess[i] === tempPin[i]) {
                correctPos++;
                tempPin[i] = null;
                tempGuess[i] = null;
            }
        }

        // Check correct numbers in wrong positions
        for (let i = 0; i < 3; i++) {
            if (tempGuess[i] !== null) {
                const idx = tempPin.indexOf(tempGuess[i]);
                if (idx !== -1) {
                    correctNum++;
                    tempPin[idx] = null;
                }
            }
        }

        const logEntry = document.createElement('div');
        logEntry.textContent = `[${val}] - Matches: ${correctPos}, Present: ${correctNum}`;
        historyDiv.appendChild(logEntry);
        historyDiv.scrollTop = historyDiv.scrollHeight;

        if (correctPos === 3) {
            showFeedback(t('pin_accept'));
            stageComplete();
        } else {
            showFeedback(t('pin_fail'), true);
            input.value = '';
            input.focus();
        }
    };

    submitBtn.addEventListener('click', check);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') check(); });
}

// ==========================================
// STAGE 4: Simple Cryptography (Caesar Cipher)
// ==========================================
function initStage4() {
    UI.puzzleTitle.textContent = t('stage4_title');
    UI.puzzleDesc.textContent = t('stage4_desc');
    updateConsole('Intercepted encrypted payload...');

    const container = document.createElement('div');
    container.className = 'puzzle-container';

    const words = ["ACCESS", "SYSTEM", "BREACH", "SECURE", "HACKER", "SERVER"];
    const targetWord = words[Math.floor(Math.random() * words.length)];
    const shift = Math.floor(Math.random() * 5) + 2; // Shift by 2 to 6

    const encryptedWord = targetWord.split('').map(char => {
        let code = char.charCodeAt(0) + shift;
        if (code > 90) code -= 26; // wrap around Z
        return String.fromCharCode(code);
    }).join('');

    const textDisplay = document.createElement('h2');
    textDisplay.style.letterSpacing = '3px';
    textDisplay.textContent = `PAYLOAD: ${encryptedWord}`;
    
    const clueDisplay = document.createElement('p');
    clueDisplay.textContent = `CLUE: SHIFT -${shift}`;

    const inputContainer = document.createElement('div');
    const input = createTerminalInput('text', '200px');
    const submitBtn = createTerminalButton(t('btn_decrypt'));

    inputContainer.appendChild(input);
    inputContainer.appendChild(submitBtn);

    container.appendChild(textDisplay);
    container.appendChild(clueDisplay);
    container.appendChild(inputContainer);
    UI.puzzleArea.appendChild(container);
    input.focus();

    const check = () => {
        if (input.value.toUpperCase() === targetWord) {
            showFeedback(t('dec_success'));
            stageComplete();
        } else {
            showFeedback(t('dec_fail'), true);
            input.value = '';
            input.focus();
        }
    };

    submitBtn.addEventListener('click', check);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') check(); });
}
