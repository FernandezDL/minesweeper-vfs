class UserInput {
    constructor(gameLogic) {
        this.gameLogic = gameLogic;

        this.onPointerDown   = this.handlePointerDown.bind(this);
        this.onContextMenu   = this.handleContextMenu.bind(this);

        this.addEventListeners();
    }

    addEventListeners() {
        const container = document.getElementById('game-container');
        if (!container) return;

        container.addEventListener('contextmenu', this.onContextMenu);
        container.addEventListener('pointerdown', this.onPointerDown);
    }

    removeEventListeners() {
        const container = document.getElementById('game-container');
        if (!container) return;

        container.removeEventListener('contextmenu', this.onContextMenu);
        container.removeEventListener('pointerdown', this.onPointerDown);
    }

    handleContextMenu(event) {
        if (event.target.closest('.cell')) { // If detects right-click on a cell
            event.preventDefault(); // Prevent the context menu from appearing
        }
    }

    handlePointerDown(event) {
        const cell = event.target.closest('.cell');
        if (!cell) return;

        const index = parseInt(cell.dataset.index, 10);
        if (Number.isNaN(index)) return;

        if (event.button === 2) { // Right-click
            event.preventDefault();          
            this.gameLogic.toggleFlag?.(index); // Toggles flag
        } else if (event.button === 0) { // Left-click
            this.gameLogic.makeMove(index); // Makes move
        } 
    }
}

export default UserInput;
