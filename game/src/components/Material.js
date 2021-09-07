import React, {useState, useEffect} from 'react';

const Material = (props) => {

    let [netMaterial, setNetMaterial] = useState({white: " ", black: " "});
    let [icons, setIcons] = useState({white: [], black: []});
    
    useEffect(() => {
        let material = {white: {"p": 0, "n": 0, "b": 0, "r": 0, "q": 0}, black: {"p": 0, "n": 0, "b": 0, "r": 0, "q": 0}};
        for(let piece of props.material.white){
            material.white[piece]++;
        }
        for(let piece of props.material.black){
            material.black[piece]++;
        }

        let whiteTotalMaterial = material.white["p"] + material.white["n"]*3 + material.white["b"]*3 + material.white["r"]*5 + material.white["q"]*9;
        let blackTotalMaterial = material.black["p"] + material.black["n"]*3 + material.black["b"]*3 + material.black["r"]*5 + material.black["q"]*9;

        if(whiteTotalMaterial > blackTotalMaterial){
            setNetMaterial({white: `+${whiteTotalMaterial - blackTotalMaterial}`, black: " "});
        }
        else if(blackTotalMaterial > whiteTotalMaterial){
            setNetMaterial({white: " ", black: `+${blackTotalMaterial - whiteTotalMaterial}`});
        }
        else {
            setNetMaterial({white: " ", black: " "});
        }

        let newIcons = {white: [], black: []};
        for(let pieceType in material.white){
            if(material.white[pieceType] > material.black[pieceType]){
                for(let i = 0; i < material.white[pieceType] - material.black[pieceType]; i++){
                    newIcons.white.push(<div className={"icon w" + pieceType} key={pieceType+i}></div>);
                }
            }
            else if(material.black[pieceType] > material.white[pieceType]){
                for(let i = 0; i < material.black[pieceType] - material.white[pieceType]; i++){
                    newIcons.black.push(<div className={"icon w" + pieceType} key={pieceType+i}></div>);
                }
            }
        }
        setIcons(newIcons);
    }, [props.material])
    
    return (
        <div className="material">
            <div><div className="icon-container">{icons.black}</div> <div className = "material-text">{netMaterial.black}</div></div>
            <div><div className="icon-container">{icons.white}</div> <div className = "material-text">{netMaterial.white}</div></div>
        </div>
    );
};

export default Material;