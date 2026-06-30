let allWords = []; 
let chapterWords = []; 
let currentIndex = 0;
let isRandom = false;

const WORDS_PER_CHAPTER = 100;

let quizWords = [];
let quizCurrentIndex = 0;
let quizCorrectCount = 0;

async function loadWords() {
    try {
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
            setupChapterSelect();
        } else {
            applyDynamicFontSize(document.getElementById('word-kanji'), "単語がありません。", "kanji");
            document.getElementById('chapter-select').innerHTML = '<option>データなし</option>';
        }
    } catch (error) {
        console.error('단어장을 불러오는 데 실패했습니다.', error);
        applyDynamicFontSize(document.getElementById('word-kanji'), "エラー", "kanji");
        document.getElementById('chapter-select').innerHTML = '<option>エラー</option>';
    }
}

function setupChapterSelect() {
    const select = document.getElementById('chapter-select');
    select.innerHTML = ''; 
    
    const totalChapters = Math.ceil(allWords.length / WORDS_PER_CHAPTER);
    
    for (let i = 0; i < totalChapters; i++) {
        const start = i * WORDS_PER_CHAPTER + 1;
        const end = Math.min((i + 1) * WORDS_PER_CHAPTER, allWords.length);
        
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `第${i + 1}章 (${start} ~ ${end})`;
        select.appendChild(option);
    }

    select.addEventListener('change', (e) => {
        const chapterIndex = parseInt(e.target.value);
        changeChapter(chapterIndex);
    });

    changeChapter(0);
}

function changeChapter(chapterIndex) {
    const start = chapterIndex * WORDS_PER_CHAPTER;
    const end = start + WORDS_PER_CHAPTER;
    
    chapterWords = allWords.slice(start, end);
    currentIndex = 0;
    
    updateCard();
}

/* ============================
   글자 수에 따른 폰트 크기 자동 조절 로직
============================ */
function applyDynamicFontSize(element, text, type) {
    const len = text.length;
    let size = '';
    
    if (type === 'kanji') { 
        if (len <= 4) size = '60px';
        else if (len <= 8) size = '48px';
        else if (len <= 15) size = '36px';
        else if (len <= 25) size = '28px';
        else size = '22px';
    } else if (type === 'yomigana') { 
        if (len <= 8) size = '32px';
        else if (len <= 15) size = '26px';
        else if (len <= 25) size = '20px';
        else size = '16px';
    } else if (type === 'meaning') { 
        if (len <= 10) size = '26px';
        else if (len <= 20) size = '22px';
        else if (len <= 30) size = '18px';
        else size = '15px';
    }
    
    element.style.fontSize = size;
    element.textContent = text;
}

function updateCard() {
    if (chapterWords.length === 0) return;
    const currentWord = chapterWords[currentIndex];
    
    // 자동 폰트 크기 조절 함수 적용
    applyDynamicFontSize(document.getElementById('word-kanji'), currentWord.kanji, 'kanji');
    applyDynamicFontSize(document.getElementById('word-yomigana'), currentWord.yomigana, 'yomigana');
    applyDynamicFontSize(document.getElementById('word-meaning'), currentWord.meaning, 'meaning');

    document.getElementById('card').classList.remove('is-flipped');
}

document.getElementById('card-container').addEventListener('click', () => {
    document.getElementById('card').classList.toggle('is-flipped');
});

document.getElementById('btn-next').addEventListener('click', () => {
    if (isRandom) {
        let newIndex;
        do { newIndex = Math.floor(Math.random() * chapterWords.length); } 
        while (newIndex === currentIndex && chapterWords.length > 1);
        currentIndex = newIndex;
    } else {
        currentIndex = (currentIndex + 1) % chapterWords.length; 
    }
    updateCard();
});

document.getElementById('btn-prev').addEventListener('click', () => {
    if (isRandom) {
        currentIndex = Math.floor(Math.random() * chapterWords.length);
    } else {
        currentIndex = (currentIndex - 1 + chapterWords.length) % chapterWords.length; 
    }
    updateCard();
});

document.getElementById('btn-seq').addEventListener('click', (e) => {
    isRandom = false;
    document.getElementById('btn-seq').classList.add('active');
    document.getElementById('btn-rand').classList.remove('active');
    currentIndex = 0; 
    updateCard();
});

document.getElementById('btn-rand').addEventListener('click', (e) => {
    isRandom = true;
    document.getElementById('btn-rand').classList.add('active');
    document.getElementById('btn-seq').classList.remove('active');
    updateCard(); 
});

/* ============================
   퀴즈 로직
============================ */
document.getElementById('btn-quiz-toggle').addEventListener('click', (e) => {
    const quizView = document.getElementById('quiz-view');
    const wordbookView = document.getElementById('wordbook-view');

    if (quizView.style.display === 'none') {
        if (chapterWords.length < 4) {
            alert("この章の単語が4個未満のため、クイズができません。");
            return;
        }
        wordbookView.style.display = 'none';
        quizView.style.display = 'flex';
        e.target.textContent = '単語帳';
        e.target.style.backgroundColor = '#4CAF50';
        document.getElementById('chapter-select').disabled = true;
        
        startQuizSession();
    } else {
        quizView.style.display = 'none';
        wordbookView.style.display = 'flex';
        e.target.textContent = 'クイズ';
        e.target.style.backgroundColor = '#ff9800';
        document.getElementById('chapter-select').disabled = false;
        
        updateCard();
    }
});

function startQuizSession() {
    quizCorrectCount = 0;
    quizCurrentIndex = 0;
    quizWords = [...chapterWords].sort(() => Math.random() - 0.5);
    
    document.getElementById('quiz-play-area').style.display = 'flex';
    document.getElementById('quiz-result-area').style.display = 'none';
    
    generateQuiz();
}

function generateQuiz() {
    if (quizCurrentIndex >= quizWords.length) {
        showQuizResult();
        return;
    }

    const feedback = document.getElementById('quiz-feedback');
    feedback.textContent = ""; 
    
    document.getElementById('quiz-progress').textContent = `${quizCurrentIndex + 1} / ${quizWords.length}`;

    const correctWord = quizWords[quizCurrentIndex];
    // 퀴즈 문제용 폰트 크기 자동 조절 적용
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
        
        // 보기 텍스트가 너무 길면 버튼 내 폰트도 줄임
        if (optText.length > 25) {
            btn.style.fontSize = '14px';
        } else if (optText.length > 15) {
            btn.style.fontSize = '16px';
        }

        if (opt === correctWord) {
            btn.dataset.correct = "true";
        }

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
        feedback.textContent = "⭕ 正解！";
        feedback.style.color = "#4CAF50";
        quizCorrectCount++;
    } else {
        clickedBtn.classList.add('wrong');
        feedback.textContent = "❌ 不正解...";
        feedback.style.color = "#f44336";
        
        allBtns.forEach(b => {
            if (b.dataset.correct === "true") {
                b.classList.add('correct');
            }
        });
    }
    
    quizCurrentIndex++;
    setTimeout(generateQuiz, 1500);
}

function showQuizResult() {
    document.getElementById('quiz-play-area').style.display = 'none';
    document.getElementById('quiz-result-area').style.display = 'flex';
    
    const scoreElement = document.getElementById('quiz-result-score');
    scoreElement.textContent = `${quizCorrectCount} / ${quizWords.length}`;
}

document.getElementById('btn-quiz-restart').addEventListener('click', startQuizSession);

/* ============================
   テーマ切替
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