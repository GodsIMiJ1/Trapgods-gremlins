
import React, { useState, useEffect, useRef, useCallback } from 'react';

const COLORS = ['red', 'blue', 'green', 'yellow'] as const;
const ROUNDS_TO_WIN = 5;
const FLASH_DURATION = 400;
const PAUSE_DURATION = 250;

type Color = typeof COLORS[number];
type GameStatus = 'idle' | 'starting' | 'showingSequence' | 'playerTurn' | 'roundComplete' | 'gameOver' | 'gameWon';

const GremlinGauntletGame = () => {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [playerSequence, setPlayerSequence] = useState<Color[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [message, setMessage] = useState('Click Start!');

  const timeoutRef = useRef<number[]>([]);

  const clearAllTimeouts = () => {
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
    setActiveColor(null);
  };

  const getRandomColor = (): Color => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  };

  const startGame = () => {
    clearAllTimeouts();
    setSequence([]);
    setPlayerSequence([]);
    setCurrentRound(0);
    setMessage('Get Ready...');
    setGameStatus('starting');
  };

  const nextRound = useCallback(() => {
    if (gameStatus === 'gameWon') return;

    setGameStatus('showingSequence');
    setPlayerSequence([]);

    const nextSequence = [...sequence, getRandomColor()];
    setSequence(nextSequence);
    setCurrentRound(prevRound => prevRound + 1);

    flashSequence(nextSequence);
  }, [sequence, gameStatus]);

  const flashSequence = (seq: Color[]) => {
    let delay = PAUSE_DURATION;
    setMessage('Watch carefully...');

    seq.forEach((color, index) => {
      const flashOnId = setTimeout(() => {
        setActiveColor(color);
      }, delay);
      timeoutRef.current.push(flashOnId);

      delay += FLASH_DURATION;

      const flashOffId = setTimeout(() => {
        setActiveColor(null);
      }, delay);
      timeoutRef.current.push(flashOffId);

      delay += PAUSE_DURATION;

      if (index === seq.length - 1) {
        const playerTurnId = setTimeout(() => {
          setGameStatus('playerTurn');
          setMessage('Your Turn!');
        }, delay);
        timeoutRef.current.push(playerTurnId);
      }
    });
  };

  const handlePlayerClick = (clickedColor: Color) => {
    if (gameStatus !== 'playerTurn') return;

    const currentPlayerIndex = playerSequence.length;
    const newPlayerSequence = [...playerSequence, clickedColor];
    setPlayerSequence(newPlayerSequence);

    if (sequence[currentPlayerIndex] === clickedColor) {
      if (newPlayerSequence.length === sequence.length) {
        if (currentRound >= ROUNDS_TO_WIN) {
          setGameStatus('gameWon');
          setMessage(`Gauntlet Conquered! (Round ${currentRound} completed)`);
          clearAllTimeouts();
        } else {
          setGameStatus('roundComplete');
          setMessage('Correct! Next round...');
          const nextRoundTimer = setTimeout(() => {
            nextRound();
          }, 1000);
          timeoutRef.current.push(nextRoundTimer);
        }
      }
    } else {
      setGameStatus('gameOver');
      setMessage(`Wrong! Game Over. (Reached Round ${currentRound})`);
      clearAllTimeouts();
    }
  };

  useEffect(() => {
    if (gameStatus === 'starting') {
      const startTimer = setTimeout(() => {
        nextRound();
      }, 1000);
      timeoutRef.current.push(startTimer);
    }
  }, [gameStatus, nextRound]);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  const isPlayerInteractionDisabled = gameStatus !== 'playerTurn';
  const isGameInProgress = gameStatus !== 'idle' && gameStatus !== 'gameOver' && gameStatus !== 'gameWon';

  return (
    <div className="bg-background/50 backdrop-blur-lg p-8 rounded-lg border border-neon-purple/30">
      <h2 className="text-2xl font-pixel text-neon-purple mb-4">Gremlin Gauntlet</h2>
      <div className={`mb-4 text-center ${gameStatus === 'gameWon' ? 'text-green-500' : ''} ${gameStatus === 'gameOver' ? 'text-red-500' : 'text-neon-green'}`}>
        {message}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {COLORS.map((color) => (
          <div
            key={color}
            onClick={() => handlePlayerClick(color)}
            className={`
              w-24 h-24 rounded-lg cursor-pointer transition-all duration-200
              ${color === 'red' ? 'bg-red-500' : ''}
              ${color === 'blue' ? 'bg-blue-500' : ''}
              ${color === 'green' ? 'bg-green-500' : ''}
              ${color === 'yellow' ? 'bg-yellow-500' : ''}
              ${activeColor === color ? 'scale-105 opacity-100 shadow-glow' : 'opacity-70'}
              ${isPlayerInteractionDisabled ? 'cursor-not-allowed opacity-40' : 'hover:opacity-85 hover:scale-103'}
            `}
            role="button"
            aria-disabled={isPlayerInteractionDisabled}
          />
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={startGame}
          disabled={isGameInProgress}
          className="bg-neon-purple hover:bg-neon-purple/80 text-white font-pixel px-8 py-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentRound > 0 || gameStatus === 'gameOver' || gameStatus === 'gameWon' ? 'Restart Game' : 'Start Game'}
        </button>
        {currentRound > 0 && (
          <p className="mt-4 text-neon-green">
            Round: {currentRound} / {ROUNDS_TO_WIN}
          </p>
        )}
      </div>
    </div>
  );
};

export default GremlinGauntletGame;
