// ==========================================
// STAGE 5: Node Routing (Pipe Puzzle)
// ==========================================
function initStage5() {
    UI.puzzleTitle.textContent = t('stage5_title');
    UI.puzzleDesc.textContent = t('stage5_desc');
    updateConsole('Rerouting network packets...');

    const container = document.createElement('div');
    container.className = 'puzzle-container';

    // Grid size 3x3
    // 0 1 2
    // 3 4 5
    // 6 7 8
    // Start at 0, End at 8
    // Shapes: 'line' (0/180 or 90/270), 'corner' (0,90,180,270)
    
    // We will do a predefined path that works: 
    // 0(right) -> 1(corner DL) -> 4(corner UR) -> 5(corner DL) -> 8(up)
    // Actually simpler: just use generic characters like:
    // '═' (horiz), '║' (vert), '╗', '╝', '╚', '╔'
    // To make it simple in HTML, we will just use unicode chars and rotate them via CSS.
    // 'L' shape (corner), 'I' shape (line)

    const gridLayout = [
        { type: 'I', sol: [90, 270] }, // S -> Right (Needs to be horiz)
        { type: 'L', sol: [180] },     // Right -> Down (╗)
        { type: 'X', sol: [0, 90, 180, 270] }, // Dummy (cross)
        { type: 'X', sol: [0, 90, 180, 270] }, // Dummy
        { type: 'L', sol: [0] },       // Down -> Right (╚)
        { type: 'L', sol: [270] },     // Right -> Down (╗)
        { type: 'X', sol: [0, 90, 180, 270] }, // Dummy
        { type: 'X', sol: [0, 90, 180, 270] }, // Dummy
        { type: 'I', sol: [0, 180] }   // Down -> E (Needs to be vert)
    ];

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    grid.style.gap = '5px';
    grid.style.margin = '20px 0';

    const tiles = [];

    gridLayout.forEach((cell, index) => {
        const btn = document.createElement('button');
        btn.style.width = '60px';
        btn.style.height = '60px';
        btn.style.background = 'transparent';
        btn.style.border = '1px solid var(--dim-color)';
        btn.style.color = 'var(--text-color)';
        btn.style.fontSize = '2rem';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'transform 0.2s';
        
        let char = '';
        if (cell.type === 'I') char = '│';
        else if (cell.type === 'L') char = '└';
        else if (cell.type === 'X') char = '┼';
        
        btn.textContent = char;
        
        if (index === 0) btn.innerHTML = '<span style="font-size:1rem; position:absolute; top:2px; left:2px">S</span>' + char;
        if (index === 8) btn.innerHTML = '<span style="font-size:1rem; position:absolute; bottom:2px; right:2px">E</span>' + char;

        // Random initial rotation
        let currentRot = Math.floor(Math.random() * 4) * 90;
        btn.style.transform = `rotate(${currentRot}deg)`;

        btn.addEventListener('click', () => {
            currentRot = (currentRot + 90) % 360;
            btn.style.transform = `rotate(${currentRot}deg)`;
            checkRouting();
        });

        tiles.push({ el: btn, cell: cell, getRot: () => currentRot });
        grid.appendChild(btn);
    });

    container.appendChild(grid);
    UI.puzzleArea.appendChild(container);

    function checkRouting() {
        let isCorrect = true;
        for (let i = 0; i < tiles.length; i++) {
            const rot = tiles[i].getRot();
            if (!tiles[i].cell.sol.includes(rot)) {
                isCorrect = false;
                break;
            }
        }
        if (isCorrect) {
            showFeedback(t('route_success'));
            // Disable clicks
            tiles.forEach(t => t.el.style.pointerEvents = 'none');
            setTimeout(stageComplete, 1000);
        }
    }
}

// ==========================================
// STAGE 6: Base Conversions (Machine Code)
// ==========================================
function initStage6() {
    UI.puzzleTitle.textContent = t('stage6_title');
    UI.puzzleDesc.textContent = t('stage6_desc');
    updateConsole('Extracting port numbers...');

    const container = document.createElement('div');
    container.className = 'puzzle-container';

    // 0 = binary, 1 = hex
    const type = Math.floor(Math.random() * 2);
    let targetNum = Math.floor(Math.random() * 200) + 50; // 50 to 250
    let displayStr = '';
    
    if (type === 0) {
        displayStr = 'BIN: ' + targetNum.toString(2);
    } else {
        displayStr = 'HEX: ' + targetNum.toString(16).toUpperCase();
    }

    const textDisplay = document.createElement('h2');
    textDisplay.style.letterSpacing = '3px';
    textDisplay.textContent = `TARGET PORT -> ${displayStr}`;
    
    const inputContainer = document.createElement('div');
    const input = createTerminalInput('number', '150px');
    input.placeholder = "DECIMAL...";
    const submitBtn = createTerminalButton(t('btn_connect'));

    inputContainer.appendChild(input);
    inputContainer.appendChild(submitBtn);

    container.appendChild(textDisplay);
    container.appendChild(inputContainer);
    UI.puzzleArea.appendChild(container);
    input.focus();

    const check = () => {
        if (parseInt(input.value) === targetNum) {
            showFeedback(t('port_connect'));
            stageComplete();
        } else {
            showFeedback(t('port_fail'), true);
            input.value = '';
            input.focus();
        }
    };

    submitBtn.addEventListener('click', check);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') check(); });
}

// ==========================================
// STAGE 7: Advanced Logic (System Equations)
// ==========================================
function initStage7() {
    UI.puzzleTitle.textContent = t('stage7_title');
    UI.puzzleDesc.textContent = t('stage7_desc');
    updateConsole('Analyzing IDS variable state...');

    const container = document.createElement('div');
    container.className = 'puzzle-container';

    // System: 
    // X + Y = A
    // Y + Z = B
    // X + Z = C
    // Find X, Y, Z
    const X = Math.floor(Math.random() * 10) + 1;
    const Y = Math.floor(Math.random() * 10) + 1;
    const Z = Math.floor(Math.random() * 10) + 1;
    
    const A = X + Y;
    const B = Y + Z;
    const C = X + Z;

    const eqDiv = document.createElement('div');
    eqDiv.style.textAlign = 'left';
    eqDiv.style.fontSize = '1.3rem';
    eqDiv.innerHTML = `
        <p>VAR_X + VAR_Y = ${A}</p>
        <p>VAR_Y + VAR_Z = ${B}</p>
        <p>VAR_X + VAR_Z = ${C}</p>
    `;

    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.gap = '10px';
    inputContainer.style.marginTop = '15px';

    const inX = createTerminalInput('number', '60px'); inX.placeholder = 'X';
    const inY = createTerminalInput('number', '60px'); inY.placeholder = 'Y';
    const inZ = createTerminalInput('number', '60px'); inZ.placeholder = 'Z';
    
    const submitBtn = createTerminalButton(t('btn_bypass'));

    inputContainer.appendChild(inX);
    inputContainer.appendChild(inY);
    inputContainer.appendChild(inZ);
    
    container.appendChild(eqDiv);
    container.appendChild(inputContainer);
    container.appendChild(submitBtn);
    
    UI.puzzleArea.appendChild(container);
    inX.focus();

    const check = () => {
        if (parseInt(inX.value) === X && parseInt(inY.value) === Y && parseInt(inZ.value) === Z) {
            showFeedback(t('ids_bypass'));
            stageComplete();
        } else {
            showFeedback(t('ids_fail'), true);
            inX.value = ''; inY.value = ''; inZ.value = '';
            inX.focus();
        }
    };

    submitBtn.addEventListener('click', check);
    inZ.addEventListener('keypress', (e) => { if (e.key === 'Enter') check(); });
}
