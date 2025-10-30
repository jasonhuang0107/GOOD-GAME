const wordDisplay = document.getElementById('word-display');
const textInput = document.getElementById('text-input');
const scoreSpan = document.getElementById('score');
const timeSpan = document.getElementById('time');
const levelSpan = document.getElementById('level');
const startButton = document.getElementById('start-button');
const speedSlowButton = document.getElementById('speed-slow');
const speedMediumButton = document.getElementById('speed-medium');
const speedFastButton = document.getElementById('speed-fast');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreSpan = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

let currentWord = '';
let score = 0;
let time = 0;
let level = 1;
let gameInterval;
let wordInterval;
let typingStartTime;
let currentSpeed = 'medium'; // Default speed

const wordsByLevel = [
    // Level 1: Simple words (2-3 characters)
    ["你好", "謝謝", "再見", "蘋果", "香蕉", "快樂", "學習", "太陽", "月亮", "星星"],
    // Level 2: Slightly longer words (3-4 characters)
    ["電腦", "手機", "學校", "老師", "朋友", "家庭", "早餐", "午餐", "晚餐", "紅色"],
    // Level 3: Common phrases/more complex words
    ["圖書館", "博物館", "游泳池", "運動場", "動物園", "超級市場", "公共汽車", "計程車", "火車站", "飛機場"],
    // Level 4
    ["台灣", "中國", "美國", "日本", "韓國", "英國", "法國", "德國", "加拿大", "澳洲"],
    // Level 5
    ["春天", "夏天", "秋天", "冬天", "一月", "二月", "三月", "四月", "五月", "六月"],
    // Level 6
    ["七月", "八月", "九月", "十月", "十一月", "十二月", "星期一", "星期二", "星期三", "星期四"],
    // Level 7
    ["星期五", "星期六", "星期日", "早上", "中午", "下午", "晚上", "明天", "昨天", "今天"],
    // Level 8
    ["醫生", "護士", "警察", "消防員", "廚師", "工程師", "藝術家", "作家", "音樂家", "運動員"],
    // Level 9
    ["唱歌", "跳舞", "畫畫", "讀書", "寫字", "跑步", "游泳", "打球", "吃飯", "睡覺"],
    // Level 10: Longer phrases/sentences
    ["祝你生日快樂", "新年快樂", "聖誕快樂", "母親節快樂", "父親節快樂", "中秋節快樂", "端午節快樂", "我愛你", "謝謝你的幫助", "天氣真好"]
];

const speedSettings = {
    'slow': 2000,   // 2 seconds per word
    'medium': 1500, // 1.5 seconds per word
    'fast': 1000    // 1 second per word
};

// Helper functions
function getRandomWord() {
    const currentLevelWords = wordsByLevel[level - 1];
    return currentLevelWords[Math.floor(Math.random() * currentLevelWords.length)];
}

function displayNewWord() {
    currentWord = getRandomWord();
    wordDisplay.textContent = currentWord;
    textInput.value = '';
    textInput.focus();
    typingStartTime = new Date().getTime();

    clearInterval(wordInterval);
    wordInterval = setInterval(() => {
        // If word not typed in time, count as incorrect and move to next
        score -= 5; // Penalty for not typing in time
        scoreSpan.textContent = score;
        displayNewWord();
    }, speedSettings[currentSpeed]);
}

function startGame() {
    score = 0;
    time = 0;
    level = 1;
    scoreSpan.textContent = score;
    timeSpan.textContent = time;
    levelSpan.textContent = level;
    gameOverScreen.style.display = 'none';
    textInput.disabled = false;
    textInput.value = '';

    displayNewWord();

    gameInterval = setInterval(() => {
        time++;
        timeSpan.textContent = time;
    }, 1000);

    startButton.textContent = '重新開始';
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(wordInterval);
    textInput.disabled = true;
    finalScoreSpan.textContent = score;
    gameOverScreen.style.display = 'flex';
    startButton.textContent = '開始遊戲'; // Reset button text for next game
}

function resetGame() {
    endGame();
    score = 0;
    time = 0;
    level = 1;
    scoreSpan.textContent = score;
    timeSpan.textContent = time;
    levelSpan.textContent = level;
    textInput.value = '';
    currentWord = '';
    wordDisplay.textContent = '點擊開始遊戲';
    gameOverScreen.style.display = 'none';
    startButton.textContent = '開始遊戲';
}

// Event Listeners
startButton.addEventListener('click', () => {
    if (startButton.textContent === '開始遊戲') {
        startGame();
    } else {
        resetGame();
    }
});

restartButton.addEventListener('click', () => {
    startGame();
});

textInput.addEventListener('input', (e) => {
    const typedText = e.target.value;
    if (typedText === currentWord) {
        const typingEndTime = new Date().getTime();
        const timeTaken = (typingEndTime - typingStartTime) / 1000;
        score += Math.max(0, 10 - Math.floor(timeTaken)); // Score based on speed
        scoreSpan.textContent = score;

        level++;
        if (level > 10) {
            endGame();
        } else {
            levelSpan.textContent = level;
            displayNewWord();
        }
    }
});

speedSlowButton.addEventListener('click', () => {
    currentSpeed = 'slow';
    updateSpeedButtons();
    if (gameInterval) { // Only reset if game is active
        displayNewWord();
    }
});

speedMediumButton.addEventListener('click', () => {
    currentSpeed = 'medium';
    updateSpeedButtons();
    if (gameInterval) {
        displayNewWord();
    }
});

speedFastButton.addEventListener('click', () => {
    currentSpeed = 'fast';
    updateSpeedButtons();
    if (gameInterval) {
        displayNewWord();
    }
});

function updateSpeedButtons() {
    speedSlowButton.classList.remove('active');
    speedMediumButton.classList.remove('active');
    speedFastButton.classList.remove('active');

    if (currentSpeed === 'slow') {
        speedSlowButton.classList.add('active');
    } else if (currentSpeed === 'medium') {
        speedMediumButton.classList.add('active');
    } else if (currentSpeed === 'fast') {
        speedFastButton.classList.add('active');
    }
}

// Initial setup
wordDisplay.textContent = '點擊開始遊戲';
textInput.disabled = true;
updateSpeedButtons();
