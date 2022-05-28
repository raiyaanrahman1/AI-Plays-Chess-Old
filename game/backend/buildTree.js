const fs = require('fs');
let MAX_DEPTH = 3, AI_PLAYER = "black", HUMAN_PLAYER = "white";

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function prevChar(c) {
    return String.fromCharCode(c.charCodeAt(0) - 1);
}

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

const generateMoveName = (data, startingPos, destination, myPieces, player) => {
    let theirColour;
    
    if(player == "white"){
        theirColour = "black";
    } 
    else theirColour = "white";

    switch(data[startingPos].charAt(1)){
        case "p":

            if(startingPos.charAt(0) != destination.charAt(0)){
                return `${startingPos.charAt(0)}x${destination}`;
            }
            
            return destination;
            
        case "n":
            for(let knight in myPieces.knights){
                if(knight != startingPos && myPieces.knights[knight].includes(destination)){
                    if(knight.charAt(0) == startingPos.charAt(0)){
                        if(data[destination].charAt(0) == theirColour.charAt(0)){
                            return `N${startingPos.charAt(1)}x${destination}`;
                        }
                        return `N${startingPos.charAt(1)}${destination}`;
                    }
                    if(data[destination].charAt(0) == theirColour.charAt(0)){
                        return `N${startingPos.charAt(0)}x${destination}`;
                    }
                    return `N${startingPos.charAt(0)}${destination}`;
                }
            }

            if(data[destination].charAt(0) == theirColour.charAt(0)){
                return `Nx${destination}`;
            }
            
            return `N${destination}`;
            
        case "b":
            for(let bishop in myPieces.bishops){
                if(bishop != startingPos && myPieces.bishops[bishop].includes(destination)){
                    if(bishop.charAt(0) == startingPos.charAt(0)){
                        if(data[destination].charAt(0) == theirColour.charAt(0)){
                            return `B${startingPos.charAt(1)}x${destination}`;
                        }
                        return `B${startingPos.charAt(1)}${destination}`;
                    }
                    if(data[destination].charAt(0) == theirColour.charAt(0)){
                        return `B${startingPos.charAt(0)}x${destination}`;
                    }
                    return `B${startingPos.charAt(0)}${destination}`;
                }
            }

            if(data[destination].charAt(0) == theirColour.charAt(0)){
                return `Bx${destination}`;
            }
            
            return `B${destination}`;
            
        case "r":
            if(player == "white" && whiteCastlingRights[0] && startingPos == "h1"){
                whiteCastlingRights[0] = false;
            }
            else if(player == "white" && whiteCastlingRights[1] && startingPos == "a1"){
                whiteCastlingRights[1] = false;
            }
            else if(player == "black" && blackCastlingRights[0] && startingPos == "h8"){
                blackCastlingRights[0] = false;
            }
            else if(player == "black" && blackCastlingRights[1] && startingPos == "a8"){
                blackCastlingRights[1] = false;
            }

            for(let rook in myPieces.rooks){
                if(rook != startingPos && myPieces.rooks[rook].includes(destination)){
                    if(rook.charAt(0) == startingPos.charAt(0)){
                        if(data[destination].charAt(0) == theirColour.charAt(0)){
                            return `R${startingPos.charAt(1)}x${destination}`;
                        }
                        return `R${startingPos.charAt(1)}${destination}`;
                    }
                    if(data[destination].charAt(0) == theirColour.charAt(0)){
                        return `R${startingPos.charAt(0)}x${destination}`;
                    }
                    return `R${startingPos.charAt(0)}${destination}`;
                }
            }

            if(data[destination].charAt(0) == theirColour.charAt(0)){
                return `Rx${destination}`;
            }
            
            return `R${destination}`;
            
        case "q":
            for(let queen in myPieces.queens){
                if(queen != startingPos && myPieces.queens[queen].includes(destination)){
                    if(queen.charAt(0) == startingPos.charAt(0)){
                        if(data[destination].charAt(0) == theirColour.charAt(0)){
                            return `Q${startingPos.charAt(1)}x${destination}`;
                        }
                        return `Q${startingPos.charAt(1)}${destination}`;
                    }
                    if(data[destination].charAt(0) == theirColour.charAt(0)){
                        return `Q${startingPos.charAt(0)}x${destination}`;
                    }
                    return `Q${startingPos.charAt(0)}${destination}`;
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
            if(startingPos.charAt(0) == "e" && (destination.charAt(0) == "g" || destination.charAt(0) == "h")){
                return "O-O";
            }
            else if(startingPos.charAt(0) == "e" && (destination.charAt(0) == "c" || destination.charAt(0) == "a")){
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

const buildTree = (tree, data, moveHistory, myPieces, theirPieces, myColour, myCastlingRights, theirCastlingRights, material, currentDepth) => {
    let theirColour = (myColour == "white") ? "black" : "white";
    
    for(let pieceType in myPieces){
        for(let pieceLoc in myPieces[pieceType]){
            for(let destination of myPieces[pieceType][pieceLoc]){
                
                let newMoveHistory = [...moveHistory];
                let newMaterial = JSON.parse(JSON.stringify(material));
                let newData = JSON.parse(JSON.stringify(data));
                let myNewPieces = JSON.parse(JSON.stringify(myPieces));
                let theirNewPieces = JSON.parse(JSON.stringify(theirPieces));
                let myNewCastlingRights = [...myCastlingRights];
                let theirNewCastlingRights = [...theirCastlingRights];
                let newAiCastlingRights = (myColour == AI_PLAYER) ? myNewCastlingRights : theirNewCastlingRights;
                let newHumanCastlingRights = (myColour == HUMAN_PLAYER) ? myNewCastlingRights : theirNewCastlingRights;
                if(pieceType == "king") {
                    myNewCastlingRights = [false, false];
                }
                if(destination == "O-O"){
                    if(myColour == "white"){
                        
                        newData["e1"] = "";
                        newData["h1"] = "";
                        newData["g1"] = "wk";
                        newData["f1"] = "wr";

                        delete myNewPieces.king["e1"];
                        myNewPieces.king["g1"] = [];

                        delete myNewPieces.rooks["h1"];
                        myNewPieces.rooks["f1"] = [];

                        newMoveHistory.push({initialPos: "e1", destination: "g1", piece: "wk", name: "O-O"});

                        myNewPieces = calculateLegalMoves(myNewPieces, theirNewPieces, myColour, newData, newMoveHistory);
                        theirNewPieces = calculateLegalMoves(theirNewPieces, myNewPieces, theirColour, newData, newMoveHistory);

                        newMoveHistory[newMoveHistory.length-1].name += getMoveSuffix(myNewPieces, theirNewPieces);
                    }
                    else {
                        newData["e8"] = "";
                        newData["h8"] = "";
                        newData["g8"] = "bk";
                        newData["f8"] = "br";

                        delete myNewPieces.king["e8"];
                        myNewPieces.king["g8"] = [];

                        delete myNewPieces.rooks["h8"];
                        myNewPieces.rooks["f8"] = [];

                        newMoveHistory.push({initialPos: "e8", destination: "g8", piece: "bk", name: "O-O"});
                    
                        myNewPieces = calculateLegalMoves(myNewPieces, theirNewPieces, myColour, newData, newMoveHistory);
                        theirNewPieces = calculateLegalMoves(theirNewPieces, myNewPieces, theirColour, newData, newMoveHistory);

                        newMoveHistory[newMoveHistory.length-1].name += getMoveSuffix(myNewPieces, theirNewPieces);
                    }
                    
                }
                else if(destination == "O-O-O"){
                    if(myColour == "white"){
                        
                        newData["e1"] = "";
                        newData["a1"] = "";
                        newData["c1"] = "wk";
                        newData["d1"] = "wr";

                        delete myNewPieces.king["e1"];
                        myNewPieces.king["c1"] = [];

                        delete myNewPieces.rooks["a1"];
                        myNewPieces.rooks["d1"] = [];

                        newMoveHistory.push({initialPos: "e1", destination: "c1", piece: "wk", name: "O-O-O"});
                    
                        myNewPieces = calculateLegalMoves(myNewPieces, theirNewPieces, myColour, newData, newMoveHistory);
                        theirNewPieces = calculateLegalMoves(theirNewPieces, myNewPieces, theirColour, newData, newMoveHistory);

                        newMoveHistory[newMoveHistory.length-1].name += getMoveSuffix(myNewPieces, theirNewPieces);
                    }
                    else {
                        newData["e8"] = "";
                        newData["a8"] = "";
                        newData["c8"] = "bk";
                        newData["d8"] = "br";

                        delete myNewPieces.king["e8"];
                        myNewPieces.king["c8"] = [];

                        delete myNewPieces.rooks["a8"];
                        myNewPieces.rooks["d8"] = [];

                        newMoveHistory.push({initialPos: "e8", destination: "c8", piece: "bk", name: "O-O-O"});
                    
                        myNewPieces = calculateLegalMoves(myNewPieces, theirNewPieces, myColour, newData, newMoveHistory);
                        theirNewPieces = calculateLegalMoves(theirNewPieces, myNewPieces, theirColour, newData, newMoveHistory);

                        newMoveHistory[newMoveHistory.length-1].name += getMoveSuffix(myNewPieces, theirNewPieces);
                    }
                }
                else if(destination == "<-x"){
                    let direction = 1;
                    if(myColour == "black"){
                        direction = -1;
                    }
                    let myNewPawnLoc = prevChar(pieceLoc.charAt(0)) + (parseInt(pieceLoc.charAt(1)) + direction);
                    let theirPawnLoc = myNewPawnLoc.charAt(0) + (parseInt(myNewPawnLoc.charAt(1) - direction));

                    newData[pieceLoc] = "";
                    newData[myNewPawnLoc] = myColour.charAt(0) + "p";

                    newData[theirPawnLoc] = "";

                    delete myNewPieces.pawns[pieceLoc];
                    myNewPieces.pawns[myNewPawnLoc] = [];

                    delete theirNewPieces.pawns[theirPawnLoc];

                    newMaterial[myColour]["p"]++;

                    newMoveHistory.push({initialPos: pieceLoc, destination: myNewPawnLoc, piece: data[pieceLoc], name: generateMoveName(data, pieceLoc, myNewPawnLoc, myPieces, myColour)});
                
                    myNewPieces = calculateLegalMoves(myNewPieces, theirNewPieces, myColour, newData, newMoveHistory);
                    theirNewPieces = calculateLegalMoves(theirNewPieces, myNewPieces, theirColour, newData, newMoveHistory);

                    newMoveHistory[newMoveHistory.length-1].name += getMoveSuffix(myNewPieces, theirNewPieces);
                }
                else if(destination == "x->"){
                    let direction = 1;
                    if(myColour == "black"){
                        direction = -1;
                    }
                    let myNewPawnLoc = nextChar(pieceLoc.charAt(0)) + (parseInt(pieceLoc.charAt(1)) + direction);
                    let theirPawnLoc = myNewPawnLoc.charAt(0) + (parseInt(myNewPawnLoc.charAt(1) - direction));

                    newData[pieceLoc] = "";
                    newData[myNewPawnLoc] = myColour.charAt(0) + "p";

                    newData[theirPawnLoc] = "";

                    delete myNewPieces.pawns[pieceLoc];
                    myNewPieces.pawns[myNewPawnLoc] = [];

                    delete theirNewPieces.pawns[theirPawnLoc];

                    newMaterial[myColour]["p"]++;

                    newMoveHistory.push({initialPos: pieceLoc, destination: myNewPawnLoc, piece: data[pieceLoc], name: generateMoveName(data, pieceLoc, myNewPawnLoc, myPieces, myColour)});
                
                    myNewPieces = calculateLegalMoves(myNewPieces, theirNewPieces, myColour, newData, newMoveHistory);
                    theirNewPieces = calculateLegalMoves(theirNewPieces, myNewPieces, theirColour, newData, newMoveHistory);

                    newMoveHistory[newMoveHistory.length-1].name += getMoveSuffix(myNewPieces, theirNewPieces);
                }
                else if(data[destination] == ""){
                    newData[pieceLoc] = "";
                    delete myNewPieces[pieceType][pieceLoc];

                    if(myColour == "white" && pieceType == "pawns" && destination.charAt(1) == "8" || (myColour == "black" && pieceType == "pawns" && destination.charAt(1) == "1")){
                        let newMoveHistory2 = [...newMoveHistory];
                        let newMaterial2 = {...newMaterial};
                        let newData2 = {...newData};
                        let myNewPieces2 = {...myNewPieces};
                        let theirNewPieces2 = {...theirNewPieces};

                        let AiPieces = (myColour == AI_PLAYER) ? myNewPieces2 : theirNewPieces2;
                        let humanPieces = (myColour == HUMAN_PLAYER) ? myNewPieces2 : theirNewPieces2;

                        newMoveHistory2.push({initialPos: pieceLoc, destination: destination, piece: data[pieceLoc], name: generateMoveName(data, pieceLoc, destination, myPieces, myColour)});
                        newMaterial2[myColour]["q"]++;
                        newData2[destination] = myColour.charAt(0) + "q";
                        myNewPieces2["queens"][destination] = [];
                        myNewPieces2 = calculateLegalMoves(myNewPieces2, theirNewPieces2, myColour, newData2, newMoveHistory2);
                        theirNewPieces2 = calculateLegalMoves(theirNewPieces2, myNewPieces2, theirColour, newData2, newMoveHistory2);
                        newMoveHistory2[newMoveHistory2.length-1].name += getMoveSuffix(myNewPieces2, theirNewPieces2, "Q");

                        let subtree = {eval: 0, children: [], data: {...newData2}, moveHistory: [...newMoveHistory2], AiPieces: {...AiPieces}, humanPieces: {...humanPieces}, AiCastlingRights: newAiCastlingRights, humanCastlingRights: newHumanCastlingRights, material: {...newMaterial2}};
                        if(currentDepth < MAX_DEPTH){
                            buildTree(subtree, newData, newMoveHistory, theirPieces, myPieces, theirColour, theirCastlingRights, myCastlingRights, newMaterial, currentDepth + 1);
                        }
                        tree.children.push(subtree);
                        
                        newMoveHistory2 = [...newMoveHistory];
                        newMaterial2 = {...newMaterial};
                        newData2 = {...newData};
                        myNewPieces2 = {...myNewPieces};
                        theirNewPieces2 = {...theirNewPieces};

                        newMoveHistory2.push({initialPos: pieceLoc, destination: destination, piece: data[pieceLoc], name: generateMoveName(data, pieceLoc, destination, myPieces, myColour)});
                        newMaterial2[myColour]["n"]++;
                        newData2[destination] = myColour.charAt(0) + "n";
                        myNewPieces2["knights"][destination] = [];
                        myNewPieces2 = calculateLegalMoves(myNewPieces2, theirNewPieces2, myColour, newData2, newMoveHistory2);
                        theirNewPieces2 = calculateLegalMoves(theirNewPieces2, myNewPieces2, theirColour, newData2, newMoveHistory2);
                        newMoveHistory2[newMoveHistory2.length-1].name += getMoveSuffix(myNewPieces2, theirNewPieces2, "N");
                        
                        subtree = {eval: 0, children: [], data: {...newData2}, moveHistory: [...newMoveHistory2], AiPieces: {...AiPieces}, humanPieces: {...humanPieces}, AiCastlingRights: newAiCastlingRights, humanCastlingRights: newHumanCastlingRights, material: {...newMaterial2}};
                        if(currentDepth < MAX_DEPTH){
                            buildTree(subtree, newData, newMoveHistory, theirPieces, myPieces, theirColour, theirCastlingRights, myCastlingRights, newMaterial, currentDepth + 1);
                        }
                        tree.children.push(subtree);
                        continue;
                    }

                    else {
                        newData[destination] = myColour.charAt(0) + getLetterByPieceType(pieceType);
                        myNewPieces[pieceType][destination] = [];

                        newMoveHistory.push({initialPos: pieceLoc, destination: destination, piece: data[pieceLoc], name: generateMoveName(data, pieceLoc, destination, myPieces, myColour)});

                        myNewPieces = calculateLegalMoves(myNewPieces, theirNewPieces, myColour, newData, newMoveHistory);
                        theirNewPieces = calculateLegalMoves(theirNewPieces, myNewPieces, theirColour, newData, newMoveHistory);

                        newMoveHistory[newMoveHistory.length-1].name += getMoveSuffix(myNewPieces, theirNewPieces);
                    }
                }
                else {

                    newMaterial[myColour][data[destination].charAt(1)]++;
                    newData[pieceLoc] = "";

                    if(myColour == "white" && pieceType == "pawns" && destination.charAt(1) == "8" || (myColour == "black" && pieceType == "pawns" && destination.charAt(1) == "1")){
                        let newMoveHistory2 = [...newMoveHistory];
                        let newMaterial2 = {...newMaterial};
                        let newData2 = JSON.parse(JSON.stringify(newData));
                        let myNewPieces2 = {...myNewPieces};
                        let theirNewPieces2 = {...theirNewPieces};

                        let AiPieces = (myColour == AI_PLAYER) ? myNewPieces2 : theirNewPieces2;
                        let humanPieces = (myColour == HUMAN_PLAYER) ? myNewPieces2 : theirNewPieces2;

                        newMoveHistory2.push({initialPos: pieceLoc, destination: destination, piece: data[pieceLoc], name: generateMoveName(data, pieceLoc, destination, myPieces, myColour)});
                        newMaterial2[myColour]["q"]++;
                        newData2[destination] = myColour.charAt(0) + "q";
                        myNewPieces2["queens"][destination] = [];
                        delete theirNewPieces2[getPieceTypeByLetter(newData[destination].charAt(1))][destination];
                        myNewPieces2 = calculateLegalMoves(myNewPieces2, theirNewPieces2, myColour, newData2, newMoveHistory2);
                        theirNewPieces2 = calculateLegalMoves(theirNewPieces2, myNewPieces2, theirColour, newData2, newMoveHistory2);
                        newMoveHistory2[newMoveHistory2.length-1].name += getMoveSuffix(myNewPieces2, theirNewPieces2, "Q");

                        let subtree = {eval: 0, children: [], data: {...newData2}, moveHistory: [...newMoveHistory2], AiPieces: {...AiPieces}, humanPieces: {...humanPieces}, AiCastlingRights: newAiCastlingRights, humanCastlingRights: newHumanCastlingRights, material: {...newMaterial2}};
                        if(currentDepth < MAX_DEPTH){
                            buildTree(subtree, newData, newMoveHistory, theirPieces, myPieces, theirColour, theirCastlingRights, myCastlingRights, newMaterial, currentDepth + 1);
                        }
                        tree.children.push(subtree);
                        
                        newMoveHistory2 = [...newMoveHistory];
                        newMaterial2 = {...newMaterial};
                        newData2 = {...newData};
                        myNewPieces2 = {...myNewPieces};
                        theirNewPieces2 = {...theirNewPieces};

                        newMoveHistory2.push({initialPos: pieceLoc, destination: destination, piece: data[pieceLoc], name: generateMoveName(data, pieceLoc, destination, myPieces, myColour)});
                        newMaterial2[myColour]["n"]++;
                        newData2[destination] = myColour.charAt(0) + "n";
                        myNewPieces2["knights"][destination] = [];
                        delete theirNewPieces2[getPieceTypeByLetter(newData[destination].charAt(1))][destination];
                        myNewPieces2 = calculateLegalMoves(myNewPieces2, theirNewPieces2, myColour, newData2, newMoveHistory2);
                        theirNewPieces2 = calculateLegalMoves(theirNewPieces2, myNewPieces2, theirColour, newData2, newMoveHistory2);
                        newMoveHistory2[newMoveHistory2.length-1].name += getMoveSuffix(myNewPieces2, theirNewPieces2, "N");

                        subtree = {eval: 0, children: [], data: {...newData2}, moveHistory: [...newMoveHistory2], AiPieces: {...AiPieces}, humanPieces: {...humanPieces}, AiCastlingRights: newAiCastlingRights, humanCastlingRights: newHumanCastlingRights, material: {...newMaterial2}};
                        if(currentDepth < MAX_DEPTH){
                            buildTree(subtree, newData, newMoveHistory, theirPieces, myPieces, theirColour, theirCastlingRights, myCastlingRights, newMaterial, currentDepth + 1);
                        }
                        tree.children.push(subtree);
                        continue;
                    }
                    else {
                        myNewPieces[pieceType][destination] = [];

                        delete theirNewPieces[getPieceTypeByLetter(data[destination].charAt(1))][destination];

                        newData[destination] = myColour.charAt(0) + getLetterByPieceType(pieceType);

                        newMoveHistory.push({initialPos: pieceLoc, destination: destination, piece: data[pieceLoc], name: generateMoveName(data, pieceLoc, destination, myPieces, myColour)});

                        myNewPieces = calculateLegalMoves(myNewPieces, theirNewPieces, myColour, newData, newMoveHistory);
                        theirNewPieces = calculateLegalMoves(theirNewPieces, myNewPieces, theirColour, newData, newMoveHistory);

                        newMoveHistory[newMoveHistory.length-1].name += getMoveSuffix(myNewPieces, theirNewPieces);
                    }
                }
                
                let AiPieces = (myColour == AI_PLAYER) ? myNewPieces : theirNewPieces;
                let humanPieces = (myColour == HUMAN_PLAYER) ? myNewPieces : theirNewPieces;

                let subtree = {eval: 0, children: [], data: newData, moveHistory: newMoveHistory, AiPieces: AiPieces, humanPieces: humanPieces, AiCastlingRights: newAiCastlingRights, humanCastlingRights: newHumanCastlingRights, material: newMaterial};
                if(currentDepth < MAX_DEPTH){
                    buildTree(subtree, newData, newMoveHistory, theirPieces, myPieces, theirColour, theirCastlingRights, myCastlingRights, newMaterial, currentDepth + 1);
                }
                tree.children.push(subtree);
                
            }
        }
    }
}

let tempData = {
    a1: "wr", b1: "wn", c1: "wb", d1: "wq", e1: "wk", f1: "wb", g1: "wn", h1: "wr",
    a2: "wp", b2: "wp", c2: "wp", d2: "wp", e2: "wp", f2: "wp", g2: "wp", h2: "wp",
    a3: "", b3: "", c3: "", d3: "", e3: "", f3: "", g3: "", h3: "",
    a4: "", b4: "", c4: "", d4: "", e4: "", f4: "", g4: "", h4: "",
    a5: "", b5: "", c5: "", d5: "", e5: "", f5: "", g5: "", h5: "",
    a6: "", b6: "", c6: "", d6: "", e6: "", f6: "", g6: "", h6: "",
    a7: "bp", b7: "bp", c7: "bp", d7: "bp", e7: "bp", f7: "bp", g7: "bp", h7: "bp",
    a8: "br", b8: "bn", c8: "bb", d8: "bq", e8: "bk", f8: "bb", g8: "bn", h8: "br",
};

let moveHistory = [];
let AiPieces = {
    pawns: {"a7":[], "b7":[], "c7":[], "d7":[], "e7":[], "f7":[], "g7":[], "h7":[]},
    knights: {"b8":[], "g8":[]},
    bishops: {"c8":[], "f8":[]},
    rooks: {"a8":[], "h8":[]},
    queens: {"d8":[]},
    king: {"e8":[]}
};
let humanPieces = {
    pawns: {"a2":[], "b2":[], "c2":[], "d2":[], "e2":[], "f2":[], "g2":[], "h2":[]},
    knights: {"b1":[], "g1":[]},
    bishops: {"c1":[], "f1":[]},
    rooks: {"a1":[], "h1":[]},
    queens: {"d1":[]},
    king: {"e1":[]}
};
let AiCastlingRights = [true, true], humanCastlingRights = [true, true];
let material = {white: {"p": 0, "n": 0, "b": 0, "r": 0, "q": 0}, black: {"p": 0, "n": 0, "b": 0, "r": 0, "q": 0}};
let tree = {eval: 0, children: [], data: tempData, moveHistory: moveHistory, AiPieces: AiPieces, humanPieces: humanPieces, AiCastlingRights: AiCastlingRights, humanCastlingRights: humanCastlingRights, material: material};
buildTree(tree, tempData, moveHistory, humanPieces, AiPieces, HUMAN_PLAYER, humanCastlingRights, AiCastlingRights, material, 0);

let str = JSON.stringify(tree, null, 2);
let readTree;

fs.writeFile('./backend/tree.json', str, function (err) {
    if (err) console.log("error while writing file" + err);
    else{
        console.log('Saved!');
        fs.readFile('./backend/tree.json', (err, data) => {
            if(err) console.log("error while reading file" + err);
            else {
                console.log("read file!");
                readTree = JSON.parse(data);
                console.log(readTree.eval);
            }
        })
    } 

});

