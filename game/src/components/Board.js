import React, {useState} from 'react';
import Square from './Sqaure';

let pieceSelected = "none";

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

const selectPiece = ([piece, player]) => {
    if(piece == "") {
        pieceSelected = "none";
    }
    if(player == "white" && piece.charAt(0) == 'w'){
        pieceSelected = piece;
    }
    else if (player == "black" && piece.charAt(0) == 'b'){
        pieceSelected = piece;
    }

    console.log("pieceSelected: " + piece);
}

const Board = (props) => {
    const board = [];
    let player = "white";
    
    let row, squareType, letter, pieceName, firstSquareLight = true;
    let [currentSquareTypes, setSquareTypes] = useState({});

    let newSquareTypes = {};
    for(let i = 0; i < 8; i++){
        letter = "a";
        let lightSquare = firstSquareLight;
        for(let j = 0; j < 8; j++){
            if(lightSquare){
                squareType = "light-square";
            }
            else {
                squareType = "dark-square";
            }
            newSquareTypes[letter+(8-i)] = squareType;


            letter = nextChar(letter);
            lightSquare = !lightSquare;
        }
        firstSquareLight = !firstSquareLight;
    }

    console.log(newSquareTypes);
    setSquareTypes(newSquareTypes);
    
    for(let i = 0; i < 8; i++){
        row = [];
        letter = "a";
        
        for(let j = 0; j < 8; j++){
            

            pieceName = props.data[letter+(8-i)];
            // if(pieceSelected == pieceName) {
            //     squareType += "-highlighted";
            // }

            // console.log(letter+(8-i).toString() + " : " + pieceName + ", pieceSelected:" + pieceSelected);

            row.push(<Square squareType = {currentSquareTypes[letter+(8-i)]} backgroundImage = {pieceName} onClickFunction={selectPiece} onClickFunctionName="selectPiece" onClickParameters={[pieceName, player]} key = {letter+(8-i)}/>);
            letter = nextChar(letter);
        }
        
        board.push(<div key={8-i} className="board-row">{row}</div>);

        
    }

    return (
        <div className = "board">
            {board}
        </div>
      );
};

export default Board;