import React, {useState} from 'react';
import './App.css';
import Board from './components/Board.js';
import Promotion from './components/Promotion.js';
import MoveHistory from './components/MoveHistory.js';

function App() {

  let [promotion, setPromotion] = useState("disabled");
  let [promotionColour, setPromotionColour] = useState("w");
  let [promotionPiece, setPromotionPiece] = useState("");

  let [moveHistory, setMoveHistory] = useState([]);

  return (
    <div className="App">
      <MoveHistory moveHistory={moveHistory} />
      <Board promotion={promotion} setPromotion={setPromotion} promotionPiece = {promotionPiece} setPromotionPiece = {setPromotionPiece} promotionColour = {promotionColour} setPromotionColour = {setPromotionColour} moveHistory = {moveHistory} setMoveHistory = {setMoveHistory}/>
      <Promotion promotion={promotion} setPromotion = {setPromotion} promotionPiece = {promotionPiece} setPromotionPiece = {setPromotionPiece} promotionColour = {promotionColour} setPromotionColour = {setPromotionColour}/>
    </div>
  );
}

export default App;
