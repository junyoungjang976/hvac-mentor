// 전기 회로 데이터
export interface ElectricalComponent {
  code: string
  name_kr: string
  name_en: string
  function: string
  spec?: string
  visualDescription?: string
  fieldTips?: string[]
  commonFailures?: string[]
}

export interface CircuitDiagram {
  id: string
  filename: string
  title_kr: string
  title_en: string
  description: string
}

export interface ControlStep {
  step: number
  name: string
  description: string
  components: string[]
}

export interface DiagnosisPoint {
  symptom: string
  checkPoints: string[]
  measurements: string[]
  solutions: string[]
}

// 전기 부품 사전
export const ELECTRICAL_COMPONENTS: Record<string, ElectricalComponent> = {
  MC: {
    code: "MC",
    name_kr: "전자접촉기",
    name_en: "Magnetic Contactor",
    function: "모터 전원을 개폐하는 릴레이. 코일에 전류가 흐르면 접점이 붙어 주회로를 연결함",
    spec: "AC 220V 코일, 3P 주접점",
    visualDescription: "코일 기호(원) + 주접점(3개 직선) + 보조접점",
    fieldTips: [
      "코일 웅웅 소리 → 전압 부족 또는 코일 불량",
      "접점 검게 변색 → 과부하 또는 교체 시기",
      "코일 저항 측정으로 단락/단선 확인 가능"
    ],
    commonFailures: [
      "접점 고착 (붙어서 안 떨어짐)",
      "접점 마모 (접촉 불량)",
      "코일 단선 (전자석 작동 안 함)"
    ]
  },
  THR: {
    code: "THR",
    name_kr: "열동계전기",
    name_en: "Thermal Overload Relay",
    function: "모터 과부하 보호. 정격 전류 초과 시 바이메탈이 휘어져 접점 개방",
    spec: "정격 전류의 105~120% 설정",
    visualDescription: "직사각형 안에 바이메탈 기호, 리셋 버튼",
    fieldTips: [
      "트립 시 빨간 버튼 돌출 확인",
      "냉각 후 리셋 (3~5분 대기)",
      "설정값: 모터 정격 전류 105~120%"
    ],
    commonFailures: [
      "바이메탈 피로로 오동작",
      "설정값 부적절",
      "리셋 불가 (내부 손상)"
    ]
  },
  NFB: {
    code: "NFB",
    name_kr: "배선용차단기",
    name_en: "No-Fuse Breaker",
    function: "회로 보호용 차단기. 과전류/단락 시 자동 차단",
    spec: "2P 또는 3P, 정격 전류별 선정",
    visualDescription: "사각형 안에 X 표시, 양쪽에 접점 기호",
    fieldTips: [
      "트립 시 레버가 중간 위치",
      "OFF로 내린 후 다시 ON",
      "반복 트립 시 원인 파악 필수"
    ],
    commonFailures: [
      "내부 접점 손상",
      "과전류 시 차단 지연",
      "레버 기구 고장"
    ]
  },
  TIC: {
    code: "TIC",
    name_kr: "온도조절기",
    name_en: "Temperature Controller",
    function: "설정 온도에 따라 압축기를 자동 제어. FOX-2SA1 모델 주로 사용",
    spec: "FOX-2SA1, 범위 -35~+35°C",
    visualDescription: "사각형에 온도 표시, 센서 연결선",
    fieldTips: [
      "dF(차동값) 설정으로 헌팅 방지",
      "센서 위치가 냉기 흐름 중에 있어야",
      "FOX-2SA1 모델이 일반적"
    ],
    commonFailures: [
      "센서 단선/단락",
      "접점 고착",
      "설정값 이탈"
    ]
  },
  DPS: {
    code: "DPS",
    name_kr: "압력스위치",
    name_en: "Dual Pressure Switch",
    function: "저압(LP)/고압(HP) 이상 시 압축기 정지. 안전장치",
    spec: "LP: 0.5~1.5kg/cm², HP: 18~22kg/cm²",
    visualDescription: "원 안에 L/H 표시, 스위치 기호",
    fieldTips: [
      "LP 트립 → 냉매 부족 우선 의심",
      "HP 트립 → 응축기 점검 우선",
      "설정 압력 확인 (현장 조건 맞게)"
    ],
    commonFailures: [
      "압력 포트 막힘",
      "다이어프램 손상",
      "접점 고착"
    ]
  },
  "F.HPC": {
    code: "F.HPC",
    name_kr: "고압차단스위치",
    name_en: "Fan High Pressure Cutout",
    function: "응축 압력 상승 시 응축기 팬 강제 기동",
    spec: "동작: 14kg/cm², 복귀: 12kg/cm²",
    visualDescription: "DPS 유사, HP 전용 표시",
    fieldTips: [
      "동작 압력 14kg/cm2 일반적",
      "복귀 압력 12kg/cm2 일반적",
      "고압 시 응축기 팬 강제 작동"
    ],
    commonFailures: [
      "설정 압력 이탈",
      "접점 불량",
      "감지 지연"
    ]
  },
  "52C": {
    code: "52C",
    name_kr: "압축기 접촉기",
    name_en: "Compressor Contactor",
    function: "압축기 전용 전자접촉기. MC와 동일 기능",
    spec: "AC 220V, 정격 전류 이상 선정",
    visualDescription: "MC와 동일, 52C 또는 52COMP 표기",
    fieldTips: [
      "MC와 동일 점검 방법",
      "압축기 기동 전류 고려해 용량 선정",
      "정격의 1.5배 이상 여유"
    ],
    commonFailures: [
      "접점 용착 (붙음)",
      "코일 단선",
      "접점 마모"
    ]
  },
  OL: {
    code: "OL",
    name_kr: "과부하계전기",
    name_en: "Overload Relay",
    function: "THR과 동일. 전동기 과부하 보호",
    spec: "정격 전류의 110~120%",
    visualDescription: "THR과 동일",
    fieldTips: [
      "THR과 동일한 기능",
      "다른 표기법일 뿐",
      "설정 및 점검 방법 동일"
    ],
    commonFailures: ["THR과 동일한 고장 모드"]
  },
  ELB: {
    code: "ELB",
    name_kr: "누전차단기",
    name_en: "Earth Leakage Breaker",
    function: "누전 발생 시 회로 차단. 감전 방지",
    spec: "정격 감도 전류 30mA, 동작 시간 0.03초",
    visualDescription: "NFB 기호에 T(테스트) 버튼 추가",
    fieldTips: [
      "월 1회 테스트 버튼 동작 확인",
      "트립 시 절연저항 측정 우선",
      "빗물 침투 여부 확인"
    ],
    commonFailures: [
      "감도 저하",
      "테스트 버튼 고장",
      "내부 회로 이상"
    ]
  },
  PB: {
    code: "PB",
    name_kr: "푸시버튼",
    name_en: "Push Button",
    function: "수동 조작 스위치. THR 트립 후 수동 리셋용",
    spec: "순간 접점형 (ON/OFF)",
    visualDescription: "원형 접점 기호",
    fieldTips: [
      "a접점: 누르면 ON",
      "b접점: 누르면 OFF",
      "THR 리셋용은 순간 접점"
    ],
    commonFailures: [
      "접점 고착",
      "스프링 피로",
      "배선 단선"
    ]
  },
  DS: {
    code: "DS",
    name_kr: "제상스위치",
    name_en: "Defrost Switch",
    function: "제상 주기 및 시간 제어",
    spec: "타이머식 또는 온도식",
    visualDescription: "시계 기호 또는 타이머 박스",
    fieldTips: [
      "제상 간격: 6~8시간 일반적",
      "제상 시간: 20~30분 일반적",
      "현장 조건에 맞게 조정"
    ],
    commonFailures: [
      "타이머 모터 고장",
      "접점 마모",
      "설정 오류"
    ]
  },
  DH: {
    code: "DH",
    name_kr: "제상히터",
    name_en: "Defrost Heater",
    function: "증발기 성에 제거용 전기 히터",
    spec: "AC 220V, 용량별 선정",
    visualDescription: "저항 기호(지그재그) 또는 네모에 H 표시",
    fieldTips: [
      "저항 측정으로 단선 확인",
      "무한대 → 단선, 교체 필요",
      "정상 저항: 20~50옴 (용량별 상이)"
    ],
    commonFailures: [
      "히터 단선",
      "절연 저하 (누전)",
      "용량 감소 (노후)"
    ]
  },
  DTS: {
    code: "DTS",
    name_kr: "제상종료스위치",
    name_en: "Defrost Termination Switch",
    function: "제상 완료 시 히터 차단 (온도 감지)",
    spec: "동작 온도: +10~15°C",
    visualDescription: "센서 기호에 온도 표시",
    fieldTips: [
      "동작 온도: +10~15도",
      "센서가 증발기 핀에 밀착되어야",
      "제상 종료 신호 발생"
    ],
    commonFailures: [
      "센서 고장 (오동작)",
      "위치 이탈",
      "배선 단선"
    ]
  }
}

// 회로 다이어그램 정보
export const CIRCUIT_DIAGRAMS: CircuitDiagram[] = [
  {
    id: "walk-in-1",
    filename: "walk-in-diagram-1.jpg",
    title_kr: "동력 및 제어회로",
    title_en: "Power & Control Circuit",
    description: "워크인 냉장고 전체 전기 회로도. 동력 회로(압축기, 팬모터)와 제어 회로(TIC, DPS, MC) 포함"
  },
  {
    id: "walk-in-2",
    filename: "walk-in-diagram-2.jpg",
    title_kr: "상세 제어회로",
    title_en: "Detailed Control Circuit",
    description: "온도 제어 로직 및 안전 장치 연동 상세도. 제상 회로 포함"
  }
]

// 제어 시퀀스 (운전 순서)
export const CONTROL_SEQUENCE: ControlStep[] = [
  {
    step: 1,
    name: "전원 투입",
    description: "NFB/ELB ON → 제어 회로 전원 공급",
    components: ["NFB", "ELB"]
  },
  {
    step: 2,
    name: "온도조절기 설정",
    description: "TIC가 고내 온도 감지 → 설정 온도보다 높으면 MC 코일 여자",
    components: ["TIC", "MC"]
  },
  {
    step: 3,
    name: "압축기 기동",
    description: "MC 주접점 닫힘 → 52C 여자 → 압축기 모터 기동. THR/DPS 정상 확인 필수",
    components: ["MC", "52C", "THR", "DPS"]
  },
  {
    step: 4,
    name: "응축기 팬 연동",
    description: "압축기 기동과 동시에 응축기 팬 모터 기동. F.HPC는 고압 이상 시에만 추가 기동",
    components: ["MC", "F.HPC"]
  },
  {
    step: 5,
    name: "온도 유지 운전",
    description: "TIC 설정 온도 도달 시 MC 코일 소자 → 압축기 정지. 온도 상승 시 재기동 반복",
    components: ["TIC", "MC"]
  },
  {
    step: 6,
    name: "제상 사이클",
    description: "DS 타이머 동작 → 압축기 정지 → DH 통전 → DTS 감지 시 제상 종료 → 압축기 재기동",
    components: ["DS", "DH", "DTS", "MC"]
  }
]

// 고장 진단 포인트
export const FAULT_DIAGNOSIS_POINTS: DiagnosisPoint[] = [
  {
    symptom: "압축기 미기동 (무반응)",
    checkPoints: [
      "1. NFB/ELB 차단 여부 확인",
      "2. TIC 설정 온도 확인 (고내 온도보다 낮게 설정)",
      "3. MC 코일 전압 측정 (AC 220V)",
      "4. THR 수동 리셋 버튼 확인 (트립 시 돌출)"
    ],
    measurements: [
      "MC 코일 단자 전압: AC 220V (정상) / 0V (이상)",
      "52C 주접점 양단 전압: 0V (정상) / 220V (접점 불량)"
    ],
    solutions: [
      "THR 트립 시 → 냉각 후 수동 리셋 (PB 버튼). 재발 시 THR 정격 확인",
      "MC 코일 무전압 시 → TIC 접점 또는 DPS 접점 개방 확인",
      "MC 접점 불량 시 → MC 교체"
    ]
  },
  {
    symptom: "압축기는 작동하나 응축기 팬 미작동",
    checkPoints: [
      "1. 팬 모터 전원 확인 (MC 보조 접점 통해 공급)",
      "2. 팬 모터 회전 여부 수동 확인 (베어링 고착?)",
      "3. F.HPC 접점 확인 (고압 정상 시는 OFF)"
    ],
    measurements: [
      "팬 모터 단자 전압: AC 220V 확인",
      "팬 모터 권선 저항: 50~100Ω (모터 종류별 상이)",
      "팬 모터 운전 전류: 정격 전류와 비교"
    ],
    solutions: [
      "전원 정상인데 미작동 → 팬 모터 베어링 고착 또는 권선 단선 → 모터 교체",
      "F.HPC만 작동 시 → 일반 운전 시에도 팬 동작하도록 회로 확인"
    ]
  },
  {
    symptom: "제상 불량 (성에 제거 안됨)",
    checkPoints: [
      "1. DS 타이머 설정 확인 (제상 주기, 제상 시간)",
      "2. DH 통전 확인 (전압 측정, 히터 온도)",
      "3. DTS 동작 확인 (제상 종료 온도)"
    ],
    measurements: [
      "DH 단자 전압: AC 220V (제상 중) / 0V (냉동 중)",
      "DH 저항: 20~50Ω (용량별 상이). 무한대 시 히터 단선",
      "DTS 동작 온도: 센서로 측정, +10~15°C 확인"
    ],
    solutions: [
      "DH 단선 시 → 히터 교체",
      "DS 미작동 시 → 타이머 고장, 교체 필요",
      "DTS 오작동 시 → 센서 위치 확인 또는 교체"
    ]
  },
  {
    symptom: "THR 자주 트립 (과부하계전기 동작)",
    checkPoints: [
      "1. 압축기 운전 전류 측정 (정격 전류와 비교)",
      "2. THR 정격 설정 확인 (압축기 정격의 110~120%)",
      "3. 압축기 과부하 원인 파악 (고압 이상, 전압 부족, 압축기 불량)"
    ],
    measurements: [
      "압축기 운전 전류: 정격 전류 ±10% 이내 정상",
      "전원 전압: AC 220V ±10% 확인",
      "고압/저압: 게이지로 측정, 정상 범위 확인"
    ],
    solutions: [
      "전류 과다 + 고압 높음 → 응축기 청소 또는 냉매 과충전 회수",
      "전압 부족 시 → 전원 용량 확인 또는 배선 점검",
      "THR 설정 부적절 시 → 정격에 맞게 재설정",
      "압축기 불량 (베어링 마모 등) → 압축기 교체"
    ]
  },
  {
    symptom: "DPS 작동 (압력 이상 정지)",
    checkPoints: [
      "1. 저압 스위치 트립 → 저압 0.5kg/cm² 미만 확인",
      "2. 고압 스위치 트립 → 고압 22kg/cm² 이상 확인",
      "3. DPS 설정 압력 확인"
    ],
    measurements: [
      "저압 게이지: 정상 1.5~3.5kg/cm²G (R-22 기준)",
      "고압 게이지: 정상 12~16kg/cm²G (R-22 기준)",
      "DPS 접점 연속성: 정상 시 도통, 트립 시 개방"
    ],
    solutions: [
      "저압 이상 → 냉매 부족 또는 팽창밸브 막힘. 냉매 보충 또는 TXV 점검",
      "고압 이상 → 응축기 청소, 팬 작동 확인, 냉매 과충전 회수",
      "DPS 오작동 시 → 설정 압력 조정 또는 DPS 교체"
    ]
  },
  {
    symptom: "누전차단기(ELB) 트립",
    checkPoints: [
      "1. 압축기 절연 저항 측정 (메가 테스터)",
      "2. 팬 모터 절연 저항 측정",
      "3. 제상 히터 절연 저항 측정",
      "4. 배선 피복 손상 여부 육안 확인"
    ],
    measurements: [
      "절연 저항: 1MΩ 이상 정상, 0.5MΩ 미만 누전 의심",
      "측정 방법: 메가 테스터 500V, 각 상과 접지(E) 간 측정"
    ],
    solutions: [
      "압축기 누전 시 → 압축기 교체",
      "팬 모터 누전 시 → 팬 모터 교체",
      "히터 누전 시 → 히터 교체",
      "배선 손상 시 → 해당 부위 재배선 또는 절연 테이프 보수"
    ]
  }
]

// 전기 회로 안전 수칙
export const ELECTRICAL_SAFETY_RULES = [
  "⚠️ 전기 작업 시 반드시 전원 차단 후 작업",
  "⚠️ 전압 측정 시 절연 장갑 착용 및 멀티미터 정상 확인",
  "⚠️ 감전 위험: 젖은 손으로 작업 금지",
  "⚠️ 단락 주의: 배선 작업 시 전선 접촉 방지",
  "⚠️ 정전기 방지: 전자 부품 취급 시 접지 팔찌 착용",
  "⚠️ 절연 저항 측정 시 회로 내 전자 부품 분리 (고전압 손상 방지)",
  "⚠️ THR 리셋 후 재트립 반복 시 무리한 재기동 금지 → 원인 파악 우선"
]

// 측정 장비 사용법
export const MEASUREMENT_TOOLS = {
  multimeter: {
    name: "디지털 멀티미터",
    uses: [
      "전압 측정: AC 220V 확인 (MC 코일, 모터 단자)",
      "저항 측정: 히터 저항, 모터 권선 저항",
      "전류 측정: 클램프 미터 또는 전류 단자 이용"
    ],
    caution: "⚠️ 전압 측정 모드에서 저항 측정 금지 (미터 손상)"
  },
  megger: {
    name: "절연 저항계 (메가 테스터)",
    uses: [
      "절연 저항 측정: 모터, 압축기, 히터 대지(E) 간 측정",
      "측정 전압: 500V DC (일반 기기), 1000V DC (고압 기기)",
      "판정 기준: 1MΩ 이상 정상"
    ],
    caution: "⚠️ 전자 부품(TIC, DPS 등) 연결된 상태로 측정 금지 → 고전압으로 부품 파손"
  },
  clampMeter: {
    name: "클램프 미터",
    uses: [
      "운전 전류 측정: 압축기, 팬 모터 각 상 전류",
      "3상 평형 확인: 각 상 전류 차이 5% 이내 정상"
    ],
    caution: "측정 시 전선 1개만 클램프에 끼워야 함 (2개 이상 시 상쇄되어 0A 표시)"
  }
}
