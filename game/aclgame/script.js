const validCompanies = [
    'TechCorp Global',
    'TechCorp Games',
    'TechCorp Comics',
    'TechCorp Studio',
    'TechCorp Cloud',
    'TechCorp Security'
];

const validTeams = [
    'Security Team',
    'Game Development Team',
    'Platform Engineering Team',
    'Webtoon Contents Team',
    'Infrastructure Team',
    'HR & Admin Team'
];

const fakeCompanies = [
    'TachCorp Global',
    'TechCorp Game',
    'TechCorp Comix',
    'TechCorp Studios',
    'TechCorp Coud',
    'TehcCorp Security'
];

const fakeTeams = [
    'Hacking Team',
    'Pizza Team',
    'Securty Team',
    'Webton Contents',
    'Sales Team',
    'Unknown Team'
];

const i18n = {
    ko: {
        title: "IT보안:접근제어게임",
        subtitle: "당신은 IT 보안 담당자입니다.",
        instructions: "제시되는 <strong>법인명</strong>과 <strong>팀명</strong>을 우측의 '허용 리스트(룰북)'와 대조하세요.",
        ruleTitle: "[ 업무 가이드 ]",
        rule1: "제시되는 <strong>법인명</strong>과 <strong>팀명</strong>을 우측의 '허용 리스트(룰북)'와 대조하세요.",
        rule2: "모두 허용 리스트에 있으면 <strong>통과(ALLOW)</strong>",
        rule3: "하나라도 틀리거나 오타(위조)가 있다면 <strong>거부(DENY)</strong>",
        rule4: "총 10명의 출입을 심사해야 합니다.",
        startBtn: "업무 시작",
        progress: "심사 대기:",
        score: "정확도:",
        allowBtn: "통과 (ALLOW)",
        denyBtn: "거부 (DENY)",
        speechEnter: "수고하십니다. 출입증입니다.",
        speechAllowRight: "감사합니다!",
        speechAllowWrong: "흐흐, 통과했네.",
        speechDenyRight: "앗, 다시 확인해볼게요.",
        speechDenyWrong: "왜 안 되나요?!",
        whitelistTitle: "화이트리스트",
        allowCorp: "[ 허용 법인 ]",
        allowTeam: "[ 허용 팀 ]",
        endTitle: "업무 종료",
        endTotal: "총 심사 인원: 10명",
        endScore: "정확도:",
        evalPerfect: "완벽합니다! 최고의 보안 담당자입니다.",
        evalGood: "수고하셨습니다. 준수한 방어율이네요!",
        evalBad: "보안 사고 발생! 조금 더 주의가 필요합니다.",
        eduTitle: "IT보안의 방화벽 접근 제어에 대해 잘 아셨나요?",
        eduDesc: "저희 기술 보안 담당자는 방화벽을 통해 이처럼 인가된 사용자만 접근할 수 있도록 통제하여 회사의 자산을 안전하게 보호하는 일을 하고 있습니다.",
        restartBtn: "다시 하기",
        homeBtn: "🏠 처음으로"
    },
    ja: {
        title: "ITセキュリティ：アクセス制御ゲーム",
        subtitle: "あなたはITセキュリティ担当者です。",
        instructions: "提示される<strong>法人名</strong>と<strong>チーム名</strong>を右側の「許可リスト」と照合してください。",
        ruleTitle: "[ 業務ガイド ]",
        rule1: "提示される<strong>法人名</strong>と<strong>チーム名</strong>を右側の「許可リスト」と照合してください。",
        rule2: "すべて許可リストにあれば<strong>通過 (ALLOW)</strong>",
        rule3: "一つでも間違っていたり偽造があれば<strong>拒否 (DENY)</strong>",
        rule4: "計10名の出入りを審査する必要があります。",
        startBtn: "業務開始",
        progress: "審査待機:",
        score: "正確度:",
        allowBtn: "通過 (ALLOW)",
        denyBtn: "拒否 (DENY)",
        speechEnter: "お疲れ様です。入館証です。",
        speechAllowRight: "ありがとうございます！",
        speechAllowWrong: "ふふ、通れたぞ。",
        speechDenyRight: "あっ、もう一度確認します。",
        speechDenyWrong: "どうしてダメなんですか？！",
        whitelistTitle: "許可リスト",
        allowCorp: "[ 許可法人 ]",
        allowTeam: "[ 許可チーム ]",
        endTitle: "業務終了",
        endTotal: "総審査人数: 10名",
        endScore: "正確度:",
        evalPerfect: "完璧です！最高のセキュリティ担当者です。",
        evalGood: "お疲れ様でした。まずまずの防御率ですね！",
        evalBad: "セキュリティ事故発生！もう少し注意が必要です。",
        eduTitle: "ITセキュリティのファイアウォールアクセス制御についてご理解いただけましたか？",
        eduDesc: "私たち技術セキュリティ担当者は、ファイアウォールを通じてこのように認可されたユーザーだけがアクセスできるように統制し、会社の資産を安全に保護する仕事を行っています。",
        restartBtn: "もう一度プレイ",
        homeBtn: "🏠 ホームへ"
    }
};

let currentLang = 'ja';
const npcSpriteIndices = [0, 1, 2, 3];

let totalNPCs = 10;
let currentNPCIndex = 0;
let score = 0;
let currentNPC = null;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const homeBtnGame = document.getElementById('home-btn-game');
const homeBtnEnd = document.getElementById('home-btn-end');
const btnAllow = document.getElementById('btn-allow');
const btnDeny = document.getElementById('btn-deny');
const langToggleBtn = document.getElementById('lang-toggle');
const startLangToggleBtn = document.getElementById('start-lang-toggle');

const btnRulebook = document.getElementById('btn-rulebook');
const rulebookModal = document.getElementById('rulebook-modal');
const closeRulebookBtn = document.getElementById('close-rulebook');

const currentCountEl = document.getElementById('current-count');
const scoreCountEl = document.getElementById('score-count');
const npcSprite = document.getElementById('npc-sprite');
const speechBubble = document.getElementById('speech-bubble');
const idCard = document.getElementById('id-card');
const idCompanyEl = document.getElementById('id-company');
const idTeamEl = document.getElementById('id-team');
const stampOverlay = document.getElementById('stamp-overlay');
const idPhoto = document.querySelector('.id-photo');

// Sounds (using Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'stamp') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateNPC() {
    const isValid = Math.random() > 0.5;
    let company, team;
    const spriteIndex = getRandomItem(npcSpriteIndices);
    let photoIndex = spriteIndex;

    if (isValid) {
        company = getRandomItem(validCompanies);
        team = getRandomItem(validTeams);
    } else {
        const fakeType = Math.floor(Math.random() * 4); // 4 types of fakes now
        if (fakeType === 0) {
            company = getRandomItem(fakeCompanies);
            team = getRandomItem(validTeams);
        } else if (fakeType === 1) {
            company = getRandomItem(validCompanies);
            team = getRandomItem(fakeTeams);
        } else if (fakeType === 2) {
            company = getRandomItem(fakeCompanies);
            team = getRandomItem(fakeTeams);
        } else {
            // Fake type 3: Photo mismatch! Data is correct, but photo belongs to someone else
            company = getRandomItem(validCompanies);
            team = getRandomItem(validTeams);
            // Pick a different photo
            photoIndex = (spriteIndex + 1 + Math.floor(Math.random() * 3)) % 4;
        }
    }

    return { company, team, isValid, spriteIndex, photoIndex };
}

function updateLanguage() {
    const dict = i18n[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerHTML = dict[key];
        }
    });
    langToggleBtn.textContent = currentLang === 'ko' ? '🇯🇵 日本語' : '🇰🇷 한국어';
    if(startLangToggleBtn) {
        startLangToggleBtn.textContent = currentLang === 'ko' ? '🇯🇵 日本語に変更' : '🇰🇷 한국어로 변경';
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'ko' ? 'ja' : 'ko';
    updateLanguage();
}

function initSprite() {
    npcSprite.style.backgroundImage = `url('assets/characters.jpg')`;
    idPhoto.style.backgroundImage = `url('assets/characters.jpg')`;
}

function startGame() {
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    currentNPCIndex = 0;
    score = 0;
    updateScoreUI();
    nextNPC();
}

function nextNPC() {
    if (currentNPCIndex >= totalNPCs) {
        endGame();
        return;
    }

    currentNPCIndex++;
    currentCountEl.textContent = currentNPCIndex;
    currentNPC = generateNPC();

    // Reset UI
    btnAllow.disabled = true;
    btnDeny.disabled = true;
    idCard.classList.add('hidden');
    stampOverlay.className = ''; 
    rulebookModal.classList.add('hidden');
    
    // Animate NPC entry
    // Main sprite uses 400% background. By using percentage for X, it automatically frames 1 of 4 columns perfectly!
    const spriteXPercent = currentNPC.spriteIndex * 33.3333;
    npcSprite.style.backgroundPosition = `${spriteXPercent}% 50%`;
    
    // ID Photo uses 800% background, container width is 60px
    idPhoto.style.backgroundPosition = `-${currentNPC.photoIndex * 120 + 30}px 30%`;
    
    npcSprite.style.transform = 'translateX(-300px)';
    speechBubble.style.opacity = '0';





    
    setTimeout(() => {
        npcSprite.style.transition = 'transform 0.5s ease-out';
        npcSprite.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            speechBubble.style.opacity = '1';
            speechBubble.textContent = i18n[currentLang].speechEnter;
            
            setTimeout(() => {
                showIDCard();
            }, 1000);
        }, 600);
    }, 100);
}

function showIDCard() {
    idCompanyEl.textContent = currentNPC.company;
    idTeamEl.textContent = currentNPC.team;
    idCard.classList.remove('hidden');
    
    btnAllow.disabled = false;
    btnDeny.disabled = false;
}

function handleDecision(playerDecision) {
    btnAllow.disabled = true;
    btnDeny.disabled = true;
    playSound('stamp');

    const isCorrect = (playerDecision === 'allow' && currentNPC.isValid) || 
                      (playerDecision === 'deny' && !currentNPC.isValid);

    stampOverlay.textContent = playerDecision === 'allow' ? 'APPROVED' : 'DENIED';
    stampOverlay.classList.add(playerDecision === 'allow' ? 'stamp-allow' : 'stamp-deny');
    stampOverlay.classList.remove('hidden');

    const dict = i18n[currentLang];
    if (isCorrect) {
        score++;
        setTimeout(() => playSound('correct'), 200);
        speechBubble.textContent = playerDecision === 'allow' ? dict.speechAllowRight : dict.speechDenyRight;
    } else {
        setTimeout(() => playSound('wrong'), 200);
        speechBubble.textContent = playerDecision === 'allow' ? dict.speechAllowWrong : dict.speechDenyWrong;
    }

    updateScoreUI();

    setTimeout(() => {
        speechBubble.style.opacity = '0';
        npcSprite.style.transition = 'transform 0.5s ease-in';
        npcSprite.style.transform = 'translateX(200px)'; 
        idCard.classList.add('hidden');
        
        setTimeout(() => {
            nextNPC();
        }, 500);
    }, 1500);
}

function updateScoreUI() {
    scoreCountEl.textContent = score;
}

function endGame() {
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    
    document.getElementById('final-score').textContent = score;
    
    const evalMsg = document.getElementById('evaluation-msg');
    const dict = i18n[currentLang];
    if (score === totalNPCs) {
        evalMsg.textContent = dict.evalPerfect;
        evalMsg.style.color = "#2ecc71";
    } else if (score >= totalNPCs * 0.7) {
        evalMsg.textContent = dict.evalGood;
        evalMsg.style.color = "#f1c40f";
    } else {
        evalMsg.textContent = dict.evalBad;
        evalMsg.style.color = "#e74c3c";
    }
}

function goHome() {
    startScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
}

// Event Listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
if(homeBtnGame) homeBtnGame.addEventListener('click', goHome);
if(homeBtnEnd) homeBtnEnd.addEventListener('click', goHome);
btnAllow.addEventListener('click', () => handleDecision('allow'));
btnDeny.addEventListener('click', () => handleDecision('deny'));
langToggleBtn.addEventListener('click', toggleLanguage);
if(startLangToggleBtn) startLangToggleBtn.addEventListener('click', toggleLanguage);
btnRulebook.addEventListener('click', () => rulebookModal.classList.remove('hidden'));
closeRulebookBtn.addEventListener('click', () => rulebookModal.classList.add('hidden'));

// Initialize language
updateLanguage();

// Pre-process sprite to remove white background
initSprite();
