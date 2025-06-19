// Game constants
const GAME_WIDTH = 600;
const GAME_HEIGHT = 600; // Square shape
const OCTOPUS_WIDTH = 120; // Increased by 50% from 80
const OCTOPUS_HEIGHT = 120; // Increased by 50% from 80
const SHARK_WIDTH = 60;
const SHARK_HEIGHT = 60;
const SHARK_SPAWN_INTERVAL = 2000; // milliseconds
const INITIAL_FALLING_SPEED = 1.3;
const SPEED_INCREMENT = 0.1;
const MAX_FALLING_SPEED = 10;

// Game state
interface GameState {
    lives: number;
    score: number;
    fallingSpeed: number;
    gameOver: boolean;
    currentProblem: MathProblem;
    sharks: Shark[];
    octopus: Octopus;
    lastSharkSpawn: number;
}

// Math problem
interface MathProblem {
    expression: string;
    correctAnswer: number;
    wrongAnswers: number[];
}

// Shark class
class Shark {
    x: number;
    y: number;
    width: number;
    height: number;
    answer: number;
    isCorrect: boolean;
    image: HTMLImageElement;

    constructor(x: number, y: number, answer: number, isCorrect: boolean) {
        this.x = x;
        this.y = y;
        this.width = SHARK_WIDTH;
        this.height = SHARK_HEIGHT;
        this.answer = answer;
        this.isCorrect = isCorrect;
        this.image = new Image();
        this.image.src = Math.random() < 0.5 ? 'img/shark_1.png' : 'img/shark_2.png';
    }

    update(speed: number): void {
        this.y += speed;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // Draw shark image
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        
        // Draw answer text next to the shark (to the right) in red
        ctx.fillStyle = 'red';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const text = String(this.answer);
        ctx.fillText(text, this.x + this.width + 5, this.y + this.height / 2);
    }
}

// Octopus class
class Octopus {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    movingLeft: boolean;
    movingRight: boolean;
    image: HTMLImageElement;

    constructor() {
        this.width = OCTOPUS_WIDTH;
        this.height = OCTOPUS_HEIGHT;
        this.x = (GAME_WIDTH - this.width) / 2;
        this.y = GAME_HEIGHT - this.height + 200; // Position at bottom with 10px margin
        this.speed = 6;
        this.movingLeft = false;
        this.movingRight = false;
        this.image = new Image();
        this.image.src = 'img/octo.png';
    }

    update(): void {
        // Get the actual canvas width for proper boundary checking
        const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        const canvasWidth = canvas ? canvas.width : GAME_WIDTH;
        
        if (this.movingLeft && this.x > 0) {
            this.x -= this.speed;
        }
        
        if (this.movingRight && this.x < canvasWidth - this.width) {
            this.x += this.speed;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // Draw the octopus image
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// Game class
class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    state: GameState;
    backgroundImage: HTMLImageElement;
    animationFrameId: number | null = null;
    
    constructor() {
        this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        
        // Load background image
        this.backgroundImage = new Image();
        this.backgroundImage.src = 'img/IMG_2649.jpg';
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
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
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Start the game loop
        this.gameLoop(0);
    }

    resizeCanvas(): void {
        const container = this.canvas.parentElement as HTMLElement;
        // Make the canvas square-shaped by using the minimum dimension
        const minDimension = Math.min(container.clientWidth, container.clientHeight);
        this.canvas.width = minDimension;
        this.canvas.height = minDimension;
        
        // Update octopus position when canvas is resized
        if (this.state && this.state.octopus) {
            this.state.octopus.y = this.canvas.height - this.state.octopus.height - 10;
        }
    }
    
    handleKeyDown(e: KeyboardEvent): void {
        if (e.key === 'ArrowLeft') {
            this.state.octopus.movingLeft = true;
        } else if (e.key === 'ArrowRight') {
            this.state.octopus.movingRight = true;
        }
    }
    
    handleKeyUp(e: KeyboardEvent): void {
        if (e.key === 'ArrowLeft') {
            this.state.octopus.movingLeft = false;
        } else if (e.key === 'ArrowRight') {
            this.state.octopus.movingRight = false;
        }
    }
    
    generateMathProblem(): MathProblem {
        const operations = ['+', '-', '*'];
        let operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, correctAnswer;
        
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
        
        const expression = `${num1} ${operation} ${num2}`;
        
        // Generate 3 wrong answers
        const wrongAnswers: number[] = [];
        while (wrongAnswers.length < 3) {
            // Generate wrong answer close to the correct one
            const wrongAnswer: number = correctAnswer + Math.floor(Math.random() * 20) - 10;
            if (wrongAnswer !== correctAnswer && wrongAnswers.indexOf(wrongAnswer) === -1 && wrongAnswer > 0) {
                wrongAnswers.push(wrongAnswer);
            }
        }
        
        document.getElementById('math-problem')!.textContent = expression;
        
        return {
            expression,
            correctAnswer,
            wrongAnswers
        };
    }
    
    spawnSharks(): void {
        const answers = [...this.state.currentProblem.wrongAnswers, this.state.currentProblem.correctAnswer];
        this.shuffleArray(answers);
        
        const availableWidth = this.canvas.width - SHARK_WIDTH;
        const segment = availableWidth / 4;
        
        for (let i = 0; i < 4; i++) {
            const isCorrect = answers[i] === this.state.currentProblem.correctAnswer;
            const x = i * segment + segment / 2 - SHARK_WIDTH / 2;
            // Add random Y offset between -100px and +100px
            const yOffset = Math.floor(Math.random() * 200) - 100;
            const shark = new Shark(x, -SHARK_HEIGHT + yOffset, answers[i], isCorrect);
            this.state.sharks.push(shark);
        }
    }
    
    shuffleArray(array: any[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    checkCollisions(): void {
        const octopus = this.state.octopus;
        
        for (let i = this.state.sharks.length - 1; i >= 0; i--) {
            const shark = this.state.sharks[i];
            
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
            if (
                shark.x < octopus.x + octopus.width &&
                shark.x + shark.width > octopus.x &&
                shark.y < octopus.y + octopus.height &&
                shark.y + shark.height > octopus.y
            ) {
                if (shark.isCorrect) {
                    // Player caught the correct answer
                    this.state.score++;
                    this.updateScoreDisplay();
                    this.state.fallingSpeed = Math.min(
                        MAX_FALLING_SPEED, 
                        this.state.fallingSpeed + SPEED_INCREMENT
                    );
                    this.state.currentProblem = this.generateMathProblem();
                } else {
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
    }
    
    updateLivesDisplay(): void {
        document.getElementById('lives-count')!.textContent = String(this.state.lives);
    }
    
    updateScoreDisplay(): void {
        document.getElementById('score-count')!.textContent = String(this.state.score);
    }
    
    gameOver(): void {
        this.state.gameOver = true;
        
        // Create game over screen if it doesn't exist
        let gameOverScreen = document.querySelector('.game-over') as HTMLElement;
        if (!gameOverScreen) {
            gameOverScreen = document.createElement('div');
            gameOverScreen.className = 'game-over';
            
            const gameOverTitle = document.createElement('h2');
            gameOverTitle.textContent = 'Game Over';
            
            const gameOverScore = document.createElement('p');
            gameOverScore.textContent = `Final Score: ${this.state.score}`;
            
            const restartButton = document.createElement('button');
            restartButton.textContent = 'Play Again';
            restartButton.addEventListener('click', () => this.restart());
            
            gameOverScreen.appendChild(gameOverTitle);
            gameOverScreen.appendChild(gameOverScore);
            gameOverScreen.appendChild(restartButton);
            
            document.querySelector('.game-container')!.appendChild(gameOverScreen);
        } else {
            gameOverScreen.querySelector('p')!.textContent = `Final Score: ${this.state.score}`;
            gameOverScreen.style.display = 'block';
        }
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    restart(): void {
        const gameOverScreen = document.querySelector('.game-over') as HTMLElement;
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
    }
    
    update(timestamp: number): void {
        // Spawn sharks at intervals
        if (this.state.sharks.length === 0 || 
            timestamp - this.state.lastSharkSpawn > SHARK_SPAWN_INTERVAL) {
            this.spawnSharks();
            this.state.lastSharkSpawn = timestamp;
        }
        
        // Update octopus position
        this.state.octopus.update();
        
        // Update shark positions
        this.state.sharks.forEach(shark => shark.update(this.state.fallingSpeed));
        
        // Check for collisions
        this.checkCollisions();
    }
    
    draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw underwater background image
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        
        // Draw sharks
        this.state.sharks.forEach(shark => shark.draw(this.ctx));
        
        // Draw octopus
        this.state.octopus.draw(this.ctx);
    }
    
    gameLoop(timestamp: number): void {
        if (!this.state.gameOver) {
            this.update(timestamp);
            this.draw();
            this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
        }
    }
}

// Initialize the game when window loads
window.addEventListener('load', () => {
    const game = new Game();
});