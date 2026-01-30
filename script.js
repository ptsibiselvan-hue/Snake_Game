const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
let snake, food, direction, score, game;
let highScore = localStorage.getItem("highScore") || 0;

// keyboard control
document.addEventListener("keydown", changeDirection);

function initGame(newStart = true) {
  if (newStart) {
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    score = 0;
  } else {
    // load saved state
    snake = JSON.parse(localStorage.getItem("snake")) || [{ x: 200, y: 200 }];
    direction = localStorage.getItem("direction") || "RIGHT";
    score = parseInt(localStorage.getItem("score")) || 0;
  }
  food = randomFood();
  updateScoreboard();
  clearInterval(game);
  game = setInterval(draw, 150);
  document.getElementById("overlay").style.display = "none";
}

function newGame() {
  initGame(true);
}

function continueGame() {
  initGame(false);
}

function changeDirection(e) {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function draw() {
  ctx.clearRect(0, 0, 400, 400);

  // draw snake
  snake.forEach((part, i) => {
    let gradient = ctx.createLinearGradient(part.x, part.y, part.x+box, part.y+box);
    gradient.addColorStop(0, i === 0 ? "#00ff00" : "#006400");
    gradient.addColorStop(1, i === 0 ? "#adff2f" : "#228b22");
    ctx.fillStyle = gradient;
    ctx.fillRect(part.x, part.y, box, box);
  });

  // draw food with glow
  ctx.fillStyle = "red";
  ctx.shadowColor = "yellow";
  ctx.shadowBlur = 20;
  ctx.fillRect(food.x, food.y, box, box);
  ctx.shadowBlur = 0;

  let head = { ...snake[0] };
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  // eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = randomFood();
  } else {
    snake.pop();
  }

  // collision
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= 400 || head.y >= 400 ||
    snake.some(part => part.x === head.x && part.y === head.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // save state for continue
  localStorage.setItem("snake", JSON.stringify(snake));
  localStorage.setItem("direction", direction);
  localStorage.setItem("score", score);

  updateScoreboard();
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

function updateScoreboard() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  document.getElementById("scoreboard").innerText =
    `Score: ${score} | High Score: ${highScore}`;
}

function gameOver() {
  clearInterval(game);
  document.getElementById("finalScore").innerText = "Score: " + score;
  document.getElementById("overlay").style.display = "block";
}