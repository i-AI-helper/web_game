// 게임 저장/불러오기 시스템을 StarcraftRPG 클래스에 추가
Object.assign(StarcraftRPG.prototype, {
    
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
        
        // 자동으로 슬롯 1에 저장
        localStorage.setItem('starcraftRPG_slot_1', JSON.stringify(saveData));
        this.addEventLog('게임이 자동 저장되었습니다.', 'system');
        this.showNotification('게임이 저장되었습니다!');
        this.updateSaveSlots();
    },

    saveGameToSlot(slot) {
        const saveData = {
            player: this.player,
            resources: this.resources,
            buildings: this.buildings,
            day: this.day,
            hour: this.hour,
            minute: this.minute,
            saveTime: Date.now()
        };
        
        localStorage.setItem(`starcraftRPG_slot_${slot}`, JSON.stringify(saveData));
        this.addEventLog(`게임이 슬롯 ${slot}에 저장되었습니다.`, 'system');
        this.showNotification(`슬롯 ${slot}에 저장되었습니다!`);
        this.updateSaveSlots();
    },

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
                this.minute = this.minute;
                
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
    },

    deleteSaveSlot(slot) {
        if (confirm(`정말로 슬롯 ${slot}의 저장 파일을 삭제하시겠습니까?`)) {
            localStorage.removeItem(`starcraftRPG_slot_${slot}`);
            this.updateSaveSlots();
            this.showNotification(`슬롯 ${slot}이 삭제되었습니다.`);
        }
    },

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
    },

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
    },

    pauseGame() {
        this.gameState = 'paused';
        this.showMenu('pause-menu');
    },

    resumeGame() {
        this.gameState = 'playing';
        this.showMenu('game-screen');
    },

    returnToMainMenu() {
        if (confirm('정말로 메인 메뉴로 돌아가시겠습니까? 저장하지 않은 진행 상황은 사라집니다.')) {
            this.gameState = 'menu';
            this.showMenu('game-menu');
            this.resetGame();
        }
    },

    resetGame() {
        this.initializeGame();
        this.updateUI();
    }
});
