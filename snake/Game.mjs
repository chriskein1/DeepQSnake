import Snake from "./Snake.mjs";
import Board from "./Board.mjs";

export default class Game {
    constructor(boardWidth, boardHeight, windowWidth, windowHeight) {
        this.refreshRate = 20;
        this.w = boardWidth;
        this.h = boardHeight;
        this.board = new Board(boardWidth, boardHeight);
        this.snake = new Snake(boardWidth, boardHeight);
        // this.food = this.createFood();
        // this.score = 0;
    }
}
// Game.setup();
// Game.setDir(1, 0);
// let x = 0
// while (x < 10000) {
//     Game.update();
//     Game.show();
//     Game.eat();
//     Game.endGame();
//     x++;
// }