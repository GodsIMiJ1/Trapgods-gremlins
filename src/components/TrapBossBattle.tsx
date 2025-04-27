
import React, { useState, useEffect } from 'react';
import OpenAIKeyInput from './OpenAIKeyInput';
import BossRoast from './trap-boss-battle/BossRoast';
import PlayerResponse from './trap-boss-battle/PlayerResponse';
import GameStatus from './trap-boss-battle/GameStatus';
import GameOver from './trap-boss-battle/GameOver';
import { useTrapBossBattle } from '../hooks/useTrapBossBattle';
import { useOpenAIBattle } from '../hooks/useOpenAIBattle';

interface TrapBossBattleProps {
  onFinishGame?: () => void;
}

const TrapBossBattle: React.FC<TrapBossBattleProps> = ({ onFinishGame }) => {
  const [playerResponse, setPlayerResponse] = useState('');
  const {
    currentRound,
    playerScore,
    gameStatus,
    roundResult,
    finalOutcome,
    startGame,
    handleRoundEnd,
    setGameStatus
  } = useTrapBossBattle(onFinishGame);

  const {
    bossRoast,
    openAIService,
    initializeOpenAI,
    generateRoast,
    evaluateResponse
  } = useOpenAIBattle();

  useEffect(() => {
    if (gameStatus === 'bossTurn' && currentRound > 0) {
      generateRoast().then(() => {
        setGameStatus('playerTurn');
      });
    }
  }, [gameStatus, currentRound, generateRoast, setGameStatus]);

  const handlePlayerResponse = async () => {
    if (!playerResponse.trim()) return;

    const quality = await evaluateResponse(playerResponse);
    if (quality) {
      handleRoundEnd(quality);
      setPlayerResponse('');
    }
  };

  const handleApiKeySubmit = (apiKey: string) => {
    initializeOpenAI(apiKey);
    startGame();
  };

  const renderContent = () => {
    if (!openAIService) {
      return (
        <div className="text-center">
          <OpenAIKeyInput onSubmit={handleApiKeySubmit} />
        </div>
      );
    }

    switch (gameStatus) {
      case 'idle':
        return (
          <div className="text-center">
            <p className="text-neon-green mb-4">Ready to face Lil' Lil'?</p>
            <button
              onClick={startGame}
              className="bg-neon-purple hover:bg-neon-purple/80 text-white font-pixel px-8 py-4 rounded-lg transition-colors"
            >
              Start Battle
            </button>
          </div>
        );

      case 'bossTurn':
      case 'playerTurn':
      case 'roundEnd':
        return (
          <div className="space-y-6">
            <GameStatus currentRound={currentRound} playerScore={playerScore} />
            <BossRoast roast={bossRoast} gameStatus={gameStatus} />
            
            {gameStatus === 'playerTurn' && (
              <PlayerResponse
                response={playerResponse}
                onResponseChange={setPlayerResponse}
                onSubmit={handlePlayerResponse}
              />
            )}

            {roundResult && gameStatus === 'roundEnd' && (
              <div className="text-4xl text-center font-bold animate-bounce">
                {roundResult}
              </div>
            )}
          </div>
        );

      case 'gameOver':
        return (
          <GameOver
            finalOutcome={finalOutcome}
            playerScore={playerScore}
            onPlayAgain={startGame}
            onFinishGame={onFinishGame}
          />
        );
    }
  };

  return (
    <div className="bg-background/50 backdrop-blur-lg p-8 rounded-lg border border-neon-purple/30">
      <h2 className="text-2xl font-pixel text-neon-purple mb-6 text-center">Trap Boss Battle</h2>
      {renderContent()}
    </div>
  );
};

export default TrapBossBattle;
