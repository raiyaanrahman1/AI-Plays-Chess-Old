import React, {useState, useEffect} from 'react';
import Square from './Sqaure';

let pieceSelected = "";
let selectedPieceLoc = "";

let data = {
    a1: "wr", b1: "wn", c1: "wb", d1: "wq", e1: "wk", f1: "wb", g1: "wn", h1: "wr",
    a2: "wp", b2: "wp", c2: "wp", d2: "wp", e2: "wp", f2: "wp", g2: "wp", h2: "wp",
    a3: "", b3: "", c3: "", d3: "", e3: "", f3: "", g3: "", h3: "",
    a4: "", b4: "", c4: "", d4: "", e4: "", f4: "", g4: "", h4: "",
    a5: "", b5: "", c5: "", d5: "", e5: "", f5: "", g5: "", h5: "",
    a6: "", b6: "", c6: "", d6: "", e6: "", f6: "", g6: "", h6: "",
    a7: "bp", b7: "bp", c7: "bp", d7: "bp", e7: "bp", f7: "bp", g7: "bp", h7: "bp",
    a8: "br", b8: "bn", c8: "bb", d8: "bq", e8: "bk", f8: "bb", g8: "bn", h8: "br",
};

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function prevChar(c) {
    return String.fromCharCode(c.charCodeAt(0) - 1);
}

// structure of pieces objects
    // {piece: {"location": [legal moves], ...}}
let whitePieces = {
    pawns: {"a2":[], "b2":[], "c2":[], "d2":[], "e2":[], "f2":[], "g2":[], "h2":[]},
    knights: {"b1":[], "g1":[]},
    bishops: {"c1":[], "f1":[]},
    rooks: {"a1":[], "h1":[]},
    queens: {"d1":[]},
    king: {"e1":[]}
};

let blackPieces = {
    pawns: {"a7":[], "b7":[], "c7":[], "d7":[], "e7":[], "f7":[], "g7":[], "h7":[]},
    knights: {"b8":[], "g8":[]},
    bishops: {"c8":[], "f8":[]},
    rooks: {"a8":[], "h8":[]},
    queens: {"d8":[]},
    king: {"e8":[]}
};

const calculateLegalMoves = (myPieces, theirPieces, myColour, checkForCheck = true) => {
    
    let result = {...myPieces};

    let theirColour;

    if(myColour == "white"){
        theirColour = "black";
    }
    else{
        theirColour = "white";
    }

    const myKingInCheck = (pieceType, currLoc, proposedLoc, theirProposedPieces) => {
        if(!checkForCheck) return false;

        let myNewPieces = {...myPieces};
        let newLocs = {};
        for(let loc in myPieces[pieceType]){
            if(loc != currLoc){
                newLocs[loc] = myPieces[pieceType][loc]; 
            }
            else {
                newLocs[proposedLoc] = [];
            }
        }
        myNewPieces[pieceType] = newLocs;
        let theirNewPieces = calculateLegalMoves(theirProposedPieces, myNewPieces, theirColour, false);
        let myKingLoc = Object.keys(myNewPieces.king)[0];

        for(let pieceType in theirNewPieces){
            for(let piece in theirNewPieces[pieceType]){
                if(theirNewPieces[pieceType][piece].includes(myKingLoc)){
                    return true;
                }
            }
        }
        return false;

    }


    let legalMoves;

    /*#####################  PAWNS  #######################################*/ 


    for(let pawn in myPieces.pawns){
        legalMoves = [];
        if(myColour == "white"){

            if(pawn.charAt(1) == "2" && data[pawn.charAt(0) + "3" ] == "" && data[pawn.charAt(0) + "4" ] == "" && !myKingInCheck("pawns", pawn, pawn.charAt(0) + "4", theirPieces)){
                legalMoves.push(pawn.charAt(0)+ "4");
            }

            if(data[pawn.charAt(0) + (parseInt(pawn.charAt(1)) + 1) ] == "" && !myKingInCheck("pawns", pawn, pawn.charAt(0)+ (parseInt(pawn.charAt(1)) + 1), theirPieces)){
                legalMoves.push(pawn.charAt(0)+ (parseInt(pawn.charAt(1)) + 1));
            }
            
            
            let squareUpAndLeft = prevChar(pawn.charAt(0)) + (parseInt(pawn.charAt(1)) + 1);
            if(pawn.charAt(0) != "a" && Object.keys(theirPieces.pawns).includes(squareUpAndLeft)) {

                //remove their pawn before checking if in check
                let theirNewPawns = {};
                for(let theirPawn in theirPieces.pawns){
                    if(theirPawn != squareUpAndLeft){
                        theirNewPawns[theirPawn] = theirPieces.pawns.theirPawn;
                    }
                }
                let theirNewPieces = {... theirPieces};
                theirNewPieces.pawns = theirNewPawns;

                if(!myKingInCheck("pawns", pawn, squareUpAndLeft, theirNewPieces)){
                    legalMoves.push(squareUpAndLeft);
                }
            }

            let squareUpAndRight = nextChar(pawn.charAt(0)) + (parseInt(pawn.charAt(1)) + 1);
            if(pawn.charAt(0) != "h" && Object.keys(theirPieces.pawns).includes(squareUpAndRight)) {

                //remove their pawn before checking if in check
                let theirNewPawns = {};
                for(let theirPawn in theirPieces.pawns){
                    if(theirPawn != squareUpAndRight){
                        theirNewPawns[theirPawn] = theirPieces.pawns.theirPawn;
                    }
                }
                let theirNewPieces = {... theirPieces};
                theirNewPieces.pawns = theirNewPawns;

                if(!myKingInCheck("pawns", pawn, squareUpAndRight, theirNewPieces)){
                    legalMoves.push(squareUpAndRight);
                }
            }
        }
        else{
            if(pawn.charAt(1) == "7" && data[pawn.charAt(0) + "6" ] == "" && data[pawn.charAt(0) + "5" ] == "" && !myKingInCheck("pawns", pawn, pawn.charAt(0) + "5", theirPieces)){
                legalMoves.push(pawn.charAt(0) + "5");
            }

            if(data[pawn.charAt(0) + (parseInt(pawn.charAt(1)) - 1) ] == "" && !myKingInCheck("pawns", pawn, pawn.charAt(0)+ (parseInt(pawn.charAt(1)) - 1), theirPieces)){
                legalMoves.push(pawn.charAt(0)+ (parseInt(pawn.charAt(1)) - 1));
            }

            let squareDownAndLeft = prevChar(pawn.charAt(0)) + (parseInt(pawn.charAt(1)) - 1);
            if(pawn.charAt(0) != "a" && Object.keys(theirPieces.pawns).includes(squareDownAndLeft)) {

                //remove their pawn before checking if in check
                let theirNewPawns = {};
                for(let theirPawn in theirPieces.pawns){
                    if(theirPawn != squareDownAndLeft){
                        theirNewPawns[theirPawn] = theirPieces.pawns.theirPawn;
                    }
                }
                let theirNewPieces = {... theirPieces};
                theirNewPieces.pawns = theirNewPawns;

                if(!myKingInCheck("pawns", pawn, squareDownAndLeft, theirNewPieces)){
                    legalMoves.push(squareDownAndLeft);
                }
            }

            let squareDownAndRight = nextChar(pawn.charAt(0)) + (parseInt(pawn.charAt(1)) - 1);
            if(pawn.charAt(0) != "h" && Object.keys(theirPieces.pawns).includes(squareDownAndRight)) {

                //remove their pawn before checking if in check
                let theirNewPawns = {};
                for(let theirPawn in theirPieces.pawns){
                    if(theirPawn != squareDownAndRight){
                        theirNewPawns[theirPawn] = theirPieces.pawns.theirPawn;
                    }
                }
                let theirNewPieces = {... theirPieces};
                theirNewPieces.pawns = theirNewPawns;

                if(!myKingInCheck("pawns", pawn, squareDownAndRight, theirNewPieces)){
                    legalMoves.push(squareDownAndRight);
                }
            }
            
        }
        result.pawns[pawn] = [...legalMoves];
    }

    return result;

}

const onClick = ([piece, player, pieceLoc, currentSquareTypes, setSquareTypes]) => {

    whitePieces = calculateLegalMoves(whitePieces, blackPieces, "white");
    blackPieces = calculateLegalMoves(blackPieces, whitePieces, "black");
    console.log(whitePieces);
    console.log(blackPieces);

    let newSquareTypes = {...currentSquareTypes};

    const deselectSelectedPiece = () => {
        newSquareTypes[selectedPieceLoc] = newSquareTypes[selectedPieceLoc].substring(0, newSquareTypes[selectedPieceLoc].indexOf("-highlighted"));
        setSquareTypes(newSquareTypes);

        pieceSelected = "";
        selectedPieceLoc = "";
    }

    const selectNewPiece = () => {
        pieceSelected = piece;
        selectedPieceLoc = pieceLoc;

        
        newSquareTypes[pieceLoc] += "-highlighted";
        setSquareTypes(newSquareTypes);
    }

    

    // move a piece to empty square
    if(piece == "" && pieceSelected != "") {
        deselectSelectedPiece();

        // move piece if possible
    }

    // select a piece when no other is selected
    else if((player == "white" && piece.charAt(0) == 'w' || player == "black" && piece.charAt(0) == 'b') && pieceSelected == ""){
        selectNewPiece();
    }

    // deselect the selected piece by clicking on it
    else if((player == "white" && piece.charAt(0) == 'w' || player == "black" && piece.charAt(0) == 'b') && pieceSelected != "" && selectedPieceLoc == pieceLoc){
        deselectSelectedPiece();
    }

    // deselect the selected piece and select a different piece
    else if((player == "white" && piece.charAt(0) == 'w' || player == "black" && piece.charAt(0) == 'b') && pieceSelected != "" && piece != "" && selectedPieceLoc != pieceLoc){
        deselectSelectedPiece();
        selectNewPiece();
    }
    

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

    let [currentSquareTypes, setSquareTypes] = useState(newSquareTypes);
    
    for(let i = 0; i < 8; i++){
        row = [];
        letter = "a";
        
        for(let j = 0; j < 8; j++){
            

            pieceName = data[letter+(8-i)];

            row.push(<Square squareTypes = {currentSquareTypes} squareLoc = {letter+(8-i)} backgroundImage = {pieceName} onClickFunction={onClick} onClickParameters={[pieceName, player, letter+(8-i), currentSquareTypes, setSquareTypes]} key = {letter+(8-i)}/>);
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