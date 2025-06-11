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

    // Initialize the game board
    function initializeBoard() {
        board.innerHTML = '';
        gameState = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }

    // Handle cell clicks
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== '' || !isGameActive()) {
            return;
        }

        updateCell(clickedCell, clickedCellIndex);
        checkResult();
    }

    // Update a cell's state
    function updateCell(cell, index) {
        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
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
            status.textContent = `Player ${currentPlayer} wins!`;
            return;
        }

        if (!gameState.includes('')) {
            status.textContent = 'Game ended in a draw!';
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
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
