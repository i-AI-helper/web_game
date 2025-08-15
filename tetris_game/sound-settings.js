/**
 * 테트릭스 사운드 설정 UI 컴포넌트
 * 
 * @author AI Assistant (Claude Sonnet 4)
 * @version 1.0.0
 * @date 2025-08-16
 */

class TetrisSoundSettings {
    constructor() {
        this.isVisible = false;
        this.settingsPanel = null;
        this.soundManager = window.tetrisSoundManager;
        
        this.initSettingsPanel();
        this.bindEvents();
    }
    
    /**
     * 설정 패널 초기화
     */
    initSettingsPanel() {
        this.settingsPanel = document.createElement('div');
        this.settingsPanel.className = 'sound-settings-panel';
        this.settingsPanel.innerHTML = this.createSettingsHTML();
        
        // 스타일 적용
        this.applyStyles();
        
        // DOM에 추가
        document.body.appendChild(this.settingsPanel);
        
        // 초기 상태 설정
        this.updateSettingsDisplay();
    }
    
    /**
     * 설정 HTML 생성
     */
    createSettingsHTML() {
        return `
            <div class="sound-settings-header">
                <h3>🎵 사운드 설정</h3>
                <button class="close-settings-btn" aria-label="설정 닫기">×</button>
            </div>
            
            <div class="sound-settings-content">
                <div class="setting-group">
                    <label class="setting-label">
                        <input type="checkbox" id="sound-enabled" class="setting-checkbox">
                        효과음 활성화
                    </label>
                </div>
                
                <div class="setting-group">
                    <label class="setting-label">
                        <input type="checkbox" id="bgm-enabled" class="setting-checkbox">
                        배경음악 활성화
                    </label>
                </div>
                
                <div class="setting-group">
                    <label class="setting-label">
                        마스터 볼륨
                        <div class="volume-control">
                            <input type="range" id="master-volume" class="volume-slider" min="0" max="100" value="70">
                            <span class="volume-value">70%</span>
                        </div>
                    </label>
                </div>
                
                <div class="setting-group">
                    <label class="setting-label">
                        효과음 볼륨
                        <div class="volume-control">
                            <input type="range" id="sfx-volume" class="volume-slider" min="0" max="100" value="80">
                            <span class="volume-value">80%</span>
                        </div>
                    </label>
                </div>
                
                <div class="setting-group">
                    <label class="setting-label">
                        배경음악 볼륨
                        <div class="volume-control">
                            <input type="range" id="bgm-volume" class="volume-slider" min="0" max="100" value="60">
                            <span class="volume-value">60%</span>
                        </div>
                    </label>
                </div>
                
                <div class="setting-group">
                    <button id="test-sound-btn" class="test-sound-btn">🔊 효과음 테스트</button>
                    <button id="test-bgm-btn" class="test-bgm-btn">🎵 BGM 테스트</button>
                </div>
                
                <div class="setting-group">
                    <div class="sound-status">
                        <span class="status-label">상태:</span>
                        <span id="sound-status-text" class="status-value">로딩 중...</span>
                    </div>
                </div>
            </div>
            
            <div class="sound-settings-footer">
                <button id="reset-settings-btn" class="reset-settings-btn">기본값으로 초기화</button>
                <button id="save-settings-btn" class="save-settings-btn">저장</button>
            </div>
        `;
    }
    
    /**
     * 스타일 적용
     */
    applyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .sound-settings-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 400px;
                max-width: 90vw;
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #0f3460;
                border-radius: 15px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                z-index: 1000;
                font-family: 'Arial', sans-serif;
                color: #ffffff;
                display: none;
                animation: slideIn 0.3s ease-out;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            
            .sound-settings-header {
                background: linear-gradient(135deg, #0f3460, #16213e);
                padding: 20px;
                border-radius: 13px 13px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #0f3460;
            }
            
            .sound-settings-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #4fc3f7;
            }
            
            .close-settings-btn {
                background: none;
                border: none;
                color: #ffffff;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
            }
            
            .close-settings-btn:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            
            .sound-settings-content {
                padding: 20px;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .setting-group {
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .setting-label {
                display: flex;
                flex-direction: column;
                gap: 10px;
                font-size: 14px;
                font-weight: 500;
                color: #e0e0e0;
            }
            
            .setting-checkbox {
                width: 18px;
                height: 18px;
                accent-color: #4fc3f7;
                cursor: pointer;
            }
            
            .volume-control {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-top: 5px;
            }
            
            .volume-slider {
                flex: 1;
                height: 6px;
                border-radius: 3px;
                background: #333;
                outline: none;
                cursor: pointer;
                -webkit-appearance: none;
            }
            
            .volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #4fc3f7;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .volume-slider::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #4fc3f7;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .volume-value {
                min-width: 40px;
                text-align: right;
                font-size: 12px;
                color: #4fc3f7;
                font-weight: 600;
            }
            
            .test-sound-btn, .test-bgm-btn {
                background: linear-gradient(135deg, #4fc3f7, #29b6f6);
                border: none;
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
                margin-right: 10px;
                transition: all 0.2s;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            
            .test-sound-btn:hover, .test-bgm-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
            
            .sound-status {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background: rgba(79, 195, 247, 0.1);
                border-radius: 8px;
                border: 1px solid rgba(79, 195, 247, 0.3);
            }
            
            .status-label {
                font-size: 12px;
                color: #4fc3f7;
                font-weight: 600;
            }
            
            .status-value {
                font-size: 12px;
                color: #e0e0e0;
                font-weight: 500;
            }
            
            .sound-settings-footer {
                padding: 20px;
                border-top: 1px solid #0f3460;
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
            
            .reset-settings-btn, .save-settings-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.2s;
            }
            
            .reset-settings-btn {
                background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                color: white;
            }
            
            .save-settings-btn {
                background: linear-gradient(135deg, #4caf50, #45a049);
                color: white;
            }
            
            .reset-settings-btn:hover, .save-settings-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
            
            .sound-settings-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 999;
                display: none;
            }
            
            @media (max-width: 480px) {
                .sound-settings-panel {
                    width: 95vw;
                    max-height: 80vh;
                }
                
                .sound-settings-content {
                    max-height: 300px;
                }
                
                .volume-control {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 10px;
                }
                
                .volume-value {
                    text-align: center;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * 이벤트 리스너 등록
     */
    bindEvents() {
        // 설정 패널 표시/숨김
        document.addEventListener('click', (e) => {
            if (e.target.matches('.sound-settings-toggle')) {
                this.toggleSettings();
            }
        });
        
        // 설정 패널 닫기
        this.settingsPanel.addEventListener('click', (e) => {
            if (e.target.matches('.close-settings-btn')) {
                this.hideSettings();
            }
        });
        
        // 체크박스 이벤트
        this.settingsPanel.addEventListener('change', (e) => {
            if (e.target.matches('.setting-checkbox')) {
                this.handleCheckboxChange(e.target);
            }
        });
        
        // 볼륨 슬라이더 이벤트
        this.settingsPanel.addEventListener('input', (e) => {
            if (e.target.matches('.volume-slider')) {
                this.handleVolumeChange(e.target);
            }
        });
        
        // 테스트 버튼 이벤트
        this.settingsPanel.addEventListener('click', (e) => {
            if (e.target.matches('#test-sound-btn')) {
                this.testSound();
            } else if (e.target.matches('#test-bgm-btn')) {
                this.testBGM();
            } else if (e.target.matches('#reset-settings-btn')) {
                this.resetSettings();
            } else if (e.target.matches('#save-settings-btn')) {
                this.saveSettings();
            }
        });
        
        // ESC 키로 설정 패널 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hideSettings();
            }
        });
        
        // 설정 패널 외부 클릭 시 닫기
        document.addEventListener('click', (e) => {
            if (this.isVisible && !this.settingsPanel.contains(e.target) && !e.target.matches('.sound-settings-toggle')) {
                this.hideSettings();
            }
        });
    }
    
    /**
     * 설정 패널 표시/숨김 토글
     */
    toggleSettings() {
        if (this.isVisible) {
            this.hideSettings();
        } else {
            this.showSettings();
        }
    }
    
    /**
     * 설정 패널 표시
     */
    showSettings() {
        this.isVisible = true;
        this.settingsPanel.style.display = 'block';
        this.updateSettingsDisplay();
        this.updateSoundStatus();
        
        // 오버레이 생성
        this.createOverlay();
    }
    
    /**
     * 설정 패널 숨김
     */
    hideSettings() {
        this.isVisible = false;
        this.settingsPanel.style.display = 'none';
        
        // 오버레이 제거
        this.removeOverlay();
    }
    
    /**
     * 오버레이 생성
     */
    createOverlay() {
        if (!document.querySelector('.sound-settings-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'sound-settings-overlay';
            document.body.appendChild(overlay);
            
            setTimeout(() => {
                overlay.style.display = 'block';
            }, 10);
        }
    }
    
    /**
     * 오버레이 제거
     */
    removeOverlay() {
        const overlay = document.querySelector('.sound-settings-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    /**
     * 설정 표시 업데이트
     */
    updateSettingsDisplay() {
        if (!this.soundManager) return;
        
        const status = this.soundManager.getStatus();
        
        // 체크박스 상태 설정
        const soundEnabled = document.getElementById('sound-enabled');
        const bgmEnabled = document.getElementById('bgm-enabled');
        
        if (soundEnabled) soundEnabled.checked = status.soundEnabled;
        if (bgmEnabled) bgmEnabled.checked = status.bgmEnabled;
        
        // 볼륨 슬라이더 설정
        const masterVolume = document.getElementById('master-volume');
        const sfxVolume = document.getElementById('sfx-volume');
        const bgmVolume = document.getElementById('bgm-volume');
        
        if (masterVolume) {
            masterVolume.value = Math.round(status.masterVolume * 100);
            masterVolume.nextElementSibling.textContent = `${Math.round(status.masterVolume * 100)}%`;
        }
        
        if (sfxVolume) {
            sfxVolume.value = Math.round(status.sfxVolume * 100);
            sfxVolume.nextElementSibling.textContent = `${Math.round(status.sfxVolume * 100)}%`;
        }
        
        if (bgmVolume) {
            bgmVolume.value = Math.round(status.bgmVolume * 100);
            bgmVolume.nextElementSibling.textContent = `${Math.round(status.bgmVolume * 100)}%`;
        }
    }
    
    /**
     * 사운드 상태 업데이트
     */
    updateSoundStatus() {
        if (!this.soundManager) return;
        
        const status = this.soundManager.getStatus();
        const statusText = document.getElementById('sound-status-text');
        
        if (statusText) {
            let statusMessage = '';
            
            if (status.audioContext === 'initialized') {
                statusMessage = 'Web Audio API 활성화';
            } else if (status.useHTML5Audio) {
                statusMessage = 'HTML5 Audio 활성화';
            } else {
                statusMessage = '사운드 비활성화';
            }
            
            statusMessage += ` | 효과음: ${status.soundsLoaded}개 | BGM: ${status.bgmLoaded ? '로드됨' : '로드 안됨'}`;
            
            statusText.textContent = statusMessage;
        }
    }
    
    /**
     * 체크박스 변경 처리
     */
    handleCheckboxChange(checkbox) {
        if (!this.soundManager) return;
        
        if (checkbox.id === 'sound-enabled') {
            this.soundManager.setSoundEnabled(checkbox.checked);
        } else if (checkbox.id === 'bgm-enabled') {
            this.soundManager.setBGMEnabled(checkbox.checked);
        }
    }
    
    /**
     * 볼륨 변경 처리
     */
    handleVolumeChange(slider) {
        if (!this.soundManager) return;
        
        const volume = parseInt(slider.value) / 100;
        const volumeDisplay = slider.nextElementSibling;
        
        if (volumeDisplay) {
            volumeDisplay.textContent = `${slider.value}%`;
        }
        
        switch (slider.id) {
            case 'master-volume':
                this.soundManager.setMasterVolume(volume);
                break;
            case 'sfx-volume':
                this.soundManager.setSFXVolume(volume);
                break;
            case 'bgm-volume':
                this.soundManager.setBGMVolume(volume);
                break;
        }
    }
    
    /**
     * 효과음 테스트
     */
    testSound() {
        if (!this.soundManager) return;
        
        // 다양한 효과음 테스트
        const testSounds = ['lineClear', 'rotate', 'drop', 'levelUp'];
        let currentIndex = 0;
        
        const playNextSound = () => {
            if (currentIndex < testSounds.length) {
                this.soundManager.playSound(testSounds[currentIndex]);
                currentIndex++;
                setTimeout(playNextSound, 500);
            }
        };
        
        playNextSound();
        
        // 테스트 버튼 비활성화
        const testBtn = document.getElementById('test-sound-btn');
        testBtn.disabled = true;
        testBtn.textContent = '테스트 중...';
        
        setTimeout(() => {
            testBtn.disabled = false;
            testBtn.textContent = '🔊 효과음 테스트';
        }, 3000);
    }
    
    /**
     * BGM 테스트
     */
    testBGM() {
        if (!this.soundManager) return;
        
        const testBtn = document.getElementById('test-bgm-btn');
        
        if (this.soundManager.currentBGM) {
            // BGM 정지
            this.soundManager.stopBGM();
            testBtn.textContent = '🎵 BGM 테스트';
        } else {
            // BGM 재생
            this.soundManager.playBGM();
            testBtn.textContent = '⏹️ BGM 정지';
            
            // 5초 후 자동 정지
            setTimeout(() => {
                if (this.soundManager.currentBGM) {
                    this.soundManager.stopBGM();
                    testBtn.textContent = '🎵 BGM 테스트';
                }
            }, 5000);
        }
    }
    
    /**
     * 설정 초기화
     */
    resetSettings() {
        if (!this.soundManager) return;
        
        // 기본값으로 설정
        this.soundManager.setMasterVolume(0.7);
        this.soundManager.setSFXVolume(0.8);
        this.soundManager.setBGMVolume(0.6);
        this.soundManager.setSoundEnabled(true);
        this.soundManager.setBGMEnabled(true);
        
        // UI 업데이트
        this.updateSettingsDisplay();
        
        // 사용자에게 알림
        this.showNotification('설정이 기본값으로 초기화되었습니다.');
    }
    
    /**
     * 설정 저장
     */
    saveSettings() {
        if (!this.soundManager) return;
        
        // 설정 저장 (자동으로 localStorage에 저장됨)
        this.soundManager.saveUserPreferences();
        
        // 사용자에게 알림
        this.showNotification('설정이 저장되었습니다.');
    }
    
    /**
     * 알림 표시
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'sound-notification';
        notification.textContent = message;
        
        // 스타일 적용
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #4fc3f7, #29b6f6)',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            zIndex: '1001',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            animation: 'slideInRight 0.3s ease-out'
        });
        
        document.body.appendChild(notification);
        
        // 3초 후 자동 제거
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    /**
     * 설정 토글 버튼 생성
     */
    createToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'sound-settings-toggle';
        toggleButton.innerHTML = '🎵';
        toggleButton.title = '사운드 설정';
        toggleButton.setAttribute('aria-label', '사운드 설정 열기');
        
        // 스타일 적용
        Object.assign(toggleButton.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4fc3f7, #29b6f6)',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            zIndex: '998',
            transition: 'all 0.2s'
        });
        
        toggleButton.addEventListener('mouseenter', () => {
            toggleButton.style.transform = 'scale(1.1)';
            toggleButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
        });
        
        toggleButton.addEventListener('mouseleave', () => {
            toggleButton.style.transform = 'scale(1)';
            toggleButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        });
        
        return toggleButton;
    }
    
    /**
     * 컴포넌트 제거
     */
    destroy() {
        this.hideSettings();
        if (this.settingsPanel && this.settingsPanel.parentNode) {
            this.settingsPanel.parentNode.removeChild(this.settingsPanel);
        }
    }
}

// 전역 인스턴스 생성
window.tetrisSoundSettings = new TetrisSoundSettings();

// 모듈 내보내기 (ES6 모듈 지원 시)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TetrisSoundSettings;
}
