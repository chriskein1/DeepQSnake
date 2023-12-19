import React from 'react';
import './Snake.css';
import Square from './Square';

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.rows = 6;
        this.cols = 6;
        this.grid = this.initializeGrid();
    }

    initializeGrid() {
        const arr = [];
        for (let i = 0; i < this.rows; i++) {
            const row = [];
            for (let j = 0; j < this.cols; j++) {
                row.push((i + j) % 2 === 0 ? 1 : 0);
            }
            arr.push(row);
        }
        return arr;
    }



    render() {
        return (
            <div className="grid">
                {this.grid.map(row => {
                    return (
                        <div className="row">
                            {row.map(col => {
                                if (col % 2 === 1) {
                                    return <Square color="black" />
                                }
                                else {
                                    return <Square color="white" />
                                }
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Grid;