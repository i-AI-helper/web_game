# 🎮 테트릭스 게임 - 고급 사운드 시스템

> Web Audio API를 활용한 고품질 사운드가 통합된 클래식 테트릭스 게임

## ✨ 주요 특징

### 🎵 고급 사운드 시스템
- **Web Audio API**: 고품질 오디오 처리 및 효과음
- **HTML5 Audio 폴백**: 호환성을 위한 대체 시스템
- **볼륨 조절**: 마스터, 효과음, BGM 개별 볼륨 제어
- **사운드 설정**: 실시간 사운드 설정 및 테스트 기능
- **이벤트 기반**: 게임 액션과 연동되는 자동 사운드 재생

### 🎮 게임 기능
- **클래식 테트릭스**: 7가지 테트로미노 블록
- **콤보 시스템**: 연속 줄 제거 시 보너스 점수
- **레벨 시스템**: 점수에 따른 난이도 증가
- **최고 점수**: 로컬 스토리지 기반 점수 저장
- **모바일 지원**: 터치 제스처 및 반응형 디자인

### 🎨 UI/UX
- **현대적 디자인**: 그라데이션과 블러 효과
- **반응형 레이아웃**: 데스크톱 및 모바일 최적화
- **애니메이션**: 부드러운 전환 효과
- **접근성**: 키보드 네비게이션 및 포커스 표시

## 🚀 시작하기

### 요구사항
- 모던 웹 브라우저 (Chrome 66+, Firefox 60+, Safari 11.1+)
- Web Audio API 지원 (선택사항)
- 터치 지원 (모바일)

### 설치 및 실행
1. 프로젝트 폴더로 이동
2. `index.html` 파일을 웹 브라우저에서 열기
3. 게임 시작 버튼 클릭

### 온라인 데모
- [GitHub Pages](https://your-username.github.io/tetris-game/)
- 또는 로컬 서버에서 실행

## 🎯 게임 조작법

### 키보드 조작
- **← →**: 블록 좌우 이동
- **↑**: 블록 회전
- **↓**: 블록 하강
- **스페이스바**: 즉시 하강
- **ESC**: 일시정지/재개

### 모바일 조작
- **스와이프**: 블록 이동 및 회전
- **더블 탭**: 즉시 하강

### 게임 규칙
- 블록을 조작하여 가로줄을 완성
- 완성된 줄은 자동으로 제거
- 4줄 동시 제거 시 "테트리스" 보너스
- 연속 제거 시 콤보 보너스
- 블록이 맨 위에 닿으면 게임 오버

## 🎵 사운드 시스템

### 지원 사운드
- **효과음**: 블록 이동, 회전, 하강, 줄 제거
- **특수 효과**: 테트리스, 레벨 업, 게임 오버
- **BGM**: 테마 음악 (루프 재생)

### 사운드 설정
- 우측 상단 🎵 버튼 클릭
- 개별 볼륨 조절 (마스터, 효과음, BGM)
- 사운드 활성화/비활성화
- 실시간 사운드 테스트

### 기술적 특징
- **Web Audio API**: 고품질 오디오 처리
- **오디오 필터**: 피치 조절 및 효과
- **메모리 관리**: 효율적인 오디오 버퍼 관리
- **폴백 시스템**: HTML5 Audio 지원

## 🏗️ 기술 스택

### 프론트엔드
- **HTML5**: 시맨틱 마크업 및 Canvas
- **CSS3**: Flexbox, Grid, 애니메이션
- **JavaScript (ES6+)**: 클래스 기반 아키텍처

### 오디오 시스템
- **Web Audio API**: 고급 오디오 처리
- **HTML5 Audio**: 폴백 시스템
- **Audio Context**: 실시간 오디오 조작

### 게임 엔진
- **Canvas API**: 2D 그래픽 렌더링
- **RequestAnimationFrame**: 부드러운 애니메이션
- **이벤트 시스템**: 커스텀 이벤트 기반 통신

## 📁 프로젝트 구조

```
tetris_game/
├── index.html              # 메인 HTML 파일
├── style.css               # CSS 스타일시트
├── tetris.js               # 게임 로직
├── advanced-sound-manager.js # 고급 사운드 매니저
├── sound-settings.js       # 사운드 설정 UI
├── sounds/                 # 사운드 파일 폴더
│   ├── line-clear.mp3     # 줄 제거 효과음
│   ├── tetris.mp3         # 테트리스 효과음
│   ├── rotate.mp3         # 회전 효과음
│   ├── drop.mp3           # 하강 효과음
│   ├── game-over.mp3      # 게임 오버 효과음
│   ├── level-up.mp3       # 레벨 업 효과음
│   ├── combo.mp3          # 콤보 효과음
│   ├── move.mp3           # 이동 효과음
│   ├── hold.mp3           # 홀드 효과음
│   ├── hard-drop.mp3      # 즉시 하강 효과음
│   └── tetris-theme.mp3   # 테마 BGM
└── README.md               # 프로젝트 문서
```

## 🔧 개발 가이드

### 로컬 개발 환경
```bash
# 프로젝트 클론
git clone https://github.com/your-username/tetris-game.git
cd tetris-game

# 로컬 서버 실행 (Python)
python -m http.server 8000

# 또는 Node.js
npx http-server

# 브라우저에서 http://localhost:8000 접속
```

### 사운드 파일 추가
1. `sounds/` 폴더에 MP3 파일 추가
2. `advanced-sound-manager.js`의 `soundFiles` 객체에 경로 추가
3. 게임 로직에서 `playSound('새사운드명')` 호출

### 새로운 게임 기능 추가
1. `tetris.js`에 기능 구현
2. 필요한 경우 커스텀 이벤트 발생
3. 사운드 매니저에서 이벤트 리스너 등록

## 🎨 커스터마이징

### 색상 테마 변경
```css
:root {
    --primary-color: #4fc3f7;
    --secondary-color: #29b6f6;
    --accent-color: #ff6b6b;
    --background-color: #0f0f23;
}
```

### 사운드 설정 수정
```javascript
// advanced-sound-manager.js
this.masterVolume = 0.8;    // 마스터 볼륨
this.sfxVolume = 0.9;       // 효과음 볼륨
this.bgmVolume = 0.7;       // BGM 볼륨
```

### 게임 속도 조절
```javascript
// tetris.js
this.dropInterval = 800;     // 기본 하강 속도 (밀리초)
```

## 🧪 테스트

### 기능 테스트
- [x] 기본 게임 플레이
- [x] 사운드 시스템
- [x] 모바일 터치 지원
- [x] 점수 시스템
- [x] 일시정지/재개

### 브라우저 호환성
- [x] Chrome 66+
- [x] Firefox 60+
- [x] Safari 11.1+
- [x] Edge 79+

### 성능 테스트
- [x] 60fps 게임 루프
- [x] 메모리 사용량 최적화
- [x] 오디오 지연 최소화

## 🐛 문제 해결

### 사운드가 재생되지 않는 경우
1. 브라우저 설정에서 사운드 허용 확인
2. Web Audio API 지원 여부 확인
3. 개발자 도구 콘솔에서 오류 메시지 확인

### 게임이 느리게 실행되는 경우
1. 다른 탭이나 프로그램 종료
2. 브라우저 하드웨어 가속 활성화
3. 게임 캔버스 크기 조정

### 모바일에서 터치가 작동하지 않는 경우
1. 터치 이벤트가 차단되지 않았는지 확인
2. 브라우저 터치 지원 확인
3. 페이지 새로고침

## 📈 성능 최적화

### 렌더링 최적화
- Canvas 더블 버퍼링
- 불필요한 그리기 연산 최소화
- RequestAnimationFrame 활용

### 오디오 최적화
- 오디오 파일 압축
- 지연 로딩 및 프리로딩
- 메모리 효율적인 버퍼 관리

### 메모리 관리
- 이벤트 리스너 정리
- 오디오 컨텍스트 관리
- 가비지 컬렉션 최적화

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

### 테스트 가이드라인
- 새로운 기능에 대한 테스트 작성
- 크로스 브라우저 호환성 확인
- 모바일 디바이스 테스트
- 성능 벤치마크 실행

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🙏 감사의 말

- **테트리스**: 원작자 Alexey Pajitnov
- **Web Audio API**: W3C 표준
- **Canvas API**: HTML5 표준
- **커뮤니티**: 기여자 및 사용자들

## 📞 연락처

- **GitHub**: [@your-username](https://github.com/your-username)
- **이슈**: [GitHub Issues](https://github.com/your-username/tetris-game/issues)
- **문의**: your-email@example.com

---

**즐거운 게임 되세요! 🎮✨**
