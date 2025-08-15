# 🚀 1.game web - 통합 게임 개발 프로젝트

> 테트릭스부터 스타크래프트 RPG까지!  
> AI 기반으로 지속적으로 개선되는 웹 게임 플랫폼

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Web-brightgreen.svg)
![AI-Powered](https://img.shields.io/badge/AI-Powered-ff6b6b.svg)

## 📖 프로젝트 소개

**1.game web**은 AI 기반으로 개발되고 지속적으로 개선되는 웹 게임 플랫폼입니다. 현재 테트릭스 게임과 스타크래프트 인생살아가기 RPG를 포함하고 있으며, 체계적인 문서화와 AI의 임의판단을 통한 지속적인 개선이 특징입니다.

### 🎯 프로젝트 목표
- **다양한 장르의 게임 통합**: 테트릭스, RPG, 시뮬레이션 등
- **AI 기반 개발 프로세스**: 자동화된 개선 제안 및 개발 방향성 제시
- **사용자 경험 최적화**: 반응형 디자인, 애니메이션, 사운드 시스템
- **확장 가능한 아키텍처**: 새로운 게임 추가 시 쉬운 통합

---

## 🎮 포함된 게임

### 🧩 테트릭스 게임 (v1.0.0) - 완성 🎉
**상태**: 100% 완성 - 고급 사운드 시스템 통합 완료

#### ✨ 주요 기능
- **클래식 테트릭스 게임플레이**: 7가지 테트로미노 블록
- **고급 사운드 시스템**: Web Audio API + HTML5 Audio 폴백
- **사운드 설정 UI**: 실시간 볼륨 조절, 사운드 테스트
- **고급 점수 시스템**: 점수, 줄, 레벨, 콤보 시스템
- **모바일 지원**: 터치 스와이프, 더블탭 제스처
- **최고 점수 저장**: LocalStorage 기반 기록 관리
- **게임 상태 관리**: 일시정지, 게임오버 화면
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험

#### 🛠️ 기술적 특징
- HTML5 Canvas 기반 렌더링
- JavaScript ES6+ 클래스 아키텍처
- CSS3 그라디언트, 애니메이션, 블러 효과
- Web Audio API + HTML5 Audio 통합
- 모바일 터치 이벤트 처리
- 이벤트 기반 아키텍처

#### 🆕 새로 추가된 기능
- **고급 사운드 매니저**: `AdvancedTetrisSoundManager` 클래스
- **사운드 설정 UI**: `TetrisSoundSettings` 컴포넌트
- **자동 사운드 재생**: 게임 이벤트와 연동되는 사운드
- **향상된 모바일 지원**: 제스처 기반 조작
- **콤보 시스템**: 연속 줄 제거 시 보너스 점수

### ⚔️ 스타크래프트 인생살아가기 RPG (v0.2.0) - 개발 중 🔄
**상태**: 기본 시스템 완성, 애니메이션 개선 완료 (85%)

#### ✨ 주요 기능
- **직업 시스템**: 광부, 기술자, 군인, 상인 중 선택
- **자원 관리**: 미네랄, 가스, 인구수, 에너지
- **건설 시스템**: 커맨드 센터, 배럭스, 팩토리, 스타포트, 아카데미
- **스킬 시스템**: 채광, 공학, 전투, 외교 스킬 향상
- **GSAP 애니메이션**: 고급 애니메이션 및 파티클 효과
- **저장/불러오기**: 3개 저장 슬롯, 자동 저장

#### 🛠️ 기술적 특징
- 모듈화된 JavaScript 구조
- GSAP (GreenSock Animation Platform) 통합
- LocalStorage 기반 게임 데이터 관리
- 반응형 웹 디자인

---

## 🚀 시작하기

### 요구사항
- 모던 웹 브라우저 (Chrome, Firefox, Safari, Edge)
- JavaScript 활성화
- Web Audio API 지원 (선택사항, HTML5 Audio 폴백 제공)

### 설치 및 실행

#### 1. 프로젝트 클론
```bash
git clone https://github.com/i-AI-helper/web_game.git
cd web_game
```

#### 2. 게임 실행
- **테트릭스**: `tetris_game/index.html` 열기
- **스타크래프트 RPG**: `starcraft_rpg/index.html` 열기

#### 3. 온라인 데모
- [GitHub Pages](https://i-ai-helper.github.io/web_game/) (예정)

---

## 🎨 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업 및 Canvas API
- **CSS3**: Flexbox, Grid, 애니메이션, 반응형 디자인
- **JavaScript ES6+**: 클래스, 모듈, 비동기 처리

### 게임 엔진
- **Canvas API**: 2D 그래픽 렌더링
- **Web Audio API**: 고급 사운드 시스템 ✅
- **HTML5 Audio**: 폴백 사운드 시스템 ✅
- **LocalStorage**: 게임 데이터 저장

### 애니메이션 & UI
- **GSAP**: 고급 애니메이션 라이브러리
- **CSS Animations**: 키프레임 애니메이션
- **반응형 디자인**: 모바일 퍼스트 접근법

### 사운드 시스템 ✅
- **Web Audio API**: 고품질 오디오 처리
- **오디오 필터**: 피치 조절, 볼륨 제어
- **이벤트 기반**: 게임 액션과 연동되는 자동 사운드

---

## 📁 프로젝트 구조

```
1.game web/
├── tetris_game/                    # 테트릭스 게임 (완성) 🎉
│   ├── index.html                 # 메인 HTML
│   ├── style.css                  # 스타일시트
│   ├── tetris.js                  # 게임 로직
│   ├── advanced-sound-manager.js  # 고급 사운드 매니저
│   ├── sound-settings.js          # 사운드 설정 UI
│   ├── sounds/                    # 사운드 파일 폴더
│   └── README.md                  # 상세 문서
├── starcraft_rpg/                 # 스타크래프트 RPG
├── md_files/                      # 프로젝트 문서
│   ├── AI_README.md              # AI 작업 기록
│   ├── project.ai.md             # 프로젝트 개요
│   ├── what_at.md                # 개선 제안
│   └── Release.md                # 릴리즈 노트
└── ai_cheat/                      # AI 대화 기록
```

---

## 🔄 버전 히스토리

### v1.0.0 (2025-08-16) 🎉
- **테트릭스 게임 완전 재구성**
  - 고급 사운드 시스템 통합
  - Web Audio API + HTML5 Audio 폴백
  - 사운드 설정 UI 컴포넌트
  - 모바일 터치 제스처 지원
  - 콤보 시스템 및 레벨 시스템
  - 반응형 디자인 및 현대적 UI

### v0.2.1 (2025-08-14)
- 테트릭스 게임 기본 기능 완성
- 점수, 줄, 레벨 시스템
- 모바일 터치 지원
- 반응형 디자인

### v0.2.0 (2025-08-14)
- 스타크래프트 RPG 기본 시스템
- GSAP 애니메이션 통합
- 모듈화된 JavaScript 구조

---

## 🎯 다음 단계

1. **GitHub 배포**: 완성된 테트릭스 게임을 저장소에 업로드
2. **사용자 테스트**: 게임 플레이 테스트 및 피드백 수집
3. **스타크래프트 RPG 사운드 시스템**: 테트릭스와 동일한 사운드 시스템 적용
4. **고급 기능 개발**: 인증 시스템, 리더보드, 테마 시스템

---

## 🤝 기여하기

### 개발 환경 설정
1. 프로젝트 포크
2. 기능 브랜치 생성
3. 코드 작성 및 테스트
4. Pull Request 생성

### 코딩 스타일
- ES6+ 문법 사용
- JSDoc 주석 작성
- 일관된 네이밍 컨벤션
- 에러 처리 및 로깅

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

## 🙏 감사의 말

- **테트리스**: 원작자 Alexey Pajitnov
- **Web Audio API**: W3C 표준
- **GSAP**: GreenSock Animation Platform
- **AI 어시스턴트**: Claude Sonnet 4

---

**프로젝트 상태**: 테트릭스 게임 100% 완성 🎉  
**마지막 업데이트**: 2025년 8월 16일 00:18  
**다음 마일스톤**: GitHub 배포 및 사용자 피드백 수집
