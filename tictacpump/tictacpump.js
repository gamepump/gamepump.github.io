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
  setTimeout(computerMove, 300);
});

// Player move
function makeMove(index, player) {
  cells[index] = player;
  const cell = board.querySelector(`[data-index='${index}']`);
  cell.textContent = player;
}

// Computer move (Minimax)
function computerMove() {
  if (!gameActive) return;

  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (cells[i] === null) {
      cells[i] = "X";
      let score = minimax(cells, 0, false);
      cells[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  makeMove(move, "X");

  if (checkWin("X")) return endGame("Computer wins!");
  if (isDraw()) return endGame("It's a draw!");

  status.textContent = "Your Turn (O)";
}

// Minimax algorithm
function minimax(boardState, depth, isMaximizing) {
  if (checkWinState(boardState, "X")) return 10 - depth;
  if (checkWinState(boardState, "O")) return depth - 10;
  if (boardState.every(cell => cell !== null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === null) {
        boardState[i] = "X";
        let score = minimax(boardState, depth + 1, false);
        boardState[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === null) {
        boardState[i] = "O";
        let score = minimax(boardState, depth + 1, true);
        boardState[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWin(player) {
  return winPatterns.some(p => p.every(i => cells[i] === player));
}

function checkWinState(state, player) {
  return winPatterns.some(p => p.every(i => state[i] === player));
}

function isDraw() {
  return cells.every(cell => cell !== null);
}

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
