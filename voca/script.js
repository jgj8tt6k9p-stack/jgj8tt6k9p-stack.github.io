let words = [];
let currentIndex = 0;
let isRandom = false;

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
            document.getElementById('word-kanji').textContent = "단어가 없습니다.";
        }
    } catch (error) {
        console.error('단어장을 불러오는 데 실패했습니다.', error);
        document.getElementById('word-kanji').textContent = "로드 에러";
    }
}

/* ============================
   단어장 (Flashcard) 로직
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
        // 퀴즈 모드로 전환
        if (words.length < 4) {
            alert("퀴즈를 진행하려면 단어가 최소 4개 이상 필요합니다.");
            return;
        }
        wordbookView.style.display = 'none';
        quizView.style.display = 'flex';
        e.target.textContent = '단어장 보기';
        e.target.style.backgroundColor = '#4CAF50';
        generateQuiz();
    } else {
        // 단어장 모드로 전환
        quizView.style.display = 'none';
        wordbookView.style.display = 'flex';
        e.target.textContent = '퀴즈 보기';
        e.target.style.backgroundColor = '#ff9800';
        updateCard();
    }
});

function generateQuiz() {
    const feedback = document.getElementById('quiz-feedback');
    feedback.textContent = ""; // 피드백 초기화
    
    // 정답 단어 1개 무작위 선택
    const correctIndex = Math.floor(Math.random() * words.length);
    const correctWord = words[correctIndex];
    
    document.getElementById('quiz-kanji').textContent = correctWord.kanji;
    
    // 오답 3개 추가 (정답과 겹치지 않게)
    let options = [correctWord];
    while(options.length < 4) {
        const wrongIndex = Math.floor(Math.random() * words.length);
        const wrongWord = words[wrongIndex];
        // 배열에 없는 단어만 추가
        if (!options.includes(wrongWord)) {
            options.push(wrongWord);
        }
    }
    
    // 보기 순서 무작위 섞기
    options.sort(() => Math.random() - 0.5);
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = ''; // 기존 버튼 초기화
    
    // 4개의 버튼 생성
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = `${opt.yomigana} (${opt.meaning})`;
        
        // 정답 여부 저장
        if (opt === correctWord) {
            btn.dataset.correct = "true";
        }

        btn.onclick = () => checkAnswer(btn, optionsContainer);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(clickedBtn, container) {
    // 한 번 클릭하면 모든 버튼 비활성화
    const allBtns = container.querySelectorAll('.quiz-option');
    allBtns.forEach(b => b.disabled = true);
    
    const isCorrect = clickedBtn.dataset.correct === "true";
    const feedback = document.getElementById('quiz-feedback');

    if (isCorrect) {
        clickedBtn.classList.add('correct');
        feedback.textContent = "⭕ 정답!";
        feedback.style.color = "#4CAF50";
    } else {
        clickedBtn.classList.add('wrong');
        feedback.textContent = "❌ 오답!";
        feedback.style.color = "#f44336";
        
        // 오답을 골랐을 때 정답인 버튼을 초록색으로 표시해줌
        allBtns.forEach(b => {
            if (b.dataset.correct === "true") {
                b.classList.add('correct');
            }
        });
    }
    
    // 1.5초(1500ms) 뒤에 다음 퀴즈 자동 생성
    setTimeout(generateQuiz, 1500);
}

// 시작
window.onload = loadWords;