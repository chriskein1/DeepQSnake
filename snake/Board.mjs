export default class Board {
    constructor(gridWidth, gridHeight, canvas) {
        // Set canvas size
        this.w = gridWidth;
        this.h = gridHeight;
        this.canvas = canvas
        // Create array
        this.board = this.instantiateBoard();
        this.draw();
    }

    // Create board
    instantiateBoard() {
        let board = []
        for (let i = 0; i < this.w; i++) {
            // Make array 2D
            board[i] = [];
            for (let j = 0; j < this.h; j++) {
                // Set the color for each tile
                board[i][j] = (i + j) % 2 === 0 ? '#4169E1' : '#0041C2'; // Hex code for light/dark blue
            }
        }
        return board;
    }

    // Render the board
    draw() {
        let ctx = this.canvas.getContext("2d");
        let squareSize = Math.floor(Math.min(this.canvas.width / this.w, this.canvas.height / this.h));
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                // Create coordinates for tile
                let x = i * squareSize;
                let y = j * squareSize;
                // Set color
                ctx.fillStyle = this.board[i][j];
                // Create rectangle
                ctx.fillRect(x, y, squareSize, squareSize);
            }
        }
    }
}