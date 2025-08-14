// 스타크래프트 RPG 게임 핵심 클래스
class StarcraftRPG {
    constructor() {
        this.initializeGame();
        this.setupEventListeners();
        this.loadSettings();
        this.updateSaveSlots();
        this.startRealTimeClock();
        this.gameLoop();
    }

    initializeGame() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 게임 상태
        this.gameState = 'menu';
        this.gameTime = 0;
        this.gameSpeed = 1;
        this.day = 1;
        this.hour = 0;
        this.minute = 0;
        
        // 플레이어 상태
        this.player = {
            level: 1,
            experience: 0,
            experienceToNext: 100,
            health: 100,
            maxHealth: 100,
            energy: 100,
            maxEnergy: 100,
            profession: 'miner',
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
        
        // 건물
        this.buildings = {
            commandCenter: 1,
            barracks: 0,
            factory: 0,
            starport: 0,
            academy: 0
        };
        
        // 애니메이션 상태
        this.animations = {
            working: false,
            mining: false
        };
        
        // 파티클
        this.particles = [];
        
        // 설정 초기화
        this.settings = {
            autoSave: true,
            animations: true,
            soundEffects: true,
            gameSpeed: 1
        };
        
        // addEventLog가 정의된 후에 호출하도록 수정
        // this.addEventLog('게임이 초기화되었습니다.', 'system');
    }

    setupEventListeners() {
        // 메인 메뉴
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.showMenu('new-game-menu');
        });
        
        document.getElementById('load-game-btn').addEventListener('click', () => {
            this.showMenu('save-slots-menu');
        });
        
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showMenu('settings-menu');
        });
        
        document.getElementById('credits-btn').addEventListener('click', () => {
            this.showMenu('credits-menu');
        });
        
        // 새 게임
        document.getElementById('start-new-game-btn').addEventListener('click', () => {
            this.startNewGame();
        });
        
        document.getElementById('back-to-main-btn').addEventListener('click', () => {
            this.showMenu('game-menu');
        });
        
        // 저장 슬롯
        document.getElementById('back-to-main-from-save-btn').addEventListener('click', () => {
            this.showMenu('game-menu');
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
        
        // 게임 메뉴 버튼들
        document.getElementById('save-game-btn').addEventListener('click', () => {
            this.saveGame();
        });
        
        document.getElementById('pause-game-btn').addEventListener('click', () => {
            this.pauseGame();
        });
        
        document.getElementById('main-menu-btn').addEventListener('click', () => {
            this.returnToMainMenu();
        });
        
        // 저장 슬롯 리스너 설정
        this.setupSaveSlotListeners();
        
        // 키보드 단축키
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    setupSaveSlotListeners() {
        // 저장 슬롯 로드 버튼들
        document.querySelectorAll('.load-slot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slot = e.target.dataset.slot;
                this.loadGameFromSlot(slot);
            });
        });
        
        // 저장 슬롯 삭제 버튼들
        document.querySelectorAll('.delete-slot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slot = e.target.dataset.slot;
                this.deleteSaveSlot(slot);
            });
        });
    }

    showMenu(menuName) {
        // GSAP 애니메이션을 사용한 메뉴 전환
        if (this.animateMenuTransition) {
            this.animateMenuTransition(menuName);
        } else {
            // 폴백: 기본 메뉴 전환
            document.querySelectorAll('.game-menu, .new-game-menu, .save-slots-menu, .settings-menu, .credits-menu, .pause-menu').forEach(menu => {
                menu.classList.add('hidden');
            });
            
            document.getElementById(menuName).classList.remove('hidden');
            
            if (menuName === 'save-slots-menu') {
                this.updateSaveSlots();
            }
        }
    }

    startNewGame() {
        const difficulty = document.getElementById('difficulty-select').value;
        const profession = document.getElementById('character-select').value;
        
        this.player.profession = profession;
        this.applyDifficultySettings(difficulty);
        this.applyProfessionBonuses(profession);
        
        this.gameState = 'playing';
        this.showMenu('game-screen');
        this.addEventLog('새로운 게임이 시작되었습니다!', 'system');
        this.addEventLog(`${this.getProfessionName(profession)}으로 시작합니다.`, 'success');
        
        this.updateUI();
    }

    applyDifficultySettings(difficulty) {
        const multipliers = {
            easy: { exp: 1.5, resource: 1.3, health: 1.2 },
            normal: { exp: 1.0, resource: 1.0, health: 1.0 },
            hard: { exp: 0.8, resource: 0.7, health: 0.8 },
            nightmare: { exp: 0.5, resource: 0.5, health: 0.6 }
        };
        
        const mult = multipliers[difficulty];
        this.player.experienceToNext = Math.floor(this.player.experienceToNext * mult.exp);
        this.resources.mineral = Math.floor(this.resources.mineral * mult.resource);
        this.player.maxHealth = Math.floor(this.player.maxHealth * mult.health);
        this.player.health = this.player.maxHealth;
    }

    applyProfessionBonuses(profession) {
        const bonuses = {
            miner: { mining: 2.0, energy: 1.2 },
            engineer: { engineering: 2.0, maxEnergy: 1.3 },
            soldier: { combat: 2.0, maxHealth: 1.3 },
            trader: { diplomacy: 2.0, maxSupply: 1.2 }
        };
        
        const bonus = bonuses[profession];
        if (bonus) {
            Object.keys(bonus).forEach(key => {
                if (key === 'maxEnergy') {
                    this.player.maxEnergy = Math.floor(this.player.maxEnergy * bonus[key]);
                    this.player.energy = this.player.maxEnergy;
                } else if (key === 'maxHealth') {
                    this.player.maxHealth = Math.floor(this.player.maxHealth * bonus[key]);
                    this.player.health = this.player.maxHealth;
                } else if (key === 'maxSupply') {
                    this.resources.maxSupply = Math.floor(this.resources.maxSupply * bonus[key]);
                } else {
                    this.player.skills[key] *= bonus[key];
                }
            });
        }
    }

    getProfessionName(profession) {
        const names = {
            miner: '광부',
            engineer: '기술자',
            soldier: '군인',
            trader: '상인'
        };
        return names[profession] || '시민';
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('starcraftRPG_settings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
    }

    startRealTimeClock() {
        setInterval(() => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('ko-KR');
            const realTimeDisplay = document.getElementById('real-time-display');
            if (realTimeDisplay) {
                realTimeDisplay.textContent = timeString;
            }
        }, 1000);
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
        
        // 게임 시간 업데이트
        const gameTimeDisplay = document.getElementById('game-time-display');
        if (gameTimeDisplay) {
            gameTimeDisplay.textContent = `Day ${this.day}, ${String(this.hour).padStart(2, '0')}:${String(this.minute).padStart(2, '0')}`;
        }
        
        // 버튼 활성화/비활성화
        document.getElementById('work-btn').disabled = this.player.energy < 20 || this.animations.working;
        document.getElementById('train-btn').disabled = this.resources.mineral < 10 || this.player.energy < 15;
        document.getElementById('explore-btn').disabled = this.player.energy < 25;
        document.getElementById('build-btn').disabled = this.resources.mineral < 50;
        document.getElementById('rest-btn').disabled = this.player.energy >= this.player.maxEnergy;
    }

    gameLoop() {
        if (this.gameState === 'playing') {
            this.gameTime++;
            
            // 게임 시간 업데이트
            if (this.gameTime % 1000 === 0) {
                this.minute++;
                if (this.minute >= 60) {
                    this.minute = 0;
                    this.hour++;
                    if (this.hour >= 24) {
                        this.hour = 0;
                        this.day++;
                        this.addEventLog(`새로운 하루가 시작되었습니다. (Day ${this.day})`, 'system');
                        
                        // 자동 저장
                        if (this.day % 5 === 0) {
                            this.saveGame();
                        }
                    }
                }
            }
            
            // 에너지 자동 회복
            if (this.gameTime % 500 === 0 && this.player.energy < this.player.maxEnergy) {
                this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + 5);
                this.updateUI();
            }
            
            // 파티클 업데이트
            this.updateParticles();
        }
        
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    handleKeyboardShortcuts(e) {
        if (e.key === 's' && e.ctrlKey) {
            e.preventDefault();
            this.saveGame();
        } else if (e.key === 'Escape') {
            if (this.gameState === 'playing') {
                this.pauseGame();
            } else if (this.gameState === 'paused') {
                this.resumeGame();
            }
        } else if (e.key === '1' && this.gameState === 'playing') {
            this.work();
        } else if (e.key === '2' && this.gameState === 'playing') {
            this.train();
        } else if (e.key === '3' && this.gameState === 'playing') {
            this.explore();
        } else if (e.key === '4' && this.gameState === 'playing') {
            this.build();
        } else if (e.key === '5' && this.gameState === 'playing') {
            this.rest();
        }
    }
}
