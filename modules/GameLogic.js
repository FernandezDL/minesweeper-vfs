class GameLogic {
    constructor(gameBoard) {
        this.gameBoard = gameBoard;
        this.gameOver = false;
        this.statusEl = document.getElementById('status');
        this.placeMines(15);
    }

    makeMove(index) {
        if (this.gameOver) return; 
        const cell = this.gameBoard.board[index]; // get cell
        if (!cell || cell.isRevealed || cell.flagged) return; // if invalid, revealed or flagged, don't do anything
        this.revealCell(index); // reveal the cell
    }

    revealCell = (index) => {
        if (this.gameOver) return; 
        const cell = this.gameBoard.board[index]; // get cell
        if (!cell || cell.isRevealed || cell.flagged) return; // if invalid, revealed or flagged, don't do anything

        if (cell.isMine) { // if it's a mine
            this.gameOver = true; // set game over
            cell.isRevealed = true; // reveal the mine
            cell.innerText = 'B'; // show bomb
            this.gameBoard.renderBoard('game-container'); // render board
            return;
        }

        // If the cell's not a mine
        const count = this.checkAdjacentMines(index); // count adjacent mines
        cell.adjacentMines = count; // assign count to the cell property
        cell.innerText = count > 0 ? count : ''; // if there are adjacent mines, show text
        cell.isRevealed = true; // reveal the cell

        if (count === 0) { // if no adjacent mines
            this.floodReveal(index); // do the flood reveal
        } else { // if there are adjacent mines
            this.gameBoard.renderBoard('game-container'); // render board
        }
    }

    floodReveal(index) {
        const toReveal = [index]; // cells to reveal
        const cellSeen = new Set();

        while(toReveal.length) { // while there are cells to reveal
            const i = toReveal.shift(); // get the first cell
            if (cellSeen.has(i)) continue;
            cellSeen.add(i);

            const cell = this.gameBoard.board[i]; // get the cell
            if (!cell || cell.isMine || cell.flagged) continue; // if already revealed, mine or flagged, skip

            const count = this.checkAdjacentMines(i); // count adjacent mines
            cell.adjacentMines = count; // assign count to the cell property
            cell.innerText = count > 0 ? count : ''; // if there are adjacent mines, show text
            cell.isRevealed = true; // reveal the cell

            if (count === 0) { // if no adjacent mines
                const innerNeighbors = this.getNeighbors(i); // get neighbors

                for (const n of innerNeighbors) { // for each neighbor
                    const newCell = this.gameBoard.board[n]; // get the cell
                    if (!newCell || newCell.isMine || newCell.flagged) continue; // skip if mine or flagged

                    const newCellCount = this.checkAdjacentMines(n); // count adjacent mines
                    if (!newCell.isRevealed && newCellCount > 0) { // if not revealed and has adjacent mines
                        newCell.adjacentMines = newCellCount; // assign count to the cell property
                        newCell.innerText = String(newCellCount); // show text
                        newCell.isRevealed = true; // reveal the cell
                    }

                    if (newCellCount === 0 && !cellSeen.has(n)) toReveal.push(n); // if there are no adjacent mines and the cell is not seen, add to reveal list
                }
            } 
        }

        this.gameBoard.renderBoard('game-container'); // render board
    }

    getNeighbors(index) {
        const neighbors = []; // indices of neighboring cells
        const rows = this.gameBoard.rows; // number of rows
        const cols = this.gameBoard.cols; // number of columns
        const r = Math.floor(index / cols); // row of the cell
        const c = index % cols; // column of the cell

        const deltas = [ 
            [-1,-1], [-1,0], [-1,1],
            [ 0,-1],         [ 0,1],
            [ 1,-1], [ 1,0], [ 1,1],
        ];

        for (const [dr, dc] of deltas) { // for each neighbor direction
            const nr = r + dr, nc = c + dc; // neighbor row and column
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) { // if within bounds
                neighbors.push(nr * cols + nc); // add neighbor index
            }
        }

        return neighbors;
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
    }

    checkAdjacentMines = (index) => {
        let count = 0;
        for (const n of this.getNeighbors(index)) {
            if (this.gameBoard.board[n].isMine) count++;
        }
        return count;
    }

    toggleFlag(index){
		const cell = this.gameBoard.board[index];
		if (!cell || cell.isRevealed) return;
		cell.flagged = !cell.flagged;
		cell.innerText = cell.flagged ? 'F' : '';
		this.gameBoard.renderBoard('game-container');
	}

    reset = () => {
        this.gameOver = false;
        this.gameBoard.reset();
        this.placeMines(15);
        if (this.statusEl) this.statusEl.textContent = '';
    }
}

export default GameLogic;