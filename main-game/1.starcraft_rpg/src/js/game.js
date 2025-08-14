class StarcraftRPG {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameMenu = document.getElementById('game-menu');
        
        // 게임 상태
        this.gameState = 'menu'; // menu, playing, paused
        this.gameTime = 0;
        this.day = 1;
        
        // 플레이어 상태
        this.player = {
            level: 1,
            experience: 0,
            experienceToNext: 100,
            health: 100,
            maxHealth: 100,
            energy: 100,
            maxEnergy: 100,
            skills: {
                mining: 1,
                engineering: 1,
                combat: 1,
                diplomacy: 1
            }
        };
        
        // 자원
        this.resources = {
            mineral: 50,
            gas: 0,
            supply: 1,
            maxSupply: 8
        };
        
        // 건물과 시설
        this.buildings = {
            commandCenter: 1,
            barracks: 0,
            factory: 0,
            starport: 0,
            academy: 0
        };
        
        // 이벤트 시스템
        this.events = [];
        this.eventLog = [];
        
        this.initializeGame();
        this.setupEventListeners();
        this.gameLoop();
    }
    
    initializeGame() {
        this.addEventLog('테란 연합의 새로운 정착지에 도착했습니다.');
        this.addEventLog('당신은 이곳에서 새로운 인생을 시작할 수 있습니다.');
        this.updateUI();
    }
    
    setupEventListeners() {
        // 메뉴 버튼들
        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('load-game-btn').addEventListener('click', () => {
            this.loadGame();
        });
        
        // 액션 버튼들
        document.getElementById('work-btn').addEventListener('click', () => {
            this.work();
        });
        
        document.getElementById('train-btn').addEventListener('click', () => {
            this.train();
        });
        
        document.getElementById('explore-btn').addEventListener('click', () => {
            this.explore();
        });
        
        document.getElementById('build-btn').addEventListener('click', () => {
            this.build();
        });
        
        document.getElementById('rest-btn').addEventListener('click', () => {
            this.rest();
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.gameMenu.classList.add('hidden');
        this.addEventLog('게임을 시작합니다!');
        this.addEventLog('일하기, 훈련하기, 탐험하기 등의 액션을 통해 발전하세요.');
    }
    
    loadGame() {
        const savedGame = localStorage.getItem('starcraftRPG_save');
        if (savedGame) {
            const gameData = JSON.parse(savedGame);
            this.player = gameData.player;
            this.resources = gameData.resources;
            this.buildings = gameData.buildings;
            this.day = gameData.day;
            this.eventLog = gameData.eventLog || [];
            this.updateUI();
            this.addEventLog('게임을 불러왔습니다.');
        } else {
            this.addEventLog('저장된 게임이 없습니다.');
        }
    }
    
    saveGame() {
        const gameData = {
            player: this.player,
            resources: this.resources,
            buildings: this.buildings,
            day: this.day,
            eventLog: this.eventLog
        };
        localStorage.setItem('starcraftRPG_save', JSON.stringify(gameData));
        this.addEventLog('게임을 저장했습니다.');
    }
    
    work() {
        if (this.player.energy < 20) {
            this.addEventLog('에너지가 부족하여 일할 수 없습니다.');
            return;
        }
        
        const mineralGain = Math.floor(Math.random() * 10) + 5 + this.player.skills.mining;
        const gasGain = Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 1 : 0;
        
        this.resources.mineral += mineralGain;
        if (gasGain > 0) this.resources.gas += gasGain;
        
        this.player.energy -= 20;
        this.player.experience += 5;
        this.player.skills.mining += 0.1;
        
        this.addEventLog(`일을 하여 미네랄 ${mineralGain}개를 획득했습니다.`);
        if (gasGain > 0) this.addEventLog(`가스 ${gasGain}개도 발견했습니다!`);
        
        this.checkLevelUp();
        this.updateUI();
    }
    
    train() {
        if (this.resources.mineral < 10 || this.player.energy < 15) {
            this.addEventLog('자원이나 에너지가 부족하여 훈련할 수 없습니다.');
            return;
        }
        
        this.resources.mineral -= 10;
        this.player.energy -= 15;
        this.player.experience += 15;
        
        // 랜덤하게 스킬 향상
        const skills = ['mining', 'engineering', 'combat', 'diplomacy'];
        const randomSkill = skills[Math.floor(Math.random() * skills.length)];
        this.player.skills[randomSkill] += 0.2;
        
        this.addEventLog('훈련을 통해 경험과 스킬을 향상시켰습니다.');
        this.checkLevelUp();
        this.updateUI();
    }
    
    explore() {
        if (this.player.energy < 25) {
            this.addEventLog('에너지가 부족하여 탐험할 수 없습니다.');
            return;
        }
        
        this.player.energy -= 25;
        this.player.experience += 10;
        
        // 랜덤 이벤트 발생
        const randomEvent = Math.random();
        if (randomEvent < 0.3) {
            // 자원 발견
            const mineralBonus = Math.floor(Math.random() * 20) + 10;
            this.resources.mineral += mineralBonus;
            this.addEventLog(`탐험 중 미네랄 광맥을 발견하여 ${mineralBonus}개를 획득했습니다!`);
        } else if (randomEvent < 0.5) {
            // 적대적 생명체와 조우
            this.addEventLog('탐험 중 적대적 생명체와 조우했습니다. 전투 스킬이 향상됩니다.');
            this.player.skills.combat += 0.3;
        } else if (randomEvent < 0.7) {
            // 새로운 기술 발견
            this.addEventLog('탐험 중 새로운 기술을 발견했습니다. 공학 스킬이 향상됩니다.');
            this.player.skills.engineering += 0.3;
        } else {
            // 아무것도 발견하지 못함
            this.addEventLog('탐험했지만 특별한 것을 발견하지 못했습니다.');
        }
        
        this.checkLevelUp();
        this.updateUI();
    }
    
    build() {
        if (this.resources.mineral < 50) {
            this.addEventLog('미네랄이 부족하여 건설할 수 없습니다.');
            return;
        }
        
        // 건설 가능한 건물들
        const buildOptions = [
            { name: 'barracks', cost: 50, mineral: 50, gas: 0, supply: 0, description: '배럭스' },
            { name: 'factory', cost: 100, mineral: 100, gas: 50, supply: 0, description: '팩토리' },
            { name: 'starport', cost: 150, mineral: 150, gas: 100, supply: 0, description: '스타포트' },
            { name: 'academy', cost: 75, mineral: 75, gas: 25, supply: 0, description: '아카데미' }
        ];
        
        // 가장 저렴한 건물부터 건설 시도
        for (let building of buildOptions) {
            if (this.resources.mineral >= building.mineral && this.resources.gas >= building.gas) {
                this.buildings[building.name]++;
                this.resources.mineral -= building.mineral;
                this.resources.gas -= building.gas;
                this.player.experience += 20;
                
                this.addEventLog(`${building.description}을(를) 건설했습니다!`);
                this.checkLevelUp();
                this.updateUI();
                return;
            }
        }
        
        this.addEventLog('건설할 수 있는 건물이 없습니다.');
    }
    
    rest() {
        if (this.player.energy >= this.player.maxEnergy) {
            this.addEventLog('이미 에너지가 가득합니다.');
            return;
        }
        
        const energyRecovery = Math.min(30, this.player.maxEnergy - this.player.energy);
        this.player.energy += energyRecovery;
        this.player.health = Math.min(this.player.maxHealth, this.player.health + 10);
        
        this.addEventLog(`휴식을 취하여 에너지를 ${energyRecovery}만큼 회복했습니다.`);
        this.updateUI();
    }
    
    checkLevelUp() {
        if (this.player.experience >= this.player.experienceToNext) {
            this.player.level++;
            this.player.experience -= this.player.experienceToNext;
            this.player.experienceToNext = Math.floor(this.player.experienceToNext * 1.5);
            
            // 레벨업 보상
            this.player.maxHealth += 10;
            this.player.health = this.player.maxHealth;
            this.player.maxEnergy += 10;
            this.player.energy = this.player.maxEnergy;
            this.resources.maxSupply += 2;
            
            this.addEventLog(`레벨업! 레벨 ${this.player.level}이 되었습니다!`);
            this.addEventLog('체력과 에너지가 증가하고 인구수 제한이 늘어났습니다.');
        }
    }
    
    addEventLog(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        const logContent = document.getElementById('log-content');
        logContent.appendChild(logEntry);
        logContent.scrollTop = logContent.scrollHeight;
        
        // 로그 항목이 너무 많아지면 오래된 것들 제거
        if (logContent.children.length > 50) {
            logContent.removeChild(logContent.firstChild);
        }
        
        this.eventLog.push({ time: timestamp, message: message });
    }
    
    updateUI() {
        // 자원 표시 업데이트
        document.getElementById('mineral-count').textContent = this.resources.mineral;
        document.getElementById('gas-count').textContent = this.resources.gas;
        document.getElementById('supply-count').textContent = this.resources.supply;
        document.getElementById('supply-max').textContent = this.resources.maxSupply;
        
        // 캐릭터 스탯 업데이트
        document.getElementById('health-current').textContent = this.player.health;
        document.getElementById('health-max').textContent = this.player.maxHealth;
        document.getElementById('energy-current').textContent = this.player.energy;
        document.getElementById('energy-max').textContent = this.player.maxEnergy;
        document.getElementById('level').textContent = this.player.level;
        
        // 버튼 활성화/비활성화
        document.getElementById('work-btn').disabled = this.player.energy < 20;
        document.getElementById('train-btn').disabled = this.resources.mineral < 10 || this.player.energy < 15;
        document.getElementById('explore-btn').disabled = this.player.energy < 25;
        document.getElementById('build-btn').disabled = this.resources.mineral < 50;
        document.getElementById('rest-btn').disabled = this.player.energy >= this.player.maxEnergy;
    }
    
    render() {
        // 캔버스 클리어
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 배경 그리기
        this.drawBackground();
        
        // 플레이어 캐릭터 그리기
        this.drawPlayer();
        
        // 건물들 그리기
        this.drawBuildings();
        
        // UI 요소들 그리기
        this.drawUI();
    }
    
    drawBackground() {
        // 우주 배경
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 별들
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 100; i++) {
            const x = (i * 37) % this.canvas.width;
            const y = (i * 73) % this.canvas.height;
            const size = (i % 3) + 1;
            this.ctx.fillRect(x, y, size, size);
        }
        
        // 행성 표면
        this.ctx.fillStyle = '#2d4a3e';
        this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);
    }
    
    drawPlayer() {
        // 플레이어 캐릭터 (간단한 원형)
        this.ctx.fillStyle = '#4a90e2';
        this.ctx.beginPath();
        this.ctx.arc(400, 300, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 체력 바
        const healthBarWidth = 40;
        const healthBarHeight = 4;
        const healthPercentage = this.player.health / this.player.maxHealth;
        
        this.ctx.fillStyle = '#ff4757';
        this.ctx.fillRect(400 - healthBarWidth/2, 280, healthBarWidth, healthBarHeight);
        this.ctx.fillStyle = '#2ed573';
        this.ctx.fillRect(400 - healthBarWidth/2, 280, healthBarWidth * healthPercentage, healthBarHeight);
    }
    
    drawBuildings() {
        // 건물들을 간단한 사각형으로 표시
        const buildingPositions = [
            { x: 200, y: 500, name: 'commandCenter', color: '#ffd700' },
            { x: 300, y: 500, name: 'barracks', color: '#ff6b6b' },
            { x: 400, y: 500, name: 'factory', color: '#4ecdc4' },
            { x: 500, y: 500, name: 'starport', color: '#45b7d1' },
            { x: 600, y: 500, name: 'academy', color: '#96ceb4' }
        ];
        
        buildingPositions.forEach(building => {
            if (this.buildings[building.name] > 0) {
                this.ctx.fillStyle = building.color;
                this.ctx.fillRect(building.x - 25, building.y - 25, 50, 50);
                
                // 건물 이름
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(building.name, building.x, building.y + 40);
            }
        });
    }
    
    drawUI() {
        // 게임 정보 표시
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 80);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Day: ${this.day}`, 20, 30);
        this.ctx.fillText(`Level: ${this.player.level}`, 20, 50);
        this.ctx.fillText(`Exp: ${this.player.experience}/${this.player.experienceToNext}`, 20, 70);
    }
    
    gameLoop() {
        if (this.gameState === 'playing') {
            this.gameTime++;
            
            // 매 1000 프레임마다 하루 증가
            if (this.gameTime % 1000 === 0) {
                this.day++;
                this.addEventLog(`새로운 하루가 시작되었습니다. (Day ${this.day})`);
                
                // 자동 저장
                if (this.day % 5 === 0) {
                    this.saveGame();
                }
            }
            
            // 에너지 자동 회복 (매 500 프레임마다)
            if (this.gameTime % 500 === 0 && this.player.energy < this.player.maxEnergy) {
                this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + 5);
                this.updateUI();
            }
        }
        
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    new StarcraftRPG();
});

// 키보드 단축키
document.addEventListener('keydown', (e) => {
    if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        // 게임 저장 (Ctrl+S)
        if (window.gameInstance) {
            window.gameInstance.saveGame();
        }
    }
});
