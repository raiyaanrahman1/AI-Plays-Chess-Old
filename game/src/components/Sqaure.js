import React from 'react';

const Square = (props) => {
    return (
        <button className={"square " + props.squareType + " " + props.backgroundImage} onClick={() => {props.onClickFunction(props.onClickParameters)}}></button>
    );
};

export default Square;