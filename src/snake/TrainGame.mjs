import { useEffect } from 'react';
import TrainSnake from "./Training.mjs";

const TrainGame = () => {
    useEffect(() => {
        console.log("Reading main successfully");

        let canvas = document.getElementById("canvas");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let snake = new TrainSnake(10, 10, canvas);

        const interval = setInterval(() => {
            window.requestAnimationFrame(() => {
                snake.step(performance.now());
                snake.printBoard(); // Update the board display
            });
        }, 1000 / 60); // 60 FPS

        return () => clearInterval(interval);
    }, []);
    
    return (
        <canvas id="canvas"></canvas>
    );
};

export default TrainGame;
