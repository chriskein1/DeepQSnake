import Apple from './Apple.mjs';
import { directions, arrayCompare } from './Directions.mjs';
import QAgent from './QAgent.mjs';

const EMPTY = 0;
const HEAD = 1;
const BODY = 2;
const TAIL = 3;
const APPLE = 4;

export default class TrainSnake {
    constructor(width, height, canvas) {
        this.frequency = 10;
        this.canvas = canvas;
        this.w = width;
        this.h = height;
        this.squareSize = Math.floor(Math.min(this.canvas.width / this.w, this.canvas.height / this.h));
        this.body = [[this.w / 2 - 1, this.h / 2], [this.w / 2, this.h / 2]];
        this.started = false;
        this.officialDir = [0, 0];
        this.apple = new Apple(this.w, this.h, this.canvas, this.body, false);
        this.apple.spawn(this.body);
        this.maxScore = 0;

        this.initializeState();

        this.actions = Object.values(directions);
        this.qAgent = new QAgent(this.actions);

        this.boardContainer = document.createElement('div');
        this.boardContainer.id = 'board-container';
        this.boardContainer.style.display = 'flex';
        this.boardContainer.style.justifyContent = 'center';
        this.boardContainer.style.alignItems = 'center';
        this.boardContainer.style.position = 'fixed';
        this.boardContainer.style.top = '50%';
        this.boardContainer.style.left = '50%';
        this.boardContainer.style.transform = 'translate(-50%, -50%)';
        this.boardContainer.style.backgroundColor = 'blue';
        document.body.appendChild(this.boardContainer);

        this.started = true;
        this.died = false;

        window.requestAnimationFrame(this.step);
    }

    // Function to get the game state, as a 2D array
    initializeState() {

        // Initialize the state array with zeros
        this.state = Array.from({ length: this.h }, () => Array.from({ length: this.w }, () => EMPTY));

        // Set '1' for snake head
        let [headX, headY] = this.body[this.body.length - 1];
        this.state[headY][headX] = HEAD;

        // Set '2' for snake body segments
        for (let i = 1; i < this.body.length - 1; i++) {
            const [x, y] = this.body[i];
            this.state[y][x] = BODY;
        }

        // Set '3' for tail
        let [tailX, tailY] = this.body[0];
        this.state[tailY][tailX] = TAIL;

        // Set '4' for apple
        let [appleX, appleY] = this.apple.pos;
        this.state[appleY][appleX] = APPLE;
    }


    step = (timeStep) => {

        if (this.started) {
            if (this.start === undefined) {
                this.start = timeStep;
                this.current = 0;
            }
            this.printBoard();
            const elapsed = timeStep - this.start;

            if (Math.floor(elapsed / this.frequency) > this.current) {

                const action = this.updateQAndChooseAction();
                this.officialDir = action;

                this.started = true;
                this.lost = false;

                this.current = Math.floor(elapsed / this.frequency);

                this.body.push([this.body[this.body.length - 1][0] + this.officialDir[0], this.body[this.body.length - 1][1] + this.officialDir[1]]);

                this.lost = this.gameOver();
            }
            if (!this.lost) {
                window.requestAnimationFrame(this.step);
            } else {
                this.restartGame();
                this.died = true;
            }
        }
    }

    printBoard() {
        let boardHtml = '<pre>';
        for (let row of this.state) {
            for (let cell of row) {
                switch (cell) {
                    case 0:
                        boardHtml += '  ';
                        break;
                    case 1:
                        boardHtml += '1 ';
                        break;
                    case 2:
                        boardHtml += '2 ';
                        break;
                    case 3:
                        boardHtml += '3 ';
                        break;
                    case 4:
                        boardHtml += '4 ';
                        break;
                    default:
                        break;
                }
            }
            boardHtml += '\n';
        }
        boardHtml += '</pre>';
        this.boardContainer.innerHTML = boardHtml;
    }

    getReward(action) {
        if (this.appleEaten) {
            console.log("Reward: ", 10);
            return 10;
        } else if (this.died) {
            console.log("Reward: ", -10);
            this.died = false;
            return -10;
        }
        // Additional reward for moving towards the apple
        const head = this.body[this.body.length - 1];
        const [appleX, appleY] = this.apple.pos;
        const [headX, headY] = head;
        const [dirX, dirY] = action; // Use the chosen action

        // Calculate distance between head and apple
        const distanceToApple = Math.abs(headX - appleX) + Math.abs(headY - appleY);

        // Calculate distance after moving
        const newX = headX + dirX;
        const newY = headY + dirY;
        const newDistanceToApple = Math.abs(newX - appleX) + Math.abs(newY - appleY);

        // If moving closer to apple, give positive reward
        if (newDistanceToApple < distanceToApple) {
            console.log("Reward: ", 2);
            return 2;
        }

        console.log("Reward: ", 0);
        return 0;
    }

    updateQAndChooseAction() {

        // Get the initial action from the Q Agent
        let action = this.qAgent.getAction(this.state);

        // If the game has not been started and the first action is left:
        if ((this.officialDir[0] === 0 && this.officialDir[1] === 0) && (action[0] === -1 && action[1] === 0)) {
            console.log("Illegal start");
            // Get new action by excluding illegal action
            action = this.qAgent.getNewAction(this.state, action);

            console.log("New action: ", action);

            if (action[0] === -1 && action[1] === 0) console.error("WHY");
        }
        // If the action is opposite to the current direction we're going:
        else if (action[0] === -this.officialDir[0] && action[1] === -this.officialDir[1]) {
            console.log("Illegal move");
            // Get new action by excluding illegal action
            action = this.qAgent.getNewAction(this.state, action);
            if (action[0] === -this.officialDir[0] && action[1] === -this.officialDir[1]) console.error("HOW");

        }

        this.nextState = this.updateState(action);

        // Update Q values
        this.qAgent.updateQValue(this.state, action, this.getReward(action), this.updateState);

        this.prevState = this.state;


        return action;
    }

    // Move the snake in the state based on the direction
    // Move tail to the position of the previous body segment
    // Move body segment to the previous head position if apple not eaten
    // Move head to the new position
    // Move apple if necessary
    updateState(action) {
        let [headX, headY] = this.body[this.body.length - 1]; // New head location

        this.state[headY][headX] = BODY; // Update head in 2D array

        this.appleEaten = arrayCompare(this.body[this.body.length - 1], this.apple.pos);
        if (this.appleEaten) {
            this.apple.spawn(this.body);
            const [appleX, appleY] = this.apple.pos;
            this.state[appleY][appleX] = APPLE; // Update apple location
            this.appleEaten = false;

        } else {
            const [tailX, tailY] = this.body[0]; // Tail location
            this.state[tailY][tailX] = EMPTY; // Update tail to 0
            this.tail = this.body.shift();
            const [newTailX, newTailY] = this.body[0]; // New tail location
            this.state[newTailY][newTailX] = TAIL; // Update new tail location
        }

        headX += action[0];
        headY += action[1];
        if (headX < 0 || headX >= this.w || headY < 0 || headY >= this.h) {
            return;
        }
        this.state[headY][headX] = HEAD; // Update head location
    }

    gameOver() {
        let head = this.body[this.body.length - 1];
        let x = head[0];
        let y = head[1];
        if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
            return true;
        }
        if (arrayCompare(head, this.tail)) {
            return true;
        }
        for (let element of this.body.slice(0, this.body.length - 1)) {
            if (arrayCompare(element, head)) {
                return true;
            }
        }
        return false;
    }

    restartGame() {
        this.maxScore = Math.max(this.maxScore, this.body.length);
        console.log("Max: ", this.maxScore);

        console.error("DEAD");

        this.body = [[this.w / 2 - 1, this.h / 2], [this.w / 2, this.h / 2]];
        this.started = true;
        this.officialDir = [0, 0];
        this.start = undefined;
        this.current = undefined;

        this.moves = [];
        this.move = 0;
        this.numMoves = 0;

        this.apple.spawn(this.body);
        this.lost = false;

        this.initializeState();
    }
}
