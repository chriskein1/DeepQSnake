export default class Square {
    constructor(color, x, y, canvas) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.color = color;
        this.dir = [0, 0];
        this.render();
        // this.start, this.previousTimeStamp;
        setInterval(() => {
            this.update();
            this.x += this.dir[0];
            this.y += this.dir[1];
            this.render();
        }, 10);

    }

    setDir(dir) {
        this.dir = dir;
    }

    update() {
        let ctx = this.canvas.getContext("2d");
        // clear
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // draw 
        this.render();
    }

    render() {
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = this.color;
        let x = this.x;
        let y = this.y;
        ctx.fillRect(x, y, 100, 100);
    }
}