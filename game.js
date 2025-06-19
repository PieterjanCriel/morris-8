var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Game constants
var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;
var OCTOPUS_WIDTH = 80;
var OCTOPUS_HEIGHT = 80;
var SHARK_WIDTH = 60;
var SHARK_HEIGHT = 60;
var SHARK_SPAWN_INTERVAL = 2000; // milliseconds
var INITIAL_FALLING_SPEED = 2;
var SPEED_INCREMENT = 0.1;
var MAX_FALLING_SPEED = 10;
// Shark class
var Shark = /** @class */ (function () {
    function Shark(x, y, answer, isCorrect) {
        this.x = x;
        this.y = y;
        this.width = SHARK_WIDTH;
        this.height = SHARK_HEIGHT;
        this.answer = answer;
        this.isCorrect = isCorrect;
    }
    Shark.prototype.update = function (speed) {
        this.y += speed;
    };
    Shark.prototype.draw = function (ctx) {
        // Draw shark placeholder
        ctx.fillStyle = this.isCorrect ? '#ff9900' : '#0099cc';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // Draw shark image placeholder
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        // Draw answer text
        ctx.fillStyle = 'black';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(this.answer), this.x + this.width / 2, this.y + this.height / 2);
    };
    return Shark;
}());
// Octopus class
var Octopus = /** @class */ (function () {
    function Octopus() {
        this.width = OCTOPUS_WIDTH;
        this.height = OCTOPUS_HEIGHT;
        this.x = (GAME_WIDTH - this.width) / 2;
        this.y = GAME_HEIGHT - this.height - 20;
        this.speed = 6;
        this.movingLeft = false;
        this.movingRight = false;
    }
    Octopus.prototype.update = function () {
        if (this.movingLeft && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.movingRight && this.x < GAME_WIDTH - this.width) {
            this.x += this.speed;
        }
    };
    Octopus.prototype.draw = function (ctx) {
        // Draw octopus placeholder
        ctx.fillStyle = '#ff6666';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // Draw octopus image placeholder
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillRect(this.x + 10, this.y + 10, this.width - 20, this.height - 20);
    };
    return Octopus;
}());
// Game class
var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        this.animationFrameId = null;
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', function () { return _this.resizeCanvas(); });
        this.state = {
            lives: 3,
            score: 0,
            fallingSpeed: INITIAL_FALLING_SPEED,
            gameOver: false,
            currentProblem: this.generateMathProblem(),
            sharks: [],
            octopus: new Octopus(),
            lastSharkSpawn: 0
        };
        // Event listeners for keyboard
        document.addEventListener('keydown', function (e) { return _this.handleKeyDown(e); });
        document.addEventListener('keyup', function (e) { return _this.handleKeyUp(e); });
        // Start the game loop
        this.gameLoop(0);
    }
    Game.prototype.resizeCanvas = function () {
        var container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    };
    Game.prototype.handleKeyDown = function (e) {
        if (e.key === 'ArrowLeft') {
            this.state.octopus.movingLeft = true;
        }
        else if (e.key === 'ArrowRight') {
            this.state.octopus.movingRight = true;
        }
    };
    Game.prototype.handleKeyUp = function (e) {
        if (e.key === 'ArrowLeft') {
            this.state.octopus.movingLeft = false;
        }
        else if (e.key === 'ArrowRight') {
            this.state.octopus.movingRight = false;
        }
    };
    Game.prototype.generateMathProblem = function () {
        var operations = ['+', '-', '*'];
        var operation = operations[Math.floor(Math.random() * operations.length)];
        var num1, num2, correctAnswer;
        switch (operation) {
            case '+':
                num1 = Math.floor(Math.random() * 100) + 1;
                num2 = Math.floor(Math.random() * 100) + 1;
                correctAnswer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 100) + 1;
                num2 = Math.floor(Math.random() * num1) + 1; // Ensure positive result
                correctAnswer = num1 - num2;
                break;
            case '*':
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                correctAnswer = num1 * num2;
                break;
            default:
                num1 = Math.floor(Math.random() * 100) + 1;
                num2 = Math.floor(Math.random() * 100) + 1;
                correctAnswer = num1 + num2;
                operation = '+';
        }
        var expression = "".concat(num1, " ").concat(operation, " ").concat(num2);
        // Generate 3 wrong answers
        var wrongAnswers = [];
        while (wrongAnswers.length < 3) {
            // Generate wrong answer close to the correct one
            var wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
            if (wrongAnswer !== correctAnswer && wrongAnswers.indexOf(wrongAnswer) === -1 && wrongAnswer > 0) {
                wrongAnswers.push(wrongAnswer);
            }
        }
        document.getElementById('math-problem').textContent = expression;
        return {
            expression: expression,
            correctAnswer: correctAnswer,
            wrongAnswers: wrongAnswers
        };
    };
    Game.prototype.spawnSharks = function () {
        var answers = __spreadArray(__spreadArray([], this.state.currentProblem.wrongAnswers, true), [this.state.currentProblem.correctAnswer], false);
        this.shuffleArray(answers);
        var availableWidth = this.canvas.width - SHARK_WIDTH;
        var segment = availableWidth / 4;
        for (var i = 0; i < 4; i++) {
            var isCorrect = answers[i] === this.state.currentProblem.correctAnswer;
            var x = i * segment + segment / 2 - SHARK_WIDTH / 2;
            var shark = new Shark(x, -SHARK_HEIGHT, answers[i], isCorrect);
            this.state.sharks.push(shark);
        }
    };
    Game.prototype.shuffleArray = function (array) {
        var _a;
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
        }
    };
    Game.prototype.checkCollisions = function () {
        var octopus = this.state.octopus;
        for (var i = this.state.sharks.length - 1; i >= 0; i--) {
            var shark = this.state.sharks[i];
            // Check if shark has gone off screen
            if (shark.y > this.canvas.height) {
                if (shark.isCorrect) {
                    // Player missed the correct answer
                    this.state.lives--;
                    this.updateLivesDisplay();
                    if (this.state.lives <= 0) {
                        this.gameOver();
                    }
                }
                this.state.sharks.splice(i, 1);
                continue;
            }
            // Check collision with octopus
            if (shark.x < octopus.x + octopus.width &&
                shark.x + shark.width > octopus.x &&
                shark.y < octopus.y + octopus.height &&
                shark.y + shark.height > octopus.y) {
                if (shark.isCorrect) {
                    // Player caught the correct answer
                    this.state.score++;
                    this.updateScoreDisplay();
                    this.state.fallingSpeed = Math.min(MAX_FALLING_SPEED, this.state.fallingSpeed + SPEED_INCREMENT);
                    this.state.currentProblem = this.generateMathProblem();
                }
                else {
                    // Player caught a wrong answer
                    this.state.lives--;
                    this.updateLivesDisplay();
                    if (this.state.lives <= 0) {
                        this.gameOver();
                    }
                }
                // Remove all sharks and spawn new ones
                this.state.sharks = [];
                break;
            }
        }
    };
    Game.prototype.updateLivesDisplay = function () {
        document.getElementById('lives-count').textContent = String(this.state.lives);
    };
    Game.prototype.updateScoreDisplay = function () {
        document.getElementById('score-count').textContent = String(this.state.score);
    };
    Game.prototype.gameOver = function () {
        var _this = this;
        this.state.gameOver = true;
        // Create game over screen if it doesn't exist
        var gameOverScreen = document.querySelector('.game-over');
        if (!gameOverScreen) {
            gameOverScreen = document.createElement('div');
            gameOverScreen.className = 'game-over';
            var gameOverTitle = document.createElement('h2');
            gameOverTitle.textContent = 'Game Over';
            var gameOverScore = document.createElement('p');
            gameOverScore.textContent = "Final Score: ".concat(this.state.score);
            var restartButton = document.createElement('button');
            restartButton.textContent = 'Play Again';
            restartButton.addEventListener('click', function () { return _this.restart(); });
            gameOverScreen.appendChild(gameOverTitle);
            gameOverScreen.appendChild(gameOverScore);
            gameOverScreen.appendChild(restartButton);
            document.querySelector('.game-container').appendChild(gameOverScreen);
        }
        else {
            gameOverScreen.querySelector('p').textContent = "Final Score: ".concat(this.state.score);
            gameOverScreen.style.display = 'block';
        }
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    };
    Game.prototype.restart = function () {
        var gameOverScreen = document.querySelector('.game-over');
        if (gameOverScreen) {
            gameOverScreen.style.display = 'none';
        }
        this.state = {
            lives: 3,
            score: 0,
            fallingSpeed: INITIAL_FALLING_SPEED,
            gameOver: false,
            currentProblem: this.generateMathProblem(),
            sharks: [],
            octopus: new Octopus(),
            lastSharkSpawn: 0
        };
        this.updateLivesDisplay();
        this.updateScoreDisplay();
        this.gameLoop(0);
    };
    Game.prototype.update = function (timestamp) {
        var _this = this;
        // Spawn sharks at intervals
        if (this.state.sharks.length === 0 ||
            timestamp - this.state.lastSharkSpawn > SHARK_SPAWN_INTERVAL) {
            this.spawnSharks();
            this.state.lastSharkSpawn = timestamp;
        }
        // Update octopus position
        this.state.octopus.update();
        // Update shark positions
        this.state.sharks.forEach(function (shark) { return shark.update(_this.state.fallingSpeed); });
        // Check for collisions
        this.checkCollisions();
    };
    Game.prototype.draw = function () {
        var _this = this;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw ocean background (additional waves)
        for (var i = 0; i < 5; i++) {
            var y = (this.canvas.height / 5) * i;
            var gradient = this.ctx.createLinearGradient(0, y, 0, y + this.canvas.height / 5);
            gradient.addColorStop(0, "rgba(0, ".concat(120 + i * 10, ", ").concat(180 - i * 10, ", ").concat(0.2 + i * 0.1, ")"));
            gradient.addColorStop(1, "rgba(0, ".concat(100 + i * 10, ", ").concat(150 - i * 10, ", ").concat(0.3 + i * 0.1, ")"));
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, y, this.canvas.width, this.canvas.height / 5);
        }
        // Draw sharks
        this.state.sharks.forEach(function (shark) { return shark.draw(_this.ctx); });
        // Draw octopus
        this.state.octopus.draw(this.ctx);
    };
    Game.prototype.gameLoop = function (timestamp) {
        var _this = this;
        if (!this.state.gameOver) {
            this.update(timestamp);
            this.draw();
            this.animationFrameId = requestAnimationFrame(function (time) { return _this.gameLoop(time); });
        }
    };
    return Game;
}());
// Initialize the game when window loads
window.addEventListener('load', function () {
    var game = new Game();
});
