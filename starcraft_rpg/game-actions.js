// 게임 액션들을 StarcraftRPG 클래스에 추가
Object.assign(StarcraftRPG.prototype, {
    
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
        
        // GSAP 애니메이션 효과
        if (this.animateWorkButton) {
            this.animateWorkButton();
        } else {
            // 폴백: CSS 애니메이션
            const workBtn = document.getElementById('work-btn');
            if (workBtn) {
                workBtn.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    workBtn.style.animation = '';
                }, 500);
            }
        }
        
        // 작업 애니메이션 시작
        document.getElementById('work-btn').classList.add('working');
        
        this.addEventLog('일을 시작했습니다...', 'system');
        
        // 3초 후 작업 완료
        setTimeout(() => {
            this.completeWork();
        }, 3000);
    },

    completeWork() {
        this.animations.working = false;
        this.animations.mining = false;
        document.getElementById('work-btn').classList.remove('working');
        
        // 직업별 보너스 계산
        const professionBonus = this.getProfessionBonus('mining');
        const skillBonus = this.player.skills.mining;
        
        const baseMineralGain = Math.floor(Math.random() * 10) + 5;
        const mineralGain = Math.floor(baseMineralGain * professionBonus * skillBonus);
        
        const gasChance = 0.3 + (this.player.skills.mining * 0.1);
        const gasGain = Math.random() < gasChance ? Math.floor(Math.random() * 3) + 1 : 0;
        
        // 자원 획득
        this.resources.mineral += mineralGain;
        if (gasGain > 0) this.resources.gas += gasGain;
        
        // GSAP 자원 획득 애니메이션
        if (this.animateResourceGain) {
            this.animateResourceGain('mineral', mineralGain);
            if (gasGain > 0) {
                this.animateResourceGain('gas', gasGain);
            }
        }
        
        // 경험치와 스킬 향상
        this.player.energy -= 20;
        this.player.experience += 5;
        this.player.skills.mining += 0.1;
        
        // 결과 표시
        this.addEventLog(`일을 완료하여 미네랄 ${mineralGain}개를 획득했습니다!`, 'success');
        if (gasGain > 0) {
            this.addEventLog(`가스 ${gasGain}개도 발견했습니다!`, 'success');
        }
        
        // 파티클 효과
        this.createMiningParticles();
        
        this.checkLevelUp();
        this.updateUI();
    },

    getProfessionBonus(skill) {
        const profession = this.player.profession;
        const bonuses = {
            miner: { mining: 1.5, engineering: 1.0, combat: 1.0, diplomacy: 1.0 },
            engineer: { mining: 1.0, engineering: 1.5, combat: 1.0, diplomacy: 1.0 },
            soldier: { mining: 1.0, engineering: 1.0, combat: 1.5, diplomacy: 1.0 },
            trader: { mining: 1.0, engineering: 1.0, combat: 1.0, diplomacy: 1.5 }
        };
        
        return bonuses[profession]?.[skill] || 1.0;
    },

    train() {
        if (this.resources.mineral < 10 || this.player.energy < 15) {
            this.addEventLog('자원이나 에너지가 부족하여 훈련할 수 없습니다.', 'error');
            return;
        }
        
        this.resources.mineral -= 10;
        this.player.energy -= 15;
        this.player.experience += 15;
        
        // 랜덤하게 스킬 향상
        const skills = ['mining', 'engineering', 'combat', 'diplomacy'];
        const randomSkill = skills[Math.floor(Math.random() * skills.length)];
        const skillGain = 0.2 * this.getProfessionBonus(randomSkill);
        this.player.skills[randomSkill] += skillGain;
        
        this.addEventLog(`훈련을 통해 ${this.getSkillName(randomSkill)} 스킬이 향상되었습니다!`, 'success');
        this.checkLevelUp();
        this.updateUI();
    },

    getSkillName(skill) {
        const names = {
            mining: '채광',
            engineering: '공학',
            combat: '전투',
            diplomacy: '외교'
        };
        return names[skill] || skill;
    },

    explore() {
        if (this.player.energy < 25) {
            this.addEventLog('에너지가 부족하여 탐험할 수 없습니다.', 'error');
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
            this.addEventLog(`탐험 중 미네랄 광맥을 발견하여 ${mineralBonus}개를 획득했습니다!`, 'success');
        } else if (randomEvent < 0.5) {
            // 적대적 생명체와 조우
            this.addEventLog('탐험 중 적대적 생명체와 조우했습니다. 전투 스킬이 향상됩니다.', 'warning');
            this.player.skills.combat += 0.3;
        } else if (randomEvent < 0.7) {
            // 새로운 기술 발견
            this.addEventLog('탐험 중 새로운 기술을 발견했습니다. 공학 스킬이 향상됩니다.', 'success');
            this.player.skills.engineering += 0.3;
        } else {
            // 아무것도 발견하지 못함
            this.addEventLog('탐험했지만 특별한 것을 발견하지 못했습니다.', 'system');
        }
        
        this.checkLevelUp();
        this.updateUI();
    },

    build() {
        if (this.resources.mineral < 50) {
            this.addEventLog('미네랄이 부족하여 건설할 수 없습니다.', 'error');
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
                
                this.addEventLog(`${building.description}을(를) 건설했습니다!`, 'success');
                this.checkLevelUp();
                this.updateUI();
                return;
            }
        }
        
        this.addEventLog('건설할 수 있는 건물이 없습니다.', 'warning');
    },

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
    },

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
            
            // 레벨업 애니메이션
            if (this.settings?.animations) {
                // GSAP 레벨업 애니메이션
                if (this.animateLevelUp) {
                    this.animateLevelUp();
                } else {
                    // 폴백: CSS 애니메이션
                    document.body.classList.add('levelup');
                    setTimeout(() => {
                        document.body.classList.remove('levelup');
                    }, 3000);
                }
            }
            
            this.addEventLog(`🎉 레벨업! 레벨 ${this.player.level}이 되었습니다! 🎉`, 'success');
            this.addEventLog('체력과 에너지가 증가하고 인구수 제한이 늘어났습니다.', 'system');
        }
    }
});