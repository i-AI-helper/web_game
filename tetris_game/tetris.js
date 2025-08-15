/**
 * 테트릭스 게임 - 고급 사운드 시스템 통합
 * 
 * @author AI Assistant (Claude Sonnet 4)
 * @version 1.0.0
 * @date 2025-08-16
 */

class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        // 게임 상태
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        
        // 게임 보드
        this.boardWidth = 10;
        this.boardHeight = 20;
        this.board = this.createEmptyBoard();
        
        // 게임 데이터
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.combo = 0;
        this.lastComboTime = 0;
        this.highScore = this.loadHighScore();
        
        // 현재 블록
        this.currentPiece = null;
        this.nextPiece = null;
        
        // 게임 타이밍
        this.dropTime = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        
        // 사운드 매니저
        this.soundManager = window.tetrisSoundManager;
        
        // 이벤트 리스너 등록
        this.bindEvents();
        
        // 초기화
        this.init();
    }
    
    /**
     * 게임 초기화
     */
    init() {
        this.generateNewPiece();
        this.generateNextPiece();
        this.updateDisplay();
        this.drawBoard();
        this.drawNextPiece();
        
        // 사운드 시스템 초기화 확인
        if (this.soundManager) {
            console.log('사운드 시스템이 성공적으로 로드되었습니다.');
        } else {
            console.warn('사운드 시스템을 찾을 수 없습니다.');
        }
    }
    
    /**
     * 빈 보드 생성
     */
    createEmptyBoard() {
        const board = [];
        for (let y = 0; y < this.boardHeight; y++) {
            board[y] = [];
            for (let x = 0; x < this.boardWidth; x++) {
                board[y][x] = 0;
            }
        }
        return board;
    }
    
    /**
     * 이벤트 리스너 등록
     */
    bindEvents() {
        // 키보드 이벤트
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // 버튼 이벤트
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        
        // 터치 이벤트 (모바일)
        this.bindTouchEvents();
    }
    
    /**
     * 터치 이벤트 바인딩
     */
    bindTouchEvents() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        let lastTapTime = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            const endTime = Date.now();
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;
            
            // 스와이프 감지
            if (deltaTime < 300) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > 50) {
                        this.movePiece(1, 0); // 오른쪽
                        this.playSound('move');
                    } else if (deltaX < -50) {
                        this.movePiece(-1, 0); // 왼쪽
                        this.playSound('move');
                    }
                } else {
                    if (deltaY > 50) {
                        this.movePiece(0, 1); // 아래
                        this.playSound('drop');
                    } else if (deltaY < -50) {
                        this.rotatePiece(); // 위 (회전)
                        this.playSound('rotate');
                    }
                }
            }
            
            // 더블 탭 감지 (즉시 하강)
            const currentTime = Date.now();
            if (currentTime - lastTapTime < 300) {
                this.hardDrop();
                this.playSound('hardDrop');
            }
            lastTapTime = currentTime;
        });
    }
    
    /**
     * 키보드 입력 처리
     */
    handleKeyPress(e) {
        if (this.gameOver) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.movePiece(-1, 0);
                this.playSound('move');
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.movePiece(1, 0);
                this.playSound('move');
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.movePiece(0, 1);
                this.playSound('drop');
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.rotatePiece();
                this.playSound('rotate');
                break;
            case ' ':
                e.preventDefault();
                this.hardDrop();
                this.playSound('hardDrop');
                break;
            case 'Escape':
                e.preventDefault();
                this.togglePause();
                break;
        }
    }
    
    /**
     * 게임 시작
     */
    startGame() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.gameOver = false;
        this.gamePaused = false;
        
        // UI 업데이트
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        
        // 게임 시작 사운드
        this.playSound('levelUp');
        
        // 게임 시작 이벤트 발생
        window.dispatchEvent(new CustomEvent('tetris_gameStart'));
        
        // 게임 루프 시작
        this.gameLoop();
    }
    
    /**
     * 게임 일시정지/재개
     */
    togglePause() {
        if (!this.gameRunning || this.gameOver) return;
        
        this.gamePaused = !this.gamePaused;
        
        if (this.gamePaused) {
            document.getElementById('pauseBtn').textContent = '계속하기';
            this.drawPauseScreen();
            
            // 게임 일시정지 이벤트 발생
            window.dispatchEvent(new CustomEvent('tetris_gamePause'));
        } else {
            document.getElementById('pauseBtn').textContent = '일시정지';
            this.drawBoard();
            
            // 게임 재개 이벤트 발생
            window.dispatchEvent(new CustomEvent('tetris_gameResume'));
        }
    }
    
    /**
     * 게임 리셋
     */
    resetGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        
        // 게임 상태 초기화
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.combo = 0;
        this.lastComboTime = 0;
        this.board = this.createEmptyBoard();
        this.dropInterval = 1000;
        
        // UI 초기화
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '일시정지';
        
        // 새 블록 생성
        this.generateNewPiece();
        this.generateNextPiece();
        
        // 화면 업데이트
        this.updateDisplay();
        this.drawBoard();
        this.drawNextPiece();
        
        // 게임 오버 화면 제거
        const gameOverScreen = document.querySelector('.game-over');
        if (gameOverScreen) {
            gameOverScreen.remove();
        }
    }
    
    /**
     * 게임 루프
     */
    gameLoop(currentTime = 0) {
        if (!this.gameRunning || this.gamePaused || this.gameOver) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.dropTime += deltaTime;
        
        if (this.dropTime > this.dropInterval) {
            this.dropPiece();
            this.dropTime = 0;
        }
        
        this.drawBoard();
        this.drawNextPiece();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    /**
     * 블록 하강
     */
    dropPiece() {
        if (!this.movePiece(0, 1)) {
            this.placePiece();
            this.clearLines();
            this.generateNewPiece();
            
            if (this.isGameOver()) {
                this.endGame();
                return;
            }
        }
    }
    
    /**
     * 블록 이동
     */
    movePiece(dx, dy) {
        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;
        
        if (this.isValidMove(newX, newY, this.currentPiece.shape)) {
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
            return true;
        }
        return false;
    }
    
    /**
     * 블록 회전
     */
    rotatePiece() {
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        if (this.isValidMove(this.currentPiece.x, this.currentPiece.y, rotated)) {
            this.currentPiece.shape = rotated;
        }
    }
    
    /**
     * 즉시 하강
     */
    hardDrop() {
        while (this.movePiece(0, 1)) {
            this.score += 2;
        }
        this.placePiece();
        this.clearLines();
        this.generateNewPiece();
        
        if (this.isGameOver()) {
            this.endGame();
        }
    }
    
    /**
     * 블록 배치
     */
    placePiece() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardY = this.currentPiece.y + y;
                    const boardX = this.currentPiece.x + x;
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.type;
                    }
                }
            }
        }
    }
    
    /**
     * 줄 제거
     */
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.boardHeight - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(new Array(this.boardWidth).fill(0));
                linesCleared++;
                y++; // 같은 줄을 다시 확인
            }
        }
        
        if (linesCleared > 0) {
            this.updateScore(linesCleared);
            this.playSound('lineClear');
            
            // 테트리스 (4줄 제거) 사운드
            if (linesCleared === 4) {
                this.playSound('tetris');
            }
            
            // 콤보 시스템
            this.updateCombo();
            
            // 줄 제거 이벤트 발생
            window.dispatchEvent(new CustomEvent('tetris_lineClear', {
                detail: { lines: linesCleared }
            }));
        } else {
            // 콤보 리셋
            this.resetCombo();
        }
    }
    
    /**
     * 점수 업데이트
     */
    updateScore(linesCleared) {
        const lineScores = [0, 100, 300, 500, 800];
        this.score += lineScores[linesCleared] * this.level;
        this.lines += linesCleared;
        
        // 레벨 업
        const newLevel = Math.floor(this.lines / 10) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            this.playSound('levelUp');
            
            // 레벨 업 이벤트 발생
            window.dispatchEvent(new CustomEvent('tetris_levelUp', {
                detail: { level: this.level }
            }));
        }
        
        // 최고 점수 업데이트
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        
        this.updateDisplay();
    }
    
    /**
     * 콤보 시스템
     */
    updateCombo() {
        const currentTime = Date.now();
        if (currentTime - this.lastComboTime < 2000) {
            this.combo++;
            this.score += this.combo * 10;
            
            // 콤보 이벤트 발생
            window.dispatchEvent(new CustomEvent('tetris_combo', {
                detail: { combo: this.combo }
            }));
            
            // 콤보 표시
            this.showCombo();
        } else {
            this.combo = 1;
        }
        this.lastComboTime = currentTime;
    }
    
    /**
     * 콤보 리셋
     */
    resetCombo() {
        this.combo = 0;
    }
    
    /**
     * 콤보 표시
     */
    showCombo() {
        if (this.combo > 1) {
            const comboDisplay = document.createElement('div');
            comboDisplay.className = 'combo-display';
            comboDisplay.textContent = `${this.combo} COMBO!`;
            
            this.canvas.parentElement.appendChild(comboDisplay);
            
            setTimeout(() => {
                if (comboDisplay.parentNode) {
                    comboDisplay.parentNode.removeChild(comboDisplay);
                }
            }, 2000);
        }
    }
    
    /**
     * 게임 오버 체크
     */
    isGameOver() {
        return !this.isValidMove(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape);
    }
    
    /**
     * 게임 종료
     */
    endGame() {
        this.gameRunning = false;
        this.gameOver = true;
        
        // 게임 오버 사운드
        this.playSound('gameOver');
        
        // 게임 오버 이벤트 발생
        window.dispatchEvent(new CustomEvent('tetris_gameOver'));
        
        // UI 업데이트
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        
        // 게임 오버 화면 표시
        this.drawGameOverScreen();
    }
    
    /**
     * 새 블록 생성
     */
    generateNewPiece() {
        this.currentPiece = this.nextPiece || this.createRandomPiece();
        this.currentPiece.x = Math.floor(this.boardWidth / 2) - Math.floor(this.currentPiece.shape[0].length / 2);
        this.currentPiece.y = 0;
        
        if (!this.isValidMove(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
            this.gameOver = true;
        }
    }
    
    /**
     * 다음 블록 생성
     */
    generateNextPiece() {
        this.nextPiece = this.createRandomPiece();
    }
    
    /**
     * 랜덤 블록 생성
     */
    createRandomPiece() {
        const pieces = [
            { type: 'I', shape: [[1, 1, 1, 1]], color: '#00f5ff' },
            { type: 'O', shape: [[1, 1], [1, 1]], color: '#ffff00' },
            { type: 'T', shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' },
            { type: 'S', shape: [[0, 1, 1], [1, 1, 0]], color: '#00f000' },
            { type: 'Z', shape: [[1, 1, 0], [0, 1, 1]], color: '#f00000' },
            { type: 'J', shape: [[1, 0, 0], [1, 1, 1]], color: '#0000f0' },
            { type: 'L', shape: [[0, 0, 1], [1, 1, 1]], color: '#ffa500' }
        ];
        
        const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
        return {
            type: randomPiece.type,
            shape: randomPiece.shape,
            color: randomPiece.color,
            x: 0,
            y: 0
        };
    }
    
    /**
     * 이동 유효성 검사
     */
    isValidMove(x, y, shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    if (newX < 0 || newX >= this.boardWidth || 
                        newY >= this.boardHeight || 
                        (newY >= 0 && this.board[newY][newX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    /**
     * 행렬 회전
     */
    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = [];
        
        for (let col = 0; col < cols; col++) {
            rotated[col] = [];
            for (let row = rows - 1; row >= 0; row--) {
                rotated[col][rows - 1 - row] = matrix[row][col];
            }
        }
        
        return rotated;
    }
    
    /**
     * 보드 그리기
     */
    drawBoard() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 보드 그리기
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x]) {
                    this.drawBlock(x, y, this.board[y][x]);
                }
            }
        }
        
        // 현재 블록 그리기
        if (this.currentPiece) {
            this.drawPiece(this.currentPiece);
        }
        
        // 그리드 그리기
        this.drawGrid();
    }
    
    /**
     * 블록 그리기
     */
    drawBlock(x, y, type) {
        const blockSize = 30;
        const colors = {
            'I': '#00f5ff', 'O': '#ffff00', 'T': '#a000f0',
            'S': '#00f000', 'Z': '#f00000', 'J': '#0000f0', 'L': '#ffa500'
        };
        
        this.ctx.fillStyle = colors[type] || '#ffffff';
        this.ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        
        // 블록 테두리
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }
    
    /**
     * 블록 조각 그리기
     */
    drawPiece(piece) {
        const blockSize = 30;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    this.ctx.fillStyle = piece.color;
                    this.ctx.fillRect(
                        (piece.x + x) * blockSize,
                        (piece.y + y) * blockSize,
                        blockSize,
                        blockSize
                    );
                    
                    // 블록 테두리
                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(
                        (piece.x + x) * blockSize,
                        (piece.y + y) * blockSize,
                        blockSize,
                        blockSize
                    );
                }
            }
        }
    }
    
    /**
     * 그리드 그리기
     */
    drawGrid() {
        const blockSize = 30;
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 1;
        
        // 세로선
        for (let x = 0; x <= this.boardWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * blockSize, 0);
            this.ctx.lineTo(x * blockSize, this.boardHeight * blockSize);
            this.ctx.stroke();
        }
        
        // 가로선
        for (let y = 0; y <= this.boardHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * blockSize);
            this.ctx.lineTo(this.boardWidth * blockSize, y * blockSize);
            this.ctx.stroke();
        }
    }
    
    /**
     * 다음 블록 그리기
     */
    drawNextPiece() {
        this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (this.nextPiece) {
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
                        
                        this.nextCtx.strokeStyle = '#ffffff';
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
    }
    
    /**
     * 일시정지 화면 그리기
     */
    drawPauseScreen() {
        const pauseScreen = document.createElement('div');
        pauseScreen.className = 'pause-screen';
        pauseScreen.innerHTML = `
            <h2>⏸️ 일시정지</h2>
            <p>ESC 키를 누르거나 일시정지 버튼을 클릭하여 게임을 계속하세요.</p>
        `;
        
        this.canvas.parentElement.appendChild(pauseScreen);
    }
    
    /**
     * 게임 오버 화면 그리기
     */
    drawGameOverScreen() {
        const gameOverScreen = document.createElement('div');
        gameOverScreen.className = 'game-over';
        gameOverScreen.innerHTML = `
            <h2>💀 게임 오버</h2>
            <p>최종 점수: ${this.score}</p>
            <p>최고 점수: ${this.highScore}</p>
            <p>레벨: ${this.level}</p>
            <p>줄: ${this.lines}</p>
            <button onclick="tetrisGame.resetGame()">다시 시작</button>
        `;
        
        this.canvas.parentElement.appendChild(gameOverScreen);
    }
    
    /**
     * 화면 업데이트
     */
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
        document.getElementById('lines').textContent = this.lines;
        document.getElementById('level').textContent = this.level;
        document.getElementById('combo').textContent = this.combo;
    }
    
    /**
     * 사운드 재생
     */
    playSound(soundName) {
        if (this.soundManager) {
            this.soundManager.playSound(soundName);
        }
    }
    
    /**
     * 최고 점수 로드
     */
    loadHighScore() {
        const saved = localStorage.getItem('tetrisHighScore');
        return saved ? parseInt(saved) : 0;
    }
    
    /**
     * 최고 점수 저장
     */
    saveHighScore() {
        localStorage.setItem('tetrisHighScore', this.highScore.toString());
    }
}

// 게임 인스턴스 생성
let tetrisGame;

// DOM 로드 완료 후 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    tetrisGame = new TetrisGame();
    
    // 전역 변수로 설정 (게임 오버 화면에서 접근하기 위해)
    window.tetrisGame = tetrisGame;
});

// 모듈 내보내기 (ES6 모듈 지원 시)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TetrisGame;
}
