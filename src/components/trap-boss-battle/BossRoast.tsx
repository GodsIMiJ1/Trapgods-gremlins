
import React from 'react';
import { BOSS_NAME } from './types';

interface BossRoastProps {
  roast: string;
  gameStatus: string;
}

// Helper function to highlight catchphrases
const highlightCatchphrases = (text: string) => {
  const catchphrases = [
    "JUUWRRAYYY!",
    "izzzer naw..?",
    "Look at em doe!",
    "oooowwuhh!"
  ];

  let formattedText = text;

  // Replace catchphrases with highlighted versions
  catchphrases.forEach(phrase => {
    formattedText = formattedText.replace(
      new RegExp(phrase, 'gi'),
      `<span class="text-neon-pink font-bold animate-pulse-slow">${phrase}</span>`
    );
  });

  return formattedText;
};

const BossRoast: React.FC<BossRoastProps> = ({ roast, gameStatus }) => {
  // Format the roast with highlighted catchphrases
  const formattedRoast = roast !== "..." ? highlightCatchphrases(roast) : roast;

  return (
    <div className="text-center space-y-2">
      <div className="text-neon-purple font-bold flex items-center justify-center gap-2">
        <span className="text-xl">👑</span>
        <span>{BOSS_NAME} says:</span>
      </div>
      <div className="bg-background/50 p-4 rounded-lg border border-neon-purple/30">
        {gameStatus === 'bossTurn' && roast === "..." ? (
          <span className="italic text-neon-green/70">Lil' Lil' is thinking...</span>
        ) : (
          <div
            className="font-glitch text-lg"
            dangerouslySetInnerHTML={{ __html: formattedRoast }}
          />
        )}
      </div>
    </div>
  );
};

export default BossRoast;
