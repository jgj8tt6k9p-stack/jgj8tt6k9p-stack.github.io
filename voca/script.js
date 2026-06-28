let words = [];
let currentIndex = 0;
let isRandom = false;

// CSV 파일 불러오기
async function loadWords() {
    try {
        const response = await fetch('words.csv');
        const text = await response.text();
        
        // 줄바꿈으로 나누고, 빈 줄 제외
        const lines = text.trim().split('\n').filter(line => line.length > 0);
        
        words = lines.map(line => {
            const [kanji, yomigana, meaning] = line.split(',');
            return {
                kanji: kanji.trim(),
                yomigana: yomigana.trim(),
                meaning: meaning.trim()
            };
        });

        if(words.length > 0) {
            updateCard();
        } else {
            document.getElementById('word-kanji').textContent = "단어가 없습니다.";
        }
    } catch (error) {
        console.error('단어장을 불러오는 데 실패했습니다.', error);
        document.getElementById('word-kanji').textContent = "CSV 파일 로드 에러";
    }
}

// 화면에 단어 표시하기
function updateCard() {
    if (words.length === 0) return;

    const currentWord = words[currentIndex];
    
    document.getElementById('word-kanji').textContent = currentWord.kanji;
    document.getElementById('word-yomigana').textContent = currentWord.yomigana;
    document.getElementById('word-meaning').textContent = currentWord.meaning;

    // 카드가 뒤집혀있다면 다시 앞면으로 원복
    document.getElementById('card').classList.remove('is-flipped');
}

// 카드 클릭 시 뒤집기
document.getElementById('card-container').addEventListener('click', () => {
    document.getElementById('card').classList.toggle('is-flipped');
});

// 다음 단어
document.getElementById('btn-next').addEventListener('click', () => {
    if (isRandom) {
        let newIndex;
        // 같은 단어가 연속으로 나오지 않도록 방지
        do {
            newIndex = Math.floor(Math.random() * words.length);
        } while (newIndex === currentIndex && words.length > 1);
        currentIndex = newIndex;
    } else {
        currentIndex = (currentIndex + 1) % words.length; // 마지막 단어 다음은 첫 단어
    }
    updateCard();
});

// 이전 단어
document.getElementById('btn-prev').addEventListener('click', () => {
    if (isRandom) {
        // 랜덤 모드일 때 이전 버튼도 랜덤으로 동작시킴
        currentIndex = Math.floor(Math.random() * words.length);
    } else {
        currentIndex = (currentIndex - 1 + words.length) % words.length; // 첫 단어 이전은 마지막 단어
    }
    updateCard();
});

// 모드 변경: 순서대로
document.getElementById('btn-seq').addEventListener('click', (e) => {
    isRandom = false;
    document.getElementById('btn-seq').classList.add('active');
    document.getElementById('btn-rand').classList.remove('active');
    currentIndex = 0; // 순서 모드로 바꾸면 처음부터 시작
    updateCard();
});

// 모드 변경: 랜덤으로
document.getElementById('btn-rand').addEventListener('click', (e) => {
    isRandom = true;
    document.getElementById('btn-rand').classList.add('active');
    document.getElementById('btn-seq').classList.remove('active');
    updateCard(); // 즉시 현재 위치에서 랜덤 모드 활성화 (다음 버튼 클릭시 랜덤 적용)
});

// 페이지 로드 시 단어장 실행
window.onload = loadWords;