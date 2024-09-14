const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');
const scoreDisplay = document.getElementById('score');
const gameOverModal = document.getElementById('gameOverModal');
const finalScore = document.getElementById('finalScore');
const closeModal = document.getElementById('closeModal');
const restartGame = document.getElementById('restartGame');

const gridSize = 20;
const canvasSize = 400;
let snake, food, score, direction, gameInterval, speed;

function initGame() {
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: 0, y: 0 };
    score = 0;
    speed = 100;
    placeFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
    scoreDisplay.textContent = "00";
    gameOverModal.style.display = 'none';  // Hide modal when the game restarts
}

function placeFood() {
    let foodOverlap = true;
    while (foodOverlap) {
        food = {
            x: Math.floor(Math.random() * canvasSize / gridSize) * gridSize,
            y: Math.floor(Math.random() * canvasSize / gridSize) * gridSize
        };
        foodOverlap = snakeCollision(food);
    }
}

function gameLoop() {
    update();
    draw();
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score.toString().padStart(2, '0');
        snake.push({});
        placeFood();
        speed -= 5;
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
    }

    for (let i = snake.length - 1; i > 0; i--) {
        snake[i] = { ...snake[i - 1] };
    }

    snake[0] = head;

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || snakeCollision(head)) {
        endGame();
    }
}

function draw() {
    ctx.fillStyle = '#34495e';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.strokeStyle = '#2c3e50';
    for (let i = 0; i < canvasSize / gridSize; i++) {
        for (let j = 0; j < canvasSize / gridSize; j++) {
            ctx.strokeRect(i * gridSize, j * gridSize, gridSize, gridSize);
        }
    }

    ctx.fillStyle = '#ffffff';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, gridSize, gridSize));

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function snakeCollision(head) {
    return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

function endGame() {
    clearInterval(gameInterval);  // Stop the game loop
    finalScore.textContent = score;  // Update modal with final score
    gameOverModal.style.display = 'flex';  // Show modal
}

// Restart game from the modal
restartGame.addEventListener('click', () => {
    initGame();
});

// Close modal button functionality
closeModal.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
});

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: gridSize };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
            break;
    }
});

restartButton.addEventListener('click', initGame);

initGame();
