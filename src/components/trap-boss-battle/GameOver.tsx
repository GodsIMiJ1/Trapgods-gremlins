
import React from 'react';
import { BOSS_NAME } from './types';

interface GameOverProps {
  finalOutcome: 'win' | 'lose' | null;
  playerScore: number;
  onPlayAgain: () => void;
  onFinishGame?: () => void;
  hasEnergy?: boolean;
}

const GameOver: React.FC<GameOverProps> = ({
  finalOutcome,
  playerScore,
  onPlayAgain,
  onFinishGame,
  hasEnergy = true
}) => {
  return (
    <div className="text-center space-y-4">
      <h3 className="text-2xl text-neon-purple font-pixel">Battle Over!</h3>
      <p className={`text-xl font-bold ${finalOutcome === 'win' ? 'text-green-400' : 'text-red-400'}`}>
        {finalOutcome === 'win'
          ? `You roasted ${BOSS_NAME}! Victory!`
          : `${BOSS_NAME}'s roasts were too much! You Lose!`}
      </p>
      <p className="text-neon-green">Final Score: {playerScore}</p>
      <div className="space-x-4">
        <button
          onClick={onPlayAgain}
          disabled={!hasEnergy}
          className={`bg-neon-purple hover:bg-neon-purple/80 text-white font-pixel px-8 py-4 rounded-lg transition-colors ${!hasEnergy ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {hasEnergy ? 'Play Again' : 'No Energy Left'}
        </button>
        {onFinishGame && (
          <button
            onClick={onFinishGame}
            className="bg-background/50 hover:bg-background/70 text-neon-green font-pixel px-8 py-4 rounded-lg
                     border border-neon-purple/30 transition-colors"
          >
            Finish Game
          </button>
        )}
        {!hasEnergy && (
          <p className="text-neon-pink mt-4 text-sm">
            Come back tomorrow for more roasts!
          </p>
        )}
      </div>
    </div>
  );
};

export default GameOver;
