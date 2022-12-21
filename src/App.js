import React from "react";
import Cell from "./Cell";
import './App.css';
import ringer1 from "./Background.mp3";
import ringer2 from "./Coin.mp3";
import ringer3 from "./Winner.mp3";
import ringer4 from "./Reverse.mp3";
import ringer5 from "./Draw.mp3";
import 'animate.css';

const RED_COIN="red";
const YELLOW_COIN="yellow";
class App extends React.Component{
  state={
    values: [
      ['', '', '','', '', '',''],
      ['', '', '','', '', '',''],
      ['', '', '','', '', '',''],
      ['', '', '','', '', '',''],
      ['', '', '','', '', '',''],
      ['', '', '','', '', '',''],
    ],
    currentPlayer: '1',
    running : true,
    message:``,
    BGAudio: new Audio(ringer1),
    CoinAudio:new Audio(ringer2),
    WinningAudio:new Audio(ringer3),
    RestartAudio:new Audio(ringer4),
    DrawAudio:new Audio(ringer5)
  }
  //sound
  sound(audio){
    audio.autoplay=true;
    audio.play();
  }



  //cell
  isAvailable = (row, cell) => {
    let available = false;
    if (this.state.values[row][cell] === '') {
      available = true;
    }
    return available;
  };

  changePlayer= ()=> {
    this.setState({currentPlayer : (this.state.currentPlayer === '1') ? '2' : '1'});
  };

  availableCell = (row, cell) => {
    let myRow=5;
    const currentValues = this.state.values;
    if((this.state.running)){
      while(!this.isAvailable(myRow,cell) && !(myRow<0)){
        myRow--;
      }
      currentValues[myRow][cell] = this.state.currentPlayer;
      this.setState({
        values: currentValues
      });
      this.setMessage();
      this.sound(this.state.CoinAudio);
      this.changePlayer();
    }

  };
  colorOfCell=(row,cell)=>{
    let color='';
    if (this.state.values[row][cell] === '1'){
      color=RED_COIN;
    }
    else if (this.state.values[row][cell] === '2'){
      color=YELLOW_COIN;
    }
    return color;
  };

  //conditions
  checkVertical(board) {
    // Check only if row is 3 or greater
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (!this.isAvailable(r,c)) {
          if (board[r][c] === board[r - 1][c] &&
              board[r][c] === board[r - 2][c] &&
              board[r][c] === board[r - 3][c]) {
            return board[r][c];
          }
        }
      }
    }
  }

  checkHorizontal(board) {
    // Check only if column is 3 or less
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (!this.isAvailable(r,c)) {
          if (board[r][c] === board[r][c + 1] &&
              board[r][c] === board[r][c + 2] &&
              board[r][c] === board[r][c + 3]) {
            return board[r][c];
          }
        }
      }
    }
  }

  checkDiagonalRight(board) {
    // Check only if row is 3 or greater AND column is 3 or less
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (!this.isAvailable(r,c)) {
          if (board[r][c] === board[r - 1][c + 1] &&
              board[r][c] === board[r - 2][c + 2] &&
              board[r][c] === board[r - 3][c + 3]) {
            return board[r][c];
          }
        }
      }
    }
  }

  checkDiagonalLeft(board) {
    // Check only if row is 3 or greater AND column is 3 or greater
    for (let r = 3; r < 6; r++) {
      for (let c = 3; c < 7; c++) {
        if (!this.isAvailable(r,c)) {
          if (board[r][c] === board[r - 1][c - 1] &&
              board[r][c] === board[r - 2][c - 2] &&
              board[r][c] === board[r - 3][c - 3]) {
            return board[r][c];
          }
        }
      }
    }
  }

  checkDraw(board) {
    let flag=false;
    for (let r = 0; r < 6; r++) {
      if (!board[r].includes('')){
        flag=true;
      }
      else {
        flag=false;
        break;
      }
    }
    return flag;
  }

  checkAll(board) {
    return this.checkVertical(board) || this.checkDiagonalRight(board) || this.checkDiagonalLeft(board) || this.checkHorizontal(board);
  }

  setMessage() {
    this.setState({message: `player ${this.state.currentPlayer}'s turn`});
    if (this.checkAll(this.state.values)) {
      this.setState({message: `player ${this.state.currentPlayer} won!`});
      this.setState({running: false});
      this.sound(this.state.WinningAudio);
    }
    else if (this.checkDraw(this.state.values)) {
      this.setState({message: `draw`});
      this.sound(this.state.DrawAudio);
    }
  }





  render() {
    return (
        <div className="App">
          <div><h1>CONNECT 4!</h1></div>
          <table>
            {
              this.state.values.map((row, rowIndex) => {
                return (
                    <tr>
                      {
                        row.map((cell, cellIndex) => {
                          return (
                              <Cell
                                  value={this.state.values[rowIndex][cellIndex] &&<div className={(this.colorOfCell(rowIndex,cellIndex))+" animate__animated animate__bounceInDown"} ></div>}
                                  row={rowIndex}
                                  cell={cellIndex}
                                  cellClicked={this.availableCell}
                                  oneSideHasWon={this.checkAll(this.state.values)}

                              />
                          );
                        })                                   }
                    </tr>
                )
              })
            }

          </table>

          <h2 className="statusText">{this.state.message}</h2>
          <div>
          <button onClick={()=>{
            this.sound(this.state.RestartAudio);
            for (let r = 0; r < 6; r++) {
              for (let c = 0; c < 7; c++) {
                this.state.values[r][c]='';
              }
            }
            this.setState({ currentPlayer: '1',
              running : true,
              message:``});}} >restart</button>
        </div>
          <div>
          <label>Background music:</label>
          </div>
          <button
              onClick={() => {
                this.state.BGAudio.loop = true;
                this.state.BGAudio.autoplay=true;
                this.state.BGAudio.play();
              }}
          >Play</button>
          <button onClick={() => (this.state.BGAudio.pause())}>Pause</button>
        </div>

    );

  }
}
export default App;