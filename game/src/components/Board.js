import React, {useState, useEffect} from 'react';
import Square from './Sqaure';

let pieceSelected = "";
let selectedPieceLoc = "";
let isCapture = false;
let targetLoc = "";
let targetPiece = "";
// short, long castling rights
let whiteCastlingRights = [true, true];
let blackCastlingRights = [true, true];

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

const getPieceTypeByLetter = (letter) => {
    let pieceType;
    switch(letter){
        case "p": 
            pieceType = "pawns";
            break;
        case "n":
            pieceType = "knights";
            break;
        case "b":
            pieceType = "bishops";
            break;
        case "r":
            pieceType = "rooks";
            break;
        case "q":
            pieceType = "queens";
            break;
        case "k":
            pieceType = "king";
            break;
        default:
            console.log("error: invalid letter");
            break;
    }
    return pieceType;
}

const getLetterByPieceType = (pieceType) => {
    let letter;
    switch(pieceType){
        case "pawns": 
        letter = "p";
            break;
        case "knights":
            letter = "n";
            break;
        case "bishops":
            letter = "b";
            break;
        case "rooks":
            letter = "r";
            break;
        case "queens":
            letter = "q";
            break;
        case "king":
            letter = "k";
            break;
        default:
            console.log("error: invalid piece type");
            break;
    }
    return letter;
}

const capturePiece = (theirPieces, pieceType, capturedPieceLoc) => {
    let theirNewPieceType = {};
    for(let piece in theirPieces[pieceType]){
        if(piece != capturedPieceLoc){
            theirNewPieceType[piece] = theirPieces[pieceType].piece;
        }
    }
    let theirNewPieces = {... theirPieces};
    theirNewPieces[pieceType] = theirNewPieceType;
    return theirNewPieces;
}

const myKingInCheck = (myPieces, theirPieces) => {
    let myKingLoc = Object.keys(myPieces.king)[0];

        for(let pieceType in theirPieces){
            for(let piece in theirPieces[pieceType]){
                if(theirPieces[pieceType][piece].includes(myKingLoc)){

                    return true;
                }
            }
        }
        return false;
}

const iAmCheckmated = (myPieces, theirPieces) => {
    if(myKingInCheck(myPieces, theirPieces)){
        for(let pieceType in myPieces){
            for(let piece in myPieces[pieceType]){
                if(myPieces[pieceType][piece].length > 0){
                    return false;
                }
            }
        }

        return true;
    }

    return false;
}

const calculateLegalMoves = (myPieces, theirPieces, myColour, data, moveHistory, checkForCheck = true) => {
    
    let result = JSON.parse(JSON.stringify(myPieces));

    let theirColour;

    if(myColour == "white"){
        theirColour = "black";
    }
    else{
        theirColour = "white";
    }

    /* the below function takes in a piece you want to move and it's proposed destination, and checks if the move results in the
       player's king being in check */

    const inCheckAfterMove = (pieceType, currLoc, proposedLoc, theirProposedPieces) => {
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
        let proposedData = {...data};
        proposedData[currLoc] = "";
        proposedData[proposedLoc] = myColour.charAt(0) + getLetterByPieceType(pieceType);
        let theirNewPieces = calculateLegalMoves(theirProposedPieces, myNewPieces, theirColour, proposedData, moveHistory, false);
        return myKingInCheck(myNewPieces, theirNewPieces);

    }    

    // clean result

    // for(let pawn in result.pawns){
    //     result.pawns[pawn] = [];
    // }

    // for(let knight in result.knights){
    //     result.knights[knight] = [];
    // }

    // for(let bishop in result.bishops){
    //     result.bishops[bishop] = [];
    // }

    // for(let rook in result.rooks){
    //     result.rooks[rook] = [];
    // }
    // for(let queen in result.queens){
    //     result.queens[queen] = [];
    // }
    // for(let myKing in result.king){
    //     result.king[myKing] = [];
    // }


    let legalMoves;

    /*############################################  PAWNS  ##########################################################*/ 


    for(let pawn in myPieces.pawns){
        legalMoves = [];
        if(myColour == "white"){

            // Pawn at starting position (can move 2 squares fwd)
            if(pawn.charAt(1) == "2" && data[pawn.charAt(0) + "3" ] == "" && data[pawn.charAt(0) + "4" ] == "" && !inCheckAfterMove("pawns", pawn, pawn.charAt(0) + "4", theirPieces)){
                legalMoves.push(pawn.charAt(0)+ "4");
            }

            // Fwd one move
            if(data[pawn.charAt(0) + (parseInt(pawn.charAt(1)) + 1) ] == "" && !inCheckAfterMove("pawns", pawn, pawn.charAt(0)+ (parseInt(pawn.charAt(1)) + 1), theirPieces)){
                legalMoves.push(pawn.charAt(0)+ (parseInt(pawn.charAt(1)) + 1));
            }
            
            // Capture to the left
            let squareUpAndLeft = prevChar(pawn.charAt(0)) + (parseInt(pawn.charAt(1)) + 1);
            if(pawn.charAt(0) != "a" && data[squareUpAndLeft].charAt(0) == "b") {

                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[squareUpAndLeft].charAt(1)), squareUpAndLeft);

                if(!inCheckAfterMove("pawns", pawn, squareUpAndLeft, theirNewPieces)){
                    legalMoves.push(squareUpAndLeft);
                }
            }

            // Capture to the right
            let squareUpAndRight = nextChar(pawn.charAt(0)) + (parseInt(pawn.charAt(1)) + 1);
            if(pawn.charAt(0) != "h" && data[squareUpAndRight].charAt(0) == "b") {

                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[squareUpAndRight].charAt(1)), squareUpAndRight);

                if(!inCheckAfterMove("pawns", pawn, squareUpAndRight, theirNewPieces)){
                    legalMoves.push(squareUpAndRight);
                }
            }

            // En Passant
            if(pawn.charAt(1) == "5" && moveHistory.length > 0){
                let lastMove = moveHistory[moveHistory.length-1];
                if(lastMove.piece == "bp" && lastMove.initialPos.charAt(1) == "7" && lastMove.destination.charAt(1) == "5"){
                        if(prevChar(pawn.charAt(0)) == lastMove.destination.charAt(0)){
                            legalMoves.push("<-x");
                        }
                        else if(nextChar(pawn.charAt(0)) == lastMove.destination.charAt(0)){
                            legalMoves.push("x->");
                        }
                    }  
            } 
        }
        else{
            // Pawn at starting position (can move 2 squares fwd)
            if(pawn.charAt(1) == "7" && data[pawn.charAt(0) + "6" ] == "" && data[pawn.charAt(0) + "5" ] == "" && !inCheckAfterMove("pawns", pawn, pawn.charAt(0) + "5", theirPieces)){
                legalMoves.push(pawn.charAt(0) + "5");
            }

            // Fwd one move
            if(data[pawn.charAt(0) + (parseInt(pawn.charAt(1)) - 1) ] == "" && !inCheckAfterMove("pawns", pawn, pawn.charAt(0)+ (parseInt(pawn.charAt(1)) - 1), theirPieces)){
                legalMoves.push(pawn.charAt(0)+ (parseInt(pawn.charAt(1)) - 1));
            }

            // Capture to the left
            let squareDownAndLeft = prevChar(pawn.charAt(0)) + (parseInt(pawn.charAt(1)) - 1);
            if(pawn.charAt(0) != "a" && data[squareDownAndLeft].charAt(0) == "w") {

                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[squareDownAndLeft].charAt(1)), squareDownAndLeft);

                if(!inCheckAfterMove("pawns", pawn, squareDownAndLeft, theirNewPieces)){
                    legalMoves.push(squareDownAndLeft);
                }
            }

            // Capture to the right
            let squareDownAndRight = nextChar(pawn.charAt(0)) + (parseInt(pawn.charAt(1)) - 1);
            if(pawn.charAt(0) != "h" && data[squareDownAndRight].charAt(0) == "w") {

                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[squareDownAndRight].charAt(1)), squareDownAndRight);

                if(!inCheckAfterMove("pawns", pawn, squareDownAndRight, theirNewPieces)){
                    legalMoves.push(squareDownAndRight);
                }
            }

            // En Passant
            if(pawn.charAt(1) == "4" && moveHistory.length > 0){
                let lastMove = moveHistory[moveHistory.length-1];
                if(lastMove.piece == "wp" && lastMove.initialPos.charAt(1) == "2" && lastMove.destination.charAt(1) == "4"){
                        if(prevChar(pawn.charAt(0)) == lastMove.destination.charAt(0)){
                            legalMoves.push("<-x");
                        }
                        else if(nextChar(pawn.charAt(0)) == lastMove.destination.charAt(0)){
                            legalMoves.push("x->");
                        }
                    }  
            } 
            
        }
        result.pawns[pawn] = [...legalMoves];
    }

    /* #############################################     ROOKS    ################################################################ */
    for(let rook in myPieces.rooks){
        legalMoves = [];

        // Moves up
        let obstructions = false;
        let x = 1;
        while(!obstructions && (parseInt(rook.charAt(1)) + x) <= 8){
            let squareUpXsteps = rook.charAt(0) + (parseInt(rook.charAt(1)) + x);
            

            if(data[squareUpXsteps] == "" && !inCheckAfterMove("rooks", rook, squareUpXsteps, theirPieces)){
                legalMoves.push(squareUpXsteps);
            }
            else if(data[squareUpXsteps].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else if(data[squareUpXsteps] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[squareUpXsteps].charAt(1)), squareUpXsteps);
                if(!inCheckAfterMove("rooks", rook, squareUpXsteps, theirNewPieces)){
                    legalMoves.push(squareUpXsteps);
                }
                obstructions = true;
            }
            x++;
        }

        // Moves down

        obstructions = false;
        x = -1;
        while(!obstructions && (parseInt(rook.charAt(1)) + x) >= 1){
            let squareDownXsteps = rook.charAt(0) + (parseInt(rook.charAt(1)) + x);

            if(data[squareDownXsteps] == "" && !inCheckAfterMove("rooks", rook, squareDownXsteps, theirPieces)){
                legalMoves.push(squareDownXsteps);
            }
            else if(data[squareDownXsteps].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else if(data[squareDownXsteps] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[squareDownXsteps].charAt(1)), squareDownXsteps);
                if(!inCheckAfterMove("rooks", rook, squareDownXsteps, theirNewPieces)){
                    legalMoves.push(squareDownXsteps);
                }
                obstructions = true;
            }

            x--;
        }

        // Moves Left
        obstructions = false;
        let leftChar = prevChar(rook.charAt(0));
        while(!obstructions && rook.charAt(0) != "a"){
            let square = leftChar + parseInt(rook.charAt(1));
            if(data[square] == "" && !inCheckAfterMove("rooks", rook, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else if(data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("rooks", rook, square, theirNewPieces)){
                    legalMoves.push(square);
                }
                obstructions = true;
            }

            if(leftChar == "a"){
                obstructions = true;
            }
            else{
                leftChar = prevChar(leftChar);
            }
        }

        // Moves Right
        obstructions = false;
        let rightChar = nextChar(rook.charAt(0));
        while(!obstructions && rook.charAt(0) != "h"){
            let square = rightChar + parseInt(rook.charAt(1));
            if(data[square] == "" && !inCheckAfterMove("rooks", rook, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else if(data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("rooks", rook, square, theirNewPieces)){
                    legalMoves.push(square);
                }
                obstructions = true;
            }

            if(rightChar == "h"){
                obstructions = true;
            }
            else{
                rightChar = nextChar(rightChar);
            }
        }

        result.rooks[rook] = [...legalMoves];
    }

    /* #############################################     BISHOPS    ################################################################ */

    for(let bishop in myPieces.bishops){
        legalMoves = [];

        // Moves up and right
        let obstructions = false;
        let x = 1;
        let rightChar = nextChar(bishop.charAt(0));

        while(!obstructions && (parseInt(bishop.charAt(1)) + x) <= 8 && bishop.charAt(0) != "h"){
            let square = rightChar + (parseInt(bishop.charAt(1)) + x);

            if(data[square] == "" && !inCheckAfterMove("bishops", bishop, square, theirPieces)){
                legalMoves.push(square);
            }
            else if (data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else if(data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("bishops", bishop, square, theirNewPieces)){
                    legalMoves.push(square);
                }
                obstructions = true;
            }

            if(rightChar == "h"){
                obstructions = true;
            }
            else{
                x++;
                rightChar = nextChar(rightChar);
            }
        }

        // Moves up and left

        obstructions = false;
        x = 1;
        let leftChar = prevChar(bishop.charAt(0));

        while(!obstructions && (parseInt(bishop.charAt(1)) + x) <= 8 && bishop.charAt(0) != "a"){
            let square = leftChar + (parseInt(bishop.charAt(1)) + x);

            if(data[square] == "" && !inCheckAfterMove("bishops", bishop, square, theirPieces)){
                legalMoves.push(square);
            }
            else if (data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else if(data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("bishops", bishop, square, theirNewPieces)){
                    legalMoves.push(square);
                }
                obstructions = true;
            }

            if(leftChar == "a"){
                obstructions = true;
            }
            else{
                x++;
                leftChar = prevChar(leftChar);
            }
        }

        // Moves down and right
        obstructions = false;
        x = -1;
        rightChar = nextChar(bishop.charAt(0));

        while(!obstructions && (parseInt(bishop.charAt(1)) + x) >= 1 && bishop.charAt(0) != "h"){
            let square = rightChar + (parseInt(bishop.charAt(1)) + x);

            if(data[square] == "" && !inCheckAfterMove("bishops", bishop, square, theirPieces)){
                legalMoves.push(square);
            }
            else if (data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else if(data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("bishops", bishop, square, theirNewPieces)){
                    legalMoves.push(square);
                }
                obstructions = true;
            }

            if(rightChar == "h"){
                obstructions = true;
            }
            else{
                x--;
                rightChar = nextChar(rightChar);
            }
        }

        // Moves down and left

        obstructions = false;
        x = -1;
        leftChar = prevChar(bishop.charAt(0));

        while(!obstructions && (parseInt(bishop.charAt(1)) + x) >= 1 && bishop.charAt(0) != "a"){
            let square = leftChar + (parseInt(bishop.charAt(1)) + x);

            if(data[square] == "" && !inCheckAfterMove("bishops", bishop, square, theirPieces)){
                legalMoves.push(square);
            }
            else if (data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else if(data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("bishops", bishop, square, theirNewPieces)){
                    legalMoves.push(square);
                }
                obstructions = true;
            }

            if(leftChar == "a"){
                obstructions = true;
            }
            else{
                x--;
                leftChar = prevChar(leftChar);
            }
        }
        result.bishops[bishop] = [...legalMoves];
    }

    /* #############################################     KNIGHTS    ################################################################ */
    for(let knight in myPieces.knights){
        legalMoves = [];
        let square;

        /* 
            x x
            x
            N
        */

        if(parseInt(knight.charAt(1)) < 7 && knight.charAt(0) != "h"){
            square = nextChar(knight.charAt(0)) + (parseInt(knight.charAt(1)) + 2);

            if(data[square] == "" && !inCheckAfterMove("knights", knight, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) != myColour.charAt(0) && data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("knights", knight, square, theirNewPieces)){
                    legalMoves.push(square);
                }
            }
        }

        /* 
            x x
              x
              N
        */

        if(parseInt(knight.charAt(1)) < 7 && knight.charAt(0) != "a"){
            square = prevChar(knight.charAt(0)) + (parseInt(knight.charAt(1)) + 2);

            if(data[square] == "" && !inCheckAfterMove("knights", knight, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) != myColour.charAt(0) && data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("knights", knight, square, theirNewPieces)){
                    legalMoves.push(square);
                }
            }
        }

        /* 
            N
            x
            x x
        */

        if(parseInt(knight.charAt(1)) > 2 && knight.charAt(0) != "h"){
            square = nextChar(knight.charAt(0)) + (parseInt(knight.charAt(1)) - 2);

            if(data[square] == "" && !inCheckAfterMove("knights", knight, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) != myColour.charAt(0) && data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("knights", knight, square, theirNewPieces)){
                    legalMoves.push(square);
                }
            }
        }

        /* 
              N
              x
            x x
        */

        if(parseInt(knight.charAt(1)) > 2 && knight.charAt(0) != "a"){
            square = prevChar(knight.charAt(0)) + (parseInt(knight.charAt(1)) - 2);

            if(data[square] == "" && !inCheckAfterMove("knights", knight, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) != myColour.charAt(0) && data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("knights", knight, square, theirNewPieces)){
                    legalMoves.push(square);
                }
            }
        }

        /* 
            x x x
            N
        */

        if(knight.charAt(1) != "8" && knight.charAt(0) != "h" && knight.charAt(0) != "g"){
            square = nextChar(nextChar(knight.charAt(0))) + (parseInt(knight.charAt(1)) + 1);

            if(data[square] == "" && !inCheckAfterMove("knights", knight, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) != myColour.charAt(0) && data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("knights", knight, square, theirNewPieces)){
                    legalMoves.push(square);
                }
            }
        }

        /* 
            x x x
                N
        */

        if(knight.charAt(1) != "8" && knight.charAt(0) != "a" && knight.charAt(0) != "b"){
            square = prevChar(prevChar(knight.charAt(0))) + (parseInt(knight.charAt(1)) + 1);

            if(data[square] == "" && !inCheckAfterMove("knights", knight, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) != myColour.charAt(0) && data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("knights", knight, square, theirNewPieces)){
                    legalMoves.push(square);
                }
            }
        }

        /* 
            N
            x x x
        */

        if(knight.charAt(1) != "1" && knight.charAt(0) != "h" && knight.charAt(0) != "g"){
            square = nextChar(nextChar(knight.charAt(0))) + (parseInt(knight.charAt(1)) - 1);

            if(data[square] == "" && !inCheckAfterMove("knights", knight, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) != myColour.charAt(0) && data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("knights", knight, square, theirNewPieces)){
                    legalMoves.push(square);
                }
            }
        }

        /* 
                N
            x x x
        */

        if(knight.charAt(1) != "1" && knight.charAt(0) != "a" && knight.charAt(0) != "b"){
            square = prevChar(prevChar(knight.charAt(0))) + (parseInt(knight.charAt(1)) - 1);

            if(data[square] == "" && !inCheckAfterMove("knights", knight, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) != myColour.charAt(0) && data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("knights", knight, square, theirNewPieces)){
                    legalMoves.push(square);
                }
            }
        }

        result.knights[knight] = [...legalMoves];

    }

    /* #############################################     QUEENS    ################################################################ */
    for(let queen in myPieces.queens){
        legalMoves = [];

        // Moves up
        let obstructions = false;
        let x = 1;
        while(!obstructions && (parseInt(queen.charAt(1)) + x) <= 8){
            let squareUpXsteps = queen.charAt(0) + (parseInt(queen.charAt(1)) + x);
            

            if(data[squareUpXsteps] == "" && !inCheckAfterMove("queens", queen, squareUpXsteps, theirPieces)){
                legalMoves.push(squareUpXsteps);
            }
            else if(data[squareUpXsteps].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else if(data[squareUpXsteps] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[squareUpXsteps].charAt(1)), squareUpXsteps);
                if(!inCheckAfterMove("queens", queen, squareUpXsteps, theirNewPieces)){
                    legalMoves.push(squareUpXsteps);
                }
                obstructions = true;
            }
            x++;
        }

        // Moves down

        obstructions = false;
        x = -1;
        while(!obstructions && (parseInt(queen.charAt(1)) + x) >= 1){
            let squareDownXsteps = queen.charAt(0) + (parseInt(queen.charAt(1)) + x);

            if(data[squareDownXsteps] == "" && !inCheckAfterMove("queens", queen, squareDownXsteps, theirPieces)){
                legalMoves.push(squareDownXsteps);
            }
            else if(data[squareDownXsteps].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else if(data[squareDownXsteps] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[squareDownXsteps].charAt(1)), squareDownXsteps);
                if(!inCheckAfterMove("queens", queen, squareDownXsteps, theirNewPieces)){
                    legalMoves.push(squareDownXsteps);
                }
                obstructions = true;
            }

            x--;
        }

        // Moves Left
        obstructions = false;
        let leftChar = prevChar(queen.charAt(0));
        while(!obstructions && queen.charAt(0) != "a"){
            let square = leftChar + parseInt(queen.charAt(1));
            if(data[square] == "" && !inCheckAfterMove("queens", queen, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else if(data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("queens", queen, square, theirNewPieces)){
                    legalMoves.push(square);
                }
                obstructions = true;
            }

            if(leftChar == "a"){
                obstructions = true;
            }
            else{
                leftChar = prevChar(leftChar);
            }
        }

        // Moves Right
        obstructions = false;
        let rightChar = nextChar(queen.charAt(0));
        while(!obstructions && queen.charAt(0) != "h"){
            let square = rightChar + parseInt(queen.charAt(1));
            if(data[square] == "" && !inCheckAfterMove("queens", queen, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else if(data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("queens", queen, square, theirNewPieces)){
                    legalMoves.push(square);
                }
                obstructions = true;
            }

            if(rightChar == "h"){
                obstructions = true;
            }
            else{
                rightChar = nextChar(rightChar);
            }
        }

        // Moves up and right
        obstructions = false;
        x = 1;
        rightChar = nextChar(queen.charAt(0));

        while(!obstructions && (parseInt(queen.charAt(1)) + x) <= 8 && queen.charAt(0) != "h"){
            let square = rightChar + (parseInt(queen.charAt(1)) + x);

            if(data[square] == "" && !inCheckAfterMove("queens", queen, square, theirPieces)){
                legalMoves.push(square);
            }
            else if (data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else if(data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("queens", queen, square, theirNewPieces)){
                    legalMoves.push(square);
                }
                obstructions = true;
            }

            if(rightChar == "h"){
                obstructions = true;
            }
            else{
                x++;
                rightChar = nextChar(rightChar);
            }
        }

        // Moves up and left

        obstructions = false;
        x = 1;
        leftChar = prevChar(queen.charAt(0));

        while(!obstructions && (parseInt(queen.charAt(1)) + x) <= 8 && queen.charAt(0) != "a"){
            let square = leftChar + (parseInt(queen.charAt(1)) + x);

            if(data[square] == "" && !inCheckAfterMove("queens", queen, square, theirPieces)){
                legalMoves.push(square);
            }
            else if (data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else if(data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("queens", queen, square, theirNewPieces)){
                    legalMoves.push(square);
                }
                obstructions = true;
            }

            if(leftChar == "a"){
                obstructions = true;
            }
            else{
                x++;
                leftChar = prevChar(leftChar);
            }
        }

        // Moves down and right
        obstructions = false;
        x = -1;
        rightChar = nextChar(queen.charAt(0));

        while(!obstructions && (parseInt(queen.charAt(1)) + x) >= 1 && queen.charAt(0) != "h"){
            let square = rightChar + (parseInt(queen.charAt(1)) + x);

            if(data[square] == "" && !inCheckAfterMove("queens", queen, square, theirPieces)){
                legalMoves.push(square);
            }
            else if (data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else if(data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("queens", queen, square, theirNewPieces)){
                    legalMoves.push(square);
                }
                obstructions = true;
            }

            if(rightChar == "h"){
                obstructions = true;
            }
            else{
                x--;
                rightChar = nextChar(rightChar);
            }
        }

        // Moves down and left

        obstructions = false;
        x = -1;
        leftChar = prevChar(queen.charAt(0));

        while(!obstructions && (parseInt(queen.charAt(1)) + x) >= 1 && queen.charAt(0) != "a"){
            let square = leftChar + (parseInt(queen.charAt(1)) + x);

            if(data[square] == "" && !inCheckAfterMove("queens", queen, square, theirPieces)){
                legalMoves.push(square);
            }
            else if (data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else if(data[square] != ""){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!inCheckAfterMove("queens", queen, square, theirNewPieces)){
                    legalMoves.push(square);
                }
                obstructions = true;
            }

            if(leftChar == "a"){
                obstructions = true;
            }
            else{
                x--;
                leftChar = prevChar(leftChar);
            }
        }

        result.queens[queen] = [...legalMoves];
    }

    /* #############################################     KING    ################################################################ */
    if(Object.keys(myPieces.king).length == 0) return result;

    let king = Object.keys(myPieces.king)[0];

    legalMoves = [];

    // Up
    let square = king.charAt(0) + (parseInt(king.charAt(1)) + 1);

    if(parseInt(king.charAt(1)) < 8 && data[square] == "" && !inCheckAfterMove("king", king, square, theirPieces)) {
        legalMoves.push(square)
    }
    else if(parseInt(king.charAt(1)) < 8 && data[square].charAt(0) != myColour.charAt(0) && data[square] != ""){
        let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
        if(!inCheckAfterMove("king", king, square, theirNewPieces)){
            legalMoves.push(square);
        }
    }

    // Down

    square = king.charAt(0) + (parseInt(king.charAt(1)) - 1);

    if(parseInt(king.charAt(1)) > 1 && data[square] == "" && !inCheckAfterMove("king", king, square, theirPieces)) {
        legalMoves.push(square)
    }
    else if(parseInt(king.charAt(1)) > 1 && data[square].charAt(0) != myColour.charAt(0) && data[square] != ""){
        let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
        if(!inCheckAfterMove("king", king, square, theirNewPieces)){
            legalMoves.push(square);
        }
    }

    // Left

    square = prevChar(king.charAt(0)) + king.charAt(1);

    if(king.charAt(0) != "a" && data[square] == "" && !inCheckAfterMove("king", king, square, theirPieces)) {
        legalMoves.push(square)
    }
    else if(king.charAt(0) != "a" && data[square].charAt(0) != myColour.charAt(0) && data[square] != ""){
        let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
        if(!inCheckAfterMove("king", king, square, theirNewPieces)){
            legalMoves.push(square);
        }
    }

    // Right

    square = nextChar(king.charAt(0)) + king.charAt(1);

    if(king.charAt(0) != "h" && data[square] == "" && !inCheckAfterMove("king", king, square, theirPieces)) {
        legalMoves.push(square)
    }
    else if(king.charAt(0) != "h" && data[square].charAt(0) != myColour.charAt(0) && data[square] != ""){
        let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
        if(!inCheckAfterMove("king", king, square, theirNewPieces)){
            legalMoves.push(square);
        }
    }

    // Up and Right

    square = nextChar(king.charAt(0)) + (parseInt(king.charAt(1)) + 1);

    if(parseInt(king.charAt(1)) < 8 && king.charAt(0) != "h" && data[square] == "" && !inCheckAfterMove("king", king, square, theirPieces)) {
        legalMoves.push(square)
    }
    else if(parseInt(king.charAt(1)) < 8 && king.charAt(0) != "h" && data[square].charAt(0) != myColour.charAt(0) && data[square] != ""){
        let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
        if(!inCheckAfterMove("king", king, square, theirNewPieces)){
            legalMoves.push(square);
        }
    }

    // Up and Left

    square = prevChar(king.charAt(0)) + (parseInt(king.charAt(1)) + 1);

    if(parseInt(king.charAt(1)) < 8 && king.charAt(0) != "a" && data[square] == "" && !inCheckAfterMove("king", king, square, theirPieces)) {
        legalMoves.push(square)
    }
    else if(parseInt(king.charAt(1)) < 8 && king.charAt(0) != "a" && data[square].charAt(0) != myColour.charAt(0) && data[square] != ""){
        let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
        if(!inCheckAfterMove("king", king, square, theirNewPieces)){
            legalMoves.push(square);
        }
    }

    // Down and Right

    square = nextChar(king.charAt(0)) + (parseInt(king.charAt(1)) - 1);

    if(parseInt(king.charAt(1)) > 1 && king.charAt(0) != "h" && data[square] == "" && !inCheckAfterMove("king", king, square, theirPieces)) {
        legalMoves.push(square)
    }
    else if(parseInt(king.charAt(1)) > 1 && king.charAt(0) != "h" && data[square].charAt(0) != myColour.charAt(0) && data[square] != ""){
        let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
        if(!inCheckAfterMove("king", king, square, theirNewPieces)){
            legalMoves.push(square);
        }
    }

    // Down and Left

    square = prevChar(king.charAt(0)) + (parseInt(king.charAt(1)) - 1);

    if(parseInt(king.charAt(1)) > 1 && king.charAt(0) != "a" && data[square] == "" && !inCheckAfterMove("king", king, square, theirPieces)) {
        legalMoves.push(square)
    }
    else if(parseInt(king.charAt(1)) > 1 && king.charAt(0) != "a" && data[square].charAt(0) != myColour.charAt(0) && data[square] != ""){
        let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
        if(!inCheckAfterMove("king", king, square, theirNewPieces)){
            legalMoves.push(square);
        }
    }

    if(!inCheckAfterMove("king", king, king, theirPieces)){
        // White Castle short
        if(myColour == "white" && whiteCastlingRights[0]){
            if(data["f1"] == "" && data["g1"] == "" && !inCheckAfterMove("king", king, "f1", theirPieces) && !inCheckAfterMove("king", king, "g1", theirPieces)){
                legalMoves.push("O-O");
            }
        }

        // White Castle long
        if(myColour == "white" && whiteCastlingRights[1]){
            if(data["d1"] == "" && data["c1"] == "" && data["b1"] == "" && !inCheckAfterMove("king", king, "d1", theirPieces) && !inCheckAfterMove("king", king, "c1", theirPieces)){
                legalMoves.push("O-O-O");
            }
        }

        // Black Castle short
        if(myColour == "black" && blackCastlingRights[0]){
            if(data["f8"] == "" && data["g8"] == "" && !inCheckAfterMove("king", king, "f8", theirPieces) && !inCheckAfterMove("king", king, "g8", theirPieces)){
                legalMoves.push("O-O");
            }
        }

        // Black Castle long
        if(myColour == "black" && blackCastlingRights[1]){
            if(data["d8"] == "" && data["c8"] == "" && data["b8"] == "" && !inCheckAfterMove("king", king, "d8", theirPieces) && !inCheckAfterMove("king", king, "c8", theirPieces)){
                legalMoves.push("O-O-O");
            }
        }
    }

    result.king[king] = [...legalMoves];

    return result;

}

// change so that not calculating moves on each mouse click - must always update both at same time bc of castling and giving check at the same time
const updateLegalMoves = (data, moveHistory) => {
    whitePieces = calculateLegalMoves(whitePieces, blackPieces, "white", data, moveHistory);
    blackPieces = calculateLegalMoves(blackPieces, whitePieces, "black", data, moveHistory);
}

const getNewMoveHistory = (data, destination, myPieces, player, moveHistory) => {
    let newMoveHistory = [...moveHistory];
    let moveName = generateMoveName(data, destination, myPieces, player);
    let move;
    if(moveName != "O-O" && moveName != "O-O-O"){
        move = {initialPos: selectedPieceLoc, destination: destination, piece: pieceSelected, name: moveName};
    }
    else{
        move = {initialPos: selectedPieceLoc, destination: moveName, name: moveName};
    }
    newMoveHistory.push(move);
    return newMoveHistory;
}

const getMoveSuffix = (myPieces, theirPieces, promotionPiece = "") => {
    let suffix = "";

    if(promotionPiece != ""){
        suffix += "=" + promotionPiece.toUpperCase();
    }

    if(iAmCheckmated(theirPieces, myPieces)){
        suffix += "#";
    }
    else if(myKingInCheck(theirPieces, myPieces)){
        suffix += "+";
    }

    return suffix;
}

const updateMoveHistory = (moveHistory, setMoveHistory, suffix) => {
    let newMoveHistory = [...moveHistory];
    if(newMoveHistory.length > 0){
        newMoveHistory[newMoveHistory.length-1].name += suffix;
        setMoveHistory(newMoveHistory);
    }
    
}

const generateMoveName = (data, destination, myPieces, player) => {
    let theirColour;
    let suffix = "";
    
    if(player == "white"){
        theirColour = "black";
    } 
    else theirColour = "white";

    switch(pieceSelected.charAt(1)){
        case "p":

            if(selectedPieceLoc.charAt(0) != destination.charAt(0)){
                return `${selectedPieceLoc.charAt(0)}x${destination}`;
            }
            
            return destination;
            
        case "n":
            for(let knight in myPieces.knights){
                if(knight != selectedPieceLoc && myPieces.knights[knight].includes(destination)){
                    if(knight.charAt(0) == selectedPieceLoc.charAt(0)){
                        if(data[destination].charAt(0) == theirColour.charAt(0)){
                            return `N${selectedPieceLoc.charAt(1)}x${destination}`;
                        }
                        return `N${selectedPieceLoc.charAt(1)}${destination}`;
                    }
                    if(data[destination].charAt(0) == theirColour.charAt(0)){
                        return `N${selectedPieceLoc.charAt(0)}x${destination}`;
                    }
                    return `N${selectedPieceLoc.charAt(0)}${destination}`;
                }
            }

            if(data[destination].charAt(0) == theirColour.charAt(0)){
                return `Nx${destination}`;
            }
            
            return `N${destination}`;
            
        case "b":
            for(let bishop in myPieces.bishops){
                if(bishop != selectedPieceLoc && myPieces.bishops[bishop].includes(destination)){
                    if(bishop.charAt(0) == selectedPieceLoc.charAt(0)){
                        if(data[destination].charAt(0) == theirColour.charAt(0)){
                            return `B${selectedPieceLoc.charAt(1)}x${destination}`;
                        }
                        return `B${selectedPieceLoc.charAt(1)}${destination}`;
                    }
                    if(data[destination].charAt(0) == theirColour.charAt(0)){
                        return `B${selectedPieceLoc.charAt(0)}x${destination}`;
                    }
                    return `B${selectedPieceLoc.charAt(0)}${destination}`;
                }
            }

            if(data[destination].charAt(0) == theirColour.charAt(0)){
                return `Bx${destination}`;
            }
            
            return `B${destination}`;
            
        case "r":
            if(player == "white" && whiteCastlingRights[0] && selectedPieceLoc == "h1"){
                whiteCastlingRights[0] = false;
            }
            else if(player == "white" && whiteCastlingRights[1] && selectedPieceLoc == "a1"){
                whiteCastlingRights[1] = false;
            }
            else if(player == "black" && blackCastlingRights[0] && selectedPieceLoc == "h8"){
                blackCastlingRights[0] = false;
            }
            else if(player == "black" && blackCastlingRights[1] && selectedPieceLoc == "a8"){
                blackCastlingRights[1] = false;
            }

            for(let rook in myPieces.rooks){
                if(rook != selectedPieceLoc && myPieces.rooks[rook].includes(destination)){
                    if(rook.charAt(0) == selectedPieceLoc.charAt(0)){
                        if(data[destination].charAt(0) == theirColour.charAt(0)){
                            return `R${selectedPieceLoc.charAt(1)}x${destination}`;
                        }
                        return `R${selectedPieceLoc.charAt(1)}${destination}`;
                    }
                    if(data[destination].charAt(0) == theirColour.charAt(0)){
                        return `R${selectedPieceLoc.charAt(0)}x${destination}`;
                    }
                    return `R${selectedPieceLoc.charAt(0)}${destination}`;
                }
            }

            if(data[destination].charAt(0) == theirColour.charAt(0)){
                return `Rx${destination}`;
            }
            
            return `R${destination}`;
            
        case "q":
            for(let queen in myPieces.queens){
                if(queen != selectedPieceLoc && myPieces.queens[queen].includes(destination)){
                    if(queen.charAt(0) == selectedPieceLoc.charAt(0)){
                        if(data[destination].charAt(0) == theirColour.charAt(0)){
                            return `Q${selectedPieceLoc.charAt(1)}x${destination}`;
                        }
                        return `Q${selectedPieceLoc.charAt(1)}${destination}`;
                    }
                    if(data[destination].charAt(0) == theirColour.charAt(0)){
                        return `Q${selectedPieceLoc.charAt(0)}x${destination}`;
                    }
                    return `Q${selectedPieceLoc.charAt(0)}${destination}`;
                }
            }

            if(data[destination].charAt(0) == theirColour.charAt(0)){
                return `Qx${destination}`;
            }
            
            return `Q${destination}`;
            
        case "k":
            // turn off castling rights

            if(player == "white" && (whiteCastlingRights[0] || whiteCastlingRights[1])){
                whiteCastlingRights = [false, false];
            }
            else if(player == "black" && (blackCastlingRights[0] || blackCastlingRights[1])){
                blackCastlingRights = [false, false];
            }

            // if castles
            if(selectedPieceLoc.charAt(0) == "e" && destination.charAt(0) == "g"){
                return "O-O";
            }
            else if(selectedPieceLoc.charAt(0) == "e" && destination.charAt(0) == "c"){
                return "O-O-O";
            }

            // capture

            if(data[destination].charAt(0) == theirColour.charAt(0)){
                return `Kx${destination}`;
            }

            // move to empty square
            
            return `K${destination}`;

            
    }
}

const onClick = ([piece, player, setPlayer, pieceLoc, currentSquareTypes, setSquareTypes, data, setData, promotion, setPromotion, setPromotionColour, moveHistory, setMoveHistory]) => {

    if(promotion == "enabled") return;

    let myPieces, theirPieces;
    let nextPlayer;

    const updatePieces = () => {
        if(player == "white"){
            myPieces = whitePieces;
            theirPieces = blackPieces;
            nextPlayer = "black";
        }
        else {
            myPieces = blackPieces;
            theirPieces = whitePieces;
            nextPlayer = "white";
        }
    }

    updatePieces();

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

    const checkForPromotion = () => {
        
        if(pieceSelected.charAt(1) == "p"){
            if(player == "white" && pieceLoc.charAt(1) == "8"){
                return true;
            }
            else if(player == "black" && pieceLoc.charAt(1) == "1"){
                return true;
            }
        }
        return false;
    }

    // castle
    if(pieceSelected.charAt(1) == "k"){
        let kingLoc = Object.keys(myPieces.king)[0];
        if(player == "white"){
            if(myPieces.king[kingLoc].includes("O-O") && (pieceLoc == "g1" || pieceLoc == "h1")){
            
                //move piece
                let newData = {...data};
                newData[selectedPieceLoc] = "";
                newData["h1"] = "";
                newData["g1"] = pieceSelected;
                newData["f1"] = "wr";

                delete myPieces.king[selectedPieceLoc];
                myPieces.king["g1"] = [];

                delete myPieces.rooks["h1"];
                myPieces.rooks["f1"] = [];

                setData(newData);
                let newMoveHistory = getNewMoveHistory(data, pieceLoc, myPieces, player, moveHistory);
                updateLegalMoves(newData, newMoveHistory);
                updatePieces();
                updateMoveHistory(newMoveHistory, setMoveHistory, getMoveSuffix(myPieces, theirPieces));
                setPlayer(nextPlayer);
                deselectSelectedPiece();

                whiteCastlingRights = [false, false];
                return;
            }
            else if(myPieces.king[kingLoc].includes("O-O-O") && (pieceLoc == "c1" || pieceLoc == "a1")){
                //move piece
                let newData = {...data};
                newData[selectedPieceLoc] = "";
                newData["a1"] = "";
                newData["c1"] = pieceSelected;
                newData["d1"] = "wr";

                delete myPieces.king[selectedPieceLoc];
                myPieces.king["c1"] = [];

                delete myPieces.rooks["a1"];
                myPieces.rooks["d1"] = [];

                setData(newData);
                let newMoveHistory = getNewMoveHistory(data, pieceLoc, myPieces, player, moveHistory);
                updateLegalMoves(newData, newMoveHistory);
                updatePieces();
                updateMoveHistory(newMoveHistory, setMoveHistory, getMoveSuffix(myPieces, theirPieces));
                setPlayer(nextPlayer);
                deselectSelectedPiece();

                whiteCastlingRights = [false, false];
                return;
            }
        }
        else{
            if(myPieces.king[kingLoc].includes("O-O") && (pieceLoc == "g8" || pieceLoc == "h8")){
            
                //move piece
                let newData = {...data};
                newData[selectedPieceLoc] = "";
                newData["h8"] = "";
                newData["g8"] = pieceSelected;
                newData["f8"] = "br";

                delete myPieces.king[selectedPieceLoc];
                myPieces.king["g8"] = [];

                delete myPieces.rooks["h8"];
                myPieces.rooks["f8"] = [];

                setData(newData);
                let newMoveHistory = getNewMoveHistory(data, pieceLoc, myPieces, player, moveHistory);
                updateLegalMoves(newData, newMoveHistory);
                updatePieces();
                updateMoveHistory(newMoveHistory, setMoveHistory, getMoveSuffix(myPieces, theirPieces));
                setPlayer(nextPlayer);
                deselectSelectedPiece();

                blackCastlingRights = [false, false];
                return;
            }
            else if(myPieces.king[kingLoc].includes("O-O-O") && (pieceLoc == "c8" || pieceLoc == "a8")){
                //move piece
                let newData = {...data};
                newData[selectedPieceLoc] = "";
                newData["a8"] = "";
                newData["c8"] = pieceSelected;
                newData["d8"] = "br";

                delete myPieces.king[selectedPieceLoc];
                myPieces.king["c8"] = [];

                delete myPieces.rooks["a8"];
                myPieces.rooks["d8"] = [];

                setData(newData);
                let newMoveHistory = getNewMoveHistory(data, pieceLoc, myPieces, player, moveHistory);
                updateLegalMoves(newData, newMoveHistory);
                updatePieces();
                updateMoveHistory(newMoveHistory, setMoveHistory, getMoveSuffix(myPieces, theirPieces));
                setPlayer(nextPlayer);
                deselectSelectedPiece();

                blackCastlingRights = [false, false];
                return;
            }
        }
        
    }

    // En Passant
    if(pieceSelected.charAt(1) == "p"){
        if(myPieces.pawns[selectedPieceLoc].includes("x->")){
            let squaresUp = 1;
            if(pieceSelected.charAt(0) == "b"){
                squaresUp = -1;
            }

            if(pieceLoc == (nextChar(selectedPieceLoc.charAt(0)) + (parseInt(selectedPieceLoc.charAt(1)) + squaresUp))){
                //move piece
                let newData = {...data};
                newData[selectedPieceLoc] = "";
                newData[pieceLoc] = pieceSelected;
                let theirPawnLoc = pieceLoc.charAt(0) + (parseInt(pieceLoc.charAt(1))-squaresUp);
                newData[theirPawnLoc] = "";
                

                delete myPieces[getPieceTypeByLetter(pieceSelected.charAt(1))][selectedPieceLoc];
                myPieces[getPieceTypeByLetter(pieceSelected.charAt(1))][pieceLoc] = [];

                
                delete theirPieces[getPieceTypeByLetter(data[theirPawnLoc].charAt(1))][theirPawnLoc];


                setData(newData);
                let newMoveHistory = getNewMoveHistory(data, pieceLoc, myPieces, player, moveHistory);
                updateLegalMoves(newData, newMoveHistory);
                updatePieces();
                updateMoveHistory(newMoveHistory, setMoveHistory, getMoveSuffix(myPieces, theirPieces));
                setPlayer(nextPlayer);
                deselectSelectedPiece();

                return;
            }
            
        }
        else if(myPieces.pawns[selectedPieceLoc].includes("<-x")){
            let squaresUp = 1;
            if(pieceSelected.charAt(0) == "b"){
                squaresUp = -1;
            }

            if(pieceLoc == (prevChar(selectedPieceLoc.charAt(0)) + (parseInt(selectedPieceLoc.charAt(1)) + squaresUp))){
                //move piece
                let newData = {...data};
                newData[selectedPieceLoc] = "";
                newData[pieceLoc] = pieceSelected;
                let theirPawnLoc = pieceLoc.charAt(0) + (parseInt(pieceLoc.charAt(1))-squaresUp);
                newData[theirPawnLoc] = "";
                

                delete myPieces[getPieceTypeByLetter(pieceSelected.charAt(1))][selectedPieceLoc];
                myPieces[getPieceTypeByLetter(pieceSelected.charAt(1))][pieceLoc] = [];


                
                delete theirPieces[getPieceTypeByLetter(data[theirPawnLoc].charAt(1))][theirPawnLoc];


                setData(newData);
                let newMoveHistory = getNewMoveHistory(data, pieceLoc, myPieces, player, moveHistory);
                updateLegalMoves(newData, newMoveHistory);
                updatePieces();
                updateMoveHistory(newMoveHistory, setMoveHistory, getMoveSuffix(myPieces, theirPieces));
                setPlayer(nextPlayer);
                deselectSelectedPiece();

                return;
            }
            
        }
    }

    // move a piece to empty square
    if(piece == "" && pieceSelected != "") {

        // move piece if possible
        if(myPieces[getPieceTypeByLetter(pieceSelected.charAt(1))][selectedPieceLoc].includes(pieceLoc)){

            if(checkForPromotion()){
                isCapture = false;
                targetLoc = pieceLoc;
                targetPiece = "";
                setPromotionColour(player.charAt(0));
                setPromotion("enabled");
                return;
            }

            //move piece
            let newData = {...data};
            newData[selectedPieceLoc] = "";
            newData[pieceLoc] = pieceSelected;

            delete myPieces[getPieceTypeByLetter(pieceSelected.charAt(1))][selectedPieceLoc];
            myPieces[getPieceTypeByLetter(pieceSelected.charAt(1))][pieceLoc] = [];

            setData(newData);
            let newMoveHistory = getNewMoveHistory(data, pieceLoc, myPieces, player, moveHistory);
            updateLegalMoves(newData, newMoveHistory);
            updatePieces();
            updateMoveHistory(newMoveHistory, setMoveHistory, getMoveSuffix(myPieces, theirPieces));
            setPlayer(nextPlayer);

        }

        deselectSelectedPiece();
    }
    // capture piece
    else if(piece.charAt(0) == nextPlayer.charAt(0) && pieceSelected != ""){
        // move piece if possible
        if(myPieces[getPieceTypeByLetter(pieceSelected.charAt(1))][selectedPieceLoc].includes(pieceLoc)){

            if(checkForPromotion()){
                isCapture = true;
                targetLoc = pieceLoc;
                targetPiece = piece;
                setPromotionColour(player.charAt(0));
                setPromotion("enabled");
                return;
            }


            //move piece
            let newData = {...data};
            newData[selectedPieceLoc] = "";
            newData[pieceLoc] = pieceSelected;

            delete myPieces[getPieceTypeByLetter(pieceSelected.charAt(1))][selectedPieceLoc];
            myPieces[getPieceTypeByLetter(pieceSelected.charAt(1))][pieceLoc] = [];

            delete theirPieces[getPieceTypeByLetter(piece.charAt(1))][pieceLoc];


            setData(newData);
            let newMoveHistory = getNewMoveHistory(data, pieceLoc, myPieces, player, moveHistory);
            updateLegalMoves(newData, newMoveHistory);
            updatePieces();
            updateMoveHistory(newMoveHistory, setMoveHistory, getMoveSuffix(myPieces, theirPieces));
            setPlayer(nextPlayer);

        }

        deselectSelectedPiece();
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
    
    let [player, setPlayer] = useState("white");
    
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

    let startingPos = {
        a1: "wr", b1: "wn", c1: "wb", d1: "wq", e1: "wk", f1: "wb", g1: "wn", h1: "wr",
        a2: "wp", b2: "wp", c2: "wp", d2: "wp", e2: "wp", f2: "wp", g2: "wp", h2: "wp",
        a3: "", b3: "", c3: "", d3: "", e3: "", f3: "", g3: "", h3: "",
        a4: "", b4: "", c4: "", d4: "", e4: "", f4: "", g4: "", h4: "",
        a5: "", b5: "", c5: "", d5: "", e5: "", f5: "", g5: "", h5: "",
        a6: "", b6: "", c6: "", d6: "", e6: "", f6: "", g6: "", h6: "",
        a7: "bp", b7: "bp", c7: "bp", d7: "bp", e7: "bp", f7: "bp", g7: "bp", h7: "bp",
        a8: "br", b8: "bn", c8: "bb", d8: "bq", e8: "bk", f8: "bb", g8: "bn", h8: "br",
    };

    let [currentSquareTypes, setSquareTypes] = useState(newSquareTypes);
    let [data, setData] = useState(startingPos);

    updateLegalMoves(data, props.moveHistory);

    useEffect(() => {
        if(props.promotionPiece != ""){
            let myPieces, theirPieces, nextPlayer, newData = {...data}, newPiece = props.promotionPiece;
            if(player == "white"){
                myPieces = whitePieces;
                theirPieces = blackPieces;
                nextPlayer = "black";
            }
            else {
                myPieces = blackPieces;
                theirPieces = whitePieces;
                nextPlayer = "white";
            }

            if(!isCapture){
                //move piece
                newData[selectedPieceLoc] = "";
                newData[targetLoc] = player.charAt(0) + props.promotionPiece;

                delete myPieces[getPieceTypeByLetter(pieceSelected.charAt(1))][selectedPieceLoc];
                myPieces[getPieceTypeByLetter(props.promotionPiece)][targetLoc] = [];           
            }
            else {
                //move piece
                newData[selectedPieceLoc] = "";
                newData[targetLoc] = player.charAt(0) + props.promotionPiece;

                delete myPieces[getPieceTypeByLetter(pieceSelected.charAt(1))][selectedPieceLoc];
                myPieces[getPieceTypeByLetter(props.promotionPiece)][targetLoc] = [];

                delete theirPieces[getPieceTypeByLetter(targetPiece.charAt(1))][targetLoc];
            }

            props.setPromotion("disabled");
            props.setPromotionPiece("");

            let newSquareTypes = {...currentSquareTypes};

            newSquareTypes[selectedPieceLoc] = newSquareTypes[selectedPieceLoc].substring(0, newSquareTypes[selectedPieceLoc].indexOf("-highlighted"));
            setSquareTypes(newSquareTypes);

            setData(newData);

            let newMoveHistory = getNewMoveHistory(data, targetLoc, myPieces, player, props.moveHistory);

            updateLegalMoves(newData, newMoveHistory);

            if(player == "white"){
                myPieces = whitePieces;
                theirPieces = blackPieces;
                nextPlayer = "black";
            }
            else {
                myPieces = blackPieces;
                theirPieces = whitePieces;
                nextPlayer = "white";
            }

            updateMoveHistory(newMoveHistory, props.setMoveHistory, getMoveSuffix(myPieces, theirPieces, newPiece));
            
            setPlayer(nextPlayer);

            pieceSelected = "";
            selectedPieceLoc = "";
        }
    }, [props.promotionPiece]);

    useEffect(() => {
        if(props.moveHistory.length > 0){
            console.log(props.moveHistory[props.moveHistory.length-1]);
        }
    }, [props.moveHistory]);
    
    for(let i = 0; i < 8; i++){
        row = [];
        letter = "a";
        
        for(let j = 0; j < 8; j++){
            

            pieceName = data[letter+(8-i)];

            row.push(<Square squareTypes = {currentSquareTypes} squareLoc = {letter+(8-i)} backgroundImage = {pieceName} onClickFunction={onClick} onClickParameters={[pieceName, player, setPlayer, letter+(8-i), currentSquareTypes, setSquareTypes, data, setData, props.promotion, props.setPromotion, props.setPromotionColour, props.moveHistory, props.setMoveHistory]} key = {letter+(8-i)}/>);
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