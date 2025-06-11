document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const difficultySelect = document.getElementById('difficulty');
    
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
    let difficulty = 'medium'; // easy/medium/hard

    // Initialize game
    function initGame() {
        board.innerHTML = '';
        gameState = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = humanPlayer;
        gameActive = true;
        status.textContent = `Your turn (${humanPlayer})`;
        difficulty = difficultySelect.value;

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
            status.textContent = "Computer thinking...";
            setTimeout(computerMove, 500);
        }
    }

    // Computer move logic
    function computerMove() {
        if (!gameActive) return;

        let move;
        switch(difficulty) {
            case 'easy':
                move = getRandomMove();
                break;
            case 'medium':
                move = getWinningMove() || getRandomMove();
                break;
            case 'hard':
                move = getWinningMove() || 
                       getBlockingMove() || 
                       getCenterMove() || 
                       getCornerMove() || 
                       getRandomMove();
                break;
        }

        if (move !== undefined) {
            const cell = document.querySelector(`[data-index="${move}"]`);
            makeMove(cell, move, computerPlayer);
            checkGameOver();
        }

        currentPlayer = humanPlayer;
        status.textContent = `Your turn (${humanPlayer})`;
    }

    // AI Strategy Functions
    function getWinningMove() {
        return findStrategicMove(computerPlayer);
    }

    function getBlockingMove() {
        return findStrategicMove(humanPlayer);
    }

    function findStrategicMove(player) {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            // Check if two in a row with one empty
            if (gameState[a] === player && gameState[b] === player && gameState[c] === '') return c;
            if (gameState[a] === player && gameState[c] === player && gameState[b] === '') return b;
            if (gameState[b] === player && gameState[c] === player && gameState[a] === '') return a;
        }
        return null;
    }

    function getCenterMove() {
        return gameState[4] === '' ? 4 : null;
    }

    function getCornerMove() {
        const corners = [0, 2, 6, 8];
        const emptyCorners = corners.filter(i => gameState[i] === '');
        return emptyCorners.length > 0 ? 
               emptyCorners[Math.floor(Math.random() * emptyCorners.length)] : 
               null;
    }

    function getRandomMove() {
        const emptyCells = [];
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') emptyCells.push(i);
        }
        return emptyCells.length > 0 ? 
               emptyCells[Math.floor(Math.random() * emptyCells.length)] : 
               null;
    }

    function makeMove(cell, index, player) {
        gameState[index] = player;
        cell.textContent = player;
    }

    function checkGameOver() {
        // Check win
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
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

    // Event listeners
    resetButton.addEventListener('click', initGame);
    difficultySelect.addEventListener('change', initGame);

    // Start the game
    initGame();
});
