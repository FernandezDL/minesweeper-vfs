class UserInput {
    constructor(gameLogic) {
        this.gameLogic = gameLogic;
        this.boundHandler = this.handleClick.bind(this);
        this.addEventListeners();
    }

    addEventListeners() {
        const container = document.getElementById('game-container');
        container?.addEventListener('click', this.boundHandler);
    } 

    handleClick(event) {
        const cell = event.target.closest('.cell');

        if (!cell) return;

        const index = parseInt(cell.dataset.index, 10);
        this.gameLogic.makeMove(index);
    }
}

export default UserInput;