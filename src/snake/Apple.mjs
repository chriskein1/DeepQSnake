import { arrayCompare } from "./Directions.mjs";

export default class Apple {
    constructor(width, height, canvas, body) {
        this.canvas = canvas;
        this.maxX = width;
        this.maxY = height;
        this.squareSize = Math.floor(Math.min(this.canvas.width / this.maxX, this.canvas.height / this.maxY));
        this.appleSprite = new Image();
        this.appleSprite.src = './apple.png';
        this.appleSprite.onload = () => {
            this.spawn(body);
        }
    }

    get pos() { return [this.x, this.y]; };

    spawn(body) {
        do {
            this.x = Math.floor(Math.random() * this.maxX);
            this.y = Math.floor(Math.random() * this.maxY);
        } while (this.inBody(body));
        console.log(this.pos);
        this.render();
    }

    inBody(body) {
        for (const element of body) {
            if (arrayCompare(element, this.pos)) {
                return true;
            }
        }
        return false;
    }

    render() {
        let ctx = this.canvas.getContext("2d");
        ctx.drawImage(this.appleSprite, this.x * this.squareSize, this.y * this.squareSize, this.squareSize, this.squareSize);
    }

}