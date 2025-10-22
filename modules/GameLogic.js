class GameLogic {
    constructor(gameBoard) {
        this.gameBoard = gameBoard;
        this.gameOver = false;
        this.statusEl = document.getElementById('status');
        this.placeMines(15);
    }

    makeMove(index) {
        if (this.gameOver) return;
        const cell = this.gameBoard.board[index];
        if (!cell || cell.isRevealed || cell.flagged) return;
        this.revealCell(index);
    }

    revealCell = (index) => {
        if (this.gameOver) return;
        const cell = this.gameBoard.board[index];
        if (!cell || cell.isRevealed || cell.flagged) return;

        console.log(`Revealing cell ${index}`, cell);

        if (cell.isMine) {
            this.gameOver = true;
            cell.isRevealed = true;
            cell.innerText = 'B';
            if (this.statusEl) this.statusEl.textContent = 'Game Over!';
            this.gameBoard.renderBoard('game-container');
            return;
        }

        const count = this.checkAdjacentMines(index);
        cell.adjacentMines = count;
        cell.innerText = count > 0 ? count : '';
        cell.isRevealed = true;

        console.log(`Revealed cell ${index} with ${count} adjacent mines 1`);

        if (count === 0) {
            console.log("Entrando aqui");
            this.floodReveal(index);
        } else {
            this.gameBoard.renderBoard('game-container');
        }
    }

    floodReveal(index) {
        const toReveal = [index]; // cells to reveal
        const cellSeen = new Set();

        console.log(toReveal);

        const neighbors = this.getNeighbors(index);
        toReveal.push(...neighbors);

        while(toReveal.length) { // while there are cells to reveal
            const i = toReveal.shift(); // get the first cell
            if (cellSeen.has(i)) continue;
            cellSeen.add(i);

            const cell = this.gameBoard.board[i];
            if (cell.isRevealed || cell.isMine || cell.flagged) continue; // if already revealed, mine or flagged, skip

            const count = this.checkAdjacentMines(i);
            cell.adjacentMines = count;
            cell.innerText = count > 0 ? count : '';
            cell.isRevealed = true;

            if (count === 0) {
                const innerNeighbors = this.getNeighbors(i);

                for (const n of innerNeighbors) {
                    const nc = this.gameBoard.board[n];
                    if (nc.isMine || nc.flagged) continue;

                    const nCount = this.checkAdjacentMines(n);
                    nc.adjacentMines = nCount;
                    nc.isRevealed = true;

                    if (nCount === 0 && !cellSeen.has(n)) toReveal.push(n);
                }
            } else{
                cell.isRevealed = true;
                cell.innerText = count;
            }   
        }

        this.gameBoard.renderBoard('game-container');
        console.log('Flood reveal complete');
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

    reset = () => {
        this.gameOver = false;
        this.gameBoard.reset();
        this.placeMines(15);
        if (this.statusEl) this.statusEl.textContent = '';
    }
}

export default GameLogic;