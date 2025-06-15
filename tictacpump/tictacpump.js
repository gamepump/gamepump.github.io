const cells = document.querySelectorAll(".cell");
const statusDiv = document.getElementById("status");
const resetBtn = document.getElementById("reset-btn");

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameOver = false;

function checkWin(player) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
  ];

  return winPatterns.some(pattern => {
    return pattern.every(i => board[i] === player);
  });
}

function checkDraw() {
  return board.every(cell => cell !== null);
}

function updateStatus(message) {
  statusDiv.textContent = message;
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] || gameOver) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    updateStatus(`${currentPlayer} wins! 🎉`);
    gameOver = true;
  } else if (checkDraw()) {
    updateStatus(`It's a draw! 🤝`);
    gameOver = true;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus(`Turn: ${currentPlayer}`);
  }
}

function resetGame() {
  board.fill(null);
  cells.forEach(cell => cell.textContent = "");
  currentPlayer = "X";
  gameOver = false;
  updateStatus(`Turn: ${currentPlayer}`);
}

cells.forEach(cell => cell.addEventListener("click", handleClick));
resetBtn.addEventListener("click", resetGame);

// Initialize status
updateStatus(`Turn: ${currentPlayer}`);
