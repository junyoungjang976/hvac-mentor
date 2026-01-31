// 냉매 배관 사이징 가이드

export interface PipeSizeEntry {
  용량: string
  흡입관: string
  액관: string
  토출관: string
}

export interface RefrigerantPipeSizing {
  냉매명: string
  단위: string
  표: PipeSizeEntry[]
  최대등가길이?: Record<string, number>
}

export interface FittingEquivalentLength {
  부품명: string
  등가길이: string
  비고?: string
}

export interface OilReturnGuideline {
  항목: string
  기준: string
  설명?: string
}

// R-22 배관 사이징 표
export const R22_PIPE_SIZING: RefrigerantPipeSizing = {
  냉매명: "R-22",
  단위: "mm OD (외경)",
  표: [
    { 용량: "0.5HP", 흡입관: "12.7mm", 액관: "6.35mm", 토출관: "9.52mm" },
    { 용량: "1HP", 흡입관: "15.88mm", 액관: "6.35mm", 토출관: "9.52mm" },
    { 용량: "2HP", 흡입관: "19.05mm", 액관: "9.52mm", 토출관: "12.7mm" },
    { 용량: "3HP", 흡입관: "22.22mm", 액관: "9.52mm", 토출관: "15.88mm" },
    { 용량: "5HP", 흡입관: "28.58mm", 액관: "12.7mm", 토출관: "19.05mm" }
  ],
  최대등가길이: {
    "0.5HP": 30,
    "1HP": 40,
    "2HP": 50,
    "3HP": 60,
    "5HP": 70
  }
}

// R-404A 배관 사이징 표
export const R404A_PIPE_SIZING: RefrigerantPipeSizing = {
  냉매명: "R-404A",
  단위: "mm OD (외경)",
  표: [
    { 용량: "0.5HP", 흡입관: "15.88mm", 액관: "6.35mm", 토출관: "9.52mm" },
    { 용량: "1HP", 흡입관: "19.05mm", 액관: "6.35mm", 토출관: "12.7mm" },
    { 용량: "2HP", 흡입관: "22.22mm", 액관: "9.52mm", 토출관: "12.7mm" },
    { 용량: "3HP", 흡입관: "28.58mm", 액관: "9.52mm", 토출관: "15.88mm" },
    { 용량: "5HP", 흡입관: "34.92mm", 액관: "12.7mm", 토출관: "19.05mm" }
  ],
  최대등가길이: {
    "0.5HP": 25,
    "1HP": 35,
    "2HP": 45,
    "3HP": 55,
    "5HP": 65
  }
}

// R-134a 배관 사이징 표
export const R134A_PIPE_SIZING: RefrigerantPipeSizing = {
  냉매명: "R-134a",
  단위: "mm OD (외경)",
  표: [
    { 용량: "0.5HP", 흡입관: "15.88mm", 액관: "6.35mm", 토출관: "9.52mm" },
    { 용량: "1HP", 흡입관: "19.05mm", 액관: "6.35mm", 토출관: "9.52mm" },
    { 용량: "2HP", 흡입관: "22.22mm", 액관: "9.52mm", 토출관: "12.7mm" },
    { 용량: "3HP", 흡입관: "28.58mm", 액관: "9.52mm", 토출관: "15.88mm" },
    { 용량: "5HP", 흡입관: "34.92mm", 액관: "12.7mm", 토출관: "19.05mm" }
  ],
  최대등가길이: {
    "0.5HP": 28,
    "1HP": 38,
    "2HP": 48,
    "3HP": 58,
    "5HP": 68
  }
}

// 통합 배관 사이징 테이블
export const PIPE_SIZING_TABLES: Record<string, RefrigerantPipeSizing> = {
  "R-22": R22_PIPE_SIZING,
  "R-404A": R404A_PIPE_SIZING,
  "R-134a": R134A_PIPE_SIZING
}

// 배관 피팅 등가길이 계수
export const EQUIVALENT_LENGTH_FACTORS: FittingEquivalentLength[] = [
  { 부품명: "90도 엘보", 등가길이: "1.0m", 비고: "표준 곡률 반경" },
  { 부품명: "45도 엘보", 등가길이: "0.5m" },
  { 부품명: "T분기 (직선)", 등가길이: "0.3m", 비고: "직진 흐름" },
  { 부품명: "T분기 (분기)", 등가길이: "1.5m", 비고: "90도 분기 흐름" },
  { 부품명: "볼밸브 (전개)", 등가길이: "0.2m" },
  { 부품명: "체크밸브", 등가길이: "2.0m" },
  { 부품명: "솔레노이드밸브", 등가길이: "3.0m" },
  { 부품명: "필터 드라이어", 등가길이: "1.0m" }
]

// 오일 리턴 가이드라인
export const OIL_RETURN_GUIDELINES: OilReturnGuideline[] = [
  {
    항목: "수평관 경사",
    기준: "1/200 경사 (압축기 방향)",
    설명: "흡입관 및 액관은 압축기를 향해 약간 하향 경사"
  },
  {
    항목: "수직 상승관 오일트랩",
    기준: "6m마다 오일트랩 설치",
    설명: "세로 배관이 길 경우 오일 환류를 위한 U자 트랩 필요"
  },
  {
    항목: "흡입관 최소 유속",
    기준: "3m/s 이상",
    설명: "오일을 압축기로 복귀시키기 위한 최소 유속"
  },
  {
    항목: "토출관 최소 유속",
    기준: "5m/s 이상",
    설명: "고온 고압 상태에서 오일 흐름 유지"
  },
  {
    항목: "이중 상승관 (듀얼 라이저)",
    기준: "부분 부하 시 고려",
    설명: "용량 제어 시스템에서 저부하 시 유속 확보"
  }
]

// 최대 등가길이 (전체 테이블)
export const MAXIMUM_EQUIVALENT_LENGTH: Record<string, Record<string, number>> = {
  "R-22": R22_PIPE_SIZING.최대등가길이 || {},
  "R-404A": R404A_PIPE_SIZING.최대등가길이 || {},
  "R-134a": R134A_PIPE_SIZING.최대등가길이 || {}
}

// 배관 재질 및 두께 가이드
export interface PipeMaterialGuide {
  재질: string
  용도: string
  특징: string
}

export const PIPE_MATERIAL_GUIDE: PipeMaterialGuide[] = [
  {
    재질: "동관 (인발관)",
    용도: "냉매 배관 전용",
    특징: "내식성 우수, 용접 가능, KS D 5301 규격"
  },
  {
    재질: "동관 (두께 0.8mm)",
    용도: "일반 냉동 시스템",
    특징: "소형~중형 시스템 표준"
  },
  {
    재질: "동관 (두께 1.0mm)",
    용도: "대형 냉동 시스템",
    특징: "압력 손실 최소화, 고압 대응"
  },
  {
    재질: "단열재 (PE 폼)",
    용도: "흡입관 보온",
    특징: "결로 방지, 냉매 과열도 유지"
  }
]

// 배관 설치 주의사항
export interface PipeInstallationNote {
  항목: string
  내용: string
  위험도?: "높음" | "중간" | "낮음"
}

export const PIPE_INSTALLATION_NOTES: PipeInstallationNote[] = [
  {
    항목: "배관 청소",
    내용: "질소 블로우로 내부 이물질 제거 (10kg/cm² 이상)",
    위험도: "높음"
  },
  {
    항목: "용접 시 질소 퍼징",
    내용: "산화 방지를 위해 배관 내부에 질소 주입 (0.5kg/cm²)",
    위험도: "중간"
  },
  {
    항목: "진동 방지",
    내용: "압축기 인근 배관에 플렉시블 호스 설치",
    위험도: "중간"
  },
  {
    항목: "배관 지지대",
    내용: "수평관 1.5m, 수직관 2m마다 지지대 설치",
    위험도: "낮음"
  },
  {
    항목: "냉매 충전 전 기밀 시험",
    내용: "질소 15kg/cm²로 24시간 압력 유지 확인",
    위험도: "높음"
  }
]
