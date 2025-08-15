// 게임 유틸리티 함수들을 StarcraftRPG 클래스에 추가
Object.assign(StarcraftRPG.prototype, {
    
    addEventLog(message, type = 'normal') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        const logContent = document.getElementById('log-content');
        logContent.appendChild(logEntry);
        logContent.scrollTop = logContent.scrollHeight;
        
        // 로그 항목이 너무 많아지면 오래된 것들 제거
        if (logContent.children.length > 50) {
            logContent.removeChild(logContent.firstChild);
        }
    },

    clearEventLog() {
        const logContent = document.getElementById('log-content');
        logContent.innerHTML = '<div class="log-entry system">이벤트 로그가 지워졌습니다.</div>';
    },

    showNotification(message) {
        const notification = document.getElementById('notification');
        const notificationText = notification.querySelector('.notification-text');
        
        notificationText.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    },

    loadSettings() {
        const savedSettings = localStorage.getItem('starcraftRPG_settings');
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                this.settings = { ...this.settings, ...parsedSettings };
            } catch (error) {
                console.error('설정 로드 오류:', error);
            }
        }
    },

    saveSettings() {
        this.settings.gameSpeed = parseFloat(document.getElementById('game-speed').value);
        this.settings.autoSave = document.getElementById('auto-save').checked;
        this.settings.animations = document.getElementById('animations').checked;
        this.settings.soundEffects = document.getElementById('sound-effects').checked;
        
        localStorage.setItem('starcraftRPG_settings', JSON.stringify(this.settings));
        this.showNotification('설정이 저장되었습니다!');
    },

    hideSettings() {
        if (this.gameState === 'playing') {
            this.showMenu('game-screen');
        } else {
            this.showMenu('game-menu');
        }
    },

    // GSAP 애니메이션 함수들
    animateMenuTransition(menuName, direction = 'fade') {
        const menu = document.getElementById(menuName);
        if (!menu) return;

        // 모든 메뉴 숨기기
        document.querySelectorAll('.game-menu, .new-game-menu, .save-slots-menu, .settings-menu, .credits-menu, .pause-menu').forEach(m => {
            if (m !== menu) {
                gsap.to(m, {
                    opacity: 0,
                    scale: 0.9,
                    y: -20,
                    duration: 0.3,
                    ease: "power2.out",
                    onComplete: () => m.classList.add('hidden')
                });
            }
        });

        // 지정된 메뉴 보이기
        menu.classList.remove('hidden');
        
        let animation;
        switch (direction) {
            case 'slideLeft':
                animation = gsap.fromTo(menu, 
                    { opacity: 0, x: -100 },
                    { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
                );
                break;
            case 'slideRight':
                animation = gsap.fromTo(menu, 
                    { opacity: 0, x: 100 },
                    { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
                );
                break;
            case 'scale':
                animation = gsap.fromTo(menu, 
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
                );
                break;
            default: // fade
                animation = gsap.fromTo(menu, 
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
                );
        }

        if (menuName === 'save-slots-menu') {
            this.updateSaveSlots();
        }
    },

    animateButtonClick(buttonId) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        gsap.to(button, {
            scale: 0.95,
            duration: 0.1,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        });
    },

    animateResourceGain(resourceType, amount) {
        const resourceElement = document.getElementById(`${resourceType}-count`);
        if (!resourceElement) return;

        gsap.to(resourceElement, {
            scale: 1.2,
            color: "#2ed573",
            duration: 0.3,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                gsap.to(resourceElement, {
                    scale: 1,
                    color: "inherit",
                    duration: 0.2
                });
            }
        });

        // 플로팅 텍스트 애니메이션
        const floatingText = document.createElement('div');
        floatingText.textContent = `+${amount}`;
        floatingText.style.cssText = `
            position: absolute;
            color: #2ed573;
            font-weight: bold;
            font-size: 1.2em;
            pointer-events: none;
            z-index: 1000;
        `;
        
        resourceElement.parentElement.style.position = 'relative';
        resourceElement.parentElement.appendChild(floatingText);

        gsap.fromTo(floatingText, 
            { opacity: 1, y: 0 },
            { 
                opacity: 0, 
                y: -50, 
                duration: 1, 
                ease: "power2.out",
                onComplete: () => floatingText.remove()
            }
        );
    },

    animateLevelUp() {
        const levelElement = document.getElementById('level');
        if (!levelElement) return;

        gsap.timeline()
            .to(levelElement, {
                scale: 1.5,
                color: "#ffd700",
                duration: 0.3,
                ease: "power2.out"
            })
            .to(levelElement, {
                scale: 1,
                color: "inherit",
                duration: 0.3,
                ease: "power2.out"
            });

        // 파티클 효과
        this.createLevelUpParticles();
    },

    createLevelUpParticles() {
        const levelElement = document.getElementById('level');
        if (!levelElement) return;

        const rect = levelElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.innerHTML = '⭐';
            particle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                font-size: 20px;
                pointer-events: none;
                z-index: 1000;
            `;
            document.body.appendChild(particle);

            const angle = (i / 8) * Math.PI * 2;
            const distance = 100;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;

            gsap.to(particle, {
                x: endX - centerX,
                y: endY - centerY,
                opacity: 0,
                scale: 0.5,
                duration: 1,
                ease: "power2.out",
                onComplete: () => particle.remove()
            });
        }
    },

    animateWorkButton() {
        const workBtn = document.getElementById('work-btn');
        if (!workBtn) return;

        gsap.timeline()
            .to(workBtn, {
                rotation: 5,
                duration: 0.1,
                ease: "power2.out"
            })
            .to(workBtn, {
                rotation: -5,
                duration: 0.1,
                ease: "power2.out"
            })
            .to(workBtn, {
                rotation: 0,
                duration: 0.1,
                ease: "power2.out"
            });
    }
});
