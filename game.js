class Player {
  constructor(name) {
    this.playerName = name;
    this.playerHealth = 100;
    this.playerScore = 0;
  }

  setScore(score) {
    this.playerScore = score;
  }

  setPlayerHealth(health) {
    this.playerHealth =
      this.playerHealth - health > 0 ? this.playerHealth - health : 0;
  }
}
let playerA;
let playerB;
let generateScoreTimer;
let compareScoreTimer;

// ________________________________GAME FORM________________________________
const gameData = document.getElementById("gameData");
const playerANameInput = document.getElementById("playerANameInput");
const playerBNameInput = document.getElementById("playerBNameInput");
const gameSubmitBtn = document.getElementById("gameSubmitBtn");
// __________________________________________________________________________

// _________________________GAME DATA_______________________________________
const gameBoard = document.getElementById("game");

const playerAName = document.getElementById("playerAName");
const playerBName = document.getElementById("playerBName");

const playerAHealth = document.getElementById("playerABar");
const playerBHealth = document.getElementById("playerBBar");

const playerABarStat = document.getElementById("playerABarStat");
const playerBBarStat = document.getElementById("playerBBarStat");

const playerAScore = document.getElementById("playerAScore");
const playerBScore = document.getElementById("playerBScore");

const playerABtn = document.getElementById("playerABtn");
let playerABtnListener;
const playerBBtn = document.getElementById("playerBBtn");
let playerBBtnListener;
const gameResultBox = document.getElementById("gameResultBox");
const resultdata = document.getElementById("resultdata");
const gameAbout = document.getElementById("gameAboutBox");
const restartGameBtn = document.getElementById("restartGameBtn");
const newGameBtn = document.getElementById("newGameBtn");
const headnewGameBtn = document.getElementById("headnewGameBtn");
const headrestartGameBtn = document.getElementById("headrestartGameBtn");

const helpBtn = document.getElementById("helpBtn");
const closeAboutBtn = document.getElementById("closeAboutBtn");

// _____________________________________________________________
gameAbout.style.display = "none";
gameResultBox.style.display = "none";
gameBoard.style.display = "none";

const restartGame = () => {
  gameReset();
  startGame();
};

const startNewGame = () => {
  gameReset();
  gameAbout.style.display = "none";
  gameResultBox.style.display = "none";
  gameBoard.style.display = "none";
  gameData.style.display = "";
  playerANameInput.value = "";
  playerBNameInput.value = "";
};

const newGame = () => {
  gameBoard.style.display = "none";
  gameReset();
  startGame();
  gameData.style.display = "none";
};

const closeHelp = () => {
  gameAbout.style.display = "none";
};

restartGameBtn.addEventListener("click", restartGame);
headrestartGameBtn.addEventListener("click", restartGame);
newGameBtn.addEventListener("click", startNewGame);
headnewGameBtn.addEventListener("click", startNewGame);
gameSubmitBtn.addEventListener("click", () => {
  newGame();
});
helpBtn.addEventListener("click", () => {
  gameAbout.style.display = "flex";
});
closeAboutBtn.addEventListener("click", closeHelp);

function gameReset() {
  if (compareScoreTimer) clearTimeout(compareScoreTimer);
  if (generateScoreTimer) clearInterval(generateScoreTimer);

  turns = 1;
  playerABtn.disabled = false;
  playerBBtn.disabled = true;
  playerAName.textContent = "Player One";
  playerBName.textContent = "Player Two";
  playerAScore.textContent = "0";
  playerBScore.textContent = "0";
  playerAHealth.style.height = "100%";
  playerBHealth.style.height = "100%";
  gameResultBox.style.display = "none";
  playerABarStat.textContent = "Health: 100%";
  playerBBarStat.textContent = "Health: 100%";
  if (playerABtnListener && playerBBtnListener) {
    playerABtn.removeEventListener("click", playerABtnListener);
    playerBBtn.removeEventListener("click", playerBBtnListener);
  }
  if (playerA && playerB) {
    delete playerA;
    delete playerB;
  }
}

//____________________________________________________

function startGame() {
  gameBoard.style.display = "flex";
  //   playerABarStat.textContent = "Health: 100%";
  //   playerBBarStat.textContent = "Health: 100%";
  playerA = new Player(playerANameInput.value || "Player One", true);
  playerB = new Player(playerBNameInput.value || "Player Two", false);
  playerAName.textContent = playerA.playerName;
  playerBName.textContent = playerB.playerName;
  let score = 0;
  let turns = 1;
  //   playerBBtn.disabled = true;

  const generateScore = (player) => {
    let time = 0;
    return new Promise((resolve) => {
      generateScoreTimer = setInterval(() => {
        score = Math.floor(Math.random() * 100) + 1;
        player.textContent = score;
        if (time === 10) {
          resolve(score);
          clearInterval(generateScoreTimer);
        }
        time++;
      }, 100);
    });
  };

  const hasGameEnded = () => {
    if (playerA.playerHealth === 0 || playerB.playerHealth === 0) {
      const winner = playerA.playerHealth === 0 ? playerB : playerA;
      resultdata.textContent = `${winner.playerName} has won the game`;
      gameResultBox.style.display = "block";
      return true;
    } else return false;
  };

  function compareScore() {
    console.log("Reached");
    playerABtn.disabled = playerBBtn.disabled = true;
    headrestartGameBtn.disabled = true;
    let winner, loser;
    if (playerA.playerScore > playerB.playerScore) {
      let damage = playerA.playerScore - playerB.playerScore;
      playerB.setPlayerHealth(damage);
      playerBHealth.style.height = `${playerB.playerHealth}%`;
      playerBBarStat.textContent = `Health: ${playerB.playerHealth}%`;
      winner = playerABtn;
      loser = playerBBtn;
      if (hasGameEnded()) return;
    } else if (playerA.playerScore < playerB.playerScore) {
      let damage = playerB.playerScore - playerA.playerScore;
      playerA.setPlayerHealth(damage);
      playerAHealth.style.height = `${playerA.playerHealth}%`;
      playerABarStat.textContent = `Health: ${playerA.playerHealth}%`;
      winner = playerBBtn;
      loser = playerABtn;
      if (hasGameEnded()) return;
    } else {
      turns = 1;
      playerABtn.disabled = false;
      playerBBtn.disabled = true;
      return;
    }
    compareScoreTimer = setTimeout(() => {
      console.log("reached");
      playerAScore.textContent = "0";
      playerBScore.textContent = "0";
      winner.disabled = false;
      loser.disabled = true;
      headrestartGameBtn.disabled = false;
      turns = 1;
    }, 3000);
  }

  playerABtnListener = async () => {
    playerABtn.disabled = true;
    headrestartGameBtn.disabled = true;
    const playerScore = await generateScore(playerAScore);
    headrestartGameBtn.disabled = false;
    playerA.setScore(playerScore);
    if (!(turns % 2 === 0)) {
      turns++;
      console.log(turns);
      playerBBtn.disabled = false;
    } else compareScore();
  };

  playerABtn.addEventListener("click", playerABtnListener);

  playerBBtnListener = async () => {
    playerBBtn.disabled = true;
    headrestartGameBtn.disabled = true;
    const playerScore = await generateScore(playerBScore);
    headrestartGameBtn.disabled = false;
    playerB.setScore(playerScore);
    if (!(turns % 2 === 0)) {
      turns++;
      console.log(turns);
      playerABtn.disabled = false;
    } else compareScore();
  };

  playerBBtn.addEventListener("click", playerBBtnListener);
}

// ____________________________________________________________

// newGame();
