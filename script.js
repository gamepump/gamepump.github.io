let userIcon = "btc";
let computerIcon = "cpu";
let board = Array(9).fill(null);
let isGameOver = false;

const cells = document.querySelectorAll(".cell");
const memePopup = document.getElementById("meme-popup");
const memeImg = document.getElementById("meme-img");

// === Handle Icon Selection ===
document.querySelectorAll("#icon-picker button").forEach(btn => {
  btn.addEventListener("click", () => {
    userIcon = btn.dataset.icon;
    resetGame();
  });
});

// === Game Start ===
cells.forEach(cell => {
  cell.addEventListener("click", () => {
    const index = parseInt(cell.dataset.index);
    if (!board[index] && !isGameOver) {
      makeMove(index, "user");
      if (!isGameOver) {
        setTimeout(() => computerMove(), 500); // Delay for realism
      }
    }
  });
});

// === Make a Move ===
function makeMove(index, player) {
  board[index] = player;
  const icon = document.createElement("img");
  icon.src = `assets/icons/${player === "user" ? userIcon : computerIcon}.png`;
  cells[index].appendChild(icon);
  checkGameStatus();
}

// === Simple AI ===
function computerMove() {
  const available = board.map((val, i) => val === null ? i : null).filter(i => i !== null);
  if (available.length === 0) return;
  const choice = available[Math.floor(Math.random() * available.length)];
  makeMove(choice, "cpu");
}

// === Check Win or Draw ===
function checkGameStatus() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      isGameOver = true;
      showMeme(board[a] === "user" ? "win" : "lose");
      return;
    }
  }

  if (!board.includes(null)) {
    isGameOver = true;
    showMeme("draw");
  }
}

// === Meme Popup ===
function showMeme(result) {
  let memes = {
    win: ["win1.jpg", "win2.jpg"],
    lose: ["lose1.jpg", "lose2.jpg"],
    draw: ["draw1.jpg"]
  };

  const pool = memes[result];
  const random = pool[Math.floor(Math.random() * pool.length)];
  memeImg.src = `assets/memes/${random}`;
  memePopup.classList.remove("hidden");
}

function closeMeme() {
  memePopup.classList.add("hidden");
  resetGame();
}

// === Reset ===
function resetGame() {
  board = Array(9).fill(null);
  isGameOver = false;
  cells.forEach(cell => cell.innerHTML = "");
}
