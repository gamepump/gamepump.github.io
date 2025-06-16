const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restart-btn");
const scoreEl = document.getElementById("score");

const bird = {
  x: 50,
  y: 150,
  width: 30,
  height: 25,
  gravity: 0.6,
  lift: -10,
  velocity: 0
};

const pipeWidth = 50;
const pipeGap = 120;
let pipes = [];
let frameCount = 0;
let score = 0;
let gameOver = false;

function drawBird() {
  ctx.fillStyle = "#ffcc00";
  ctx.beginPath();
  ctx.ellipse(bird.x, bird.y, bird.width/2, bird.height/2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = "#ff6600";
  ctx.beginPath();
  ctx.moveTo(bird.x + bird.width/2, bird.y);
  ctx.lineTo(bird.x + bird.width/2 + 10, bird.y - 5);
  ctx.lineTo(bird.x + bird.width/2 + 10, bird.y + 5);
  ctx.closePath();
  ctx.fill();
}

function drawPipes() {
  ctx.fillStyle = "#228B22";
  pipes.forEach(pipe => {
    // top pipe
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    // bottom pipe
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
  });
}

function createPipe() {
  const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
  const bottomHeight = topHeight + pipeGap;
  pipes.push({x: canvas.width, top: topHeight, bottom: bottomHeight});
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird physics
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Prevent bird going off screen
  if (bird.y + bird.height/2 > canvas.height) {
    bird.y = canvas.height - bird.height/2;
    gameOver = true;
  }
  if (bird.y - bird.height/2 < 0) {
    bird.y = bird.height/2;
    bird.velocity = 0;
  }

  // Pipes movement
  pipes.forEach(pipe => {
    pipe.x -= 2;

    // Collision detection
    if (
      bird.x + bird.width/2 > pipe.x &&
      bird.x - bird.width/2 < pipe.x + pipeWidth &&
      (bird.y - bird.height/2 < pipe.top || bird.y + bird.height/2 > pipe.bottom)
    ) {
      gameOver = true;
    }

    // Score when pipe passed
    if (!pipe.scored && pipe.x + pipeWidth < bird.x) {
      score++;
      pipe.scored = true;
      scoreEl.textContent = `Score: ${score}`;
    }
  });

  // Remove offscreen pipes
  if (pipes.length && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
  }

  // Add new pipes every 90 frames
  frameCount++;
  if (frameCount % 90 === 0) {
    createPipe();
  }

  drawPipes();
  drawBird();

  if (gameOver) {
    scoreEl.textContent += " - Game Over!";
  } else {
    requestAnimationFrame(update);
  }
}

function jump() {
  if (!gameOver) {
    bird.velocity = bird.lift;
  }
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  frameCount = 0;
  score = 0;
  gameOver = false;
  scoreEl.textContent = "Score: 0";
  update();
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});
canvas.addEventListener("click", jump);
restartBtn.addEventListener("click", resetGame);

// Start game
update();
