let allWords = []; 
let chapterWords = []; 
let currentChunkSize = 20;
let currentChapterIndex = 0; 

let studySequence = []; 
let currentStep = 0;    
let isRandom = false;

let memorizedChapters = new Set();

let quizSequence = [];
let quizCurrentIndex = 0;
let quizCorrectCount = 0;
let currentQuizType = 'yomi'; 

const views = ['view-home', 'view-chapters', 'view-study', 'view-completion', 'view-quiz', 'view-quiz-result'];

async function loadWords() {
    try {
        const savedChapters = JSON.parse(localStorage.getItem('memorizedChapters')) || [];
        memorizedChapters = new Set(savedChapters);

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
        setupChapters(currentChunkSize);
    }
});

/* ============================
   1. 단위 선택 & 2. 챕터 목록 생성
============================ */
// 50개 버튼 동작 추가
document.getElementById('btn-chunk-20').addEventListener('click', () => setupChapters(20));
document.getElementById('btn-chunk-50').addEventListener('click', () => setupChapters(50));
document.getElementById('btn-chunk-100').addEventListener('click', () => setupChapters(100));

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
        
        const chapterKey = `${chunkSize}_${i}`;
        
        if (memorizedChapters.has(chapterKey)) {
            btn.innerHTML = `<span>第${i + 1}章 (${start} ~ ${end})</span> <span style="font-size:22px;">✅</span>`;
            btn.classList.add('completed');
        } else {
            btn.textContent = `第${i + 1}章 (${start} ~ ${end})`;
        }
        
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
    currentChapterIndex = chapterIndex;
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

    document.getElementById('card').classList.remove('is-flipped');
}

document.getElementById('btn-skip-to-quiz').addEventListener('click', () => {
    showCompletionScreen();
});

document.getElementById('card-container').addEventListener('click', () => {
    document.getElementById('card').classList.toggle('is-flipped');
});

document.getElementById('btn-next').addEventListener('click', () => {
    currentStep++;
    if (currentStep >= chapterWords.length) {
        showCompletionScreen(); 
    } else {
        updateCard();
    }
});

document.getElementById('btn-prev').addEventListener('click', () => {
    currentStep--;
    if (currentStep < 0) { currentStep = chapterWords.length - 1; }
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
   4. 학습 완료 화면 (퀴즈 종류 선택)
============================ */
function showCompletionScreen() {
    showView('view-completion');
}

document.getElementById('btn-go-quiz-yomi').addEventListener('click', () => {
    if (chapterWords.length < 4) { alert("単語が4個未満のため、クイズができません。"); return; }
    currentQuizType = 'yomi';
    startQuizSession();
});

document.getElementById('btn-go-quiz-imi').addEventListener('click', () => {
    if (chapterWords.length < 4) { alert("単語が4個未満のため、クイズができません。"); return; }
    currentQuizType = 'imi';
    startQuizSession();
});

document.getElementById('btn-go-review').addEventListener('click', () => {
    startStudySession(); 
});

document.getElementById('btn-go-list-from-comp').addEventListener('click', () => {
    setupChapters(currentChunkSize);
});


/* ============================
   5. 퀴즈 진행 로직
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
    
    const hintElement = document.getElementById('quiz-hint');
    hintElement.classList.add('clickable');
    hintElement.dataset.isHidden = "true";
    
    if (currentQuizType === 'yomi') {
        hintElement.textContent = "💡 意味を見る";
        hintElement.dataset.hintText = `[ ${correctWord.meaning} ]`;
    } else {
        hintElement.textContent = "💡 読み方を見る";
        hintElement.dataset.hintText = `[ ${correctWord.yomigana} ]`;
    }
    
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
        
        let optText = "";
        if (currentQuizType === 'yomi') {
            optText = opt.yomigana;
        } else {
            optText = opt.meaning;
        }

        btn.textContent = optText;
        if (optText.length > 25) { btn.style.fontSize = '14px'; } 
        else if (optText.length > 15) { btn.style.fontSize = '16px'; }

        if (opt === correctWord) { btn.dataset.correct = "true"; }

        btn.onclick = () => checkAnswer(btn, optionsContainer);
        optionsContainer.appendChild(btn);
    });
}

document.getElementById('quiz-hint').addEventListener('click', function() {
    if (this.dataset.isHidden === "true") {
        this.textContent = this.dataset.hintText;
        this.dataset.isHidden = "false";
        this.classList.remove('clickable'); 
    }
});

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
   6. 퀴즈 결과 화면 (암기 버튼 표시)
============================ */
function showQuizResult() {
    showView('view-quiz-result');
    document.getElementById('quiz-result-score').textContent = `${quizCorrectCount} / ${quizSequence.length}`;
    updateMarkChapterButton();
}

function updateMarkChapterButton() {
    const btn = document.getElementById('btn-mark-chapter');
    const chapterKey = `${currentChunkSize}_${currentChapterIndex}`;
    
    if (memorizedChapters.has(chapterKey)) {
        btn.textContent = "✅ 暗記済みに設定中 (取消)"; 
        btn.classList.add('active');
    } else {
        btn.textContent = "✔ この章を覚えた"; 
        btn.classList.remove('active');
    }
}

document.getElementById('btn-mark-chapter').addEventListener('click', () => {
    const chapterKey = `${currentChunkSize}_${currentChapterIndex}`;
    
    if (memorizedChapters.has(chapterKey)) {
        memorizedChapters.delete(chapterKey);
    } else {
        memorizedChapters.add(chapterKey);
    }
    
    localStorage.setItem('memorizedChapters', JSON.stringify(Array.from(memorizedChapters)));
    updateMarkChapterButton(); 
});


document.getElementById('btn-quiz-restart').addEventListener('click', startQuizSession);
document.getElementById('btn-go-list-from-quiz').addEventListener('click', () => {
    setupChapters(currentChunkSize);
});


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