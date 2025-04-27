
import { useState, useEffect, useCallback } from 'react';
import { GameStatus, TOTAL_ROUNDS, WIN_SCORE_THRESHOLD } from '../components/trap-boss-battle/types';

export const useTrapBossBattle = (onFinishGame?: () => void) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [roundResult, setRoundResult] = useState<string | null>(null);
  const [finalOutcome, setFinalOutcome] = useState<'win' | 'lose' | null>(null);

  const startGame = useCallback(() => {
    console.log("Starting new battle...");
    setCurrentRound(1);
    setPlayerScore(0);
    setFinalOutcome(null);
    setRoundResult(null);
    setGameStatus('bossTurn');
  }, []);

  const handleRoundEnd = useCallback((quality: 'good' | 'mid' | 'weak') => {
    const scoreDelta = quality === 'good' ? 2 : quality === 'mid' ? 1 : 0;
    setPlayerScore(prev => prev + scoreDelta);
    setRoundResult(quality === 'good' ? '🔥' : quality === 'mid' ? 'meh' : 'weak sauce');
    setGameStatus('roundEnd');
  }, []);

  useEffect(() => {
    if (gameStatus === 'roundEnd') {
      console.log(`Round ${currentRound} ended. Score: ${playerScore}`);
      const transitionTimeout = setTimeout(() => {
        if (currentRound >= TOTAL_ROUNDS) {
          const outcome = playerScore >= WIN_SCORE_THRESHOLD ? 'win' : 'lose';
          setFinalOutcome(outcome);
          setGameStatus('gameOver');
          console.log(`Game Over. Final Score: ${playerScore}. Outcome: ${outcome}`);
        } else {
          setCurrentRound(prev => prev + 1);
          setGameStatus('bossTurn');
          console.log("Proceeding to next round...");
        }
      }, 2000);

      return () => clearTimeout(transitionTimeout);
    }
  }, [gameStatus, currentRound, playerScore]);

  return {
    currentRound,
    playerScore,
    gameStatus,
    roundResult,
    finalOutcome,
    startGame,
    handleRoundEnd,
    setGameStatus
  };
};
