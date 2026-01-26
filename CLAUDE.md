# HVAC Mentor - AI 냉동공조 현장 멘토

## 개요
냉동공조 기술자를 위한 AI 지원 진단 및 멘토링 도구.
기존 Streamlit 앱(ai-havc-agent)을 React + Vite + Supabase + Vercel로 재구축.

## 기술 스택
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: Google Gemini 2.0 Flash
- **Deploy**: Vercel

## 프로젝트 구조
```
hvac-mentor/
├── src/
│   ├── data/           # 정적 데이터 (P-T 차트, 고장패턴 등)
│   │   ├── ptChart.ts
│   │   ├── fieldStandards.ts
│   │   ├── faultPatterns.ts
│   │   ├── emergency.ts
│   │   ├── checklist.ts
│   │   └── chargingGuide.ts
│   ├── lib/            # 유틸리티 및 외부 연동
│   │   ├── supabase.ts
│   │   ├── gemini.ts
│   │   └── diagnosis.ts
│   ├── components/     # UI 컴포넌트
│   ├── App.tsx         # 메인 앱
│   └── index.css       # Tailwind 스타일
├── supabase/
│   └── migrations/     # DB 마이그레이션
├── .env.example
├── vercel.json
└── CLAUDE.md
```

## 주요 기능

### 1. 진단 탭
- 저압/고압 입력
- 현장 증상 선택 (헌팅, 배관 성에, 액면계 거품, 압축기 소음)
- 자동 진단 (P-T 차트 기반)
- AI 멘토 가이드 (Gemini)
- 진단 리포트 다운로드

### 2. 고장 패턴 탭
- 8가지 고장 패턴 사전
- 원인, 증상, 조치사항, 주의사항

### 3. 비상 대응 탭
- 5가지 긴급 상황 매뉴얼
- 고압 이상, 액압축, 누설, 과열, 전기 이상

### 4. 체크리스트 탭
- 일일/주간/월간/계절별 점검 항목
- 체크 상태 저장 (Supabase)

### 5. 충전 가이드 탭
- 냉매별 충전 방법 (R-22, R-404A, R-134a)
- 준비 → 충전 → 확인 → 완료 기준

### 6. 고객 보고서 탭 (개발 중)
- 점검 결과 이미지 카드 생성

### 7. 전기 회로 탭 (개발 중)
- 전기 회로 다이어그램

## 환경변수
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_AI_KEY=your_google_ai_key
```

## 개발 명령어
```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# 빌드
npm run build

# 배포
vercel --prod
```

## P-T 차트 데이터
- R-22: Forane PDF 기준 (°C, kg/cm²G)
- R-404A: iGas PDF 기준
- R-134a: iGas PDF 기준

## 진단 로직
1. 저압/고압 입력 → P-T 차트로 증발/응축 온도 계산
2. 현장 기준(FIELD_STANDARDS)과 비교
3. 패턴 매칭 (FAULT_PATTERNS)
4. 증상 기반 추가 진단
5. AI 멘토 응답 생성

## Supabase 테이블
- `hvac_diagnoses`: 진단 기록
- `hvac_equipment`: 설비 정보
- `hvac_checklist_records`: 체크리스트 완료 기록

## 배포
- **Production**: https://hvac-mentor.vercel.app/

## 관련 링크
- 기존 Streamlit 앱: https://github.com/junyoungjang976/ai-havc-agent
- Busungtk 메인: https://github.com/junyoungjang976/busungtk
