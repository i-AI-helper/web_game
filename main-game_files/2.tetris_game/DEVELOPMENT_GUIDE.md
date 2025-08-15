# 🔧 테트릭스 게임 개발 가이드

## 📋 프로젝트 구조

```
tetris_game/
├── index.html          # 메인 HTML 파일
├── style.css           # CSS 스타일시트
├── tetris.js           # 게임 로직 JavaScript
├── README.md           # 기본 설명서
├── GAME_DETAILS.md     # 게임 상세 설명서
├── DEVELOPMENT_GUIDE.md # 개발 가이드 (현재 파일)
└── CHANGELOG.md        # 변경 이력
```

## 🏗️ 아키텍처 개요

### 클래스 구조
```javascript
class Tetris {
    constructor()     // 초기화 및 설정
    init()           // 이벤트 바인딩 및 초기 렌더링
    bindEvents()     // 키보드 및 터치 이벤트 처리
    bindTouchEvents() // 모바일 터치 이벤트
    gameLoop()       // 메인 게임 루프
    // ... 기타 메서드들
}
```

### 핵심 컴포넌트
1. **게임 보드 관리**: 2D 배열로 블록 상태 추적
2. **블록 생성**: 7가지 테트로미노 랜덤 생성
3. **충돌 감지**: 블록 이동 및 회전 시 경계 확인
4. **줄 제거**: 완성된 줄 감지 및 제거
5. **점수 시스템**: 콤보 및 보너스 점수 계산

## 💻 코드 상세 분석

### 1. 게임 보드 초기화
```javascript
this.board = Array(this.BOARD_HEIGHT).fill()
    .map(() => Array(this.BOARD_WIDTH).fill(0));
```
- **BOARD_HEIGHT**: 20 (세로)
- **BOARD_WIDTH**: 10 (가로)
- **0**: 빈 공간, 색상 코드: 블록이 있는 공간

### 2. 테트로미노 블록 정의
```javascript
this.pieces = [
    [[1, 1, 1, 1]],           // I 블록
    [[1, 1], [1, 1]],         // O 블록
    [[0, 1, 0], [1, 1, 1]],   // T 블록
    // ... 기타 블록들
];
```
- **2D 배열**: 각 블록의 모양을 0과 1로 표현
- **1**: 블록이 차지하는 공간
- **0**: 빈 공간

### 3. 블록 회전 알고리즘
```javascript
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
```
- **수학적 원리**: 90도 시계방향 회전
- **새로운 좌표**: `(j, rows-1-i)`

### 4. 충돌 감지 시스템
```javascript
isCollision(piece, dx, dy) {
    const newX = piece.x + dx;
    const newY = piece.y + dy;
    
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const boardX = newX + x;
                const boardY = newY + y;
                
                // 경계 확인 및 다른 블록과의 충돌 확인
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
```

### 5. 콤보 시스템
```javascript
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
        // 콤보 계산
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
```

## 🎨 렌더링 시스템

### Canvas 렌더링
```javascript
drawBoard() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 보드에 있는 블록들 그리기
    for (let y = 0; y < this.BOARD_HEIGHT; y++) {
        for (let x = 0; x < this.BOARD_WIDTH; x++) {
            if (this.board[y][x]) {
                this.drawBlock(x, y, this.board[y][x]);
            }
        }
    }
    
    // 현재 움직이는 블록 그리기
    if (this.currentPiece) {
        this.drawPiece(this.currentPiece);
    }
    
    // 그리드 라인 그리기
    this.drawGrid();
}
```

### 블록 그리기
```javascript
drawBlock(x, y, color) {
    // 메인 블록
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, 
                     this.BLOCK_SIZE, this.BLOCK_SIZE);
    
    // 테두리
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, 
                        this.BLOCK_SIZE, this.BLOCK_SIZE);
    
    // 하이라이트 효과 (3D 느낌)
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(x * this.BLOCK_SIZE + 2, y * this.BLOCK_SIZE + 2, 
                      this.BLOCK_SIZE - 4, 2);
    this.ctx.fillRect(x * this.BLOCK_SIZE + 2, y * this.BLOCK_SIZE + 2, 
                      2, this.BLOCK_SIZE - 4);
}
```

## 📱 모바일 터치 지원

### 터치 이벤트 처리
```javascript
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
        
        // 스와이프 방향에 따른 동작
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 30) this.movePiece(1, 0);   // 오른쪽
            else if (deltaX < -30) this.movePiece(-1, 0); // 왼쪽
        } else {
            if (deltaY > 30) this.movePiece(0, 1);   // 아래
            else if (deltaY < -30) this.rotatePiece(); // 위 (회전)
        }
    });
}
```

### 더블 탭 감지
```javascript
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
```

## 🎯 성능 최적화

### 1. requestAnimationFrame 사용
```javascript
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
```

### 2. 효율적인 렌더링
- **부분 업데이트**: 변경된 부분만 다시 그리기
- **이중 버퍼링**: Canvas의 내장 이중 버퍼 활용
- **메모리 관리**: 불필요한 객체 생성 최소화

### 3. 이벤트 최적화
- **디바운싱**: 키보드 입력 처리 최적화
- **터치 감도**: 적절한 스와이프 임계값 설정

## 🐛 디버깅 및 테스트

### 콘솔 로그
```javascript
// 개발 모드에서만 활성화
if (this.debugMode) {
    console.log('Score:', this.score);
    console.log('Level:', this.level);
    console.log('Combo:', this.combo);
}
```

### 게임 상태 확인
```javascript
getGameState() {
    return {
        score: this.score,
        lines: this.lines,
        level: this.level,
        combo: this.combo,
        gameRunning: this.gameRunning,
        gamePaused: this.gamePaused
    };
}
```

## 🚀 확장 가능성

### 새로운 블록 추가
```javascript
// 새로운 블록 타입 추가
this.pieces.push([
    [1, 1, 1],
    [0, 1, 0]
]);

// 새로운 색상 추가
this.colors.push('#ff00ff');
```

### 새로운 게임 모드
```javascript
class TimeAttackMode extends Tetris {
    constructor() {
        super();
        this.timeLimit = 120; // 2분
        this.timeRemaining = this.timeLimit;
    }
    
    gameLoop() {
        super.gameLoop();
        this.updateTimer();
    }
}
```

## 📚 참고 자료

### HTML5 Canvas
- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)

### JavaScript 게임 개발
- [Game Development Patterns](https://gameprogrammingpatterns.com/)
- [JavaScript Game Development](https://developer.mozilla.org/en-US/docs/Games)

### 테트릭스 알고리즘
- [Tetris Wiki](https://tetris.wiki/)
- [SRS Rotation System](https://tetris.wiki/SRS)

---

**개발자**: AI 어시스턴트 + 사용자  
**마지막 업데이트**: 2025년 8월 14일  
**버전**: v0.2.1
