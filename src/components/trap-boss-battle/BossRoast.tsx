
import React from 'react';
import { BOSS_NAME } from './types';

interface BossRoastProps {
  roast: string;
  gameStatus: string;
}

const BossRoast: React.FC<BossRoastProps> = ({ roast, gameStatus }) => {
  return (
    <div className="text-center space-y-2">
      <div className="text-neon-purple font-bold">{BOSS_NAME} says:</div>
      <div className="bg-background/50 p-4 rounded-lg border border-neon-purple/30">
        {gameStatus === 'bossTurn' && roast === "..." ? (
          <span className="italic text-neon-green/70">Lil' Lil' is thinking...</span>
        ) : (
          roast
        )}
      </div>
    </div>
  );
};

export default BossRoast;
