
import React from 'react';
import { TOTAL_ROUNDS } from './types';

interface GameStatusProps {
  currentRound: number;
  playerScore: number;
  energy?: number;
  maxEnergy?: number;
}

const GameStatus: React.FC<GameStatusProps> = ({ currentRound, playerScore, energy, maxEnergy }) => {
  return (
    <div className="text-center space-y-1">
      <p className="text-neon-green">
        Round: {currentRound} / {TOTAL_ROUNDS} | Score: {playerScore}
      </p>
      {energy !== undefined && maxEnergy !== undefined && (
        <p className="text-cyber-blue font-glitch text-sm">
          🔥 Roasts Left Today: {energy}/{maxEnergy}
        </p>
      )}
    </div>
  );
};

export default GameStatus;
