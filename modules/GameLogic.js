class GameLogic {
    constructor(gameBoard) {
        this.gameBoard = gameBoard;
        this.gameOver = false;
        this.statusEl = document.getElementById('status');
        this.placeMines(20);

        // --- Timer ---
        this.timerEl = document.getElementById('timerDisplay');
        this.timerId = null;
        this.timerStarted = false;
        this.startAt = 0;   // timestamp in ms
        this.elapsed = 0; 
        this.renderTimer(0);
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

        this.startTimer();
        
        if (cell.isMine) { // if it's a mine
            this.gameOver = true; // set game over

            for(const cell of this.gameBoard.board){ // checks all cells
                if(cell.isMine) cell.isRevealed = true; // reveals all the mines
            }
            
            const resetBtn = document.getElementById('reset');
            if (resetBtn) resetBtn.classList.add('is-gameover');

            this.stopTimer(); // stop timer
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

        this.checkWin(); // Check wining condition
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
        if (this.gameOver) return;

        const brd = this.gameBoard.board; // get board
        const mines = 20;

        let safeRevealed = 0;
        for (const cell of brd) { // check all cells in the board
            if (cell.isRevealed && !cell.isMine) safeRevealed++; // if the cell is revealed and not a mine, increase the counter
        }

        if (safeRevealed === brd.length - mines) { // if the counter equals the amount of safe cells (total cells minus mines)
            this.gameOver = true; // set game over to true
            this.stopTimer(); // stop timer
            const resetBtn = document.getElementById('reset'); // get the reset button
            if (resetBtn) resetBtn.classList.add('is-win'); // change the image
        }
    }

    placeMines = (mineCount) => {
        const brd = this.gameBoard.board; // get board
        let placedMines = 0; // initialize counter
        while (placedMines < mineCount) { // while we have placed less mines than specified
            const index = Math.floor(Math.random() * brd.length); // Get a random index
            if (!brd[index].isMine) { // if that index is not already a mine
                brd[index].isMine = true; // set the cell to mine
                placedMines++; // increase the counter
            }
        }
    }

    checkAdjacentMines = (index) => {
        let count = 0;
        for (const n of this.getNeighbors(index)) { // for all neighboring cells
            if (this.gameBoard.board[n].isMine) count++; // if the neighboring cell is a mine, increase counter
        }

        return count;
    }

    toggleFlag(index){
		const cell = this.gameBoard.board[index]; // get cell
		if (!cell || cell.isRevealed) return; // if the cell is revealed, skip
		cell.flagged = !cell.flagged; // change between states
		this.gameBoard.renderBoard('game-container'); // render board
	}

    renderTimer(seconds) {
        const s = Math.min(999, Math.max(0, Math.floor(seconds)));
        if (this.timerEl) this.timerEl.textContent = s.toString().padStart(3, '0'); // change text
    }
    
    startTimer() {
        if (this.timerStarted) return; // If the timer has start, don't start again

        this.timerStarted = true; // set flag to true
        this.startAt = Date.now() - this.elapsed; // set start time

        this.timerId = setInterval(() => {
            const seconds = (Date.now() - this.startAt) / 1000;
            this.renderTimer(seconds); // render time
            if (seconds >= 999) this.stopTimer(); // time limit
        }, 1000);
    }

    stopTimer() {
        if (this.timerId) clearInterval(this.timerId);
        this.timerId = null;
        this.elapsed = Date.now() - this.startAt; // total time
        this.timerStarted = false; // set flag to false
    }

    resetTimer() {
        // restart all values
        if (this.timerId) clearInterval(this.timerId);
        this.timerId = null;

        this.timerStarted = false; // set flag to false
        this.startAt = 0; 
        this.elapsed = 0;

        this.renderTimer(0); // render the timer at 000
    }
    
    reset = () => {
        this.gameOver = false;
        const resetBtn = document.getElementById('reset'); // get the reset button
        if (resetBtn) {
            resetBtn.classList.remove('is-gameover'); // clean the game over state
            resetBtn.classList.remove('is-win'); // clean the win state
        }

        this.resetTimer(); // reset timer

        this.gameBoard.reset(); // reset game
        this.placeMines(20); // place 20 mines
    }
}

export default GameLogic;