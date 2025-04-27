
import React, { useState, useEffect, useCallback } from 'react';
import OpenAIKeyInput from './OpenAIKeyInput';
import { OpenAIService } from '../services/openai';
import BossRoast from './trap-boss-battle/BossRoast';
import PlayerResponse from './trap-boss-battle/PlayerResponse';
import GameStatus from './trap-boss-battle/GameStatus';
import GameOver from './trap-boss-battle/GameOver';
import { 
  GameStatus as GameStatusType,
  TOTAL_ROUNDS,
  WIN_SCORE_THRESHOLD
} from './trap-boss-battle/types';

interface TrapBossBattleProps {
  onFinishGame?: () => void;
}

const TrapBossBattle: React.FC<TrapBossBattleProps> = ({ onFinishGame }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [bossRoast, setBossRoast] = useState('');
  const [playerResponse, setPlayerResponse] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatusType>('idle');
  const [roundResult, setRoundResult] = useState<string | null>(null);
  const [finalOutcome, setFinalOutcome] = useState<'win' | 'lose' | null>(null);
  const [openAIService, setOpenAIService] = useState<OpenAIService | null>(null);

  const generateRoundData = useCallback(async () => {
    if (!openAIService) return;
    
    console.log(`Generating data for round ${currentRound}`);
    setBossRoast("...");
    
    try {
      const newRoast = await openAIService.generateRoast();
      setBossRoast(newRoast);
      setGameStatus('playerTurn');
      setRoundResult(null);
      console.log("Boss roast delivered, player's turn.");
    } catch (error) {
      console.error('Error generating roast:', error);
      setBossRoast("Your code's so buggy, even console.log gave up!");
      setGameStatus('playerTurn');
    }
  }, [currentRound, openAIService]);

  const handlePlayerResponse = async () => {
    if (!openAIService || !playerResponse.trim()) return;

    const quality = await openAIService.evaluateResponse(playerResponse);
    const scoreDelta = quality === 'good' ? 2 : quality === 'mid' ? 1 : 0;
    setPlayerScore(prevScore => prevScore + scoreDelta);
    setRoundResult(quality === 'good' ? '🔥' : quality === 'mid' ? 'meh' : 'weak sauce');
    setGameStatus('roundEnd');
    setPlayerResponse('');
  };

  const startGame = () => {
    console.log("Starting new battle...");
    setCurrentRound(1);
    setPlayerScore(0);
    setFinalOutcome(null);
    setRoundResult(null);
    setGameStatus('bossTurn');
  };

  const handleApiKeySubmit = (apiKey: string) => {
    setOpenAIService(new OpenAIService(apiKey));
    startGame();
  };

  useEffect(() => {
    if (gameStatus === 'bossTurn' && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      generateRoundData();
    }
  }, [gameStatus, currentRound, generateRoundData]);

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
