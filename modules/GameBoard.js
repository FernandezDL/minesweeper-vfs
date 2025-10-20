class GameBoard{
	constructor(rows, cols){
		this.rows = rows;
		this.cols = cols;
		this.board = this.createBoard();
	}

	createBoard(){
		return Array.from({length: this.rows * this.cols}, () => '');
	}

	renderBoard(containerId){
		const container = document.getElementById(containerId);
		container.innerHTML = '';
		for (let index = 0; index < this.board.length; index++){
			const cell = document.createElement('div');
			cell.classList.add('cell');
			cell.dataset.index = index;
			cell.textContent = this.board[index] || '';
			container.appendChild(cell);
		}
	}

	updateCell(index, value){
		this.board[index] = value;
	}

	reset(){
		this.board = this.createBoard();
	}
}

export default GameBoard;