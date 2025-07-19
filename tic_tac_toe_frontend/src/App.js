import React, { useState } from 'react';
import './App.css';

// Style constants for theme and accent colors
const THEME = {
  accent: '#FFC107',
  primary: '#2196F3',
  secondary: '#4CAF50',
  background: '#fff',
  boardBorder: '#e9ecef',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
};

/**
 * Minimalist Square component for a Tic Tac Toe cell.
 */
function Square({ value, onClick, isWinning }) {
  return (
    <button
      className={`ttt-square${isWinning ? ' ttt-win-square' : ''}`}
      onClick={onClick}
      aria-label={value ? `Cell: ${value}` : 'Empty cell'}
      tabIndex={0}
      style={{
        color: value === 'X' ? THEME.primary : value === 'O' ? THEME.accent : undefined,
        borderColor: isWinning ? THEME.accent : THEME.boardBorder,
        fontWeight: isWinning ? 700 : 400
      }}
    >
      {value}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * The main tic tac toe UI, handles board, state, winner detection, UI layout.
 */
function App() {
  // 'X' always goes first
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [step, setStep] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  // Calculate derived state
  const current = history[step];
  const winnerInfo = calculateWinner(current);
  const isDraw = !winnerInfo && current.every(Boolean);

  // PUBLIC_INTERFACE
  // Handles clicking a square
  function handleSquareClick(i) {
    if (winnerInfo || current[i]) return; // Block if game over or not empty

    // Only allow marking empty squares
    const board = current.slice();
    board[i] = xIsNext ? 'X' : 'O';
    setHistory(history.slice(0, step + 1).concat([board]));
    setStep(step + 1);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  // Reset the board to initial state
  function handleReset() {
    setHistory([Array(9).fill(null)]);
    setStep(0);
    setXIsNext(true);
  }

  // Square rendering
  function renderSquare(i) {
    const isWinning = winnerInfo?.line?.includes(i);
    return (
      <Square
        key={i}
        value={current[i]}
        onClick={() => handleSquareClick(i)}
        isWinning={isWinning}
      />
    );
  }

  // Status line
  let status;
  if (winnerInfo) {
    status = (
      <span>
        <span style={{ color: winnerInfo.winner === 'X' ? THEME.primary : THEME.accent, fontWeight: 600 }}>
          {winnerInfo.winner}
        </span> wins!
      </span>
    );
  } else if (isDraw) {
    status = (
      <span>
        <span style={{ color: THEME.secondary, fontWeight: 600 }}>Draw!</span>
      </span>
    );
  } else {
    status = (
      <span>
        Turn:&nbsp;
        <span style={{
          color: xIsNext ? THEME.primary : THEME.accent,
          fontWeight: 600
        }}>
          {xIsNext ? 'X' : 'O'}
        </span>
      </span>
    );
  }

  return (
    <div className="ttt-root" style={{
      minHeight: '100vh',
      background: THEME.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="ttt-card" style={{
        background: '#fff',
        boxShadow: THEME.boxShadow,
        padding: '2.5rem 2rem 2rem 2rem',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '320px'
      }}>
        <div className="ttt-status" style={{
          marginBottom: '1.25rem',
          fontSize: '1.25rem',
          letterSpacing: '0.04em'
        }}>
          {status}
        </div>
        <div className="ttt-board" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 60px)',
          gridTemplateRows: 'repeat(3, 60px)',
          gap: '0.6rem',
          marginBottom: '1.5rem'
        }}>
          {Array(9).fill(0).map((_, i) => renderSquare(i))}
        </div>
        <button
          className="ttt-reset-btn"
          onClick={handleReset}
          aria-label="Reset Game"
          style={{
            background: THEME.primary,
            color: '#fff',
            border: 'none',
            padding: '0.65rem 2.3rem',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '1rem',
            letterSpacing: '0.04em',
            cursor: 'pointer',
            boxShadow: THEME.boxShadow,
            transition: 'background 0.16s'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Calculates if there's a winner on the tic tac toe board.
 * @param {Array} squares - The tic tac toe board as a flat array of 9 elements (X, O, or null)
 * @returns {null|{winner: 'X'|'O', line: number[]}} - Winner and winning line, or null.
 */
function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

export default App;
