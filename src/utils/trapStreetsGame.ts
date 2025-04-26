/**
 * Initializes and runs the Trap Streets game on the provided canvas.
 * @param {HTMLCanvasElement} canvas - The canvas element to draw the game on.
 * @param {function} onGameOver - Callback function when the game ends (win or lose).
 * @param {function} onScoreUpdate - Callback function to update score/time display.
 */
export function startGame(canvas, onGameOver, onScoreUpdate) {
    if (!canvas) {
        console.error("Canvas element not provided to startGame");
        return null; // Indicate failure or inability to start
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("Could not get 2D context from canvas");
        return null;
    }

    // --- Game Constants ---
    const PLAYER_WIDTH = 30;
    const PLAYER_HEIGHT = 30;
    const PLAYER_SPEED = 5;
    const PLAYER_COLOR = 'blue'; // Gremlin representation

    const OBSTACLE_WIDTH = 40;
    const OBSTACLE_HEIGHT = 20;
    const OBSTACLE_SPEED = 3;
    const OBSTACLE_COLOR = 'red'; // Roast Fail representation
    const OBSTACLE_SPAWN_RATE = 1000; // Milliseconds between spawns

    const WIN_TIME_SECONDS = 30;

    // --- Game State ---
    let player = {
        x: canvas.width / 2 - PLAYER_WIDTH / 2,
        y: canvas.height - PLAYER_HEIGHT - 10, // Positioned near the bottom
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        dx: 0 // Change in x per frame
    };

    let obstacles = [];
    let score = 0;
    let startTime = Date.now();
    let elapsedTimeSeconds = 0;
    let gameOver = false;
    let gameWon = false;
    let lastObstacleSpawnTime = 0;
    let animationFrameId = null;
    let keysPressed = {};

    // --- Event Listeners ---
    function handleKeyDown(event) {
        keysPressed[event.key] = true;
    }

    function handleKeyUp(event) {
        keysPressed[event.key] = false;
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // --- Game Functions ---
    function updatePlayer() {
        // Determine movement direction based on pressed keys
        let moveLeft = keysPressed['ArrowLeft'] || keysPressed['a'];
        let moveRight = keysPressed['ArrowRight'] || keysPressed['d'];

        if (moveLeft && !moveRight) {
            player.dx = -PLAYER_SPEED;
        } else if (moveRight && !moveLeft) {
            player.dx = PLAYER_SPEED;
        } else {
            player.dx = 0; // No movement or conflicting keys
        }

        // Apply movement
        player.x += player.dx;

        // Boundary detection
        if (player.x < 0) {
            player.x = 0;
        }
        if (player.x + player.width > canvas.width) {
            player.x = canvas.width - player.width;
        }
    }

    function spawnObstacle() {
        const currentTime = Date.now();
        if (currentTime - lastObstacleSpawnTime > OBSTACLE_SPAWN_RATE) {
            const x = Math.random() * (canvas.width - OBSTACLE_WIDTH); // Random x position
            obstacles.push({
                x: x,
                y: -OBSTACLE_HEIGHT, // Start just above the canvas
                width: OBSTACLE_WIDTH,
                height: OBSTACLE_HEIGHT,
                speed: OBSTACLE_SPEED + Math.random() * 2 // Slight speed variation
            });
            lastObstacleSpawnTime = currentTime;
        }
    }

    function updateObstacles() {
        // Move existing obstacles and remove off-screen ones
        obstacles = obstacles.filter(obstacle => {
            obstacle.y += obstacle.speed;
            return obstacle.y < canvas.height; // Keep if still on screen
        });
    }

    function checkCollisions() {
        for (const obstacle of obstacles) {
            // Simple AABB (Axis-Aligned Bounding Box) collision detection
            if (
                player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y
            ) {
                gameOver = true;
                gameWon = false; // Can't win if you collide
                return; // Exit early on first collision
            }
        }
    }

    function checkWinCondition() {
        if (!gameOver && elapsedTimeSeconds >= WIN_TIME_SECONDS) {
            gameWon = true;
            gameOver = true; // End the game loop
        }
    }

    function updateTimerAndScore() {
        elapsedTimeSeconds = Math.floor((Date.now() - startTime) / 1000);
        score = elapsedTimeSeconds; // Score is time survived
        onScoreUpdate(score, WIN_TIME_SECONDS - elapsedTimeSeconds);
    }

    function drawPlayer() {
        ctx.fillStyle = PLAYER_COLOR;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawObstacles() {
        ctx.fillStyle = OBSTACLE_COLOR;
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    function drawGameOver() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Dim background

        ctx.font = '40px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        if (gameWon) {
            ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2 - 20);
             ctx.font = '20px Arial';
             ctx.fillText(`Survived for ${score} seconds!`, canvas.width / 2, canvas.height / 2 + 20);
        } else {
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
             ctx.font = '20px Arial';
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
        }
         ctx.font = '16px Arial';
         ctx.fillText('Refresh page or restart component to play again.', canvas.width / 2, canvas.height / 2 + 60);
    }

    // --- Game Loop ---
    function gameLoop() {
        if (gameOver) {
            drawGameOver();
            onGameOver(gameWon, score); // Notify React component
            cleanup(); // Stop loop and remove listeners
            return;
        }

        // 1. Clear Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 2. Update State
        updatePlayer();
        spawnObstacle();
        updateObstacles();
        checkCollisions(); // Sets gameOver if collision occurs
        updateTimerAndScore();
        checkWinCondition(); // Sets gameWon and gameOver if time reached

        // 3. Draw Elements
        drawPlayer();
        drawObstacles();
        // Score/Timer display is handled by the React component via onScoreUpdate callback

        // 4. Request Next Frame
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    // --- Cleanup Function ---
    function cleanup() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        console.log("Game cleanup complete.");
    }

    // --- Start Game ---
    console.log("Starting Trap Streets game...");
    lastObstacleSpawnTime = Date.now(); // Initialize spawn timer
    startTime = Date.now(); // Initialize game timer
    animationFrameId = requestAnimationFrame(gameLoop);

    // Return the cleanup function so the React component can call it on unmount
    return cleanup;
}
