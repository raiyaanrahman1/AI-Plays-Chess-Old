import React from 'react';

const Promotion = (props) => {
    return (
        <div>
            <button className={`square light-square ${props.promotionColour}q promotion ` + props.promotion} onClick={() => {
                props.setPromotionPiece("q");
                props.setPromotion("disabled");
            }}></button>
            <button className={`square light-square ${props.promotionColour}r promotion ` + props.promotion} onClick={() => {
                props.setPromotionPiece("r");
                props.setPromotion("disabled");
            }}></button>
            <button className={`square light-square ${props.promotionColour}n promotion ` + props.promotion} onClick={() => {
                props.setPromotionPiece("n");
                props.setPromotion("disabled");
            }}></button>
            <button className={`square light-square ${props.promotionColour}b promotion ` + props.promotion} onClick={() => {
                props.setPromotionPiece("b");
                props.setPromotion("disabled");
            }}></button>
        </div>
    );
};

export default Promotion;