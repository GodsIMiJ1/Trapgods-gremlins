
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Shield, Sword, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  const [playerStreak, setPlayerStreak] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio context for game sounds
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  const playSound = (color: Color) => {
    if (!audioRef.current) return;
    
    const frequencies: Record<Color, number> = {
      red: 330,
      blue: 262,
      green: 392,
      yellow: 494
    };
    
    try {
      audioRef.current.src = `data:audio/wav;base64,${generateTone(frequencies[color], 0.3)}`;
      audioRef.current.play().catch(e => console.log('Audio play error:', e));
    } catch (err) {
      console.log('Audio error:', err);
    }
  };
  
  // Simple tone generator
  const generateTone = (frequency: number, duration: number): string => {
    const sampleRate = 44100;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);
    
    for (let i = 0; i < numSamples; i++) {
      samples[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate);
    }
    
    // Convert to WAV format
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    
    // Write WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);
    
    // Write samples
    for (let i = 0; i < samples.length; i++) {
      const sample = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    }
    
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  };
  
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

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
    setPlayerStreak(0);
    setMessage('Get Ready...');
    setGameStatus('starting');
    toast({
      title: 'Gremlin Gauntlet',
      description: 'Game started! Watch the pattern carefully...',
      duration: 3000,
    });
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
        playSound(color);
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
    
    // Play sound on click
    playSound(clickedColor);

    const currentPlayerIndex = playerSequence.length;
    const newPlayerSequence = [...playerSequence, clickedColor];
    setPlayerSequence(newPlayerSequence);

    if (sequence[currentPlayerIndex] === clickedColor) {
      // Correct move
      if (newPlayerSequence.length === sequence.length) {
        // Round complete
        const newStreak = playerStreak + 1;
        setPlayerStreak(newStreak);
        
        if (newStreak % 3 === 0 && newStreak > 0) {
          toast({
            title: `${newStreak} Streak!`,
            description: "You're on fire!",
            duration: 2000,
          });
        }
        
        if (currentRound >= ROUNDS_TO_WIN) {
          setGameStatus('gameWon');
          setMessage(`Gauntlet Conquered! (Round ${currentRound} completed)`);
          clearAllTimeouts();
          if (onComplete) {
            toast({
              title: 'Victory!',
              description: 'You have conquered the Gauntlet!',
              duration: 5000,
            });
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
      // Wrong move
      setGameStatus('gameOver');
      setMessage(`Wrong! Game Over. (Reached Round ${currentRound})`);
      clearAllTimeouts();
      setPlayerStreak(0);
      
      toast({
        title: 'Game Over',
        description: `You reached round ${currentRound}. Try again!`,
        duration: 3000,
      });
      
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

  const getColorClass = (color: Color, isActive: boolean) => {
    const baseClasses = `w-24 h-24 rounded-lg cursor-pointer transition-all duration-200 
                        border border-neon-purple flex items-center justify-center`;
    
    const colorClasses = {
      red: `bg-red-500/50 ${isActive ? 'bg-red-500/90' : ''}`,
      blue: `bg-blue-500/50 ${isActive ? 'bg-blue-500/90' : ''}`,
      green: `bg-green-500/50 ${isActive ? 'bg-green-500/90' : ''}`,
      yellow: `bg-yellow-500/50 ${isActive ? 'bg-yellow-500/90' : ''}`
    };
    
    const stateClasses = isActive 
      ? 'scale-105 opacity-100 shadow-glow' 
      : 'opacity-70';
    
    const interactionClasses = isPlayerInteractionDisabled 
      ? 'cursor-not-allowed opacity-40' 
      : 'hover:opacity-85 hover:scale-103 hover:shadow-neon';
    
    return `${baseClasses} ${colorClasses[color]} ${stateClasses} ${interactionClasses}`;
  };

  const renderIcon = (color: Color) => {
    if (color === 'red') return <Sword className="opacity-50" size={28} />;
    if (color === 'blue') return <Shield className="opacity-50" size={28} />;
    if (color === 'green') return <Star className="opacity-50" size={28} />;
    return null;
  };

  return (
    <div className="relative bg-dark-surface/50 backdrop-blur-lg p-8 rounded-lg border border-neon-purple animate-pulse-slow">
      <div className="absolute top-4 right-4 opacity-10 text-4xl font-pixel text-neon-purple">
        👁️
      </div>
      <div className="absolute bottom-2 right-2 opacity-5 text-sm font-pixel text-neon-green">
        NODE
      </div>
      <h2 className="text-2xl font-pixel text-neon-purple mb-4 animate-glitch flex items-center">
        <span className="mr-2">Gremlin Gauntlet</span>
        {playerStreak > 0 && (
          <span className="text-sm bg-neon-purple/20 px-2 py-1 rounded-full text-neon-green">
            {playerStreak}x
          </span>
        )}
      </h2>
      
      <div className={`mb-4 text-center font-pixel ${gameStatus === 'gameWon' ? 'text-neon-green' : ''} ${gameStatus === 'gameOver' ? 'text-neon-pink' : 'text-neon-green'}`}>
        {message}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {COLORS.map((color) => (
          <div
            key={color}
            onClick={() => handlePlayerClick(color)}
            className={getColorClass(color, activeColor === color)}
            role="button"
            aria-disabled={isPlayerInteractionDisabled}
          >
            {renderIcon(color)}
          </div>
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
          <div className="mt-4 flex justify-center items-center">
            <p className="text-neon-green font-pixel">
              Round: {currentRound} / {ROUNDS_TO_WIN}
            </p>
            <div className="ml-3 flex space-x-1">
              {Array.from({ length: ROUNDS_TO_WIN }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-full ${i < currentRound ? 'bg-neon-green' : 'bg-dark-surface border border-neon-green/20'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml,...')] opacity-5 mix-blend-overlay"></div>
    </div>
  );
};

export default GremlinGauntletGame;
