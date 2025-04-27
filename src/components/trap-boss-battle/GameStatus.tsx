
import React from 'react';
import { TOTAL_ROUNDS } from './types';

interface GameStatusProps {
  currentRound: number;
  playerScore: number;
}

const GameStatus: React.FC<GameStatusProps> = ({ currentRound, playerScore }) => {
  return (
    <p className="text-neon-green text-center">
      Round: {currentRound} / {TOTAL_ROUNDS} | Score: {playerScore}
    </p>
  );
};

export default GameStatus;
