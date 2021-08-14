import React from 'react';

const Square = (props) => {
    return (
        <button className={"square " + props.squareTypes[props.squareLoc] + " " + props.backgroundImage} onClick={() => {props.onClickFunction(props.onClickParameters)}}></button>
    );
};

export default Square;