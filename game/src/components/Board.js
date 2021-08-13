import React from 'react';
import Square from './Sqaure';



function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

const Board = (props) => {
    const board = [];
    let row, squareType, letter, firstSquareLight = true;
    
    for(let i = 0; i < 8; i++){
        row = [];
        letter = "a";
        let lightSquare = firstSquareLight;
        for(let j = 0; j < 8; j++){
            if(lightSquare){
                squareType = "light-square";
            }
            else {
                squareType = "dark-square";
            }

            row.push(<Square squareType = {squareType} backgroundImage = {props.data[letter+(8-i).toString()]} key = {letter+(8-i)}/>);
            letter = nextChar(letter);
            lightSquare = !lightSquare;
        }
        firstSquareLight = !firstSquareLight;
        board.push(<div key={8-i} className="board-row">{row}</div>);
    }

    return (
        <div className = "board">
            {board}
        </div>
      );
};

export default Board;