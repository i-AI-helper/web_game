// 게임 렌더링과 파티클 시스템을 StarcraftRPG 클래스에 추가
Object.assign(StarcraftRPG.prototype, {
    
    render() {
        // 캔버스 클리어
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 배경 그리기
        this.drawBackground();
        
        // 플레이어 캐릭터 그리기
        this.drawPlayer();
        
        // 건물들 그리기
        this.drawBuildings();
        
        // 파티클 그리기
        this.drawParticles();
        
        // UI 요소들 그리기
        this.drawUI();
    },

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
    },

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
        
        // 에너지 바
        const energyBarWidth = 40;
        const energyBarHeight = 4;
        const energyPercentage = this.player.energy / this.player.maxEnergy;
        
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(400 - energyBarWidth/2, 275, energyBarWidth, energyBarHeight);
        this.ctx.fillStyle = '#2ed573';
        this.ctx.fillRect(400 - energyBarWidth/2, 275, energyBarWidth * energyPercentage, energyBarHeight);
    },

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
    },

    drawUI() {
        // 게임 정보 표시
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 100);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Day: ${this.day}`, 20, 30);
        this.ctx.fillText(`Level: ${this.player.level}`, 20, 50);
        this.ctx.fillText(`Exp: ${this.player.experience}/${this.player.experienceToNext}`, 20, 70);
        this.ctx.fillText(`Profession: ${this.getProfessionName(this.player.profession)}`, 20, 90);
    },

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
    },

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
    },

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 60;
            this.ctx.fillRect(particle.x, particle.y, 3, 3);
        });
        this.ctx.globalAlpha = 1;
    }
});
