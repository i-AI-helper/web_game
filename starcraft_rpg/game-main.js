// 게임 시작 및 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 게임 인스턴스 생성
    window.gameInstance = new StarcraftRPG();
    
    // 초기 이벤트 로그 메시지 추가
    if (window.gameInstance && window.gameInstance.addEventLog) {
        window.gameInstance.addEventLog('게임이 초기화되었습니다.', 'system');
    }
    
    // 추가 이벤트 리스너들
    setupAdditionalEventListeners();
});

// 추가 이벤트 리스너 설정
function setupAdditionalEventListeners() {
    // 이벤트 로그 지우기 버튼
    const clearLogBtn = document.getElementById('clear-log-btn');
    if (clearLogBtn) {
        clearLogBtn.addEventListener('click', () => {
            if (window.gameInstance) {
                window.gameInstance.clearEventLog();
            }
        });
    }
    
    // 설정 저장 버튼
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            if (window.gameInstance) {
                window.gameInstance.saveSettings();
            }
        });
    }
    
    // 설정 뒤로가기 버튼
    const backFromSettingsBtn = document.getElementById('back-from-settings-btn');
    if (backFromSettingsBtn) {
        backFromSettingsBtn.addEventListener('click', () => {
            if (window.gameInstance) {
                window.gameInstance.hideSettings();
            }
        });
    }
    
    // 크레딧 뒤로가기 버튼
    const backFromCreditsBtn = document.getElementById('back-from-credits-btn');
    if (backFromCreditsBtn) {
        backFromCreditsBtn.addEventListener('click', () => {
            if (window.gameInstance) {
                window.gameInstance.showMenu('game-menu');
            }
        });
    }
    
    // 일시정지 메뉴 버튼들
    const resumeBtn = document.getElementById('resume-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            if (window.gameInstance) {
                window.gameInstance.resumeGame();
            }
        });
    }
    
    const savePauseBtn = document.getElementById('save-pause-btn');
    if (savePauseBtn) {
        savePauseBtn.addEventListener('click', () => {
            if (window.gameInstance) {
                window.gameInstance.saveGame();
            }
        });
    }
    
    const settingsPauseBtn = document.getElementById('settings-pause-btn');
    if (settingsPauseBtn) {
        settingsPauseBtn.addEventListener('click', () => {
            if (window.gameInstance) {
                window.gameInstance.showMenu('settings-menu');
            }
        });
    }
    
    const quitToMainBtn = document.getElementById('quit-to-main-btn');
    if (quitToMainBtn) {
        quitToMainBtn.addEventListener('click', () => {
            if (window.gameInstance) {
                window.gameInstance.returnToMainMenu();
            }
        });
    }
}

// 전역 함수들 (디버깅용)
window.gameDebug = {
    showGameState: () => {
        if (window.gameInstance) {
            console.log('게임 상태:', window.gameInstance.gameState);
            console.log('플레이어:', window.gameInstance.player);
            console.log('자원:', window.gameInstance.resources);
            console.log('건물:', window.gameInstance.buildings);
        }
    },
    
    resetGame: () => {
        if (window.gameInstance) {
            window.gameInstance.resetGame();
        }
    },
    
    addResources: (mineral = 100, gas = 50) => {
        if (window.gameInstance) {
            window.gameInstance.resources.mineral += mineral;
            window.gameInstance.resources.gas += gas;
            window.gameInstance.updateUI();
        }
    },
    
    levelUp: () => {
        if (window.gameInstance) {
            window.gameInstance.player.experience = window.gameInstance.player.experienceToNext;
            window.gameInstance.checkLevelUp();
        }
    }
};

// 에러 핸들링
window.addEventListener('error', (event) => {
    console.error('게임 에러:', event.error);
    if (window.gameInstance) {
        window.gameInstance.addEventLog('게임에서 오류가 발생했습니다.', 'error');
    }
});

// 페이지 언로드 시 저장
window.addEventListener('beforeunload', () => {
    if (window.gameInstance && window.gameInstance.gameState === 'playing') {
        window.gameInstance.saveGame();
    }
});
