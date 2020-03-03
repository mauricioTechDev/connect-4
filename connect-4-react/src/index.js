import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const className = 'square' + (props.highlight ? ' highlight' : '');
    return (
      <button
        className={className} onClick={props.onClick} >
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    const winLine = this.props.winLine;
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={winLine && winLine.includes(i)}
     />
   );
  }

  render() {
    // const boardSize = 6;

    let squares = [];

    for(let i = 0; i < 6; i++){
      let row = [];
      for(let j = 0; j < 7; j++){
          row.push(this.renderSquare(i * 7 + j));

      }
      squares.push(<div key={i} className="board-row">{row}</div>);
    }
    return (
      <div>{squares}</div>
    );
  }
}
// TOP LEVEL GAME COMPONENT
class Game extends React.Component {
  // initiating the state with CONSTRUCTOR
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(42).fill(null),
        isAscending: true
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  };

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1];
    const squares = current.squares.slice()
    if (calculateWinner(squares).winner || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        // Store the index of the latest moved square
        latestMoveSquare: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      XIsNext: (step % 2) === 0
    });
  }
  handleSortToggle(){
    this.setState({
      isAscending: !this.state.isAscending
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winInfo = calculateWinner(current.squares);
    const winner = winInfo.winner;

    let moves = history.map((step, move) => {
      const latestMoveSquare = step.latestMoveSquare;
      const col = 1 + latestMoveSquare % 3;
      const row = 1 + Math.floor(latestMoveSquare / 3);
      const description = move ?
      `Go to move # ${move} (${col}, ${row})` :
      'Go to game start';

      return (
        <li key={move}>
        {/* Bold the currentyl selected item */}
          <button
          className={move === this.state.stepNumber ? 'move-list-item-selected' : ''}
          onClick={() => this.jumpTo(move)}>{description}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      if (winInfo.isDraw) {
      status = "It's a Draw!!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    }

    const isAscending = this.state.isAscending;
    if (isAscending){
      moves.reverse()
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winLine={winInfo.line}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleSortToggle()}>
            {isAscending ? 'ascending' : 'descending'}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}



// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return{
        winner: squares[a],
        line: lines[i],
        isDraw: false,
      }
    }
  }

  let isDraw = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      isDraw = false;
      break;
    }
  }
  return {
      winner: null,
      line: null,
      isDraw: isDraw,
    };
 }



 checkVertical(board) {
  // Check only if row is 3 or greater
  for (let r = 3; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
      if (board[r][c]) {
        if (board[r][c] === board[r - 1][c] &&
            board[r][c] === board[r - 2][c] &&
            board[r][c] === board[r - 3][c]) {
          return board[r][c];
        }
      }
    }
  }
}
