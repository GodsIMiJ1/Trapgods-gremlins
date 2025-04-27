
import { GAME } from './constants';

export const clearCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.clearRect(0, 0, width, height);
  
  // Draw background
  ctx.fillStyle = GAME.BACKGROUND_COLOR;
  ctx.fillRect(0, 0, width, height);
  
  // Draw grid
  ctx.strokeStyle = GAME.GRID_COLOR;
  ctx.lineWidth = 1;
  
  // Vertical grid lines
  for (let x = 0; x <= width; x += GAME.GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  // Horizontal grid lines
  for (let y = 0; y <= height; y += GAME.GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

export const drawGameOver = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  gameWon: boolean, 
  score: number
) => {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, width, height);

  ctx.font = '40px Arial';
  ctx.fillStyle = '#39ff14';
  ctx.textAlign = 'center';
  
  if (gameWon) {
    ctx.fillText('YOU WIN!', width / 2, height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText(`Survived for ${score} seconds!`, width / 2, height / 2 + 20);
  } else {
    ctx.fillText('GAME OVER', width / 2, height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, width / 2, height / 2 + 20);
  }
  
  ctx.font = '16px Arial';
  ctx.fillText('Refresh page or restart component to play again.', width / 2, height / 2 + 60);
};
