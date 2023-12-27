export default class Snake {
    constructor(width, height, canvas) {
        // Head is last element of list
        this.frequency = 1000;
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
        window.requestAnimationFrame(this.step);
    }

    step = (timeStamp) => {
        if (this.dir[0] !== 0 || this.dir[1] !== 0) {
            if (this.start === undefined) {
                this.start = timeStamp;
                this.current = 0;
            }
            const elapsed = timeStamp - this.start;
            if (Math.floor(elapsed / this.frequency) > this.current) {
                this.current = Math.floor(elapsed / this.frequency);
                this.officialDir = this.dir;
                this.body.push([this.body[this.body.length - 1][0] + this.officialDir[0], this.body[this.body.length - 1][1] + this.officialDir[1]]);
            }
            if (this.officialDir[0] !== 0 || this.officialDir[1] !== 0) {
                let ctx = this.canvas.getContext("2d");
                let headX = this.body[this.body.length - 1][0] * this.squareSize;
                let headY = this.body[this.body.length - 1][1] * this.squareSize;
                ctx.clearRect(headX, headY, this.squareSize, this.squareSize);
                // ctx.fillRect(headX, headY, this.squareSize, this.squareSize * (elapsed % this.frequency) / this.frequency);
                // Going down
                if (this.officialDir[0] === 0 && this.officialDir[1] === 1) {
                    console.log("Down");
                    ctx.fillRect(headX, headY, this.squareSize, this.squareSize * (elapsed * this.frequency) / this.frequency);
                }
                // Going up
                else if (this.officialDir[0] === 0 && this.officialDir[1] === -1) {
                    console.log("Up");
                    ctx.fillRect(headX, headY - this.squareSize * elapsed / this.max, this.squareSize, this.squareSize * elapsed / this.max);
                }
                // Going right
                else if (this.officialDir[0] === 1 && this.officialDir[1] === 0) {
                    console.log("Right");
                    ctx.fillRect(headX, headY, this.squareSize * elapsed / this.max, this.squareSize);
                }
                // Going left
                else if (this.officialDir[0] === -1 && this.officialDir[1] === 0) {
                    console.log("Left");
                    ctx.fillRect(headX - this.squareSize * elapsed / this.max, headY, this.squareSize / elapsed, this.squareSize);
                } else {
                    console.log("Error");
                }
            }
        }
        window.requestAnimationFrame(this.step);
    }

    setDir(dir) {
        this.dir = dir;
    }

    update() {
        // call once per big time step
        this.grow(); // grow head
        // this.shrink(); // shrink tail
    }

    grow() {


        // Logic to grow head
        // this.body.push({this.body[this.body.length - 1][0] + this.dir[0], this.body[this.body.length - 1][1] + this.dir[1]})
        // paint new rect at head, assign to variable.
        // int t = 0;

        /* 
            while t < refreshRate {
                move new rect in this.dir this.direction
                rect.translate(this.dir[0]/refreshRate, this.dir[1]/refreshRate)
            }
        */
        // this.body.push(newR


    }

    shrink() {
        // logic to shrink tail
    }

    eat(pos) {
        // call once per big time step
        // Logic to eat food (like update, but don't shrink tail)
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