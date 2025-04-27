
export const PLAYER = {
  WIDTH: 30,
  HEIGHT: 30,
  SPEED: 5,
  COLOR: '#39ff14', // Bright neon green
  BORDER: '#ffffff', // White border
} as const;

export const OBSTACLE = {
  WIDTH: 40,
  HEIGHT: 20,
  SPEED: 3,
  COLOR: '#ff00ff', // Neon pink
  BORDER: '#ffffff', // White border
  SPAWN_RATE: 1000, // Milliseconds between spawns
} as const;

export const GAME = {
  WIN_TIME_SECONDS: 30,
  BACKGROUND_COLOR: '#1a1a1a',
  GRID_COLOR: '#333333',
  GRID_SIZE: 50,
} as const;
