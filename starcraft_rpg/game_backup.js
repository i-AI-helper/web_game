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
            skills: { mining: 1, engineering: 1, combat: 1, diplomacy: 1 }
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
        
        this.addEventLog('게임이 초기화되었습니다.', 'system');
    }

    setupEventListeners() {
        // 메인 메뉴
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.showMenu('new-game-menu');
        });
        
        document.getElementById('load-game-btn').addEventListener('click', () => {
            this.showMenu('save-slots-menu');
        });
        
        // 새 게임
        document.getElementById('start-new-game-btn').addEventListener('click', () => {
            this.startNewGame();
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
        
        // 저장 슬롯 리스너 설정
        this.setupSaveSlotListeners();
    }

    setupSaveSlotListeners() {
        document.querySelectorAll('.load-slot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slot = e.target.dataset.slot;
                this.loadGameFromSlot(slot);
            });
        });
        
        document.querySelectorAll('.delete-slot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slot = e.target.dataset.slot;
                this.deleteSaveSlot(slot);
            });
        });
    }

    showMenu(menuName) {
        document.querySelectorAll('.game-menu, .new-game-menu, .save-slots-menu, .settings-menu, .credits-menu, .pause-menu').forEach(menu => {
            menu.classList.add('hidden');
        });
        
        document.getElementById(menuName).classList.remove('hidden');
        
        if (menuName === 'save-slots-menu') {
            this.updateSaveSlots();
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

    work() {
        if (this.player.energy < 20) {
            this.addEventLog('에너지가 부족하여 일할 수 없습니다.', 'error');
            return;
        }
        
        if (this.animations.working) {
            this.addEventLog('이미 일하고 있습니다.', 'warning');
            return;
        }
        
        this.animations.working = true;
        this.animations.mining = true;
        
        // 작업 애니메이션 시작
        document.getElementById('work-btn').classList.add('working');
        
        this.addEventLog('일을 시작했습니다...', 'system');
        
        // 3초 후 작업 완료
        setTimeout(() => {
            this.completeWork();
        }, 3000);
    }

    completeWork() {
        this.animations.working = false;
        this.animations.mining = false;
        document.getElementById('work-btn').classList.remove('working');
        
        const professionBonus = this.getProfessionBonus('mining');
        const skillBonus = this.player.skills.mining;
        
        const baseMineralGain = Math.floor(Math.random() * 10) + 5;
        const mineralGain = Math.floor(baseMineralGain * professionBonus * skillBonus);
        
        const gasChance = 0.3 + (this.player.skills.mining * 0.1);
        const gasGain = Math.random() < gasChance ? Math.floor(Math.random() * 3) + 1 : 0;
        
        this.resources.mineral += mineralGain;
        if (gasGain > 0) this.resources.gas += gasGain;
        
        this.player.energy -= 20;
        this.player.experience += 5;
        this.player.skills.mining += 0.1;
        
        this.addEventLog(`일을 완료하여 미네랄 ${mineralGain}개를 획득했습니다!`, 'success');
        if (gasGain > 0) {
            this.addEventLog(`가스 ${gasGain}개도 발견했습니다!`, 'success');
        }
        
        this.createMiningParticles();
        this.checkLevelUp();
        this.updateUI();
    }

    getProfessionBonus(skill) {
        const profession = this.player.profession;
        const bonuses = {
            miner: { mining: 1.5, engineering: 1.0, combat: 1.0, diplomacy: 1.0 },
            engineer: { mining: 1.0, engineering: 1.5, combat: 1.0, diplomacy: 1.0 },
            soldier: { mining: 1.0, engineering: 1.0, combat: 1.5, diplomacy: 1.0 },
            trader: { mining: 1.0, engineering: 1.0, combat: 1.0, diplomacy: 1.5 }
        };
        
        return bonuses[profession]?.[skill] || 1.0;
    }

    train() {
        if (this.resources.mineral < 10 || this.player.energy < 15) {
            this.addEventLog('자원이나 에너지가 부족하여 훈련할 수 없습니다.', 'error');
            return;
        }
        
        this.resources.mineral -= 10;
        this.player.energy -= 15;
        this.player.experience += 15;
        
        const skills = ['mining', 'engineering', 'combat', 'diplomacy'];
        const randomSkill = skills[Math.floor(Math.random() * skills.length)];
        const skillGain = 0.2 * this.getProfessionBonus(randomSkill);
        this.player.skills[randomSkill] += skillGain;
        
        this.addEventLog(`훈련을 통해 ${this.getSkillName(randomSkill)} 스킬이 향상되었습니다!`, 'success');
        this.checkLevelUp();
        this.updateUI();
    }

    getSkillName(skill) {
        const names = {
            mining: '채광',
            engineering: '공학',
            combat: '전투',
            diplomacy: '외교'
        };
        return names[skill] || skill;
    }

    explore() {
        if (this.player.energy < 25) {
            this.addEventLog('에너지가 부족하여 탐험할 수 없습니다.', 'error');
            return;
        }
        
        this.player.energy -= 25;
        this.player.experience += 10;
        
        const randomEvent = Math.random();
        if (randomEvent < 0.3) {
            const mineralBonus = Math.floor(Math.random() * 20) + 10;
            this.resources.mineral += mineralBonus;
            this.addEventLog(`탐험 중 미네랄 광맥을 발견하여 ${mineralBonus}개를 획득했습니다!`, 'success');
        } else if (randomEvent < 0.5) {
            this.addEventLog('탐험 중 적대적 생명체와 조우했습니다. 전투 스킬이 향상됩니다.', 'warning');
            this.player.skills.combat += 0.3;
        } else if (randomEvent < 0.7) {
            this.addEventLog('탐험 중 새로운 기술을 발견했습니다. 공학 스킬이 향상됩니다.', 'success');
            this.player.skills.engineering += 0.3;
        } else {
            this.addEventLog('탐험했지만 특별한 것을 발견하지 못했습니다.', 'system');
        }
        
        this.checkLevelUp();
        this.updateUI();
    }

    build() {
        if (this.resources.mineral < 50) {
            this.addEventLog('미네랄이 부족하여 건설할 수 없습니다.', 'error');
            return;
        }
        
        const buildOptions = [
            { name: 'barracks', cost: 50, mineral: 50, gas: 0, supply: 0, description: '배럭스' },
            { name: 'factory', cost: 100, mineral: 100, gas: 50, supply: 0, description: '팩토리' },
            { name: 'starport', cost: 150, mineral: 150, gas: 100, supply: 0, description: '스타포트' },
            { name: 'academy', cost: 75, mineral: 75, gas: 25, supply: 0, description: '아카데미' }
        ];
        
        for (let building of buildOptions) {
            if (this.resources.mineral >= building.mineral && this.resources.gas >= building.gas) {
                this.buildings[building.name]++;
                this.resources.mineral -= building.mineral;
                this.resources.gas -= building.gas;
                this.player.experience += 20;
                
                this.addEventLog(`${building.description}을(를) 건설했습니다!`, 'success');
                this.checkLevelUp();
                this.updateUI();
                return;
            }
        }
        
        this.addEventLog('건설할 수 있는 건물이 없습니다.', 'warning');
    }

    rest() {
        if (this.player.energy >= this.player.maxEnergy) {
            this.addEventLog('이미 에너지가 가득합니다.', 'warning');
            return;
        }
        
        const energyRecovery = Math.min(30, this.player.maxEnergy - this.player.energy);
        this.player.energy += energyRecovery;
        this.player.health = Math.min(this.player.maxHealth, this.player.health + 10);
        
        this.addEventLog(`휴식을 취하여 에너지를 ${energyRecovery}만큼 회복했습니다.`, 'success');
        this.updateUI();
    }

    checkLevelUp() {
        if (this.player.experience >= this.player.experienceToNext) {
            this.player.level++;
            this.player.experience -= this.player.experienceToNext;
            this.player.experienceToNext = Math.floor(this.player.experienceToNext * 1.5);
            
            this.player.maxHealth += 10;
            this.player.health = this.player.maxHealth;
            this.player.maxEnergy += 10;
            this.player.energy = this.player.maxEnergy;
            this.resources.maxSupply += 2;
            
            if (this.settings?.animations) {
                document.body.classList.add('levelup');
                setTimeout(() => {
                    document.body.classList.remove('levelup');
                }, 3000);
            }
            
            this.addEventLog(`🎉 레벨업! 레벨 ${this.player.level}이 되었습니다! 🎉`, 'success');
            this.addEventLog('체력과 에너지가 증가하고 인구수 제한이 늘어났습니다.', 'system');
        }
    }

    saveGame() {
        const saveData = {
            player: this.player,
            resources: this.resources,
            buildings: this.buildings,
            day: this.day,
            hour: this.hour,
            minute: this.minute,
            saveTime: Date.now()
        };
        
        localStorage.setItem('starcraftRPG_slot_1', JSON.stringify(saveData));
        this.addEventLog('게임이 자동 저장되었습니다.', 'system');
        this.showNotification('게임이 저장되었습니다!');
        this.updateSaveSlots();
    }

    loadGameFromSlot(slot) {
        const savedGame = localStorage.getItem(`starcraftRPG_slot_${slot}`);
        if (savedGame) {
            try {
                const gameData = JSON.parse(savedGame);
                this.player = gameData.player;
                this.resources = gameData.resources;
                this.buildings = gameData.buildings;
                this.day = gameData.day;
                this.hour = gameData.hour;
                this.minute = gameData.minute;
                
                this.gameState = 'playing';
                this.showMenu('game-screen');
                this.updateUI();
                
                this.addEventLog(`슬롯 ${slot}에서 게임을 불러왔습니다.`, 'system');
                this.showNotification(`슬롯 ${slot}에서 불러왔습니다!`);
            } catch (error) {
                this.addEventLog('저장 파일을 불러오는 중 오류가 발생했습니다.', 'error');
            }
        } else {
            this.addEventLog('저장된 게임이 없습니다.', 'warning');
        }
    }

    deleteSaveSlot(slot) {
        if (confirm(`정말로 슬롯 ${slot}의 저장 파일을 삭제하시겠습니까?`)) {
            localStorage.removeItem(`starcraftRPG_slot_${slot}`);
            this.updateSaveSlots();
            this.showNotification(`슬롯 ${slot}이 삭제되었습니다.`);
        }
    }

    updateSaveSlots() {
        for (let i = 1; i <= 3; i++) {
            const slotInfo = document.getElementById(`slot-${i}-info`);
            const savedGame = localStorage.getItem(`starcraftRPG_slot_${i}`);
            
            if (savedGame) {
                try {
                    const gameData = JSON.parse(savedGame);
                    const saveDate = new Date(gameData.saveTime);
                    const timeAgo = this.getTimeAgo(saveDate);
                    
                    slotInfo.innerHTML = `
                        <div>레벨 ${gameData.player.level}</div>
                        <div>Day ${gameData.day}</div>
                        <div>${timeAgo} 전</div>
                    `;
                } catch (error) {
                    slotInfo.textContent = '손상된 파일';
                }
            } else {
                slotInfo.textContent = '비어있음';
            }
        }
    }

    getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (days > 0) return `${days}일`;
        if (hours > 0) return `${hours}시간`;
        if (minutes > 0) return `${minutes}분`;
        return '방금 전';
    }

    addEventLog(message, type = 'normal') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        const logContent = document.getElementById('log-content');
        logContent.appendChild(logEntry);
        logContent.scrollTop = logContent.scrollHeight;
        
        if (logContent.children.length > 50) {
            logContent.removeChild(logContent.firstChild);
        }
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        const notificationText = notification.querySelector('.notification-text');
        
        notificationText.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
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

    createMiningParticles() {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: 400 + (Math.random() - 0.5) * 100,
                y: 300 + (Math.random() - 0.5) * 100,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 60,
                color: '#ffd700'
            });
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 60;
            this.ctx.fillRect(particle.x, particle.y, 3, 3);
        });
        this.ctx.globalAlpha = 1;
    }

    updateUI() {
        document.getElementById('mineral-count').textContent = this.resources.mineral;
        document.getElementById('gas-count').textContent = this.resources.gas;
        document.getElementById('supply-count').textContent = this.resources.supply;
        document.getElementById('supply-max').textContent = this.resources.maxSupply;
        
        document.getElementById('health-current').textContent = this.player.health;
        document.getElementById('health-max').textContent = this.player.maxHealth;
        document.getElementById('energy-current').textContent = this.player.energy;
        document.getElementById('energy-max').textContent = this.player.maxEnergy;
        document.getElementById('level').textContent = this.player.level;
        
        const gameTimeDisplay = document.getElementById('game-time-display');
        if (gameTimeDisplay) {
            gameTimeDisplay.textContent = `Day ${this.day}, ${String(this.hour).padStart(2, '0')}:${String(this.minute).padStart(2, '0')}`;
        }
        
        document.getElementById('work-btn').disabled = this.player.energy < 20 || this.animations.working;
        document.getElementById('train-btn').disabled = this.resources.mineral < 10 || this.player.energy < 15;
        document.getElementById('explore-btn').disabled = this.player.energy < 25;
        document.getElementById('build-btn').disabled = this.resources.mineral < 50;
        document.getElementById('rest-btn').disabled = this.player.energy >= this.player.maxEnergy;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawBackground();
        this.drawPlayer();
        this.drawBuildings();
        this.drawParticles();
        this.drawUI();
    }

    drawBackground() {
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 100; i++) {
            const x = (i * 37) % this.canvas.width;
            const y = (i * 73) % this.canvas.height;
            const size = (i % 3) + 1;
            this.ctx.fillRect(x, y, size, size);
        }
        
        this.ctx.fillStyle = '#2d4a3e';
        this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);
    }

    drawPlayer() {
        this.ctx.fillStyle = '#4a90e2';
        this.ctx.beginPath();
        this.ctx.arc(400, 300, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        const healthBarWidth = 40;
        const healthBarHeight = 4;
        const healthPercentage = this.player.health / this.player.maxHealth;
        
        this.ctx.fillStyle = '#ff4757';
        this.ctx.fillRect(400 - healthBarWidth/2, 280, healthBarWidth, healthBarHeight);
        this.ctx.fillStyle = '#2ed573';
        this.ctx.fillRect(400 - healthBarWidth/2, 280, healthBarWidth * healthPercentage, healthBarHeight);
        
        const energyBarWidth = 40;
        const energyBarHeight = 4;
        const energyPercentage = this.player.energy / this.player.maxEnergy;
        
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(400 - energyBarWidth/2, 275, energyBarWidth, energyBarHeight);
        this.ctx.fillStyle = '#2ed573';
        this.ctx.fillRect(400 - energyBarWidth/2, 275, energyBarWidth * energyPercentage, energyBarHeight);
    }

    drawBuildings() {
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
                
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(building.name, building.x, building.y + 40);
            }
        });
    }

    drawUI() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 100);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Day: ${this.day}`, 20, 30);
        this.ctx.fillText(`Level: ${this.player.level}`, 20, 50);
        this.ctx.fillText(`Exp: ${this.player.experience}/${this.player.experienceToNext}`, 20, 70);
        this.ctx.fillText(`Profession: ${this.getProfessionName(this.player.profession)}`, 20, 90);
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

    gameLoop() {
        if (this.gameState === 'playing') {
            this.gameTime++;
            
            if (this.gameTime % 1000 === 0) {
                this.minute++;
                if (this.minute >= 60) {
                    this.minute = 0;
                    this.hour++;
                    if (this.hour >= 24) {
                        this.hour = 0;
                        this.day++;
                        this.addEventLog(`새로운 하루가 시작되었습니다. (Day ${this.day})`, 'system');
                        
                        if (this.day % 5 === 0) {
                            this.saveGame();
                        }
                    }
                }
            }
            
            if (this.gameTime % 500 === 0 && this.player.energy < this.player.maxEnergy) {
                this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + 5);
                this.updateUI();
            }
            
            this.updateParticles();
        }
        
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('starcraftRPG_settings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
    }
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new StarcraftRPG();
});
