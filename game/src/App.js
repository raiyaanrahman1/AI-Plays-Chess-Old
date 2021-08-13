import './App.css';
import Board from './components/Board.js';

function App() {

  let data = {
    a1: "wr", b1: "wn", c1: "wb", d1: "wq", e1: "wk", f1: "wb", g1: "wn", h1: "wr",
    a2: "wp", b2: "wp", c2: "wp", d2: "wp", e2: "wp", f2: "wp", g2: "wp", h2: "wp",
    a3: "", b3: "", c3: "", d3: "", e3: "", f3: "", g3: "", h3: "",
    a4: "", b4: "", c4: "", d4: "", e4: "", f4: "", g4: "", h4: "",
    a5: "", b5: "", c5: "", d5: "", e5: "", f5: "", g5: "", h5: "",
    a6: "", b6: "", c6: "", d6: "", e6: "", f6: "", g6: "", h6: "",
    a7: "bp", b7: "bp", c7: "bp", d7: "bp", e7: "bp", f7: "bp", g7: "bp", h7: "bp",
    a8: "br", b8: "bn", c8: "bb", d8: "bq", e8: "bk", f8: "bb", g8: "bn", h8: "br",
  };

  return (
    <div className="App">
      <Board data={data}/>
    </div>
  );
}

export default App;
