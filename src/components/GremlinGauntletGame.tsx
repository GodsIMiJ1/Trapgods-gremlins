import React, { useState, useEffect, useCallback, useRef } from 'react';

const COLORS = ['red', 'blue', 'green', 'yellow'] as const;
const ROUNDS_TO_WIN = 5;
const FLASH_DURATION = 400;
const PAUSE_DURATION = 250;

type Color = typeof COLORS[number];
type GameStatus = 'idle' | 'starting' | 'showingSequence' | 'playerTurn' | 'roundComplete' | 'gameOver' | 'gameWon';

interface GremlinGauntletGameProps {
  onComplete?: (won: boolean) => void;
}

const GremlinGauntletGame: React.FC<GremlinGauntletGameProps> = ({ onComplete }) => {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [playerSequence, setPlayerSequence] = useState<Color[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [message, setMessage] = useState('Click Start!');
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);

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
          if (onComplete) {
            onComplete(true);
          }
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
      if (onComplete) {
        onComplete(false);
      }
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
    <div className="relative bg-dark-surface/50 backdrop-blur-lg p-8 rounded-lg border border-neon-purple animate-pulse-slow">
      <div className="absolute top-4 right-4 opacity-10 text-4xl font-pixel text-neon-purple">
        👁️
      </div>
      <div className="absolute bottom-2 right-2 opacity-5 text-sm font-pixel text-neon-green">
        NODE
      </div>
      <h2 className="text-2xl font-pixel text-neon-purple mb-4 animate-glitch">Gremlin Gauntlet</h2>
      <div className={`mb-4 text-center font-pixel ${gameStatus === 'gameWon' ? 'text-neon-green' : ''} ${gameStatus === 'gameOver' ? 'text-neon-pink' : 'text-neon-green'}`}>
        {message}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {COLORS.map((color) => (
          <div
            key={color}
            onClick={() => handlePlayerClick(color)}
            className={`
              w-24 h-24 rounded-lg cursor-pointer transition-all duration-200 border border-neon-purple
              ${color === 'red' ? 'bg-red-500/50' : ''}
              ${color === 'blue' ? 'bg-blue-500/50' : ''}
              ${color === 'green' ? 'bg-green-500/50' : ''}
              ${color === 'yellow' ? 'bg-yellow-500/50' : ''}
              ${activeColor === color ? 'scale-105 opacity-100 shadow-glow' : 'opacity-70'}
              ${isPlayerInteractionDisabled ? 'cursor-not-allowed opacity-40' : 'hover:opacity-85 hover:scale-103 hover:shadow-neon'}
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
          className="bg-dark-surface hover:bg-dark-surface/80 text-neon-purple font-pixel px-8 py-4 rounded 
                   border border-neon-purple transition-all duration-300 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:shadow-neon hover:scale-103 hover:rotate-1"
        >
          {currentRound > 0 || gameStatus === 'gameOver' || gameStatus === 'gameWon' ? 'Restart Game' : 'Start Game'}
        </button>
        {currentRound > 0 && (
          <p className="mt-4 text-neon-green font-pixel">
            Round: {currentRound} / {ROUNDS_TO_WIN}
          </p>
        )}
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml,...')] opacity-5 mix-blend-overlay"></div>
    </div>
  );
};

export default GremlinGauntletGame;
