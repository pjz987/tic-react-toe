import React from 'react'

function Square (props) {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare (i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render () {
    return (
      <div>
        <div className='board-row'>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className='board-row'>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className='board-row'>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    )
  }
}

// function XorO (props) {
//   return (
//     <div>
//       <div>Who goes first?</div>
//       <button onClick={() => props.xFirst()}>X</button>
//       <button onClick={() => props.oFirst()}>O</button>
//     </div>
//   )
// }

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: null,
      xOrO: null
    }
  }

  handleClick (i) {
    if (this.state.xOrO === null) return
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  // jumpTo (step) {
  //   this.setState({
  //     stepNumber: step,
  //     xIsNext: (step % 2) === 0
  //   })
  // }

  undo () {
    const undoStep = this.state.stepNumber - 1
    this.setState({
      stepNumber: undoStep,
      xIsNext: (undoStep % 2) + this.state.xOrO === 0
    },
    console.log(this.state, 'undo-state'))
  }

  redo () {
    const redoStep = this.state.stepNumber + 1
    this.setState({
      stepNumber: redoStep,
      xIsNext: (redoStep % 2) + this.state.xOrO === 0
    })
  }

  playAgain () {
    this.setState({
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: null,
      xOrO: null
    })
  }

  xFirst () {
    this.setState({ xOrO: 0, xIsNext: true })
  }

  oFirst () {
    this.setState({ xOrO: 1, xIsNext: false })
  }

  render () {
    console.log(this.state)
    const history = this.state.history
    // const step = this.state.history.length
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    // const moves = history.map((step, move) => {
    //   const desc = move
    //     ? 'Go to move #' + move
    //     : 'Go to game start'
    //   return (
    //     <li key={move}>
    //       <button onClick={() => this.jumpTo(move)}>{desc}</button>
    //     </li>
    //   )
    // })

    let status
    if (winner) {
      status = 'Winner: ' + winner
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    const xOrO =
      <div>
        <div>Who goes first?</div>
        <button onClick={() => this.xFirst()}>X</button>
        <button onClick={() => this.oFirst()}>O</button>
      </div>

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className='game-info'>
          {this.state.xOrO === null
            ? xOrO
            : <div>{status}</div>}
          {this.state.history.length > 1 ? <button onClick={() => this.undo()}>Undo</button> : ''}
          {this.state.history.length - 1 > this.state.stepNumber ? <button onClick={this.redo.bind(this)}>Redo</button> : ''}
          {winner ? <button onClick={() => this.playAgain()}>Play Again?</button> : ''}
          {/* <ol>{moves}</ol> */}
        </div>
      </div>
    )
  }
}

// ===================================

function calculateWinner (squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

export default Game
