
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
    <div className="glass-card p-8 rounded-lg">
      <h2 className="text-2xl font-pixel text-neon-green mb-4">// TRAP_STREETS.exe</h2>
      <div className="flex justify-between mb-4">
        <span className="font-glitch text-neon-pink">SCORE: {score}</span>
        {!isGameOver && isRunning && <span className="font-glitch text-cyber-blue">TIME: {timeLeft}s</span>}
      </div>
      <div className="flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          className="border border-neon-purple/30 bg-dark-background rounded"
        />
        {!isRunning && (
          <Button 
            onClick={startNewGame} 
            disabled={isRunning}
            className="mt-4 font-pixel"
          >
            {isGameOver ? 'RETRY.exe' : 'LAUNCH.exe'}
          </Button>
        )}
        <p className="text-neon-green text-sm font-glitch mt-2">
          &lt; Use Left/Right Arrow keys to dodge the traps. Survive for 30 seconds! &gt;
        </p>
      </div>
    </div>
  );
};

export default TrapStreetsGame;
