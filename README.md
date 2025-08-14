# 🚀 스타크래프트 인생살아가기 RPG

> 테란의 일개 시민에서 우주 제국의 지배자까지!  
> 스타크래프트 테마의 인생 시뮬레이션 RPG 게임

![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Web-brightgreen.svg)

## 📖 게임 소개

스타크래프트 인생살아가기 RPG는 웹 브라우저에서 즐길 수 있는 인생 시뮬레이션 게임입니다. 플레이어는 테란의 평범한 시민으로 시작하여, 다양한 직업을 선택하고 자원을 수집하며 건물을 건설해 나가면서 점진적으로 성장하는 경험을 할 수 있습니다.

## ✨ 주요 기능

### 🎯 직업 시스템
- **광부**: 채광 특화, 미네랄 수집 보너스
- **기술자**: 건설 특화, 건물 건설 효율성 향상
- **군인**: 전투 특화, 체력 및 전투 스킬 강화
- **상인**: 거래 특화, 인구수 제한 증가

### 🏗️ 건설 시스템
- **커맨드 센터**: 기본 건물, 게임 시작점
- **배럭스**: 군사 건물, 전투 유닛 생산
- **팩토리**: 기계화 건물, 중장비 생산
- **스타포트**: 우주 건물, 우주선 생산
- **아카데미**: 연구 건물, 기술 개발

### 💎 자원 관리
- **미네랄**: 기본 건설 자원
- **가스**: 고급 건설 및 연구 자원
- **인구수**: 건물 및 유닛 제한
- **에너지**: 액션 수행에 필요한 자원

### 🎮 게임 시스템
- **난이도 설정**: 4단계 난이도 (쉬움 ~ 악몽)
- **저장/불러오기**: 3개 저장 슬롯 지원
- **자동 저장**: 5일마다 자동 저장
- **키보드 단축키**: 빠른 액션 실행

## 🚀 시작하기

### 요구사항
- 모던 웹 브라우저 (Chrome, Firefox, Safari, Edge)
- JavaScript 활성화
- 인터넷 연결 (GSAP 라이브러리 로드용)

### 설치 및 실행
1. 프로젝트를 클론하거나 다운로드
```bash
git clone [repository-url]
cd starcraft_rpg
```

2. 웹 브라우저에서 `index.html` 파일 열기
3. 게임 시작!

### 온라인 데모
- [GitHub Pages](https://[username].github.io/starcraft_rpg/) (예정)

## 🎨 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **애니메이션**: GSAP (GreenSock Animation Platform)
- **아키텍처**: 모듈화된 JavaScript 구조
- **저장**: LocalStorage
- **디자인**: 반응형 웹 디자인

## 📁 프로젝트 구조

```
starcraft_rpg/
├── 📄 index.html          # 메인 HTML 파일
├── 🎨 style.css           # 스타일시트 (애니메이션 포함)
├── ⚙️ game-core.js        # 핵심 게임 클래스
├── 🎮 game-actions.js     # 게임 액션들
├── 💾 game-save.js        # 저장/불러오기 시스템
├── 🖼️ game-render.js      # 렌더링 및 파티클
├── 🛠️ game-utils.js       # 유틸리티 함수들
├── 🚀 game-main.js        # 게임 초기화 및 메인 로직
├── 🐛 debug.html          # 디버깅 도구
└── 📚 README.md           # 게임 설명서
```

## 🎮 게임 플레이

### 기본 액션
1. **일하기** (⛏️): 미네랄 수집, 에너지 20 소모
2. **훈련하기** (🏋️): 스킬 향상, 미네랄 10 + 에너지 15 소모
3. **탐험하기** (🗺️): 랜덤 이벤트, 에너지 25 소모
4. **건설하기** (🏗️): 건물 건설, 미네랄 50+ 소모
5. **휴식하기** (😴): 에너지 회복, 무료

### 게임 진행
- 게임 내 시간은 실제 시간과 연동
- 하루가 지날 때마다 자동 저장 (설정 가능)
- 레벨업 시 체력, 에너지, 인구수 증가
- 스킬 향상으로 효율성 증가

## 🔧 개발자 도구

### 디버깅
- `debug.html` 파일을 통해 게임 상태 모니터링
- 브라우저 콘솔에서 `gameDebug` 함수 사용

### 전역 함수
```javascript
// 게임 상태 확인
gameDebug.showGameState()

// 게임 리셋
gameDebug.resetGame()

// 자원 추가
gameDebug.addResources(100, 50)

// 즉시 레벨업
gameDebug.levelUp()
```

## 📈 버전 히스토리

### v0.2.0 (2025-08-14)
- ✨ GSAP 애니메이션 라이브러리 통합
- 🎨 고급 CSS 애니메이션 시스템 구현
- 🔄 메뉴 전환 애니메이션 개선
- 💫 자원 획득 시 시각적 피드백 강화
- ⭐ 레벨업 파티클 효과 추가
- 🌐 Safari 브라우저 호환성 개선

### v0.1.0 (2025-08-14)
- 🎮 기본 게임 시스템 구현
- 🏗️ 건설 시스템 구현
- 💾 저장/불러오기 시스템
- 🎯 직업 시스템 및 보너스
- 📱 반응형 UI/UX 디자인

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 감사의 말

- **Blizzard Entertainment**: 스타크래프트 시리즈 영감
- **GreenSock**: GSAP 애니메이션 라이브러리
- **Google Fonts**: Orbitron 폰트 제공

## 📞 연락처

- **프로젝트 링크**: [https://github.com/[username]/starcraft_rpg](https://github.com/[username]/starcraft_rpg)
- **이슈 리포트**: [GitHub Issues](https://github.com/[username]/starcraft_rpg/issues)

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
