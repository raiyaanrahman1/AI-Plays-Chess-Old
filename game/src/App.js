import React, {useState} from 'react';
import './App.css';
import Board from './components/Board.js';
import Promotion from './components/Promotion.js';
import MoveHistory from './components/MoveHistory.js';
import Material from './components/Material.js';
import GamemodeSelector from './components/GamemodeSelector';

function App() {

  let [promotion, setPromotion] = useState("disabled");
  let [promotionColour, setPromotionColour] = useState("w");
  let [promotionPiece, setPromotionPiece] = useState("");

  let [moveHistory, setMoveHistory] = useState([]);
  let [material, setMaterial] = useState({white: {"p": 0, "n": 0, "b": 0, "r": 0, "q": 0}, black: {"p": 0, "n": 0, "b": 0, "r": 0, "q": 0}});

  let [gamemode, setGamemode] = useState("AI");

  return (
    <div className="App">
      <MoveHistory moveHistory={moveHistory} />
      <Board promotion={promotion} setPromotion={setPromotion} promotionPiece = {promotionPiece} setPromotionPiece = {setPromotionPiece} promotionColour = {promotionColour} setPromotionColour = {setPromotionColour} moveHistory = {moveHistory} setMoveHistory = {setMoveHistory} material = {material} setMaterial = {setMaterial} gamemode={gamemode}/>
      <Promotion promotion={promotion} setPromotion = {setPromotion} promotionPiece = {promotionPiece} setPromotionPiece = {setPromotionPiece} promotionColour = {promotionColour} setPromotionColour = {setPromotionColour}/>
      <Material material = {material} />
      <GamemodeSelector gamemode = {gamemode} setGamemode = {setGamemode}/>
    </div>
  );
}

export default App;
