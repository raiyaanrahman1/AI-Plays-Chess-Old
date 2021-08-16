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
            console.log("error: invalid piece type");
            break;
    }
    return pieceType;
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

    /*############################################  PAWNS  ##########################################################*/ 


    for(let pawn in myPieces.pawns){
        legalMoves = [];
        if(myColour == "white"){

            // Pawn at starting position (can move 2 squares fwd)
            if(pawn.charAt(1) == "2" && data[pawn.charAt(0) + "3" ] == "" && data[pawn.charAt(0) + "4" ] == "" && !myKingInCheck("pawns", pawn, pawn.charAt(0) + "4", theirPieces)){
                legalMoves.push(pawn.charAt(0)+ "4");
            }

            // Fwd one move
            if(data[pawn.charAt(0) + (parseInt(pawn.charAt(1)) + 1) ] == "" && !myKingInCheck("pawns", pawn, pawn.charAt(0)+ (parseInt(pawn.charAt(1)) + 1), theirPieces)){
                legalMoves.push(pawn.charAt(0)+ (parseInt(pawn.charAt(1)) + 1));
            }
            
            // Capture to the left
            let squareUpAndLeft = prevChar(pawn.charAt(0)) + (parseInt(pawn.charAt(1)) + 1);
            if(pawn.charAt(0) != "a" && data[squareUpAndLeft].charAt(0) == "b") {

                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[squareUpAndLeft].charAt(1)), squareUpAndLeft);

                if(!myKingInCheck("pawns", pawn, squareUpAndLeft, theirNewPieces)){
                    legalMoves.push(squareUpAndLeft);
                }
            }

            // Capture to the right
            let squareUpAndRight = nextChar(pawn.charAt(0)) + (parseInt(pawn.charAt(1)) + 1);
            if(pawn.charAt(0) != "h" && data[squareUpAndRight].charAt(0) == "b") {

                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[squareUpAndRight].charAt(1)), squareUpAndRight);

                if(!myKingInCheck("pawns", pawn, squareUpAndRight, theirNewPieces)){
                    legalMoves.push(squareUpAndRight);
                }
            }
        }
        else{
            // Pawn at starting position (can move 2 squares fwd)
            if(pawn.charAt(1) == "7" && data[pawn.charAt(0) + "6" ] == "" && data[pawn.charAt(0) + "5" ] == "" && !myKingInCheck("pawns", pawn, pawn.charAt(0) + "5", theirPieces)){
                legalMoves.push(pawn.charAt(0) + "5");
            }

            // Fwd one move
            if(data[pawn.charAt(0) + (parseInt(pawn.charAt(1)) - 1) ] == "" && !myKingInCheck("pawns", pawn, pawn.charAt(0)+ (parseInt(pawn.charAt(1)) - 1), theirPieces)){
                legalMoves.push(pawn.charAt(0)+ (parseInt(pawn.charAt(1)) - 1));
            }

            // Capture to the left
            let squareDownAndLeft = prevChar(pawn.charAt(0)) + (parseInt(pawn.charAt(1)) - 1);
            if(pawn.charAt(0) != "a" && data[squareDownAndLeft].charAt(0) == "w") {

                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[squareDownAndLeft].charAt(1)), squareDownAndLeft);

                if(!myKingInCheck("pawns", pawn, squareDownAndLeft, theirNewPieces)){
                    legalMoves.push(squareDownAndLeft);
                }
            }

            // Capture to the right
            let squareDownAndRight = nextChar(pawn.charAt(0)) + (parseInt(pawn.charAt(1)) - 1);
            if(pawn.charAt(0) != "h" && data[squareDownAndRight].charAt(0) == "w") {

                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[squareDownAndRight].charAt(1)), squareDownAndRight);

                if(!myKingInCheck("pawns", pawn, squareDownAndRight, theirNewPieces)){
                    legalMoves.push(squareDownAndRight);
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
            

            if(data[squareUpXsteps] == "" && !myKingInCheck("rooks", rook, squareUpXsteps, theirPieces)){
                legalMoves.push(squareUpXsteps);
            }
            else if(data[squareUpXsteps].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else {
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[squareUpXsteps].charAt(1)), squareUpXsteps);
                if(!myKingInCheck("rooks", rook, squareUpXsteps, theirNewPieces)){
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

            if(data[squareDownXsteps] == "" && !myKingInCheck("rooks", rook, squareDownXsteps, theirPieces)){
                legalMoves.push(squareDownXsteps);
            }
            else if(data[squareDownXsteps].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else {
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[squareDownXsteps].charAt(1)), squareDownXsteps);
                if(!myKingInCheck("rooks", rook, squareDownXsteps, theirNewPieces)){
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
            if(data[square] == "" && !myKingInCheck("rooks", rook, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else {
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("rooks", rook, square, theirNewPieces)){
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
            if(data[square] == "" && !myKingInCheck("rooks", rook, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else {
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("rooks", rook, square, theirNewPieces)){
                    legalMoves.push(square);
                }
                obstructions = true;
            }

            if(rightChar == "h"){
                obstructions = true;
            }
            else{
                rightChar = prevChar(rightChar);
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

            if(data[square] == "" && !myKingInCheck("bishops", bishop, square, theirPieces)){
                legalMoves.push(square);
            }
            else if (data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else {
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("bishops", bishop, square, theirNewPieces)){
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

            if(data[square] == "" && !myKingInCheck("bishops", bishop, square, theirPieces)){
                legalMoves.push(square);
            }
            else if (data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else {
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("bishops", bishop, square, theirNewPieces)){
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

            if(data[square] == "" && !myKingInCheck("bishops", bishop, square, theirPieces)){
                legalMoves.push(square);
            }
            else if (data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else {
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("bishops", bishop, square, theirNewPieces)){
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

            if(data[square] == "" && !myKingInCheck("bishops", bishop, square, theirPieces)){
                legalMoves.push(square);
            }
            else if (data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else {
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("bishops", bishop, square, theirNewPieces)){
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

            if(data[square] == "" && !myKingInCheck("knights", knight, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) != myColour.charAt(0)){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("knights", knight, square, theirNewPieces)){
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

            if(data[square] == "" && !myKingInCheck("knights", knight, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) != myColour.charAt(0)){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("knights", knight, square, theirNewPieces)){
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

            if(data[square] == "" && !myKingInCheck("knights", knight, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) != myColour.charAt(0)){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("knights", knight, square, theirNewPieces)){
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

            if(data[square] == "" && !myKingInCheck("knights", knight, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) != myColour.charAt(0)){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("knights", knight, square, theirNewPieces)){
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

            if(data[square] == "" && !myKingInCheck("knights", knight, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) != myColour.charAt(0)){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("knights", knight, square, theirNewPieces)){
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

            if(data[square] == "" && !myKingInCheck("knights", knight, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) != myColour.charAt(0)){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("knights", knight, square, theirNewPieces)){
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

            if(data[square] == "" && !myKingInCheck("knights", knight, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) != myColour.charAt(0)){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("knights", knight, square, theirNewPieces)){
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

            if(data[square] == "" && !myKingInCheck("knights", knight, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) != myColour.charAt(0)){
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("knights", knight, square, theirNewPieces)){
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
            

            if(data[squareUpXsteps] == "" && !myKingInCheck("queens", queen, squareUpXsteps, theirPieces)){
                legalMoves.push(squareUpXsteps);
            }
            else if(data[squareUpXsteps].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else {
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[squareUpXsteps].charAt(1)), squareUpXsteps);
                if(!myKingInCheck("queens", queen, squareUpXsteps, theirNewPieces)){
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

            if(data[squareDownXsteps] == "" && !myKingInCheck("queens", queen, squareDownXsteps, theirPieces)){
                legalMoves.push(squareDownXsteps);
            }
            else if(data[squareDownXsteps].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else {
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[squareDownXsteps].charAt(1)), squareDownXsteps);
                if(!myKingInCheck("queens", queen, squareDownXsteps, theirNewPieces)){
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
            if(data[square] == "" && !myKingInCheck("queens", queen, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else {
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("queens", queen, square, theirNewPieces)){
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
            if(data[square] == "" && !myKingInCheck("queens", queen, square, theirPieces)){
                legalMoves.push(square);
            }
            else if(data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else {
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("queens", queen, square, theirNewPieces)){
                    legalMoves.push(square);
                }
                obstructions = true;
            }

            if(rightChar == "h"){
                obstructions = true;
            }
            else{
                rightChar = prevChar(rightChar);
            }
        }

        // Moves up and right
        obstructions = false;
        x = 1;
        rightChar = nextChar(queen.charAt(0));

        while(!obstructions && (parseInt(queen.charAt(1)) + x) <= 8 && queen.charAt(0) != "h"){
            let square = rightChar + (parseInt(queen.charAt(1)) + x);

            if(data[square] == "" && !myKingInCheck("queens", queen, square, theirPieces)){
                legalMoves.push(square);
            }
            else if (data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else {
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("queens", queen, square, theirNewPieces)){
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

            if(data[square] == "" && !myKingInCheck("queens", queen, square, theirPieces)){
                legalMoves.push(square);
            }
            else if (data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else {
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("queens", queen, square, theirNewPieces)){
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

            if(data[square] == "" && !myKingInCheck("queens", queen, square, theirPieces)){
                legalMoves.push(square);
            }
            else if (data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else {
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("queens", queen, square, theirNewPieces)){
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

            if(data[square] == "" && !myKingInCheck("queens", queen, square, theirPieces)){
                legalMoves.push(square);
            }
            else if (data[square].charAt(0) == myColour.charAt(0)){
                obstructions = true;
            }
            else {
                let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
                if(!myKingInCheck("queens", queen, square, theirNewPieces)){
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

    let king = Object.keys(myPieces.king)[0];

    legalMoves = [];

    // Up
    let square = king.charAt(0) + (parseInt(king.charAt(1)) + 1);

    if(parseInt(king.charAt(1)) < 8 && data[square] == "" && !myKingInCheck("king", king, square, theirPieces)) {
        legalMoves.push(square)
    }
    else if(parseInt(king.charAt(1)) < 8 && data[square].charAt(0) != myColour.charAt(0)){
        let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
        if(!myKingInCheck("king", king, square, theirNewPieces)){
            legalMoves.push(square);
        }
    }

    // Down

    square = king.charAt(0) + (parseInt(king.charAt(1)) - 1);

    if(parseInt(king.charAt(1)) > 1 && data[square] == "" && !myKingInCheck("king", king, square, theirPieces)) {
        legalMoves.push(square)
    }
    else if(parseInt(king.charAt(1)) > 1 && data[square].charAt(0) != myColour.charAt(0)){
        let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
        if(!myKingInCheck("king", king, square, theirNewPieces)){
            legalMoves.push(square);
        }
    }

    // Left

    square = prevChar(king.charAt(0)) + king.charAt(1);

    if(king.charAt(0) != "a" && data[square] == "" && !myKingInCheck("king", king, square, theirPieces)) {
        legalMoves.push(square)
    }
    else if(king.charAt(0) != "a" && data[square].charAt(0) != myColour.charAt(0)){
        let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
        if(!myKingInCheck("king", king, square, theirNewPieces)){
            legalMoves.push(square);
        }
    }

    // Right

    square = nextChar(king.charAt(0)) + king.charAt(1);

    if(king.charAt(0) != "h" && data[square] == "" && !myKingInCheck("king", king, square, theirPieces)) {
        legalMoves.push(square)
    }
    else if(king.charAt(0) != "h" && data[square].charAt(0) != myColour.charAt(0)){
        let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
        if(!myKingInCheck("king", king, square, theirNewPieces)){
            legalMoves.push(square);
        }
    }

    // Up and Right

    square = nextChar(king.charAt(0)) + (parseInt(king.charAt(1)) + 1);

    if(parseInt(king.charAt(1)) < 8 && king.charAt(0) != "h" && data[square] == "" && !myKingInCheck("king", king, square, theirPieces)) {
        legalMoves.push(square)
    }
    else if(parseInt(king.charAt(1)) < 8 && king.charAt(0) != "h" && data[square].charAt(0) != myColour.charAt(0)){
        let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
        if(!myKingInCheck("king", king, square, theirNewPieces)){
            legalMoves.push(square);
        }
    }

    // Up and Left

    square = prevChar(king.charAt(0)) + (parseInt(king.charAt(1)) + 1);

    if(parseInt(king.charAt(1)) < 8 && king.charAt(0) != "a" && data[square] == "" && !myKingInCheck("king", king, square, theirPieces)) {
        legalMoves.push(square)
    }
    else if(parseInt(king.charAt(1)) < 8 && king.charAt(0) != "a" && data[square].charAt(0) != myColour.charAt(0)){
        let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
        if(!myKingInCheck("king", king, square, theirNewPieces)){
            legalMoves.push(square);
        }
    }

    // Down and Right

    square = nextChar(king.charAt(0)) + (parseInt(king.charAt(1)) - 1);

    if(parseInt(king.charAt(1)) > 1 && king.charAt(0) != "h" && data[square] == "" && !myKingInCheck("king", king, square, theirPieces)) {
        legalMoves.push(square)
    }
    else if(parseInt(king.charAt(1)) > 1 && king.charAt(0) != "h" && data[square].charAt(0) != myColour.charAt(0)){
        let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
        if(!myKingInCheck("king", king, square, theirNewPieces)){
            legalMoves.push(square);
        }
    }

    // Down and Left

    square = prevChar(king.charAt(0)) + (parseInt(king.charAt(1)) - 1);

    if(parseInt(king.charAt(1)) > 1 && king.charAt(0) != "a" && data[square] == "" && !myKingInCheck("king", king, square, theirPieces)) {
        legalMoves.push(square)
    }
    else if(parseInt(king.charAt(1)) > 1 && king.charAt(0) != "a" && data[square].charAt(0) != myColour.charAt(0)){
        let theirNewPieces = capturePiece(theirPieces, getPieceTypeByLetter(data[square].charAt(1)), square);
        if(!myKingInCheck("king", king, square, theirNewPieces)){
            legalMoves.push(square);
        }
    }

    result.king[king] = [...legalMoves];

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