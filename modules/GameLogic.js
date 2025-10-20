class GameLogic {
    constructor(gameBoard) {
        this.gameBoard = gameBoard;
        this.gameOver = false;
        this.statusEl = document.getElementById('status');
        this.placeMines(15);
    }

    makeMove(index) {
        if (this.gameOver || this.gameBoard[index]) return;

        this.revealCell(index);
    }

    revealCell = (index) => {
        const cell = this.gameBoard.board[index];
        if (cell.isRevealed || this.gameOver) return;
        cell.isRevealed = true;
        
        if (cell.isMine) {
            this.gameOver = true;
            console.log('Game Over!');
            if (this.statusEl) this.statusEl.textContent = 'Game Over!';

            return;
        }

        cell.adjacentMines = this.checkAdjacentMines(index);
        cell.innerText = cell.adjacentMines > 0 ? cell.adjacentMines : '';
        this.gameBoard.renderBoard('game-container');
        console.log(cell);

        //if (this.checkWin()) {
        //    this.gameOver = true;
        //    if (this.statusEl) this.statusEl.textContent = 'You Win!';
        //}
    }

    checkWin = () => {
        const brd = this.gameBoard.board;

        // TODO: validar que esten abiertas cellTotal - minas
        //this.board.length - 15
        return false;
    }

    placeMines = (mineCount) => {
        const brd = this.gameBoard.board;
        let placedMines = 0;
        while (placedMines < mineCount) {
            const index = Math.floor(Math.random() * brd.length);
            if (!brd[index].isMine) {
                brd[index].isMine = true;
                placedMines++;
            }
        }
        //console.log(brd);
    }

    checkAdjacentMines = (index) => {
        const directions = [-1, 1, -this.gameBoard.cols, this.gameBoard.cols, -this.gameBoard.cols - 1, -this.gameBoard.cols + 1, this.gameBoard.cols - 1, this.gameBoard.cols + 1];
        let count = 0;
        directions.forEach(dir => {
            const neighborIndex = index + dir;
            if (neighborIndex >= 0 && neighborIndex < this.gameBoard.board.length) {
                if (this.gameBoard.board[neighborIndex].isMine) {
                    count++;
                }
            }
        });
        return count;
    }

    reset = () => {
        this.gameOver = false;
        this.gameBoard.reset();
        this.placeMines(15);
        if (this.statusEl) this.statusEl.textContent = '';
    }
}

export default GameLogic;