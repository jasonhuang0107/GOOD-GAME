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

// New DOM elements for welcome and high scores screens
const welcomeScreen = document.getElementById('welcome-screen');
const playerNameInput = document.getElementById('player-name');
const modeSelection = document.querySelector('.mode-selection');
const startGameButton = document.getElementById('start-game-button');
const viewHighScoresButton = document.getElementById('view-high-scores-button');
const gameScreen = document.getElementById('game-screen');
const backToMenuButton = document.getElementById('back-to-menu-button');
const highScoresScreen = document.getElementById('high-scores-screen');
const highScoresList = document.getElementById('high-scores-list');
const backFromScoresButton = document.getElementById('back-from-scores-button');


let currentWord = '';
let score = 0;
let time = 0;
let level = 1;
let gameInterval;
let wordInterval;
let typingStartTime;
let currentSpeedLevel = 5; // Default speed level (1-10)
let gameMode = 'speed'; // Default game mode
let playerName = '匿名玩家';
let highScores = JSON.parse(localStorage.getItem('typingHighScores')) || [];

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

function showScreen(screenToShow) {
    welcomeScreen.style.display = 'none';
    gameScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    highScoresScreen.style.display = 'none';

    document.getElementById(screenToShow).style.display = 'flex';
}

function showWelcomeScreen() {
    showScreen('welcome-screen');
    playerNameInput.value = playerName;
}

function showGameScreen() {
    showScreen('game-screen');
    textInput.focus();
}

function showGameOverScreen() {
    showScreen('game-over-screen');
    finalScoreSpan.textContent = score;
}

function showHighScoresScreen() {
    showScreen('high-scores-screen');
    displayHighScores();
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
    textInput.disabled = false;
    textInput.value = '';

    // Game mode specific initializations
    if (gameMode === 'speed') {
        // Speed mode: 10 levels, normal speed progression
        levelSpan.textContent = `${level}/10`;
        currentSpeedLevel = 5; // Default speed for speed mode
        speedSlider.value = currentSpeedLevel;
        speedSlider.style.display = 'none'; // Hide speed slider in speed mode
    } else if (gameMode === 'breakthrough') {
        // Breakthrough mode: Start slow, speed up per level
        levelSpan.textContent = `${level}/10`;
        currentSpeedLevel = 1; // Start at slowest speed
        speedSlider.value = currentSpeedLevel;
        speedSlider.style.display = 'none'; // Hide speed slider in breakthrough mode
    } else if (gameMode === 'practice') {
        // Practice mode: Infinite levels, controllable speed
        levelSpan.textContent = `無限`;
        speedSlider.style.display = 'inline-block'; // Show speed slider in practice mode
    }
    updateSpeedDisplay(); // Update display based on new speedLevel

    displayNewWord();

    gameInterval = setInterval(() => {
        time++;
        timeSpan.textContent = time;
    }, 1000);

    showGameScreen();
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(wordInterval);
    textInput.disabled = true;
    
    if (gameMode === 'speed') {
        saveHighScore(playerName, score);
    }
    showGameOverScreen();
}

function resetGame() {
    endGame(); // Ensure intervals are cleared
    score = 0;
    time = 0;
    level = 1;
    scoreSpan.textContent = score;
    timeSpan.textContent = time;
    levelSpan.textContent = level;
    textInput.value = '';
    currentWord = '';
    wordDisplay.textContent = '點擊開始遊戲';
    // gameOverScreen.style.display = 'none'; // Handled by showScreen
    startButton.textContent = '重新開始'; // Reset button text for next game screen
    
    // After resetting, go back to welcome screen
    showWelcomeScreen();
}

function saveHighScore(player, finalScore) {
    const newScore = { name: player, score: finalScore, date: new Date().toLocaleString() };
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score); // Sort descending
    highScores = highScores.slice(0, 10); // Keep only top 10
    localStorage.setItem('typingHighScores', JSON.stringify(highScores));
}

function displayHighScores() {
    highScoresList.innerHTML = ''; // Clear existing list
    if (highScores.length === 0) {
        highScoresList.innerHTML = '<li>目前沒有最高分紀錄。</li>';
        return;
    }
    highScores.forEach((scoreEntry, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${index + 1}. ${scoreEntry.name}</span><span>${scoreEntry.score}分 (${scoreEntry.date})</span>`;
        highScoresList.appendChild(li);
    });
}

// Event Listeners
startGameButton.addEventListener('click', () => {
    playerName = playerNameInput.value || '匿名玩家';
    const selectedMode = document.querySelector('input[name="game-mode"]:checked');
    if (selectedMode) {
        gameMode = selectedMode.value;
    }
    startGame();
});

viewHighScoresButton.addEventListener('click', () => {
    showHighScoresScreen();
});

backToMenuButton.addEventListener('click', () => {
    showWelcomeScreen();
});

backFromScoresButton.addEventListener('click', () => {
    showWelcomeScreen();
});

startButton.addEventListener('click', () => {
    // In game-screen, startButton is '重新開始' to reset current game
    resetGame();
});

restartButton.addEventListener('click', () => {
    startGame(); // In game-over-screen, restartButton starts a new game with current settings
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

        // Game mode specific level progression
        if (gameMode === 'speed') {
            level++;
            if (level > 10) {
                endGame();
            } else {
                levelSpan.textContent = `${level}/10`;
                displayNewWord();
            }
        } else if (gameMode === 'breakthrough') {
            level++;
            if (level > 10) {
                endGame(); // 10 questions per level
            } else {
                // Increase speed for next level
                if (currentSpeedLevel < 10) {
                    currentSpeedLevel++;
                    speedSlider.value = currentSpeedLevel;
                    updateSpeedDisplay();
                }
                levelSpan.textContent = `${level}/10`;
                displayNewWord();
            }
        } else if (gameMode === 'practice') {
            level++; // Infinite levels
            levelSpan.textContent = `無限 (關卡 ${level})`;
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
showWelcomeScreen(); // Show welcome screen on initial load
