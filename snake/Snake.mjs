import Apple from './Apple.mjs';
import { directions, arrayCompare } from './Directions.mjs';
export default class Snake {
    constructor(width, height, canvas) {
        // Head is last element of list
        this.frequency = 250;
        this.canvas = canvas;
        this.w = width;
        this.h = height
        this.squareSize = Math.floor(Math.min(this.canvas.width / this.w, this.canvas.height / this.h));
        this.body = [[this.w / 2 - 1, this.h / 2], [this.w / 2, this.h / 2]];
        this.dir = [0, 0];
        this.officialDir = [0, 0];
        this.render();
        this.start = undefined;
        this.current = undefined;
        this.apple = new Apple(this.w, this.h, this.canvas, this.body);
        window.requestAnimationFrame(this.step);
    }

    step = (timeStep) => {
        if (this.dir[0] !== 0 || this.dir[1] !== 0) {
            if (this.start === undefined) {
                this.start = timeStep;
                this.current = 0;
            }
            const elapsed = timeStep - this.start;
            if (Math.floor(elapsed / this.frequency) > this.current) {
                this.current = Math.floor(elapsed / this.frequency);
                this.officialDir = this.dir;
                this.body.push([this.body[this.body.length - 1][0] + this.officialDir[0], this.body[this.body.length - 1][1] + this.officialDir[1]]);
                this.appleEaten = arrayCompare(this.body[this.body.length - 1], this.apple.pos);
                if (this.appleEaten) {
                    this.apple.spawn(this.body);
                    // Define tail
                } else {
                    this.tail = this.body.shift();
                }
                this.lost = this.gameOver();
            }
            if (!this.lost) {
                this.grow(elapsed);
                if (!this.appleEaten) {
                    this.shrink(elapsed);
                }
                window.requestAnimationFrame(this.step);
            } else {
                window.location.reload();
            }
        }
    }

    setDir(dir) {
        this.dir = dir;
    }

    /* 
        grow() is called once per small time step. 
        It grows the snake by a number of pixels to create smooth movement between tiles. 
        It also updates the official direction of the Snake,
    */
    grow(elapsed) {
        if (this.officialDir[0] === 0 && this.officialDir[1] === 0) {
            return;
        }
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "#3BB143";
        let headX = this.body[this.body.length - 1][0] * this.squareSize;
        let headY = this.body[this.body.length - 1][1] * this.squareSize;
        ctx.clearRect(headX, headY, this.squareSize, this.squareSize);
        // Set size of rectangle
        let d = this.squareSize * (elapsed % this.frequency) / this.frequency;
        if (d / this.squareSize > .90) d = this.squareSize;
        // Set direction, and draw rectangle to be moving in the correct direction
        if (arrayCompare(this.officialDir, directions["down"])) {
            ctx.fillRect(headX, headY, this.squareSize, d);
        }
        else if (arrayCompare(this.officialDir, directions["up"])) {
            ctx.fillRect(headX, headY + this.squareSize - d, this.squareSize, d);
        }
        else if (arrayCompare(this.officialDir, directions["right"])) {
            ctx.fillRect(headX, headY, d, this.squareSize);
        }
        else if (arrayCompare(this.officialDir, directions["left"])) {
            ctx.fillRect(headX + this.squareSize - d, headY, d, this.squareSize);
        } else {
            console.log("Error");
        }
    }

    // logic to shrink tail
    shrink(elapsed) {
        if (this.officialDir[0] === 0 && this.officialDir[1] === 0) {
            return;
        }
        let ctx = this.canvas.getContext("2d");
        let tailX = this.tail[0] * this.squareSize;
        let tailY = this.tail[1] * this.squareSize;
        let d = this.squareSize * (elapsed % this.frequency) / this.frequency;
        if (d / this.squareSize > .90) d = this.squareSize;
        let tailDir = this.getTailDir();
        if (arrayCompare(tailDir, directions["down"])) {
            ctx.clearRect(tailX, tailY, this.squareSize, d);
        }
        else if (arrayCompare(tailDir, directions["up"])) {
            ctx.clearRect(tailX, tailY + this.squareSize - d, this.squareSize, d);
        }
        else if (arrayCompare(tailDir, directions["right"])) {
            ctx.clearRect(tailX, tailY, d, this.squareSize);

        }
        else if (arrayCompare(tailDir, directions["left"])) {
            ctx.clearRect(tailX + this.squareSize - d, tailY, d, this.squareSize);

        } else {
            console.log("Error");
        }
    }

    // getTailDir() function called by shrink() to determine the movement direction of the tail
    getTailDir() {
        let next = this.body[0];
        return [next[0] - this.tail[0], next[1] - this.tail[1]];
    }

    // Determine if the Snake has died
    // Death is determined by going out of bounds or having the Snake's head run into its body
    gameOver() {
        // Get head of Snake
        let head = this.body[this.body.length - 1];
        // Get coordinates of head
        let x = head[0];
        let y = head[1];
        // Check if head is out of bounds
        if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
            return true;
        }
        if (arrayCompare(head, this.tail)) {
            return true;
        }
        // Check if head is in body
        for (let element of this.body.slice(0, this.body.length - 1)) {
            if (arrayCompare(element, head)) {
                return true;
            }
        }
        return false;
    }

    // Render the Snake
    render() {
        let ctx = this.canvas.getContext("2d");
        // Iterate through the Snake body list
        for (let tile of this.body) {
            // Set color
            ctx.fillStyle = '#3BB143'; // Hex code for green

            // Get coordinates for Snake
            let x = tile[0] * this.squareSize;
            let y = tile[1] * this.squareSize;
            // Create rectangle
            ctx.fillRect(x, y, this.squareSize, this.squareSize);
        }
    }
}