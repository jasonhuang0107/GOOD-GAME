const wordDisplay = document.getElementById('word-display');
const textInput = document.getElementById('text-input');
const scoreSpan = document.getElementById('score');
const timeSpan = document.getElementById('time');
const levelSpan = document.getElementById('level');
const startButton = document.getElementById('start-button');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreSpan = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const speedSlider = document.getElementById('speed-slider');
const speedDisplay = document.getElementById('speed-display');

let currentWord = '';
let score = 0;
let time = 0;
let level = 1;
let gameInterval;
let wordInterval;
let typingStartTime;
let currentSpeedLevel = 5; // Default speed level (1-10)

// Define 10 speed stages (interval in milliseconds)
const speedStages = Array.from({ length: 10 }, (_, i) => 5000 - i * 300);

const wordsByLevel = [
    // Level 1: Simple words (2-3 characters)
    ["你好", "謝謝", "再見", "蘋果", "香蕉", "快樂", "學習", "太陽", "月亮", "星星"],
    // Level 2: Animals
    ["貓咪", "狗狗", "老虎", "大象", "小鳥", "兔子", "馬兒", "牛隻", "羊群", "魚蝦"],
    // Level 3: Home Appliances
    ["電視", "冰箱", "冷氣", "風扇", "電鍋", "烤箱", "洗衣", "烘乾", "吸塵", "熱水"],
    // Level 4: Anime/Manga Characters (Chinese names)
    ["悟空", "鳴人", "魯夫", "炭治", "小智", "皮卡", "柯南", "多啦", "美戰", "火影"],
    // Level 5: Common objects/places (3 characters)
    ["公園", "學校", "商店", "醫院", "銀行", "餐廳", "飯店", "車站", "機場", "圖書"],
    // Level 6: Actions/verbs (3 characters)
    ["吃飯", "睡覺", "跑步", "跳舞", "唱歌", "畫畫", "讀書", "寫字", "運動", "學習"],
    // Level 7: Adjectives/feelings (3 characters)
    ["開心", "難過", "生氣", "害怕", "寂寞", "輕鬆", "緊張", "漂亮", "聰明", "勇敢"],
    // Level 8: Foods/Drinks (3 characters)
    ["咖啡", "牛奶", "果汁", "可樂", "啤酒", "麵包", "蛋糕", "餅乾", "水餃", "火鍋"],
    // Level 9: Nature/Scenery (3 characters)
    ["海洋", "高山", "河流", "湖泊", "森林", "沙漠", "天空", "白雲", "彩虹", "流星"],
    // Level 10: Mixed challenging words (3 characters)
    ["愛你", "加油", "感謝", "成功", "夢想", "希望", "未來", "奇蹟", "永恆", "幸福"]
];

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
    }, speedStages[currentSpeedLevel - 1]);
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
        // Add a visual feedback effect
        wordDisplay.classList.add('correct-feedback');
        setTimeout(() => {
            wordDisplay.classList.remove('correct-feedback');
        }, 300); // Remove the class after 300ms

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

speedSlider.addEventListener('input', (e) => {
    currentSpeedLevel = parseInt(e.target.value);
    updateSpeedDisplay();
    if (gameInterval) { // Only reset if game is active
        displayNewWord();
    }
});

function updateSpeedDisplay() {
    let speedText = '';
    if (currentSpeedLevel <= 3) {
        speedText = '慢';
    } else if (currentSpeedLevel <= 7) {
        speedText = '中等';
    } else {
        speedText = '快';
    }
    speedDisplay.textContent = speedText + ` (階段 ${currentSpeedLevel})`;
}

// Initial setup
wordDisplay.textContent = '點擊開始遊戲';
textInput.disabled = true;
updateSpeedDisplay();
