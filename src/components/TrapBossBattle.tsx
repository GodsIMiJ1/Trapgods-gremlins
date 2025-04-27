import React, { useState, useEffect, useCallback } from 'react';
import { Textarea } from "@/components/ui/textarea";
import OpenAIKeyInput from './OpenAIKeyInput';
import { OpenAIService } from '../services/openai';

// Constants
const BOSS_NAME = "Lil' Lil'";
const BOSS_ROASTS = [
  "Yo breath smell like WiFi lag!",
  "Did you get dressed in the dark, fam?",
  "Are your sneakers velcro? 'Cause you ain't got no laces.",
  "I've seen better comebacks on a broken trampoline.",
  "Your flow is so weak, it makes dial-up look fast.",
  "You look like you search for 'how to boil water' on Google.",
  "Is that your face or did you run into a parked car?",
];

type ResponseQuality = 'good' | 'mid' | 'weak';
type GameStatus = 'idle' | 'bossTurn' | 'playerTurn' | 'roundEnd' | 'gameOver';

interface PlayerResponse {
  text: string;
  quality: ResponseQuality;
}

const ALL_PLAYER_RESPONSES: PlayerResponse[] = [
  // Good Responses (Score: 2)
  { text: "My comeback is loading... unlike your last hit single.", quality: 'good' },
  { text: "I've heard better roasts from a toaster oven.", quality: 'good' },
  { text: "Was that supposed to hurt? My grandma knits meaner sweaters.", quality: 'good' },
  { text: "Weak sauce? Nah fam, you're the whole expired condiment rack.", quality: 'good' },
  { text: "Even my GPS has a better sense of direction than your insults.", quality: 'good' },

  // Mid Responses (Score: 1)
  { text: "Okay, okay, that was... definitely a sentence.", quality: 'mid' },
  { text: "Takes one to know one, I guess?", quality: 'mid' },
  { text: "Is that really the best you got?", quality: 'mid' },
  { text: "Alright, simmer down now, teacup.", quality: 'mid' },

  // Weak Responses (Score: 0)
  { text: "Uh... yeah, what you said!", quality: 'weak' },
  { text: "I'm rubber, you're glue...", quality: 'weak' },
  { text: "*stares blankly*", quality: 'weak' },
  { text: "My cat has better insults.", quality: 'weak' },
];

const RESPONSE_INDICATORS: Record<ResponseQuality, string> = { good: '🔥', mid: 'meh', weak: 'weak sauce' };
const RESPONSE_SCORES: Record<ResponseQuality, number> = { good: 2, mid: 1, weak: 0 };
const TOTAL_ROUNDS = 3;
const WIN_SCORE_THRESHOLD = 4;

const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

interface TrapBossBattleProps {
  onFinishGame?: () => void;
}

const TrapBossBattle: React.FC<TrapBossBattleProps> = ({ onFinishGame }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [bossRoast, setBossRoast] = useState('');
  const [playerResponse, setPlayerResponse] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
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
    const scoreDelta = RESPONSE_SCORES[quality];
    setPlayerScore(prevScore => prevScore + scoreDelta);
    setRoundResult(RESPONSE_INDICATORS[quality]);
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
    let cleanupTimeout = () => { };
    if (gameStatus === 'bossTurn' && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      cleanupTimeout = generateRoundData();
    }
    return cleanupTimeout;
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
            <p className="text-neon-green mb-4">Ready to face {BOSS_NAME}?</p>
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
            <p className="text-neon-green text-center">
              Round: {currentRound} / {TOTAL_ROUNDS} | Score: {playerScore}
            </p>
            <div className="text-center space-y-2">
              <div className="text-neon-purple font-bold">{BOSS_NAME} says:</div>
              <div className="bg-background/50 p-4 rounded-lg border border-neon-purple/30">
                {gameStatus === 'bossTurn' && bossRoast === "..." ? (
                  <span className="italic text-neon-green/70">Lil' Lil' is thinking...</span>
                ) : (
                  bossRoast
                )}
              </div>
            </div>

            {gameStatus === 'playerTurn' && (
              <div className="space-y-2">
                <Textarea
                  value={playerResponse}
                  onChange={(e) => setPlayerResponse(e.target.value)}
                  placeholder="Type your response..."
                  className="w-full bg-background/50 border-neon-purple/30"
                />
                <button
                  onClick={handlePlayerResponse}
                  disabled={!playerResponse.trim()}
                  className="w-full bg-neon-purple hover:bg-neon-purple/80 disabled:opacity-50 
                           disabled:cursor-not-allowed text-white font-pixel px-8 py-4 rounded-lg transition-colors"
                >
                  Drop That Beat
                </button>
              </div>
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
                onClick={startGame}
                className="bg-neon-purple hover:bg-neon-purple/80 text-white font-pixel px-8 py-4 rounded-lg transition-colors"
              >
                Play Again
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
            </div>
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
