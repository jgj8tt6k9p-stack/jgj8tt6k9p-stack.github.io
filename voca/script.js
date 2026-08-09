let allWords = []; 
let chapterWords = []; 
let currentChunkSize = 20;

let studySequence = []; 
let currentStep = 0;    
let isRandom = false;

// 암기 상태를 저장할 Set (로컬 스토리지 연동)
let memorizedSet = new Set();

let quizSequence = [];
let quizCurrentIndex = 0;
let quizCorrectCount = 0;

const views = ['view-home', 'view-chapters', 'view-study', 'view-completion', 'view-quiz', 'view-quiz-result'];

// CSV 로드 및 저장된 암기 데이터 불러오기
async function loadWords() {
    try {
        // 암기된 단어 목록 불러오기
        const savedMemorized = JSON.parse(localStorage.getItem('memorizedWords')) || [];
        memorizedSet = new Set(savedMemorized);

        const response = await fetch('words.csv');
        const text = await response.text();
        const lines = text.trim().split('\n').filter(line => line.length > 0);
        
        allWords = lines.map(line => {
            const [kanji, yomigana, meaning] = line.split(',');
            return {
                kanji: kanji ? kanji.trim() : "",
                yomigana: yomigana ? yomigana.trim() : "",
                meaning: meaning ? meaning.trim() : ""
            };
        });

        if(allWords.length > 0) {
            showView('view-home');
        } else {
            alert("単語データがありません。");
        }
    } catch (error) {
        console.error('CSV로드 에러:', error);
        alert("データの読み込みに失敗しました。");
    }
}

/* ============================
   화면 제어 함수
============================ */
function showView(viewId) {
    views.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    document.getElementById(viewId).style.display = 'flex';

    const btnBack = document.getElementById('btn-back');
    if (viewId === 'view-home') {
        btnBack.style.display = 'none';
        document.getElementById('header-title').textContent = "日本語 単語帳";
    } else {
        btnBack.style.display = 'block';
    }
}

document.getElementById('btn-back').addEventListener('click', () => {
    const activeView = views.find(id => document.getElementById(id).style.display === 'flex');
    
    if (activeView === 'view-chapters') {
        showView('view-home');
    } else if (['view-study', 'view-completion', 'view-quiz', 'view-quiz-result'].includes(activeView)) {
        showView('view-chapters');
    }
});

/* ============================
   1. 단위 선택 (홈 화면)
============================ */
document.getElementById('btn-chunk-20').addEventListener('click', () => setupChapters(20));
document.getElementById('btn-chunk-100').addEventListener('click', () => setupChapters(100));

/* ============================
   2. 챕터 목록 생성
============================ */
function setupChapters(chunkSize) {
    currentChunkSize = chunkSize;
    const listContainer = document.getElementById('chapter-list-container');
    listContainer.innerHTML = '';
    
    const totalChapters = Math.ceil(allWords.length / chunkSize);
    
    for (let i = 0; i < totalChapters; i++) {
        const start = i * chunkSize + 1;
        const end = Math.min((i + 1) * chunkSize, allWords.length);
        
        const btn = document.createElement('button');
        btn.className = 'btn-chapter';
        btn.textContent = `第${i + 1}章 (${start} ~ ${end})`;
        
        btn.onclick = () => startChapter(i);
        listContainer.appendChild(btn);
    }
    
    document.getElementById('header-title').textContent = `${chunkSize}個ずつ学習`;
    showView('view-chapters');
}

/* ============================
   3. 단어장 학습 시작 및 로직
============================ */
function startChapter(chapterIndex) {
    const start = chapterIndex * currentChunkSize;
    const end = start + currentChunkSize;
    chapterWords = allWords.slice(start, end);
    
    startStudySession();
}

function startStudySession() {
    studySequence = Array.from({length: chapterWords.length}, (_, i) => i);
    
    if (isRandom) {
        studySequence.sort(() => Math.random() - 0.5);
    }
    
    currentStep = 0;
    showView('view-study');
    updateCard();
}

function applyDynamicFontSize(element, text, type) {
    const len = text.length;
    let size = '';
    
    if (type === 'kanji') { 
        if (len <= 4) size = '60px'; else if (len <= 8) size = '48px'; else if (len <= 15) size = '36px'; else if (len <= 25) size = '28px'; else size = '22px';
    } else if (type === 'yomigana') { 
        if (len <= 8) size = '32px'; else if (len <= 15) size = '26px'; else if (len <= 25) size = '20px'; else size = '16px';
    } else if (type === 'meaning') { 
        if (len <= 10) size = '26px'; else if (len <= 20) size = '22px'; else if (len <= 30) size = '18px'; else size = '15px';
    }
    element.style.fontSize = size;
    element.textContent = text;
}

function updateCard() {
    if (chapterWords.length === 0) return;
    
    document.getElementById('study-progress').textContent = `${currentStep + 1} / ${chapterWords.length}`;
    
    const wordIndex = studySequence[currentStep];
    const currentWord = chapterWords[wordIndex];
    
    applyDynamicFontSize(document.getElementById('word-kanji'), currentWord.kanji, 'kanji');
    applyDynamicFontSize(document.getElementById('word-yomigana'), currentWord.yomigana, 'yomigana');
    applyDynamicFontSize(document.getElementById('word-meaning'), currentWord.meaning, 'meaning');

    // 암기 상태 체크 후 UI 업데이트
    const isMemorized = memorizedSet.has(currentWord.kanji);
    const badges = document.querySelectorAll('.memorized-badge');
    badges.forEach(b => b.style.display = isMemorized ? 'block' : 'none');
    
    const btnMemo = document.getElementById('btn-memorize');
    if (isMemorized) {
        btnMemo.classList.add('active');
        btnMemo.textContent = '✅ 覚えた'; // 외웠다 (완료)
    } else {
        btnMemo.classList.remove('active');
        btnMemo.textContent = '✔ 覚える'; // 외우기 (미완료)
    }

    document.getElementById('card').classList.remove('is-flipped');
}

// 암기 버튼 클릭 이벤트
document.getElementById('btn-memorize').addEventListener('click', () => {
    if (chapterWords.length === 0) return;
    const currentWord = chapterWords[studySequence[currentStep]];
    
    if (memorizedSet.has(currentWord.kanji)) {
        memorizedSet.delete(currentWord.kanji); // 암기 취소
    } else {
        memorizedSet.add(currentWord.kanji); // 암기 등록
    }
    
    // 로컬 스토리지에 배열 형태로 저장
    localStorage.setItem('memorizedWords', JSON.stringify(Array.from(memorizedSet)));
    
    // 버튼 및 뱃지 상태 즉시 갱신
    updateCard();
});

document.getElementById('card-container').addEventListener('click', () => {
    document.getElementById('card').classList.toggle('is-flipped');
});

document.getElementById('btn-next').addEventListener('click', () => {
    currentStep++;
    if (currentStep >= chapterWords.length) {
        showView('view-completion');
    } else {
        updateCard();
    }
});

document.getElementById('btn-prev').addEventListener('click', () => {
    currentStep--;
    if (currentStep < 0) {
        currentStep = chapterWords.length - 1;
    }
    updateCard();
});

document.getElementById('btn-seq').addEventListener('click', () => {
    isRandom = false;
    document.getElementById('btn-seq').classList.add('active');
    document.getElementById('btn-rand').classList.remove('active');
    startStudySession(); 
});

document.getElementById('btn-rand').addEventListener('click', () => {
    isRandom = true;
    document.getElementById('btn-rand').classList.add('active');
    document.getElementById('btn-seq').classList.remove('active');
    startStudySession(); 
});


/* ============================
   4. 학습 완료 화면 버튼 동작
============================ */
document.getElementById('btn-go-quiz').addEventListener('click', () => {
    if (chapterWords.length < 4) {
        alert("この章の単語が4個未満のため、クイズができません。");
        return;
    }
    startQuizSession();
});

document.getElementById('btn-go-review').addEventListener('click', () => {
    startStudySession(); 
});

document.getElementById('btn-go-list-from-comp').addEventListener('click', () => {
    showView('view-chapters');
});


/* ============================
   5. 퀴즈 로직
============================ */
function startQuizSession() {
    quizCorrectCount = 0;
    quizCurrentIndex = 0;
    quizSequence = [...chapterWords].sort(() => Math.random() - 0.5);
    
    showView('view-quiz');
    generateQuiz();
}

function generateQuiz() {
    if (quizCurrentIndex >= quizSequence.length) {
        showQuizResult();
        return;
    }

    const feedback = document.getElementById('quiz-feedback');
    feedback.textContent = ""; 
    
    document.getElementById('quiz-progress').textContent = `${quizCurrentIndex + 1} / ${quizSequence.length}`;

    const correctWord = quizSequence[quizCurrentIndex];
    applyDynamicFontSize(document.getElementById('quiz-kanji'), correctWord.kanji, 'kanji');
    
    let options = [correctWord];
    while(options.length < 4) {
        const wrongIndex = Math.floor(Math.random() * chapterWords.length);
        const wrongWord = chapterWords[wrongIndex];
        if (!options.includes(wrongWord)) {
            options.push(wrongWord);
        }
    }
    
    options.sort(() => Math.random() - 0.5);
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = ''; 
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        
        const optText = `${opt.yomigana} (${opt.meaning})`;
        btn.textContent = optText;
        if (optText.length > 25) { btn.style.fontSize = '14px'; } 
        else if (optText.length > 15) { btn.style.fontSize = '16px'; }

        if (opt === correctWord) { btn.dataset.correct = "true"; }

        btn.onclick = () => checkAnswer(btn, optionsContainer);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(clickedBtn, container) {
    const allBtns = container.querySelectorAll('.quiz-option');
    allBtns.forEach(b => b.disabled = true);
    
    const isCorrect = clickedBtn.dataset.correct === "true";
    const feedback = document.getElementById('quiz-feedback');

    if (isCorrect) {
        clickedBtn.classList.add('correct');
        feedback.textContent = "⭕ 正解！"; feedback.style.color = "#4CAF50";
        quizCorrectCount++;
    } else {
        clickedBtn.classList.add('wrong');
        feedback.textContent = "❌ 不正解..."; feedback.style.color = "#f44336";
        allBtns.forEach(b => {
            if (b.dataset.correct === "true") b.classList.add('correct');
        });
    }
    
    quizCurrentIndex++;
    setTimeout(generateQuiz, 1500);
}


/* ============================
   6. 퀴즈 결과 화면
============================ */
function showQuizResult() {
    showView('view-quiz-result');
    document.getElementById('quiz-result-score').textContent = `${quizCorrectCount} / ${quizSequence.length}`;
}

document.getElementById('btn-quiz-restart').addEventListener('click', startQuizSession);
document.getElementById('btn-go-list-from-quiz').addEventListener('click', () => showView('view-chapters'));


/* ============================
   🌙 테마(다크모드) 제어
============================ */
const btnDarkMode = document.getElementById('btn-dark-mode');

btnDarkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        btnDarkMode.textContent = '明るい'; 
        localStorage.setItem('theme', 'dark');
    } else {
        btnDarkMode.textContent = 'ダーク'; 
        localStorage.setItem('theme', 'light');
    }
});

function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
        btnDarkMode.textContent = 'ダーク';
    } else {
        document.body.classList.add('dark-mode');
        btnDarkMode.textContent = '明るい';
    }
}

window.onload = () => {
    applyTheme();
    loadWords();
};