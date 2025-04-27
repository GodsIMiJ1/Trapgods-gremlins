
import React, { useState, useEffect } from 'react';
import BossRoast from './trap-boss-battle/BossRoast';
import PlayerResponse from './trap-boss-battle/PlayerResponse';
import GameStatus from './trap-boss-battle/GameStatus';
import GameOver from './trap-boss-battle/GameOver';
import { useTrapBossBattle } from '../hooks/useTrapBossBattle';
import { useOpenAIBattle } from '../hooks/useOpenAIBattle';
import { useEnergySystem } from '../hooks/useEnergySystem';

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
    startGame: originalStartGame,
    handleRoundEnd,
    setGameStatus
  } = useTrapBossBattle(onFinishGame);

  const {
    bossRoast,
    generateRoast,
    evaluateResponse,
    isLoading
  } = useOpenAIBattle();

  const {
    energy,
    maxEnergy,
    consumeEnergy,
    hasEnergy,
    isInitialized
  } = useEnergySystem();

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

  // Wrap the original startGame with energy check
  const startGame = () => {
    if (hasEnergy()) {
      consumeEnergy();
      originalStartGame();
    } else {
      alert("❌ Out of Roasts! Come back tomorrow to roast again!");
    }
  };

  const renderContent = () => {

    switch (gameStatus) {
      case 'idle':
        return (
          <div className="text-center">
            <p className="text-neon-green mb-4">Ready to face Lil' Lil'?</p>
            <div className="mb-4">
              <p className="text-cyber-blue font-glitch mb-2">
                🔥 Roasts Left Today: {energy}/{maxEnergy}
              </p>
            </div>
            <button
              onClick={startGame}
              disabled={!hasEnergy()}
              className={`bg-neon-purple hover:bg-neon-purple/80 text-white font-pixel px-8 py-4 rounded-lg transition-colors ${!hasEnergy() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {hasEnergy() ? 'Start Battle' : 'No Energy Left'}
            </button>
            {!hasEnergy() && (
              <p className="text-neon-pink mt-2 text-sm">
                Come back tomorrow for more roasts!
              </p>
            )}
          </div>
        );

      case 'bossTurn':
      case 'playerTurn':
      case 'roundEnd':
        return (
          <div className="space-y-6">
            <GameStatus
              currentRound={currentRound}
              playerScore={playerScore}
              energy={energy}
              maxEnergy={maxEnergy}
            />
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
          <div>
            <div className="mb-4">
              <p className="text-cyber-blue font-glitch text-center">
                🔥 Roasts Left Today: {energy}/{maxEnergy}
              </p>
            </div>
            <GameOver
              finalOutcome={finalOutcome}
              playerScore={playerScore}
              onPlayAgain={startGame}
              onFinishGame={onFinishGame}
              hasEnergy={hasEnergy()}
            />
          </div>
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
