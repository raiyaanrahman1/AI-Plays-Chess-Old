import React from 'react';

const GamemodeSelector = (props) => {
    
    return (
        <div className="gamemode-selector-div">
            <p>Set gamemode to:</p> 
            <button className="gamemode-selector" onClick={()=> {
                if(props.gamemode == "Self Play"){
                    props.setGamemode("AI");
                }
                else{
                    props.setGamemode("Self Play")
                }
            }}>{props.gamemode == "Self Play" ? "AI" : "Self Play"}</button>
        </div>
    );
};

export default GamemodeSelector;