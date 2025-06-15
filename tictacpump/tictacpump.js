const board = document.getElementById("board");
const status = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

let cells = Array(9).fill(null);
let currentPlayer = "O";
let gameActive = true;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Create cells
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = i;
  board.appendChild(cell);
}

// Handle click
board.addEventListener("click", (e) => {
  if (!e.target.classList.contains("cell")) return;

  const index = e.target.dataset.index;
  if (!gameActive || cells[index]) return;

  makeMove(index, "O");
  if (checkWin("O")) return endGame("You win!");
  if (isDraw()) return endGame("It's a draw!");

  status.textContent = "Computer's Turn (X)";
  setTimeout(computerMove, 500);
});

// Player move
function makeMove(index, player) {
  cells[index] = player;
  const cell = board.querySelector(`[data-index='${index}']`);
  cell.textContent = player;
}

// Computer move (random empty cell)
function computerMove() {
  if (!gameActive) return;
  const empty = cells.map((v, i) => v === null ? i : null).filter(v => v !== null);
  const move = empty[Math.floor(Math.random() * empty.length)];
  makeMove(move, "X");

  if (checkWin("X")) return endGame("Computer wins!");
  if (isDraw()) return endGame("It's a draw!");

  status.textContent = "Your Turn (O)";
}

// Check win
function checkWin(player) {
  return winPatterns.some(p => p.every(i => cells[i] === player));
}

// Check draw
function isDraw() {
  return cells.every(cell => cell !== null);
}

// End game
function endGame(message) {
  status.textContent = message;
  gameActive = false;
}

// Reset
resetBtn.addEventListener("click", () => {
  cells = Array(9).fill(null);
  gameActive = true;
  status.textContent = "Your Turn (O)";
  board.querySelectorAll(".cell").forEach(c => c.textContent = "");
});

