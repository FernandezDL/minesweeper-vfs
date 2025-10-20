import GameBoard from '../modules/GameBoard.js';
import UserInput from '../modules/GameLogic.js';
import GameLogic from '../modules/GameLogic.js';

class GameEngine {
    constructor(containerId) {
        this.containerId = containerId;

        //Decorator pattern
        this.gameBoard = new GameBoard(15, 15);
        this.gameLogic = new GameLogic(this.gameBoard);
        this.userInput = new UserInput(this.GameLogic);

        this.statusEl = document.getElementById('status');
        this.resetBtn = document.getElementById('reset');

        this.gameBoard.renderBoard(containerId);

        this.resetBtn?.addEventListener('click', () => {
            this.gameLogic.reset();
            this.gameBoard.renderBoard(this.containerId);
        });
    }
}

export default GameEngine;