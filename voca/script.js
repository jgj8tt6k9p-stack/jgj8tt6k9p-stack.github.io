let allWords = []; 
let chapterWords = []; 
let currentIndex = 0;
let isRandom = false;

// 랜덤 셔플을 위한 배열과 인덱스 추가
let randomSequence = [];
let randomSequenceIndex = 0;

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
    
    // 랜덤 모드가 켜진 상태로 챕터를 바꿨을 경우, 새 챕터 단어로 다시 섞기
    if (isRandom) {
        generateRandomSequence();
    }
    
    updateCard();
}

/* ============================
   중복 없는 랜덤(셔플) 시퀀스 생성 함수
============================ */
function generateRandomSequence() {
    if (chapterWords.length === 0) return;
    // 0부터 챕터 단어수-1 까지의 숫자 배열을 만든 뒤 무작위로 섞음
    randomSequence = Array.from({length: chapterWords.length}, (_, i) => i);
    randomSequence.sort(() => Math.random() - 0.5);
    randomSequenceIndex = 0; // 셔플 후 첫 번째 순서부터 시작
    currentIndex = randomSequence[randomSequenceIndex];
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
    
    applyDynamicFontSize(document.getElementById('word-kanji'), currentWord.kanji, 'kanji');
    applyDynamicFontSize(document.getElementById('word-yomigana'), currentWord.yomigana, 'yomigana');
    applyDynamicFontSize(document.getElementById('word-meaning'), currentWord.meaning, 'meaning');

    document.getElementById('card').classList.remove('is-flipped');
}

document.getElementById('card-container').addEventListener('click', () => {
    document.getElementById('card').classList.toggle('is-flipped');
});

// 다음 단어 버튼
document.getElementById('btn-next').addEventListener('click', () => {
    if (isRandom) {
        randomSequenceIndex++;
        // 챕터 내의 모든 단어를 무작위로 다 봤을 경우, 다시 새롭게 섞음
        if (randomSequenceIndex >= chapterWords.length) {
            generateRandomSequence();
        } else {
            currentIndex = randomSequence[randomSequenceIndex];
        }
    } else {
        currentIndex = (currentIndex + 1) % chapterWords.length; 
    }
    updateCard();
});

// 이전 단어 버튼
document.getElementById('btn-prev').addEventListener('click', () => {
    if (isRandom) {
        randomSequenceIndex--;
        // 첫 단어에서 이전을 누르면 배열의 맨 끝(이미 섞인 순서의 마지막)으로 이동
        if (randomSequenceIndex < 0) {
            randomSequenceIndex = chapterWords.length - 1;
        }
        currentIndex = randomSequence[randomSequenceIndex];
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
    if (!isRandom) {
        isRandom = true;
        document.getElementById('btn-rand').classList.add('active');
        document.getElementById('btn-seq').classList.remove('active');
        // 랜덤 모드를 처음 켤 때 카드 한 번 섞기
        generateRandomSequence(); 
        updateCard(); 
    }
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