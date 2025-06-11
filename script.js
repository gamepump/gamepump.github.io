document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = [];
    let currentPlayer = 'X';

    // Create board
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.addEventListener('click', () => handleClick(i));
        board.appendChild(cell);
        cells.push(cell);
    }

    function handleClick(index) {
        if (cells[index].textContent !== '') return;
        
        cells[index].textContent = currentPlayer;
        
        if (checkWin()) {
            alert(`${currentPlayer} wins!`);
            showPopup(); // Show your popup image
            resetGame();
        } else if (isDraw()) {
            alert("Draw!");
            resetGame();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }

    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winPatterns.some(pattern => 
            pattern.every(index => cells[index].textContent === currentPlayer)
        );
    }

    function isDraw() {
        return cells.every(cell => cell.textContent !== '');
    }

    function resetGame() {
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = 'X';
    }

    function showPopup() {
        document.getElementById('popup').style.display = 'block';
    }
});