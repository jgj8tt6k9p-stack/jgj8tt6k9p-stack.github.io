// ==========================================
// STAGE 8: Complex Cryptography (Vigenère)
// ==========================================
function initStage8() {
    UI.puzzleTitle.textContent = t('stage8_title');
    UI.puzzleDesc.textContent = t('stage8_desc');
    updateConsole('Extracting encrypted admin credentials...');

    const container = document.createElement('div');
    container.className = 'puzzle-container';

    const targetWord = "ROOT";
    const keyword = "KEY"; // K=10, E=4, Y=24
    
    // R (17) + K (10) = 27 = 1 = B
    // O (14) + E (4) = 18 = S
    // O (14) + Y (24) = 38 = 12 = M
    // T (19) + K (10) = 29 = 3 = D
    const ciphertext = "BSMD";

    const textDisplay = document.createElement('h2');
    textDisplay.style.letterSpacing = '5px';
    textDisplay.textContent = `HASH: ${ciphertext}`;
    
    const clueDisplay = document.createElement('p');
    clueDisplay.innerHTML = `KEYWORD: ${keyword}<br><br><span style="font-size:0.8rem; letter-spacing:1px; line-height:1.5;">A B C D E F G H I J K L M<br>0 1 2 3 4 5 6 7 8 9 10 11 12<br>N O P Q R S T U V W X Y Z<br>13 14 15 16 17 18 19 20 21 22 23 24 25</span>`;

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
            showFeedback(t('hash_success'));
            stageComplete();
        } else {
            showFeedback(t('hash_fail'), true);
            input.value = '';
            input.focus();
        }
    };

    submitBtn.addEventListener('click', check);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') check(); });
}

// ==========================================
// STAGE 9: Logic Gates
// ==========================================
function initStage9() {
    UI.puzzleTitle.textContent = t('stage9_title');
    UI.puzzleDesc.textContent = t('stage9_desc');
    updateConsole('Accessing motherboard logic gates...');

    const container = document.createElement('div');
    container.className = 'puzzle-container';

    let vals = { A: 0, B: 0, C: 0 };

    const diagram = document.createElement('div');
    diagram.style.fontFamily = 'var(--font-family)';
    diagram.style.whiteSpace = 'pre';
    diagram.style.textAlign = 'left';
    diagram.style.background = 'rgba(0,0,0,0.5)';
    diagram.style.padding = '10px';
    diagram.style.border = '1px solid var(--dim-color)';
    
    function renderDiagram() {
        let A = vals.A, B = vals.B, C = vals.C;
        let and1 = (A && B) ? 1 : 0;
        let xor1 = (C ^ A) ? 1 : 0;
        let out = (and1 && xor1) ? 1 : 0;

        diagram.textContent = `
  [A: ${A}] ──┐
          ├──( AND )── [${and1}] ──┐
  [B: ${B}] ──┘                    │
                           ├──( AND )── OUT: [${out}]
  [C: ${C}] ──┐                    │
          ├──( XOR )── [${xor1}] ──┘
  [A: ${A}] ──┘
        `;
    }

    renderDiagram();

    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '15px';
    btnContainer.style.marginTop = '20px';

    ['A', 'B', 'C'].forEach(lbl => {
        const btn = createTerminalButton(`TOGGLE ${lbl}`);
        btn.addEventListener('click', () => {
            vals[lbl] = vals[lbl] === 0 ? 1 : 0;
            renderDiagram();
        });
        btnContainer.appendChild(btn);
    });

    const submitBtn = createTerminalButton(t('btn_exec'));
    submitBtn.style.marginTop = '20px';
    submitBtn.style.border = '1px solid var(--warn-color)';
    submitBtn.style.color = 'var(--warn-color)';

    submitBtn.addEventListener('click', () => {
        let out = ((vals.A && vals.B) && (vals.C ^ vals.A)) ? 1 : 0;
        if (out === 1) {
            showFeedback(t('hw_success'));
            stageComplete();
        } else {
            showFeedback(t('hw_fail'), true);
        }
    });

    container.appendChild(diagram);
    container.appendChild(btnContainer);
    container.appendChild(submitBtn);
    UI.puzzleArea.appendChild(container);
}

// ==========================================
// STAGE 10: Assembly Logic
// ==========================================
function initStage10() {
    UI.puzzleTitle.textContent = t('stage10_title');
    UI.puzzleDesc.textContent = t('stage10_desc');
    updateConsole('Gaining root access to mainframe...');

    const container = document.createElement('div');
    container.className = 'puzzle-container';
    
    const instDiv = document.createElement('div');
    instDiv.style.textAlign = 'left';
    instDiv.innerHTML = `
        <p>INITIAL STATE: AX = 0</p>
        <p>TARGET STATE: AX = 42</p>
        <br>
    `;

    const lines = [];
    for(let i=0; i<3; i++) {
        const line = document.createElement('div');
        line.style.marginBottom = '10px';
        
        const select = document.createElement('select');
        select.style.background = 'var(--bg-color)';
        select.style.color = 'var(--text-color)';
        select.style.border = '1px solid var(--border-color)';
        select.style.fontFamily = 'var(--font-family)';
        select.style.fontSize = '1.2rem';
        select.style.padding = '5px';
        
        ['ADD', 'SUB', 'MUL', 'XOR'].forEach(op => {
            const opt = document.createElement('option');
            opt.value = op;
            opt.textContent = op;
            select.appendChild(opt);
        });

        const input = createTerminalInput('number', '80px');
        input.placeholder = 'VAL';

        line.appendChild(document.createTextNode((i+1) + ' '));
        line.appendChild(select);
        line.appendChild(document.createTextNode(' AX, '));
        line.appendChild(input);

        lines.push({ op: select, val: input });
        instDiv.appendChild(line);
    }

    const submitBtn = createTerminalButton(t('btn_compile'));
    submitBtn.style.marginTop = '20px';
    
    container.appendChild(instDiv);
    container.appendChild(submitBtn);
    UI.puzzleArea.appendChild(container);

    submitBtn.addEventListener('click', () => {
        let AX = 0;
        let error = false;

        for (let i = 0; i < 3; i++) {
            const op = lines[i].op.value;
            const val = parseInt(lines[i].val.value);
            
            if (isNaN(val)) {
                showFeedback(t('syntax_err') + ` ${i+1}`, true);
                error = true;
                break;
            }

            switch(op) {
                case 'ADD': AX += val; break;
                case 'SUB': AX -= val; break;
                case 'MUL': AX *= val; break;
                case 'XOR': AX ^= val; break;
            }
        }

        if (error) return;

        updateConsole(`Execution finished. AX = ${AX}`);

        if (AX === 42) {
            showFeedback(t('asm_success'));
            stageComplete();
        } else {
            showFeedback(t('asm_fail'), true);
        }
    });
}
