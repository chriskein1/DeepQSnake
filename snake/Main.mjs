

import Game from "./Game.mjs";
import Snake from "./Snake.mjs";
import Board from "./Board.mjs";

// Get canvas
let canvas1 = document.getElementById("canvas1");
let canvas2 = document.getElementById("canvas2");

// Edit Size
canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;

let board = new Board(10, 10, canvas1);
let snake = new Snake(10, 10, canvas2);

window.addEventListener("keydown", (e) => {
    window.requestAnimationFrame(snake.step);
    if (e.key == "ArrowUp") {
        snake.setDir([0, - 1]);
    } else if (e.key == "ArrowDown") {
        snake.setDir([0, 1]);
    } else if (e.key == "ArrowLeft") {
        snake.setDir([-1, 0]);
    } else if (e.key == "ArrowRight") {
        snake.setDir([1, 0]);
    }
    else if (e.key.toLowerCase() == "w") {
        snake.setDir([0, -1]);
    } else if (e.key.toLowerCase() == "s") {
        snake.setDir([0, 1]);
    } else if (e.key.toLowerCase() == "a") {
        snake.setDir([-1, 0]);
    } else if (e.key.toLowerCase() == "d") {
        snake.setDir([1, 0]);
    }
});


// New game
// let game = new Game(10, 10, canvas.width, canvas.height);
// window.addEventListener("keydown", (e) => {
//     console.log(e.key);
//     if (e.key == "ArrowUp") {
//         game.snake.setDir([0, -1]);
//     } else if (e.key == "ArrowDown") {
//         game.snake.setDir([0, 1]);
//     } else if (e.key == "ArrowLeft") {
//         game.snake.setDir([-1, 0]);
//     } else if (e.key == "ArrowRight") {
//         game.snake.setDir([1, 0]);
//     }
// });
// //TODO: Render Snake

// // Play Game

// // int main(int argc, char **argv[]) {
// //     return 0;
// // }