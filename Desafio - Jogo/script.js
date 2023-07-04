// Variáveis globais
var level = 1;
var score = 0;
var timerValue = 3;
var timerInterval;
var targetColor;
var targetWord;
var buttonsContainer;
var startButton;
var gameOverContainer;
var finalScore;
var playerName;
var saveScoreButton;
var rankingContainer;
var rankingList;

// Cores disponíveis
const colors = [
  "red",
  "blue",
  "yellow",
  "green",
  "orange",
  "purple",
  "pink",
  "brown",
  "grey"
];

// Inicialização do jogo
window.addEventListener("DOMContentLoaded", function () {
  buttonsContainer = document.getElementById("buttons-container");
  startButton = document.getElementById("start-button");
  gameOverContainer = document.getElementById("game-over-container");
  finalScore = document.getElementById("final-score");
  playerName = document.getElementById("player-name");
  saveScoreButton = document.getElementById("save-score-button");
  rankingContainer = document.getElementById("ranking-container");
  rankingList = document.getElementById("ranking-list");

  startButton.addEventListener("click", startGame);
  saveScoreButton.addEventListener("click", saveScore);

  document.getElementById("ranking-button").addEventListener("click", showRanking);
});


// Inicia o jogo
function startGame() {
  level = 1;
  score = 0;
  timerValue = 3;
  showLevel();
  showScore();
  showTimer();
  startButton.disabled = true;
  gameOverContainer.style.display = "none";
  buttonsContainer.style.display = "flex";
  generateButtons();
  nextRound();
  rankingContainer.style.display = "none"; 
}

// Próxima rodada
function nextRound() {
  clearInterval(timerInterval);
  if (level > 1) {
    shuffleButtons();
  }
  chooseTargetColor();
  chooseTargetWord();
  showTargetWord();
  startTimer();
}

// Escolhe uma cor alvo aleatória
function chooseTargetColor() {
  targetColor = colors[Math.floor(Math.random() * colors.length)];
}

// Escolhe uma palavra alvo aleatória
function chooseTargetWord() {
  targetWord = colors[Math.floor(Math.random() * colors.length)];
}

// Mostra a palavra alvo
function showTargetWord() {
  var targetWordElement = document.getElementById("target-word");
  targetWordElement.textContent = targetWord;
  targetWordElement.style.color = targetColor;
}

// Gera os botões de cores
function generateButtons() {
  const colorButtons = Array.from(document.getElementsByClassName("color-button"));
  const shuffledColors = shuffle(colors.slice(0, colorButtons.length));

  colorButtons.forEach((button, index) => {
    button.style.backgroundColor = shuffledColors[index];
    button.addEventListener("click", checkAnswer);
  });
}

// Embaralha os botões
function shuffleButtons() {
  var buttons = Array.from(buttonsContainer.getElementsByClassName("color-button"));
  buttons.forEach(function (button) {
    buttonsContainer.removeChild(button);
  });
  buttons.sort(function () {
    return 0.5 - Math.random();
  });
  buttons.forEach(function (button) {
    buttonsContainer.appendChild(button);
  });
}

// Inicia o temporizador
function startTimer() {
  var timerLabel = document.getElementById("timer");
  timerLabel.textContent = timerValue;
  timerInterval = setInterval(function () {
    timerValue--;
    timerLabel.textContent = timerValue;
    if (timerValue === 0) {
      endGame();
    }
  }, 1000);
}

// Verifica a resposta do jogador
function checkAnswer(event) {
  var selectedColor = event.target.style.backgroundColor;
  if (selectedColor === targetColor) {
    increaseScore();
    nextRound();
  } else {
    endGame();
  }
}

// Aumenta a pontuação
function increaseScore() {
  score++;
  showScore();
  if (score % 10 === 0) {
    increaseLevel();
  }
}

// Aumenta o nível
function increaseLevel() {
  level++;
  showLevel();
  if (level === 3) {
    shuffleButtons();
  }
  if (level >= 4) {
    timerValue = 3 - (level - 4) * 0.3;
    showTimer();
  }
}

// Mostra o nível atual
function showLevel() {
  var levelElement = document.getElementById("level");
  levelElement.textContent = level;
}

// Mostra a pontuação atual
function showScore() {
  var scoreElement = document.getElementById("score");
  scoreElement.textContent = score;
}

// Mostra o temporizador
function showTimer() {
  var timerElement = document.getElementById("timer");
  timerElement.textContent = timerValue;
}

// Finaliza o jogo
function endGame() {
  clearInterval(timerInterval);
  buttonsContainer.style.display = "none";
  gameOverContainer.style.display = "block";
  finalScore.textContent = score;
  startButton.disabled = false;
  showRanking();
}

// Salva a pontuação no ranking
function saveScore() {
  var playerNameValue = playerName.value;
  if (playerNameValue && score > 0) {
    var rankingItem = document.createElement("li");
    rankingItem.textContent = playerNameValue + " - " + score;
    rankingList.appendChild(rankingItem);
    saveRanking();
    showRanking();
    playerName.value = "";
  }
}

// Salva o ranking no armazenamento local
function saveRanking() {
  var rankingItems = Array.from(rankingList.getElementsByTagName("li"));
  var rankingData = [];
  rankingItems.forEach(function (item) {
    rankingData.push(item.textContent);
  });
  localStorage.setItem("ranking", JSON.stringify(rankingData));
}

// Mostra o ranking
function showRanking() {
  var rankingData = localStorage.getItem("ranking");
  if (rankingData) {
    rankingData = JSON.parse(rankingData);
    rankingList.innerHTML = ""; // Limpa a lista de ranking
    rankingData.forEach(function (data) {
      var rankingItem = document.createElement("li");
      rankingItem.textContent = data;
      rankingList.appendChild(rankingItem);
    });
  }
}
  

// Embaralha um array usando o algoritmo Fisher-Yates
function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
