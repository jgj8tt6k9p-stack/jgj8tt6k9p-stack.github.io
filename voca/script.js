let allWords = []; // CSV에서 불러온 전체 단어
let chapterWords = []; // 현재 선택된 장(챕터)의 단어들 (최대 100개)
let currentIndex = 0;
let isRandom = false;

const WORDS_PER_CHAPTER = 100;

// 퀴즈 변수
let quizWords = [];
let quizCurrentIndex = 0;
let quizCorrectCount = 0;

// CSV 파일 불러오기
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
            document.getElementById('word-kanji').textContent = "単語がありません。";
            document.getElementById('chapter-select').innerHTML = '<option>データなし</option>';
        }
    } catch (error) {
        console.error('단어장을 불러오는 데 실패했습니다.', error);
        document.getElementById('word-kanji').textContent = "エラー";
        document.getElementById('chapter-select').innerHTML = '<option>エラー</option>';
    }
}

/* ============================
   챕터(장) 분리 로직
============================ */
function setupChapterSelect() {
    const select = document.getElementById('chapter-select');
    select.innerHTML = ''; // 초기화
    
    // 필요한 총 챕터 수 계산 (예: 430개 -> 5챕터)
    const totalChapters = Math.ceil(allWords.length / WORDS_PER_CHAPTER);
    
    for (let i = 0; i < totalChapters; i++) {
        const start = i * WORDS_PER_CHAPTER + 1;
        const end = Math.min((i + 1) * WORDS_PER_CHAPTER, allWords.length);
        
        const option = document.createElement('option');
        option.value = i;
        // 예: 第1章 (1~100)
        option.textContent = `第${i + 1}章 (${start} ~ ${end})`;
        select.appendChild(option);
    }

    // 챕터가 바뀌면 동작할 이벤트
    select.addEventListener('change', (e) => {
        const chapterIndex = parseInt(e.target.value);
        changeChapter(chapterIndex);
    });

    // 초기 로딩 시 1장(인덱스 0) 자동 선택
    changeChapter(0);
}

function changeChapter(chapterIndex) {
    const start = chapterIndex * WORDS_PER_CHAPTER;
    const end = start + WORDS_PER_CHAPTER;
    
    // 전체 단어에서 해당 챕터 분량만 잘라내기
    chapterWords = allWords.slice(start, end);
    
    // 상태 초기화
    currentIndex = 0;
    
    // 순서 모드로 강제 초기화할지 유지할지는 취향껏 (여기선 유지하되 첫단어로)
    updateCard();
}


/* ============================
   단어장 로직 (chapterWords 기준)
============================ */
function updateCard() {
    if (chapterWords.length === 0) return;
    const currentWord = chapterWords[currentIndex];
    
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
   화면 전환 및 퀴즈 로직 (chapterWords 기준)
============================ */
document.getElementById('btn-quiz-toggle').addEventListener('click', (e) => {
    const quizView = document.getElementById('quiz-view');
    const wordbookView = document.getElementById('wordbook-view');

    if (quizView.style.display === 'none') {
        if (chapterWords.length < 4) {
            // 현재 장의 단어가 4개 미만일 경우 예외 처리
            // (100개 단위 분할이므로 보통 마지막 장에서 발생 가능)
            alert("この章の単語が4個未満のため、クイズができません。");
            return;
        }
        wordbookView.style.display = 'none';
        quizView.style.display = 'flex';
        e.target.textContent = '単語帳';
        e.target.style.backgroundColor = '#4CAF50';
        
        // 퀴즈 중에는 챕터 이동 막기
        document.getElementById('chapter-select').disabled = true;
        
        startQuizSession();
    } else {
        quizView.style.display = 'none';
        wordbookView.style.display = 'flex';
        e.target.textContent = 'クイズ';
        e.target.style.backgroundColor = '#ff9800';
        
        // 챕터 이동 다시 허용
        document.getElementById('chapter-select').disabled = false;
        
        updateCard();
    }
});

function startQuizSession() {
    quizCorrectCount = 0;
    quizCurrentIndex = 0;
    // 현재 선택된 장(chapterWords)만으로 퀴즈 배열 생성 후 셔플
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
    document.getElementById('quiz-kanji').textContent = correctWord.kanji;
    
    // 오답은 현재 장 안에서만 뽑기
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
   🌙 テーマ切替
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

// 시작
window.onload = () => {
    applyTheme();
    loadWords();
};