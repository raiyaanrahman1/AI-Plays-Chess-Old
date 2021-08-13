import React from 'react';

const Square = (props) => {
    return (
        <button className={"square " + props.squareType + " " + props.backgroundImage}></button>
    );
};

export default Square;