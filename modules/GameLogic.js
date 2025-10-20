class GameLogic {
    constructor(gameBoard) {
        this.gameBoard = gameBoard;
        this.gameOver = false;
        this.statusEl = document.getElementById('status');
        this.placeMines(15);
    }

    makeMove(index, firstClick) {
        if (this.gameOver || this.gameBoard[index]) return;

        this.revealCell(index);
    }

    revealCell = (index, firstClick) => {
        const cell = this.gameBoard.board[index];
        if (cell.isRevealed || this.gameOver) return;
        cell.isRevealed = true;
        
        if (cell.isMine) {
            this.gameOver = true;
            if (this.statusEl) this.statusEl.textContent = 'Game Over!';
            return;
        }

        this.gameBoard.updateCell(index, cell);

        if (this.checkWin()) {
            this.gameOver = true;
            if (this.statusEl) this.statusEl.textContent = 'You Win!';
        }
    }

    checkWin = () => {
        const brd = this.gameBoard.board;

        // TODO: validar que esten abiertas cellTotal - minas
        return false;
    }

    placeMines = (mineCount) => {
        console.log('Placing mines');
        const brd = this.gameBoard.board;
        let placedMines = 0;
        while (placedMines < mineCount) {
            const index = Math.floor(Math.random() * brd.length);
            if (!brd[index].isMine) {
                brd[index].isMine = true;
                placedMines++;
            }
        }

        console.log(this.gameBoard.board);
    }
}

export default GameLogic;