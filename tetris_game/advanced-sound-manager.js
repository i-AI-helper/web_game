/**
 * 고급 테트릭스 사운드 매니저
 * Web Audio API를 활용한 고품질 사운드 시스템
 * 
 * @author AI Assistant (Claude Sonnet 4)
 * @version 1.0.0
 * @date 2025-08-16
 */

class AdvancedTetrisSoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.bgm = null;
        this.currentBGM = null;
        
        // 볼륨 설정
        this.masterVolume = 0.7;
        this.sfxVolume = 0.8;
        this.bgmVolume = 0.6;
        
        // 사운드 설정
        this.soundEnabled = true;
        this.bgmEnabled = true;
        
        // 초기화
        this.initAudioContext();
        this.initSounds();
        this.loadUserPreferences();
        
        // 이벤트 리스너 등록
        this.bindEvents();
    }
    
    /**
     * Web Audio API 컨텍스트 초기화
     */
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Web Audio API initialized successfully');
        } catch (error) {
            console.error('Web Audio API not supported:', error);
            this.fallbackToHTML5Audio();
        }
    }
    
    /**
     * HTML5 Audio로 폴백
     */
    fallbackToHTML5Audio() {
        console.log('Falling back to HTML5 Audio');
        this.useHTML5Audio = true;
    }
    
    /**
     * 사운드 파일 초기화
     */
    async initSounds() {
        if (this.useHTML5Audio) {
            this.initHTML5Sounds();
        } else {
            await this.initWebAudioSounds();
        }
    }
    
    /**
     * Web Audio API 사운드 초기화
     */
    async initWebAudioSounds() {
        const soundFiles = {
            lineClear: 'sounds/line-clear.mp3',
            tetris: 'sounds/tetris.mp3',
            rotate: 'sounds/rotate.mp3',
            drop: 'sounds/drop.mp3',
            gameOver: 'sounds/game-over.mp3',
            levelUp: 'sounds/level-up.mp3',
            combo: 'sounds/combo.mp3',
            move: 'sounds/move.mp3',
            hold: 'sounds/hold.mp3',
            hardDrop: 'sounds/hard-drop.mp3'
        };
        
        for (const [name, path] of Object.entries(soundFiles)) {
            try {
                const response = await fetch(path);
                if (!response.ok) {
                    console.warn(`Failed to load sound: ${name} (${response.status})`);
                    continue;
                }
                
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.sounds.set(name, audioBuffer);
                console.log(`Sound loaded: ${name}`);
            } catch (error) {
                console.warn(`Failed to load sound: ${name}`, error);
            }
        }
        
        // BGM 로드
        try {
            const bgmResponse = await fetch('sounds/tetris-theme.mp3');
            if (bgmResponse.ok) {
                const bgmArrayBuffer = await bgmResponse.arrayBuffer();
                this.bgm = await this.audioContext.decodeAudioData(bgmArrayBuffer);
                console.log('BGM loaded successfully');
            }
        } catch (error) {
            console.warn('Failed to load BGM', error);
        }
    }
    
    /**
     * HTML5 Audio 사운드 초기화
     */
    initHTML5Sounds() {
        const soundFiles = {
            lineClear: 'sounds/line-clear.mp3',
            tetris: 'sounds/tetris.mp3',
            rotate: 'sounds/rotate.mp3',
            drop: 'sounds/drop.mp3',
            gameOver: 'sounds/game-over.mp3',
            levelUp: 'sounds/level-up.mp3',
            combo: 'sounds/combo.mp3',
            move: 'sounds/move.mp3',
            hold: 'sounds/hold.mp3',
            hardDrop: 'sounds/hard-drop.mp3'
        };
        
        for (const [name, path] of Object.entries(soundFiles)) {
            try {
                const audio = new Audio(path);
                audio.preload = 'auto';
                this.sounds.set(name, audio);
                console.log(`HTML5 Sound loaded: ${name}`);
            } catch (error) {
                console.warn(`Failed to load HTML5 sound: ${name}`, error);
            }
        }
        
        // BGM 로드
        try {
            this.bgm = new Audio('sounds/tetris-theme.mp3');
            this.bgm.preload = 'auto';
            this.bgm.loop = true;
            console.log('HTML5 BGM loaded successfully');
        } catch (error) {
            console.warn('Failed to load HTML5 BGM', error);
        }
    }
    
    /**
     * 사운드 재생 (Web Audio API)
     */
    playSound(soundName, options = {}) {
        if (!this.soundEnabled) return null;
        
        const audioBuffer = this.sounds.get(soundName);
        if (!audioBuffer) {
            console.warn(`Sound not found: ${soundName}`);
            return null;
        }
        
        if (this.useHTML5Audio) {
            return this.playHTML5Sound(soundName, options);
        } else {
            return this.playWebAudioSound(soundName, options);
        }
    }
    
    /**
     * Web Audio API 사운드 재생
     */
    playWebAudioSound(soundName, options = {}) {
        try {
            const audioBuffer = this.sounds.get(soundName);
            if (!audioBuffer) return null;
            
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            const filterNode = this.audioContext.createBiquadFilter();
            
            source.buffer = audioBuffer;
            source.connect(gainNode);
            gainNode.connect(filterNode);
            filterNode.connect(this.audioContext.destination);
            
            // 볼륨 조절
            const volume = (options.volume || 1) * this.sfxVolume * this.masterVolume;
            gainNode.gain.value = volume;
            
            // 피치 조절
            if (options.pitch) {
                source.playbackRate.value = options.pitch;
            }
            
            // 루프 설정
            source.loop = options.loop || false;
            
            // 필터 효과
            if (options.filter) {
                filterNode.type = options.filter.type || 'lowpass';
                filterNode.frequency.value = options.filter.frequency || 1000;
                filterNode.Q.value = options.filter.Q || 1;
            }
            
            source.start(0);
            
            // 재생 완료 이벤트
            source.onended = () => {
                if (options.onEnded) {
                    options.onEnded();
                }
            };
            
            return source;
        } catch (error) {
            console.error('Error playing Web Audio sound:', error);
            return null;
        }
    }
    
    /**
     * HTML5 Audio 사운드 재생
     */
    playHTML5Sound(soundName, options = {}) {
        try {
            const audio = this.sounds.get(soundName);
            if (!audio) return null;
            
            // 볼륨 조절
            const volume = (options.volume || 1) * this.sfxVolume * this.masterVolume;
            audio.volume = volume;
            
            // 피치 조절 (HTML5 Audio는 제한적)
            if (options.pitch && audio.playbackRate !== undefined) {
                audio.playbackRate = options.pitch;
            }
            
            // 루프 설정
            audio.loop = options.loop || false;
            
            // 재생
            audio.currentTime = 0;
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error('HTML5 Audio play failed:', error);
                });
            }
            
            return audio;
        } catch (error) {
            console.error('Error playing HTML5 sound:', error);
            return null;
        }
    }
    
    /**
     * BGM 재생
     */
    playBGM() {
        if (!this.bgmEnabled || !this.bgm) return;
        
        if (this.useHTML5Audio) {
            this.bgm.volume = this.bgmVolume * this.masterVolume;
            this.bgm.currentTime = 0;
            this.bgm.play().catch(error => {
                console.error('BGM play failed:', error);
            });
            this.currentBGM = this.bgm;
        } else {
            this.stopBGM();
            
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = this.bgm;
            source.loop = true;
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            gainNode.gain.value = this.bgmVolume * this.masterVolume;
            
            source.start(0);
            this.currentBGM = source;
        }
    }
    
    /**
     * BGM 정지
     */
    stopBGM() {
        if (this.currentBGM) {
            if (this.useHTML5Audio) {
                this.currentBGM.pause();
                this.currentBGM.currentTime = 0;
            } else {
                this.currentBGM.stop();
            }
            this.currentBGM = null;
        }
    }
    
    /**
     * BGM 일시정지
     */
    pauseBGM() {
        if (this.currentBGM && this.useHTML5Audio) {
            this.currentBGM.pause();
        }
    }
    
    /**
     * BGM 재개
     */
    resumeBGM() {
        if (this.currentBGM && this.useHTML5Audio) {
            this.currentBGM.play().catch(error => {
                console.error('BGM resume failed:', error);
            });
        }
    }
    
    /**
     * 볼륨 설정
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.updateBGMVolume();
        this.saveUserPreferences();
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.saveUserPreferences();
    }
    
    setBGMVolume(volume) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        this.updateBGMVolume();
        this.saveUserPreferences();
    }
    
    /**
     * BGM 볼륨 업데이트
     */
    updateBGMVolume() {
        if (this.currentBGM) {
            if (this.useHTML5Audio) {
                this.currentBGM.volume = this.bgmVolume * this.masterVolume;
            } else {
                // Web Audio API의 경우 gainNode를 통해 볼륨 조절
                // 이는 playBGM() 호출 시 자동으로 적용됨
            }
        }
    }
    
    /**
     * 사운드 활성화/비활성화
     */
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
        this.saveUserPreferences();
    }
    
    setBGMEnabled(enabled) {
        this.bgmEnabled = enabled;
        if (!enabled) {
            this.stopBGM();
        } else if (this.currentBGM === null) {
            this.playBGM();
        }
        this.saveUserPreferences();
    }
    
    /**
     * 사용자 설정 저장
     */
    saveUserPreferences() {
        const preferences = {
            masterVolume: this.masterVolume,
            sfxVolume: this.sfxVolume,
            bgmVolume: this.bgmVolume,
            soundEnabled: this.soundEnabled,
            bgmEnabled: this.bgmEnabled
        };
        
        localStorage.setItem('tetrisSoundPreferences', JSON.stringify(preferences));
    }
    
    /**
     * 사용자 설정 로드
     */
    loadUserPreferences() {
        const savedPreferences = localStorage.getItem('tetrisSoundPreferences');
        if (savedPreferences) {
            try {
                const preferences = JSON.parse(savedPreferences);
                
                this.masterVolume = preferences.masterVolume ?? 0.7;
                this.sfxVolume = preferences.sfxVolume ?? 0.8;
                this.bgmVolume = preferences.bgmVolume ?? 0.6;
                this.soundEnabled = preferences.soundEnabled ?? true;
                this.bgmEnabled = preferences.bgmEnabled ?? true;
                
                console.log('Sound preferences loaded:', preferences);
            } catch (error) {
                console.warn('Failed to load sound preferences:', error);
            }
        }
    }
    
    /**
     * 이벤트 리스너 등록
     */
    bindEvents() {
        // 게임 이벤트 리스너
        window.addEventListener('tetris_lineClear', (e) => {
            this.playSound('lineClear', { volume: 1.0 });
        });
        
        window.addEventListener('tetris_tetris', (e) => {
            this.playSound('tetris', { volume: 1.2 });
        });
        
        window.addEventListener('tetris_rotate', (e) => {
            this.playSound('rotate', { volume: 0.8 });
        });
        
        window.addEventListener('tetris_drop', (e) => {
            this.playSound('drop', { volume: 0.6 });
        });
        
        window.addEventListener('tetris_gameOver', (e) => {
            this.playSound('gameOver', { volume: 1.0 });
            this.stopBGM();
        });
        
        window.addEventListener('tetris_levelUp', (e) => {
            this.playSound('levelUp', { volume: 1.1 });
        });
        
        window.addEventListener('tetris_combo', (e) => {
            this.playSound('combo', { volume: 1.0 + (e.detail.combo * 0.1) });
        });
        
        window.addEventListener('tetris_move', (e) => {
            this.playSound('move', { volume: 0.4 });
        });
        
        window.addEventListener('tetris_hold', (e) => {
            this.playSound('hold', { volume: 0.9 });
        });
        
        window.addEventListener('tetris_hardDrop', (e) => {
            this.playSound('hardDrop', { volume: 1.0 });
        });
        
        // 게임 시작/종료 이벤트
        window.addEventListener('tetris_gameStart', () => {
            this.playBGM();
        });
        
        window.addEventListener('tetris_gamePause', () => {
            this.pauseBGM();
        });
        
        window.addEventListener('tetris_gameResume', () => {
            this.resumeBGM();
        });
    }
    
    /**
     * 사운드 매니저 상태 정보
     */
    getStatus() {
        return {
            audioContext: this.audioContext ? 'initialized' : 'not_initialized',
            useHTML5Audio: this.useHTML5Audio || false,
            soundsLoaded: this.sounds.size,
            bgmLoaded: this.bgm !== null,
            currentBGM: this.currentBGM ? 'playing' : 'stopped',
            masterVolume: this.masterVolume,
            sfxVolume: this.sfxVolume,
            bgmVolume: this.bgmVolume,
            soundEnabled: this.soundEnabled,
            bgmEnabled: this.bgmEnabled
        };
    }
    
    /**
     * 사운드 매니저 정리
     */
    destroy() {
        this.stopBGM();
        
        if (this.audioContext && !this.useHTML5Audio) {
            this.audioContext.close();
        }
        
        this.sounds.clear();
        this.bgm = null;
        this.currentBGM = null;
    }
}

// 전역 인스턴스 생성
window.tetrisSoundManager = new AdvancedTetrisSoundManager();

// 모듈 내보내기 (ES6 모듈 지원 시)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedTetrisSoundManager;
}
