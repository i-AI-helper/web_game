class Tetris {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.BOARD_WIDTH = 10;
        this.BOARD_HEIGHT = 20;
        this.BLOCK_SIZE = 30;
        
        this.board = Array(this.BOARD_HEIGHT).fill().map(() => Array(this.BOARD_WIDTH).fill(0));
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameRunning = false;
        this.gamePaused = false;
        this.dropTime = 0;
        this.dropInterval = 1000;
        this.highScore = localStorage.getItem('tetrisHighScore') || 0;
        
        this.currentPiece = null;
        this.nextPiece = null;
        
        // 게임 개선: 콤보 시스템
        this.combo = 0;
        this.lastComboTime = 0;
        
        this.pieces = [
            // I piece
            [[1, 1, 1, 1]],
            // O piece
            [[1, 1], [1, 1]],
            // T piece
            [[0, 1, 0], [1, 1, 1]],
            // S piece
            [[0, 1, 1], [1, 1, 0]],
            // Z piece
            [[1, 1, 0], [0, 1, 1]],
            // J piece
            [[1, 0, 0], [1, 1, 1]],
            // L piece
            [[0, 0, 1], [1, 1, 1]]
        ];
        
        this.colors = [
            '#00f5ff', // I - Cyan
            '#ffff00', // O - Yellow
            '#a000f0', // T - Purple
            '#00f000', // S - Green
            '#f00000', // Z - Red
            '#0000f0', // J - Blue
            '#ffa000'  // L - Orange
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.generateNewPiece();
        this.drawBoard();
        this.drawNextPiece();
        this.updateDisplay();
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // 모바일 터치 지원 개선
        this.bindTouchEvents();
        
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
    }
    
    bindTouchEvents() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 30) {
                    this.movePiece(1, 0); // 오른쪽
                } else if (deltaX < -30) {
                    this.movePiece(-1, 0); // 왼쪽
                }
            } else {
                if (deltaY > 30) {
                    this.movePiece(0, 1); // 아래
                } else if (deltaY < -30) {
                    this.rotatePiece(); // 위 (회전)
                }
            }
        });
        
        // 더블 탭으로 즉시 하강
        let lastTap = 0;
        this.canvas.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                this.hardDrop();
            }
            lastTap = currentTime;
        });
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning || this.gamePaused) return;
        
        switch(e.keyCode) {
            case 37: // Left arrow
                this.movePiece(-1, 0);
                break;
            case 39: // Right arrow
                this.movePiece(1, 0);
                break;
            case 40: // Down arrow
                this.movePiece(0, 1);
                break;
            case 38: // Up arrow
                this.rotatePiece();
                break;
            case 32: // Spacebar
                this.hardDrop();
                break;
        }
    }
    
    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gamePaused = false;
            this.gameLoop();
            document.getElementById('startBtn').textContent = '게임 중...';
            document.getElementById('startBtn').disabled = true;
        }
    }
    
    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
            if (this.gamePaused) {
                document.getElementById('pauseBtn').textContent = '계속하기';
                this.drawPauseScreen();
            } else {
                document.getElementById('pauseBtn').textContent = '일시정지';
                this.gameLoop();
            }
        }
    }
    
    resetGame() {
        this.board = Array(this.BOARD_HEIGHT).fill().map(() => Array(this.BOARD_WIDTH).fill(0));
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.combo = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.dropTime = 0;
        this.dropInterval = 1000;
        this.generateNewPiece();
        this.updateDisplay();
        this.drawBoard();
        this.drawNextPiece();
        
        document.getElementById('startBtn').textContent = '게임 시작';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').textContent = '일시정지';
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        const now = Date.now();
        if (now - this.dropTime > this.dropInterval) {
            this.movePiece(0, 1);
            this.dropTime = now;
        }
        
        this.drawBoard();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    generateNewPiece() {
        if (!this.nextPiece) {
            this.nextPiece = this.createPiece();
        }
        
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece();
        
        if (this.isCollision(this.currentPiece, 0, 0)) {
            this.gameOver();
        }
        
        this.drawNextPiece();
    }
    
    createPiece() {
        const pieceIndex = Math.floor(Math.random() * this.pieces.length);
        const piece = this.pieces[pieceIndex];
        return {
            shape: piece,
            color: this.colors[pieceIndex],
            x: Math.floor(this.BOARD_WIDTH / 2) - Math.floor(piece[0].length / 2),
            y: 0
        };
    }
    
    movePiece(dx, dy) {
        if (!this.currentPiece) return;
        
        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;
        
        if (!this.isCollision(this.currentPiece, newX - this.currentPiece.x, newY - this.currentPiece.y)) {
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
            return true;
        } else if (dy > 0) {
            this.placePiece();
            this.clearLines();
            this.generateNewPiece();
            this.updateScore();
        }
        
        return false;
    }
    
    rotatePiece() {
        if (!this.currentPiece) return;
        
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        const originalShape = this.currentPiece.shape;
        
        this.currentPiece.shape = rotated;
        
        if (this.isCollision(this.currentPiece, 0, 0)) {
            this.currentPiece.shape = originalShape;
        }
    }
    
    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = matrix[i][j];
            }
        }
        
        return rotated;
    }
    
    hardDrop() {
        let dropDistance = 0;
        while (this.movePiece(0, 1)) {
            dropDistance++;
        }
        this.score += dropDistance * 2;
        this.updateDisplay();
    }
    
    isCollision(piece, dx, dy) {
        const newX = piece.x + dx;
        const newY = piece.y + dy;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardX = newX + x;
                    const boardY = newY + y;
                    
                    if (boardX < 0 || boardX >= this.BOARD_WIDTH || 
                        boardY >= this.BOARD_HEIGHT ||
                        (boardY >= 0 && this.board[boardY][boardX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    placePiece() {
        if (!this.currentPiece) return;
        
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardX = this.currentPiece.x + x;
                    const boardY = this.currentPiece.y + y;
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.BOARD_WIDTH).fill(0));
                linesCleared++;
                y++;
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            
            // 콤보 시스템 개선
            const now = Date.now();
            if (now - this.lastComboTime < 2000) {
                this.combo++;
            } else {
                this.combo = 1;
            }
            this.lastComboTime = now;
            
            // 콤보 보너스 점수
            const comboBonus = this.combo * 50;
            this.score += linesCleared * 100 + comboBonus;
        } else {
            this.combo = 0;
        }
    }
    
    updateScore() {
        this.score += 10;
        this.updateDisplay();
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lines').textContent = this.lines;
        document.getElementById('level').textContent = this.level;
        
        // 최고 점수 업데이트
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('tetrisHighScore', this.highScore);
        }
    }
    
    drawBoard() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw board
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y][x]) {
                    this.drawBlock(x, y, this.board[y][x]);
                }
            }
        }
        
        // Draw current piece
        if (this.currentPiece) {
            this.drawPiece(this.currentPiece);
        }
        
        // Draw grid
        this.drawGrid();
        
        // 게임 개선: 콤보 표시
        if (this.combo > 1) {
            this.drawCombo();
        }
    }
    
    drawPiece(piece) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    this.drawBlock(piece.x + x, piece.y + y, piece.color);
                }
            }
        }
    }
    
    drawBlock(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
        
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
        
        // Add highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(x * this.BLOCK_SIZE + 2, y * this.BLOCK_SIZE + 2, this.BLOCK_SIZE - 4, 2);
        this.ctx.fillRect(x * this.BLOCK_SIZE + 2, y * this.BLOCK_SIZE + 2, 2, this.BLOCK_SIZE - 4);
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.BOARD_WIDTH; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.BLOCK_SIZE, 0);
            this.ctx.lineTo(x * this.BLOCK_SIZE, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.BOARD_HEIGHT; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.BLOCK_SIZE);
            this.ctx.lineTo(this.canvas.width, y * this.BLOCK_SIZE);
            this.ctx.stroke();
        }
    }
    
    drawNextPiece() {
        this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (!this.nextPiece) return;
        
        const blockSize = 20;
        const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * blockSize) / 2;
        const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * blockSize) / 2;
        
        for (let y = 0; y < this.nextPiece.shape.length; y++) {
            for (let x = 0; x < this.nextPiece.shape[y].length; x++) {
                if (this.nextPiece.shape[y][x]) {
                    this.nextCtx.fillStyle = this.nextPiece.color;
                    this.nextCtx.fillRect(
                        offsetX + x * blockSize,
                        offsetY + y * blockSize,
                        blockSize,
                        blockSize
                    );
                    
                    this.nextCtx.strokeStyle = '#333';
                    this.nextCtx.lineWidth = 1;
                    this.nextCtx.strokeRect(
                        offsetX + x * blockSize,
                        offsetY + y * blockSize,
                        blockSize,
                        blockSize
                    );
                }
            }
        }
    }
    
    // 게임 개선: 일시정지 화면
    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('일시정지', this.canvas.width / 2, this.canvas.height / 2 - 20);
        this.ctx.font = '16px Arial';
        this.ctx.fillText('계속하기 버튼을 클릭하세요', this.canvas.width / 2, this.canvas.height / 2 + 20);
    }
    
    // 게임 개선: 콤보 표시
    drawCombo() {
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${this.combo} COMBO!`, this.canvas.width / 2, 50);
    }
    
    gameOver() {
        this.gameRunning = false;
        this.drawGameOverScreen();
        
        // 최고 점수 업데이트
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('tetrisHighScore', this.highScore);
        }
    }
    
    // 게임 개선: 게임 오버 화면
    drawGameOverScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('게임 오버!', this.canvas.width / 2, this.canvas.height / 2 - 60);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`최종 점수: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 - 20);
        this.ctx.fillText(`최고 점수: ${this.highScore}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
        this.ctx.fillText(`완성한 줄: ${this.lines}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillText('다시 시작 버튼을 클릭하세요', this.canvas.width / 2, this.canvas.height / 2 + 80);
        
        document.getElementById('startBtn').textContent = '게임 시작';
        document.getElementById('startBtn').disabled = false;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Tetris();
});
