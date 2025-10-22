class GameBoard{
	constructor(rows, cols){
		this.rows = rows;
		this.cols = cols;
		this.board = this.createBoard();
	}

	makeCell =()=>{
		return {
			isRevealed: false,
			isMine: false,
            flagged: false,
			adjacentMines: 0
		};
	}

	createBoard(){
		return Array.from({length: this.rows * this.cols}, () => this.makeCell());
	}

	renderBoard(containerId){
		const container = document.getElementById(containerId);
		container.innerHTML = '';
		for (let index = 0; index < this.board.length; index++){
			const cell = document.createElement('div');
			cell.classList.add('cell');
			cell.classList.toggle('isRevealed', this.board[index].isRevealed);
			cell.classList.toggle('flagged', this.board[index].flagged);
			cell.classList.toggle('isMine', this.board[index].isRevealed && this.board[index].isMine);

			// colors for the adjacent mines number
			const mines = this.board[index].adjacentMines ?? 0;
			cell.dataset.count = (this.board[index].isRevealed && mines > 0 && !this.board[index].isMine) ? String(mines) : 0;
			
			cell.dataset.index = index;
			cell.textContent = this.board[index].innerText || '';
			container.appendChild(cell);
		}

	}

	reset(){
		this.board = this.createBoard();
	}
}

export default GameBoard;