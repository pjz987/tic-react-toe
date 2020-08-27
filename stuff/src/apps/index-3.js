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

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: Math.random() >= 0.5,
      xOrO: null,
      player: null,
      first: true
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
    }, () => this.aiClick())
  }

  aiClick () {
    if (this.state.player === 'X' && this.state.xIsNext) return
    if (this.state.player === 'O' && !this.state.xIsNext) return
    setTimeout(() => {
      const history = this.state.history.slice(0, this.state.stepNumber + 1)
      const current = history[history.length - 1]
      const freeSquares = []
      for (let i = 0; i < current.squares.length; i++) {
        if (current.squares[i] === null) freeSquares.push(i)
      }
      const j = freeSquares.sort((a, b) => 0.5 - Math.random()).pop()
      this.handleClick(j)
    }, 500)
  }

  undo () {
    const undoStep = this.state.stepNumber - 1
    this.setState({
      stepNumber: undoStep,
      xIsNext: (undoStep % 2) + this.state.xOrO === 0
    })
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
      xIsNext: Math.random() >= 0.5,
      xOrO: null
    })
  }

  xFirst () {
    this.setState({ xOrO: 0, player: 'X' })
    if (!this.state.xIsNext) this.aiClick()
  }

  oFirst () {
    this.setState({ xOrO: 1, player: 'O' })
    if (this.state.xIsNext) this.aiClick()
  }

  render () {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

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
        </div>
      </div>
    )
  }
}

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
