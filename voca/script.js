let words = [];
let currentIndex = 0;
let isRandom = false;

let quizWords = [];
let quizCurrentIndex = 0;
let quizCorrectCount = 0;

// CSV 파일 불러오기
async function loadWords() {
    try {
        const response = await fetch('words.csv');
        const text = await response.text();
        
        const lines = text.trim().split('\n').filter(line => line.length > 0);
        
        words = lines.map(line => {
            const [kanji, yomigana, meaning] = line.split(',');
            return {
                kanji: kanji ? kanji.trim() : "",
                yomigana: yomigana ? yomigana.trim() : "",
                meaning: meaning ? meaning.trim() : ""
            };
        });

        if(words.length > 0) {
            updateCard();
        } else {
            document.getElementById('word-kanji').textContent = "単語がありません。";
        }
    } catch (error) {
        console.error('단어장을 불러오는 데 실패했습니다.', error);
        document.getElementById('word-kanji').textContent = "エラー";
    }
}

/* ============================
   단어장 로직 (日本語 UI)
============================ */
function updateCard() {
    if (words.length === 0) return;
    const currentWord = words[currentIndex];
    
    document.getElementById('word-kanji').textContent = currentWord.kanji;
    document.getElementById('word-yomigana').textContent = currentWord.yomigana;
    document.getElementById('word-meaning').textContent = currentWord.meaning;

    document.getElementById('card').classList.remove('is-flipped');
}

document.getElementById('card-container').addEventListener('click', () => {
    document.getElementById('card').classList.toggle('is-flipped');
});

document.getElementById('btn-next').addEventListener('click', () => {
    if (isRandom) {
        let newIndex;
        do { newIndex = Math.floor(Math.random() * words.length); } 
        while (newIndex === currentIndex && words.length > 1);
        currentIndex = newIndex;
    } else {
        currentIndex = (currentIndex + 1) % words.length; 
    }
    updateCard();
});

document.getElementById('btn-prev').addEventListener('click', () => {
    if (isRandom) {
        currentIndex = Math.floor(Math.random() * words.length);
    } else {
        currentIndex = (currentIndex - 1 + words.length) % words.length; 
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
   화면 전환 및 퀴즈 로직
============================ */
document.getElementById('btn-quiz-toggle').addEventListener('click', (e) => {
    const quizView = document.getElementById('quiz-view');
    const wordbookView = document.getElementById('wordbook-view');

    if (quizView.style.display === 'none') {
        if (words.length < 4) {
            alert("クイズを始めるには単語が少なくとも4個以上必要です。");
            return;
        }
        wordbookView.style.display = 'none';
        quizView.style.display = 'flex';
        e.target.textContent = '単語帳';
        e.target.style.backgroundColor = '#4CAF50';
        startQuizSession();
    } else {
        quizView.style.display = 'none';
        wordbookView.style.display = 'flex';
        e.target.textContent = 'クイズ';
        e.target.style.backgroundColor = '#ff9800';
        updateCard();
    }
});

function startQuizSession() {
    quizCorrectCount = 0;
    quizCurrentIndex = 0;
    quizWords = [...words].sort(() => Math.random() - 0.5);
    
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
    document.getElementById('quiz-kanji').textContent = correctWord.kanji;
    
    let options = [correctWord];
    while(options.length < 4) {
        const wrongIndex = Math.floor(Math.random() * words.length);
        const wrongWord = words[wrongIndex];
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
        btn.textContent = `${opt.yomigana} (${opt.meaning})`;
        
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
   🌙 ダークモード トグル ロ직
============================ */
const btnDarkMode = document.getElementById('btn-dark-mode');

btnDarkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        btnDarkMode.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        btnDarkMode.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
});

// 페이지 초기 로드 시 기존 테마 유저 설정 반영
function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        btnDarkMode.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        btnDarkMode.textContent = '🌙';
    }
}

// 시작
window.onload = () => {
    applyTheme();
    loadWords();
};