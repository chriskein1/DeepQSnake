import './Snake.css';

function Square({ color, props }) {
    const squareStyle = {
        backgroundColor: color,
        width: 100,
        height: 100
    };

    return (
        < div style={squareStyle} />
    )
}

export default Square;