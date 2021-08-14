import React, {useState, useEffect} from 'react';
import Square from './Sqaure';

let pieceSelected = "none";
let selectedPieceLoc = "";

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

const selectPiece = ([piece, player, pieceLoc, currentSquareTypes, setSquareTypes]) => {
    if(piece == "") {
        pieceSelected = "none";
        selectedPieceLoc = "";
    }
    if(player == "white" && piece.charAt(0) == 'w'){
        pieceSelected = piece;
        selectedPieceLoc = pieceLoc;
    }
    else if (player == "black" && piece.charAt(0) == 'b'){
        pieceSelected = piece;
        selectedPieceLoc = pieceLoc;
    }

    let newSquareTypes = currentSquareTypes;
    newSquareTypes[pieceLoc] += "-highlighted";
    // console.log(newSquareTypes[pieceLoc]);
    setSquareTypes(newSquareTypes);

    // console.log("pieceSelected: " + piece);
}

const Board = (props) => {
    
    const board = [];
    let player = "white";
    
    let row, squareType, letter, pieceName, firstSquareLight = true;
    

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
    // setSquareTypes(newSquareTypes);
    let [currentSquareTypes, setSquareTypes] = useState(newSquareTypes);
    
    for(let i = 0; i < 8; i++){
        row = [];
        letter = "a";
        
        for(let j = 0; j < 8; j++){
            

            pieceName = props.data[letter+(8-i)];
            

            // console.log(letter+(8-i).toString() + " : " + pieceName + ", pieceSelected:" + pieceSelected);

            row.push(<Square squareTypes = {currentSquareTypes} squareLoc = {letter+(8-i)} backgroundImage = {pieceName} onClickFunction={selectPiece} onClickFunctionName="selectPiece" onClickParameters={[pieceName, player, letter+(8-i), currentSquareTypes, setSquareTypes]} key = {letter+(8-i)}/>);
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