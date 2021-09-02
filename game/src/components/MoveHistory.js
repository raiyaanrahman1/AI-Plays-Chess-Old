import React, {useEffect} from 'react';

const MoveHistory = (props) => {
    useEffect(() => {
        let newStr = "";
        if(props.moveHistory.length > 0){
            let i = props.moveHistory.length-1;
            if(i % 2 == 0){
                newStr = `${i/2 + 1}.${props.moveHistory[i].name}`;
            }
            else {
                newStr = ` ${props.moveHistory[i].name}</br>`;
            }
        }
        
        document.getElementById("move-history").innerHTML += newStr;
        document.getElementById("move-history-wrapper").scrollTop = document.getElementById("move-history-wrapper").scrollHeight;
    }, [props.moveHistory])
    
    return (
        <div className="auto-scroll moveHistory" id="move-history-wrapper"><p id="move-history"></p></div>
    );
};

export default MoveHistory;