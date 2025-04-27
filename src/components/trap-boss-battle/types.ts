
export type GameStatus = 'idle' | 'bossTurn' | 'playerTurn' | 'roundEnd' | 'gameOver';
export type ResponseQuality = 'good' | 'mid' | 'weak';

export interface PlayerResponse {
  text: string;
  quality: ResponseQuality;
}

export const RESPONSE_INDICATORS: Record<ResponseQuality, string> = { 
  good: '🔥', 
  mid: 'meh', 
  weak: 'weak sauce' 
};

export const RESPONSE_SCORES: Record<ResponseQuality, number> = { 
  good: 2, 
  mid: 1, 
  weak: 0 
};

export const TOTAL_ROUNDS = 3;
export const WIN_SCORE_THRESHOLD = 4;
export const BOSS_NAME = "Lil' Lil'";
