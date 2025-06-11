document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    const humanPlayer = 'X';
    const computerPlayer = 'O';
    let gameActive = true;

    // Initialize game
    function initGame() {
        board.innerHTML = '';
        gameState = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = humanPlayer;
        gameActive = true;
        status.textContent = `Your turn (${humanPlayer})`;

        // Create cells
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }

    // Handle human move
    function handleCellClick(e) {
        if (!gameActive || currentPlayer !== humanPlayer) return;

        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== '') return;

        makeMove(clickedCell, clickedCellIndex, humanPlayer);
        
        if (!checkGameOver()) {
            currentPlayer = computerPlayer;
            status.textContent = "Computer's turn...";
            setTimeout(computerMove, 500);
        }
    }

    // Computer move logic
    function computerMove() {
        if (!gameActive) return;

        // Find all empty cells
        const emptyCells = [];
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                emptyCells.push(i);
            }
        }

        // Make random move if available
        if (emptyCells.length > 0) {
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const cell = document.querySelector(`[data-index="${randomIndex}"]`);
            makeMove(cell, randomIndex, computerPlayer);
            checkGameOver();
        }

        currentPlayer = humanPlayer;
        status.textContent = `Your turn (${humanPlayer})`;
    }

    // Make a move
    function makeMove(cell, index, player) {
        gameState[index] = player;
        cell.textContent = player;
    }

    // Check for win/draw
    function checkGameOver() {
        // Check win
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                gameActive = false;
                status.textContent = gameState[a] === humanPlayer ? 'You win!' : 'Computer wins!';
                return true;
            }
        }

        // Check draw
        if (!gameState.includes('')) {
            gameActive = false;
            status.textContent = 'Game ended in a draw!';
            return true;
        }

        return false;
    }

    // Reset game
    resetButton.addEventListener('click', initGame);

    // Start the game
    initGame();
});
