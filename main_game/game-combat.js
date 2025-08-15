// 전투 시스템을 StarcraftRPG 클래스에 추가
Object.assign(StarcraftRPG.prototype, {
    
    // 전투 시작
    startCombat() {
        this.inCombat = true;
        this.gameState = 'combat';
        
        // 전투 UI 표시
        this.showCombatUI();
        
        // 전투 로그 시작
        this.addEventLog('⚔️ 전투가 시작되었습니다!', 'warning');
        this.addEventLog(`적: ${this.currentEnemy.name} (레벨 ${this.currentEnemy.level})`, 'info');
        this.addEventLog(`체력: ${this.currentEnemy.health}/${this.currentEnemy.maxHealth}`, 'info');
    },
    
    // 전투 UI 표시
    showCombatUI() {
        // 기존 액션 버튼들 숨기기
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.style.display = 'none';
        });
        
        // 전투 버튼들 표시
        this.showCombatButtons();
        
        // 적 정보 표시
        this.updateEnemyInfo();
    },
    
    // 전투 버튼들 표시
    showCombatButtons() {
        const actionPanel = document.querySelector('.action-panel');
        
        // 기존 전투 버튼들 제거
        actionPanel.querySelectorAll('.combat-btn').forEach(btn => btn.remove());
        
        // 새로운 전투 버튼들 추가
        const combatButtons = [
            { id: 'attack-btn', icon: '⚔️', text: '공격', cost: '에너지 15' },
            { id: 'special-btn', icon: '✨', text: '특수공격', cost: '에너지 25' },
            { id: 'defend-btn', icon: '🛡️', text: '방어', cost: '에너지 10' },
            { id: 'item-btn', icon: '💊', text: '아이템', cost: '무료' },
            { id: 'flee-btn', icon: '🏃', text: '도망', cost: '에너지 20' }
        ];
        
        combatButtons.forEach(btn => {
            const button = document.createElement('button');
            button.id = btn.id;
            button.className = 'action-btn combat-btn';
            button.innerHTML = `
                <span class="btn-icon">${btn.icon}</span>
                <span class="btn-text">${btn.text}</span>
                <span class="btn-cost">${btn.cost}</span>
            `;
            
            // 버튼 이벤트 리스너 추가
            button.addEventListener('click', () => this.handleCombatAction(btn.id));
            
            actionPanel.appendChild(button);
        });
    },
    
    // 적 정보 업데이트
    updateEnemyInfo() {
        if (!this.currentEnemy) return;
        
        // 적 정보를 표시할 요소 생성 또는 업데이트
        let enemyInfo = document.getElementById('enemy-info');
        if (!enemyInfo) {
            enemyInfo = document.createElement('div');
            enemyInfo.id = 'enemy-info';
            enemyInfo.className = 'enemy-info';
            document.querySelector('.game-screen').appendChild(enemyInfo);
        }
        
        enemyInfo.innerHTML = `
            <div class="enemy-header">
                <h3>${this.currentEnemy.image} ${this.currentEnemy.name}</h3>
                <span class="enemy-level">레벨 ${this.currentEnemy.level}</span>
            </div>
            <div class="enemy-stats">
                <div class="enemy-health">
                    <span class="stat-label">체력:</span>
                    <div class="health-bar">
                        <div class="health-fill" style="width: ${(this.currentEnemy.health / this.currentEnemy.maxHealth) * 100}%"></div>
                    </div>
                    <span class="health-text">${this.currentEnemy.health}/${this.currentEnemy.maxHealth}</span>
                </div>
                <div class="enemy-abilities">
                    <span class="stat-label">능력:</span>
                    <span class="abilities">${this.currentEnemy.abilities.map(ability => this.getAbilityName(ability)).join(', ')}</span>
                </div>
            </div>
        `;
    },
    
    // 능력 이름 반환
    getAbilityName(ability) {
        const abilityNames = {
            'swarm': '군집',
            'fast': '빠름',
            'charge': '돌진',
            'shield': '방패',
            'stim': '자극제',
            'range': '원거리'
        };
        
        return abilityNames[ability] || ability;
    },
    
    // 전투 액션 처리
    handleCombatAction(action) {
        if (!this.inCombat || !this.currentEnemy) return;
        
        switch (action) {
            case 'attack-btn':
                this.playerAttack();
                break;
            case 'special-btn':
                this.playerSpecialAttack();
                break;
            case 'defend-btn':
                this.playerDefend();
                break;
            case 'item-btn':
                this.useItem();
                break;
            case 'flee-btn':
                this.playerFlee();
                break;
        }
    },
    
    // 플레이어 공격
    playerAttack() {
        if (this.player.energy < 15) {
            this.addEventLog('에너지가 부족합니다!', 'error');
            return;
        }
        
        this.player.energy -= 15;
        
        // 공격력 계산 (플레이어 공격력 + 무작위 요소)
        const baseAttack = this.player.skills.combat * 10;
        const randomFactor = Math.random() * 20 + 10;
        const totalAttack = Math.floor(baseAttack + randomFactor);
        
        // 적 방어력 고려
        const actualDamage = Math.max(1, totalAttack - this.currentEnemy.defense);
        
        // 적 체력 감소
        this.currentEnemy.health = Math.max(0, this.currentEnemy.health - actualDamage);
        
        this.addEventLog(`⚔️ ${actualDamage}의 데미지를 입혔습니다!`, 'success');
        this.updateEnemyInfo();
        
        // 적 사망 확인
        if (this.currentEnemy.health <= 0) {
            this.enemyDefeated();
        } else {
            // 적 반격
            setTimeout(() => this.enemyAttack(), 1000);
        }
        
        this.updateUI();
    },
    
    // 플레이어 특수공격
    playerSpecialAttack() {
        if (this.player.energy < 25) {
            this.addEventLog('에너지가 부족합니다!', 'error');
            return;
        }
        
        this.player.energy -= 25;
        
        // 특수공격은 일반 공격보다 강함
        const baseAttack = this.player.skills.combat * 15;
        const randomFactor = Math.random() * 30 + 20;
        const totalAttack = Math.floor(baseAttack + randomFactor);
        
        // 적 방어력 고려
        const actualDamage = Math.max(1, totalAttack - this.currentEnemy.defense);
        
        // 적 체력 감소
        this.currentEnemy.health = Math.max(0, this.currentEnemy.health - actualDamage);
        
        this.addEventLog(`✨ 특수공격! ${actualDamage}의 데미지를 입혔습니다!`, 'success');
        this.updateEnemyInfo();
        
        // 적 사망 확인
        if (this.currentEnemy.health <= 0) {
            this.enemyDefeated();
        } else {
            // 적 반격
            setTimeout(() => this.enemyAttack(), 1000);
        }
        
        this.updateUI();
    },
    
    // 플레이어 방어
    playerDefend() {
        if (this.player.energy < 10) {
            this.addEventLog('에너지가 부족합니다!', 'error');
            return;
        }
        
        this.player.energy -= 10;
        
        // 방어 상태 설정 (다음 공격 데미지 감소)
        this.player.defending = true;
        
        this.addEventLog('🛡️ 방어 자세를 취했습니다!', 'info');
        
        // 적 공격
        setTimeout(() => this.enemyAttack(), 1000);
        this.updateUI();
    },
    
    // 아이템 사용
    useItem() {
        // 현재는 간단한 체력 회복 아이템만 구현
        if (this.player.health < this.player.maxHealth) {
            const healAmount = Math.min(30, this.player.maxHealth - this.player.health);
            this.player.health += healAmount;
            
            this.addEventLog(`💊 체력 회복 아이템을 사용했습니다! +${healAmount}`, 'success');
            this.updateUI();
        } else {
            this.addEventLog('체력이 이미 가득합니다!', 'warning');
        }
    },
    
    // 플레이어 도망
    playerFlee() {
        if (this.player.energy < 20) {
            this.addEventLog('에너지가 부족합니다!', 'error');
            return;
        }
        
        this.player.energy -= 20;
        
        // 도망 성공 확률 (플레이어 속도 스킬에 영향받음)
        const fleeChance = 0.3 + (this.player.skills.diplomacy * 0.1);
        
        if (Math.random() < fleeChance) {
            this.addEventLog('🏃 도망에 성공했습니다!', 'success');
            this.endCombat();
        } else {
            this.addEventLog('도망에 실패했습니다!', 'warning');
            // 적 공격
            setTimeout(() => this.enemyAttack(), 1000);
        }
        
        this.updateUI();
    },
    
    // 적 공격
    enemyAttack() {
        if (!this.inCombat || !this.currentEnemy) return;
        
        // 적 공격력 계산
        const baseAttack = this.currentEnemy.attack;
        const randomFactor = Math.random() * 10 + 5;
        const totalAttack = Math.floor(baseAttack + randomFactor);
        
        // 플레이어 방어 상태 확인
        let actualDamage = totalAttack;
        if (this.player.defending) {
            actualDamage = Math.floor(totalAttack * 0.5);
            this.player.defending = false;
            this.addEventLog('🛡️ 방어로 데미지가 감소했습니다!', 'info');
        }
        
        // 플레이어 체력 감소
        this.player.health = Math.max(0, this.player.health - actualDamage);
        
        this.addEventLog(`💥 ${this.currentEnemy.name}의 공격! ${actualDamage}의 데미지를 받았습니다!`, 'error');
        
        // 플레이어 사망 확인
        if (this.player.health <= 0) {
            this.playerDefeated();
        } else {
            // 전투 계속
            this.updateUI();
        }
    },
    
    // 적 처치
    enemyDefeated() {
        this.addEventLog(`🎉 ${this.currentEnemy.name}을(를) 처치했습니다!`, 'success');
        
        // 보상 지급
        const experienceGain = this.currentEnemy.experience;
        const mineralGain = this.currentEnemy.mineralReward;
        const gasGain = this.currentEnemy.gasReward;
        
        this.player.experience += experienceGain;
        this.resources.mineral += mineralGain;
        if (gasGain > 0) this.resources.gas += gasGain;
        
        this.addEventLog(`경험치 +${experienceGain}, 미네랄 +${mineralGain}`, 'success');
        if (gasGain > 0) this.addEventLog(`가스 +${gasGain}`, 'success');
        
        // 레벨업 확인
        this.checkLevelUp();
        
        // 전투 종료
        this.endCombat();
        
        this.updateUI();
    },
    
    // 플레이어 패배
    playerDefeated() {
        this.addEventLog('💀 전투에서 패배했습니다...', 'error');
        this.addEventLog('체력이 회복되고 안전한 곳으로 이동합니다.', 'info');
        
        // 체력 회복 (최대 체력의 50%)
        this.player.health = Math.floor(this.player.maxHealth * 0.5);
        
        // 전투 종료
        this.endCombat();
        
        this.updateUI();
    },
    
    // 전투 종료
    endCombat() {
        this.inCombat = false;
        this.gameState = 'playing';
        this.currentEnemy = null;
        this.player.defending = false;
        
        // 전투 UI 숨기기
        this.hideCombatUI();
        
        // 일반 액션 버튼들 표시
        this.showNormalButtons();
        
        this.addEventLog('전투가 종료되었습니다.', 'info');
    },
    
    // 전투 UI 숨기기
    hideCombatUI() {
        const enemyInfo = document.getElementById('enemy-info');
        if (enemyInfo) {
            enemyInfo.remove();
        }
    },
    
    // 일반 액션 버튼들 표시
    showNormalButtons() {
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.style.display = 'flex';
        });
        
        // 전투 버튼들 제거
        document.querySelectorAll('.combat-btn').forEach(btn => btn.remove());
    }
});
