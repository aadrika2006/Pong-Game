const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 12;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;

// Game state
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ball = {
  x: canvas.width / 2 - BALL_SIZE / 2,
  y: canvas.height / 2 - BALL_SIZE / 2,
  vx: 5 * (Math.random() < 0.5 ? 1 : -1),
  vy: 4 * (Math.random() < 0.5 ? 1 : -1)
};
let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp within canvas
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// AI paddle logic
function moveAIPaddle() {
  const aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ball.y) {
    aiY += 4;
  } else if (aiCenter > ball.y) {
    aiY -= 4;
  }
  // Clamp
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Ball movement and collision
function moveBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Top/bottom wall collision
  if (ball.y <= 0 || ball.y + BALL_SIZE >= canvas.height) {
    ball.vy *= -1;
    ball.y = Math.max(0, Math.min(canvas.height - BALL_SIZE, ball.y));
  }

  // Left paddle collision
  if (
    ball.x <= PLAYER_X + PADDLE_WIDTH &&
    ball.x >= PLAYER_X &&
    ball.y + BALL_SIZE > playerY &&
    ball.y < playerY + PADDLE_HEIGHT
  ) {
    ball.vx *= -1;
    // Add a small effect based on where the ball hits the paddle
    const impact = ((ball.y + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ball.vy += impact * 2;
    ball.x = PLAYER_X + PADDLE_WIDTH; // prevent sticking
  }

  // Right paddle collision
  if (
    ball.x + BALL_SIZE >= AI_X &&
    ball.x + BALL_SIZE <= AI_X + PADDLE_WIDTH &&
    ball.y + BALL_SIZE > aiY &&
    ball.y < aiY + PADDLE_HEIGHT
  ) {
    ball.vx *= -1;
    // Add a small effect based on where the ball hits the paddle
    const impact = ((ball.y + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ball.vy += impact * 2;
    ball.x = AI_X - BALL_SIZE; // prevent sticking
  }

  // Score
  if (ball.x < 0) {
    aiScore++;
    resetBall();
  } else if (ball.x > canvas.width) {
    playerScore++;
    resetBall();
  }
}

function resetBall() {
  ball.x = canvas.width / 2 - BALL_SIZE / 2;
  ball.y = canvas.height / 2 - BALL_SIZE / 2;
  ball.vx = 5 * (Math.random() < 0.5 ? 1 : -1);
  ball.vy = 4 * (Math.random() < 0.5 ? 1 : -1);
  document.getElementById('playerScore').textContent = playerScore;
  document.getElementById('aiScore').textContent = aiScore;
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x + BALL_SIZE / 2, ball.y + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
  ctx.fill();

  // Draw center line
  ctx.strokeStyle = '#fff';
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

// Main game loop
function gameLoop() {
  moveAIPaddle();
  moveBall();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();