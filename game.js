document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    const humanPlayer = 'X';
    const computerPlayer = 'O';

    // Initialize the game board
    function initializeBoard() {
        board.innerHTML = '';
        gameState = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = humanPlayer;
        status.textContent = `Your turn (${humanPlayer})`;

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }

    // Handle human player's move
    function handleCellClick(e) {
        if (currentPlayer !== humanPlayer || !isGameActive()) return;

        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== '') return;

        makeMove(clickedCell, clickedCellIndex, humanPlayer);
        
        if (!checkResult() && isGameActive()) {
            currentPlayer = computerPlayer;
            status.textContent = "Computer thinking...";
            setTimeout(computerMove, 500); // Delay for better UX
        }
    }

    // Computer makes a random move
    function computerMove() {
        if (!isGameActive()) return;

        const emptyCells = gameState
            .map((cell, index) => cell === '' ? index : null)
            .filter(val => val !== null);

        if (emptyCells.length > 0) {
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const cell = document.querySelector(`.cell[data-index="${randomIndex}"]`);
            makeMove(cell, randomIndex, computerPlayer);
            checkResult();
        }

        currentPlayer = humanPlayer;
        status.textContent = `Your turn (${humanPlayer})`;
    }

    // Make a move (human or computer)
    function makeMove(cell, index, player) {
        gameState[index] = player;
        cell.textContent = player;
    }

    // Check for win or draw
    function checkResult() {
        let roundWon = false;
        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
                continue;
            }
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            const winner = currentPlayer === humanPlayer ? 'You win!' : 'Computer wins!';
            status.textContent = winner;
            return true;
        }

        if (!gameState.includes('')) {
            status.textContent = 'Game ended in a draw!';
            return true;
        }

        return false;
    }

    // Check if game is still active
    function isGameActive() {
        return !status.textContent.includes('wins') && !status.textContent.includes('draw');
    }

    // Reset game
    resetButton.addEventListener('click', initializeBoard);

    // Start the game
    initializeBoard();
});
