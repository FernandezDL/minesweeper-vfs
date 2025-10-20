class GameLogic {
    constructor(gameBoard) {
        this.gameBoard = gameBoard;
        this.gameOver = false;
        this.statusEl = document.getElementById('status');
    }

    makeMove(index) {
        if (this.gameOver || this.gameBoard[index]) return;

        this.gameBoard.updateCell(index);

        if (this.checkWin()) {
            this.gameOver = true;
            if (this.statusEl) this.statusEl.textContent = 'You exploted?';
            return;
        }
    }

    checkWin = () => {
        const brd = this.gameBoard.board;

        // TODO: validar que esten abiertas cellTotal - minas
        return false;
    }
}

export default GameLogic;