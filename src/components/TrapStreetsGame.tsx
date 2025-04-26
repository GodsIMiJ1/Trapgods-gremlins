
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { startGame } from '../utils/trapStreetsGame';
import { Button } from "@/components/ui/button";

interface TrapStreetsGameProps {
  onComplete: (won: boolean) => void;
}

const TrapStreetsGame: React.FC<TrapStreetsGameProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameCleanupRef = useRef<(() => void) | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleScoreUpdate = useCallback((newScore: number, newTimeLeft: number) => {
    setScore(newScore);
    setTimeLeft(Math.max(0, newTimeLeft));
  }, []);

  const handleGameOver = useCallback((won: boolean, finalScore: number) => {
    setIsGameOver(true);
    setScore(finalScore);
    setIsRunning(false);
    onComplete(won);
  }, [onComplete]);

  const startNewGame = () => {
    if (gameCleanupRef.current) {
      gameCleanupRef.current();
      gameCleanupRef.current = null;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      setIsGameOver(false);
      setScore(0);
      setTimeLeft(30);
      setIsRunning(true);

      gameCleanupRef.current = startGame(canvas, handleGameOver, handleScoreUpdate);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 600;
      canvas.height = 400;
    }

    return () => {
      if (gameCleanupRef.current) {
        gameCleanupRef.current();
        gameCleanupRef.current = null;
      }
    };
  }, [handleGameOver, handleScoreUpdate]);

  return (
    <div className="bg-background/50 backdrop-blur-lg p-8 rounded-lg border border-neon-purple/30">
      <h2 className="text-2xl font-pixel text-neon-purple mb-4">Trap Streets</h2>
      <div className="flex justify-between mb-4 text-neon-green">
        <span>Score: {score}</span>
        {!isGameOver && isRunning && <span>Time Left: {timeLeft}s</span>}
      </div>
      <div className="flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          className="border border-neon-purple/30 bg-background"
        />
        {!isRunning && (
          <Button 
            onClick={startNewGame} 
            disabled={isRunning}
            className="bg-neon-purple hover:bg-neon-purple/80 text-white font-pixel"
          >
            {isGameOver ? 'Try Again' : 'Start Game'}
          </Button>
        )}
        <p className="text-neon-green text-sm">
          Use Left/Right Arrow keys to dodge the red 'Roast Fails'. Survive for 30 seconds!
        </p>
      </div>
    </div>
  );
};

export default TrapStreetsGame;
