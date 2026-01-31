// 전기 회로 학습 가이드 데이터

// ============================================================
// 회로 기호 사전 (Circuit Symbol Dictionary)
// ============================================================

export interface CircuitSymbol {
  id: string
  symbol: string
  name_kr: string
  name_en: string
  category: 'power' | 'control' | 'protection' | 'sensor' | 'motor'
  description: string
  visualDescription: string
  fieldTip?: string
}

export const CIRCUIT_SYMBOLS: CircuitSymbol[] = [
  // 전원 및 스위치류
  {
    id: 'nfb',
    symbol: 'NFB',
    name_kr: '배선용차단기',
    name_en: 'No-Fuse Breaker',
    category: 'protection',
    description: '과전류 및 단락 시 자동으로 회로를 차단하는 보호장치',
    visualDescription: '사각형 안에 X 표시, 양쪽에 접점 기호',
    fieldTip: '트립 시 레버가 중간 위치. ON 전에 OFF로 완전히 내린 후 다시 올려야 함'
  },
  {
    id: 'elb',
    symbol: 'ELB',
    name_kr: '누전차단기',
    name_en: 'Earth Leakage Breaker',
    category: 'protection',
    description: '누전 감지 시 0.03초 내 차단하여 감전 방지',
    visualDescription: 'NFB 기호에 T(테스트) 버튼 추가',
    fieldTip: '월 1회 테스트 버튼으로 동작 확인 필수'
  },
  {
    id: 'mc',
    symbol: 'MC',
    name_kr: '전자접촉기',
    name_en: 'Magnetic Contactor',
    category: 'control',
    description: '코일에 전압이 인가되면 주접점이 닫혀 모터에 전원 공급',
    visualDescription: '코일 기호(원) + 주접점(3개 직선) + 보조접점',
    fieldTip: '웅웅 소리가 나면 코일 불량 또는 접점 이물질. 접점이 검게 변색되면 교체 시기'
  },
  {
    id: '52c',
    symbol: '52C',
    name_kr: '압축기 접촉기',
    name_en: 'Compressor Contactor',
    category: 'control',
    description: 'MC와 동일 기능. 압축기 전용 전자접촉기',
    visualDescription: 'MC와 동일, 52C 또는 52COMP 표기',
    fieldTip: '압축기 기동 시 순간적으로 높은 전류가 흐르므로 정격에 여유 필요'
  },
  {
    id: 'thr',
    symbol: 'THR',
    name_kr: '열동계전기',
    name_en: 'Thermal Overload Relay',
    category: 'protection',
    description: '과전류 시 바이메탈이 휘어져 접점을 개방하여 모터 보호',
    visualDescription: '직사각형 안에 바이메탈 기호, 리셋 버튼',
    fieldTip: '트립 후 냉각 시간(3~5분) 필요. 빨간 버튼 돌출 시 트립 상태'
  },
  {
    id: 'ol',
    symbol: 'OL',
    name_kr: '과부하계전기',
    name_en: 'Overload Relay',
    category: 'protection',
    description: 'THR과 동일 기능, 다른 표기법',
    visualDescription: 'THR과 동일',
    fieldTip: '설정값은 모터 정격 전류의 105~120%'
  },
  {
    id: 'tic',
    symbol: 'TIC',
    name_kr: '온도조절기',
    name_en: 'Temperature Indicator Controller',
    category: 'sensor',
    description: '설정 온도에 따라 압축기 ON/OFF 자동 제어',
    visualDescription: '사각형에 온도 표시, 센서 연결선',
    fieldTip: 'FOX-2SA1 모델이 일반적. dF(차동값) 설정으로 헌팅 방지'
  },
  {
    id: 'dps',
    symbol: 'DPS',
    name_kr: '압력스위치',
    name_en: 'Dual Pressure Switch',
    category: 'sensor',
    description: '저압/고압 이상 감지 시 압축기 정지. 안전장치',
    visualDescription: '원 안에 L/H 표시, 스위치 기호',
    fieldTip: 'LP(저압) 트립 시: 냉매 부족 의심. HP(고압) 트립 시: 응축기 점검'
  },
  {
    id: 'fhpc',
    symbol: 'F.HPC',
    name_kr: '고압차단스위치',
    name_en: 'Fan High Pressure Cutout',
    category: 'sensor',
    description: '고압 상승 시 응축기 팬 강제 작동',
    visualDescription: 'DPS 유사, HP 전용 표시',
    fieldTip: '동작 압력 14kg/cm2, 복귀 압력 12kg/cm2가 일반적'
  },
  // 모터류
  {
    id: 'comp',
    symbol: 'COMP',
    name_kr: '압축기모터',
    name_en: 'Compressor Motor',
    category: 'motor',
    description: '냉매를 압축하는 핵심 동력원',
    visualDescription: '원 안에 M 표시, 3상 결선',
    fieldTip: '절연저항 1MΩ 이상 정상. 기동 전류는 정격의 5~7배'
  },
  {
    id: 'cfm',
    symbol: 'CFM',
    name_kr: '응축기팬모터',
    name_en: 'Condenser Fan Motor',
    category: 'motor',
    description: '응축기의 열을 외부로 방출하는 팬',
    visualDescription: '원 안에 M, 팬 아이콘 또는 CFM 표기',
    fieldTip: '팬 회전 방향 확인. 역회전 시 냉각 능력 급감'
  },
  {
    id: 'efm',
    symbol: 'EFM',
    name_kr: '증발기팬모터',
    name_en: 'Evaporator Fan Motor',
    category: 'motor',
    description: '증발기의 냉기를 고내로 순환시키는 팬',
    visualDescription: '원 안에 M, EFM 표기',
    fieldTip: '제상 중에는 정지해야 함. 팬 지연 타이머 확인'
  },
  // 제상 관련
  {
    id: 'dh',
    symbol: 'DH',
    name_kr: '제상히터',
    name_en: 'Defrost Heater',
    category: 'power',
    description: '증발기 성에를 녹이는 전기 히터',
    visualDescription: '저항 기호(지그재그) 또는 네모에 H 표시',
    fieldTip: '저항값 측정으로 단선 확인. 무한대면 히터 단선'
  },
  {
    id: 'ds',
    symbol: 'DS',
    name_kr: '제상타이머',
    name_en: 'Defrost Switch/Timer',
    category: 'control',
    description: '제상 주기 및 시간을 제어하는 타이머',
    visualDescription: '시계 기호 또는 타이머 박스',
    fieldTip: '일반적으로 6~8시간 간격, 20~30분 제상'
  },
  {
    id: 'dts',
    symbol: 'DTS',
    name_kr: '제상종료센서',
    name_en: 'Defrost Termination Switch',
    category: 'sensor',
    description: '제상 완료 온도(+10~15도) 감지 시 히터 차단',
    visualDescription: '센서 기호에 온도 표시',
    fieldTip: '센서 위치가 증발기 핀 사이에 밀착되어야 정확'
  },
  // 기타
  {
    id: 'pb',
    symbol: 'PB',
    name_kr: '푸시버튼',
    name_en: 'Push Button',
    category: 'control',
    description: '수동 조작용 스위치. THR 리셋 등에 사용',
    visualDescription: '원형 접점 기호',
    fieldTip: 'a접점(누르면 ON), b접점(누르면 OFF) 구분'
  },
  {
    id: 'ry',
    symbol: 'RY',
    name_kr: '릴레이',
    name_en: 'Relay',
    category: 'control',
    description: '소전류로 대전류 회로를 제어하는 스위치',
    visualDescription: '코일 기호 + 접점, 사각형 안에 RY',
    fieldTip: '8핀, 11핀 등 규격에 맞는 소켓 사용'
  },
  {
    id: 'tb',
    symbol: 'TB',
    name_kr: '터미널블록',
    name_en: 'Terminal Block',
    category: 'power',
    description: '전선 연결 및 분배를 위한 단자대',
    visualDescription: '번호가 매겨진 단자 기호',
    fieldTip: '나사 풀림 확인. 느슨하면 과열, 화재 위험'
  }
]

// ============================================================
// 회로도 읽는 방법 가이드
// ============================================================

export interface ReadingStep {
  step: number
  title: string
  description: string
  tips: string[]
  example?: string
}

export const CIRCUIT_READING_GUIDE: ReadingStep[] = [
  {
    step: 1,
    title: '동력회로와 제어회로 구분하기',
    description: '회로도는 크게 동력회로(굵은 선, 3상)와 제어회로(가는 선, 단상)로 나뉩니다.',
    tips: [
      '동력회로: 모터에 전원을 공급하는 주회로. 380V 3상 사용',
      '제어회로: 동력회로를 제어하는 보조회로. 220V 단상 사용',
      '동력회로가 위/왼쪽, 제어회로가 아래/오른쪽에 배치가 일반적'
    ],
    example: '자동차로 비유하면 동력회로는 엔진, 제어회로는 운전대'
  },
  {
    step: 2,
    title: '전원 공급 경로 따라가기',
    description: 'NFB/ELB에서 시작하여 전원이 어디로 흘러가는지 추적합니다.',
    tips: [
      'R-S-T (또는 L1-L2-L3): 3상 전원 표시',
      'N: 중성선(뉴트럴)',
      'E 또는 G: 접지선',
      '전류는 항상 전원에서 부하(모터)로 흐름'
    ],
    example: 'NFB → MC 주접점 → THR → 압축기 모터'
  },
  {
    step: 3,
    title: '제어 회로 논리 이해하기',
    description: '어떤 조건에서 모터가 작동하는지 제어 회로를 분석합니다.',
    tips: [
      '직렬 연결: AND 조건 (모든 조건 충족 시 작동)',
      '병렬 연결: OR 조건 (하나만 충족해도 작동)',
      'a접점(NO): 평상시 열림, 신호 시 닫힘',
      'b접점(NC): 평상시 닫힘, 신호 시 열림'
    ],
    example: 'TIC + DPS + THR이 모두 닫혀야 MC 코일에 전원 공급'
  },
  {
    step: 4,
    title: '안전장치 확인하기',
    description: '어떤 안전장치가 어디에 연결되어 있는지 파악합니다.',
    tips: [
      'THR: 과전류 보호 → MC 코일 회로에 직렬 연결',
      'DPS: 압력 이상 보호 → MC 코일 회로에 직렬 연결',
      'ELB: 누전 보호 → 전원 최초 인입부에 설치',
      'b접점으로 연결되어 이상 시 회로 차단'
    ]
  },
  {
    step: 5,
    title: '제상 회로 분석하기',
    description: '제상 동작 시 어떤 부품이 작동/정지하는지 확인합니다.',
    tips: [
      '제상 시작: DS 타이머 작동 → 압축기 정지 + 히터 ON',
      '제상 중: 증발기 팬도 정지 (재결빙 방지)',
      '제상 종료: DTS 온도 도달 또는 타이머 종료',
      '팬 지연: 제상 후 잠시 팬 정지 유지 (물방울 건조)'
    ]
  },
  {
    step: 6,
    title: '단자 번호 및 배선 확인',
    description: '터미널 블록의 번호와 실제 배선을 대조합니다.',
    tips: [
      '회로도의 단자 번호와 현장 단자대 번호 일치 확인',
      '전선 색상: R(적), S(황), T(청), N(백), E(녹황)',
      '배선 번호 태그가 있으면 추적이 훨씬 쉬움',
      '불명확한 배선은 멀티미터로 도통 확인'
    ]
  }
]

// ============================================================
// 동력회로 vs 제어회로 비교
// ============================================================

export interface CircuitComparison {
  aspect: string
  powerCircuit: string
  controlCircuit: string
}

export const POWER_VS_CONTROL: CircuitComparison[] = [
  {
    aspect: '전압',
    powerCircuit: '380V 3상 (또는 220V 3상)',
    controlCircuit: '220V 단상 (또는 24V DC)'
  },
  {
    aspect: '전류',
    powerCircuit: '수십~수백 암페어 (대전류)',
    controlCircuit: '수 밀리암페어~수 암페어 (소전류)'
  },
  {
    aspect: '역할',
    powerCircuit: '모터에 실제 전원 공급',
    controlCircuit: '동력회로의 ON/OFF 제어'
  },
  {
    aspect: '주요 부품',
    powerCircuit: 'NFB, MC 주접점, THR, 모터',
    controlCircuit: 'TIC, DPS, MC 코일, 릴레이'
  },
  {
    aspect: '선 굵기',
    powerCircuit: '굵은 선 (5.5mm2 이상)',
    controlCircuit: '가는 선 (1.5~2.5mm2)'
  },
  {
    aspect: '회로도 위치',
    powerCircuit: '보통 왼쪽 또는 위쪽',
    controlCircuit: '보통 오른쪽 또는 아래쪽'
  },
  {
    aspect: '고장 시 영향',
    powerCircuit: '모터 완전 정지',
    controlCircuit: '자동 제어 불가, 수동 가능'
  }
]

// ============================================================
// 일반적인 HVAC 회로 패턴
// ============================================================

export interface CommonPattern {
  id: string
  name: string
  description: string
  components: string[]
  sequence: string[]
  troubleshooting: string[]
}

export const COMMON_CIRCUIT_PATTERNS: CommonPattern[] = [
  {
    id: 'basic-refrigeration',
    name: '기본 냉동 회로',
    description: '온도조절기로 압축기를 ON/OFF 하는 가장 기본적인 회로',
    components: ['NFB', 'MC', 'THR', 'TIC', 'COMP'],
    sequence: [
      'NFB ON → 제어회로 통전',
      'TIC가 온도 감지 → 설정값 초과 시 접점 닫힘',
      'MC 코일 여자 → 주접점 닫힘',
      '압축기 모터 기동',
      'TIC 설정 온도 도달 → 접점 열림 → 압축기 정지'
    ],
    troubleshooting: [
      '압축기 미기동 시 → TIC 설정 확인, MC 코일 전압 측정',
      '계속 작동 시 → TIC 센서 위치 확인, 접점 고착 의심'
    ]
  },
  {
    id: 'dual-system',
    name: '듀얼 시스템 회로',
    description: '2개의 냉동기가 독립적으로 작동하는 회로 (N100, N200)',
    components: ['NFB', 'MC1', 'MC2', 'TIC1', 'TIC2', 'COMP1', 'COMP2'],
    sequence: [
      '각 시스템은 독립 TIC로 제어',
      'TIC1 → MC1 → COMP1 계통',
      'TIC2 → MC2 → COMP2 계통',
      '공통 안전장치로 전체 보호'
    ],
    troubleshooting: [
      '한쪽만 작동 시 → 해당 계통 TIC, MC 점검',
      '둘 다 미작동 시 → 공통 전원부 (NFB, ELB) 점검'
    ]
  },
  {
    id: 'defrost-cycle',
    name: '제상 사이클 회로',
    description: '타이머 또는 온도 기반으로 자동 제상하는 회로',
    components: ['DS', 'DH', 'DTS', 'EFM', 'MC'],
    sequence: [
      'DS 타이머 동작 → 제상 시작 신호',
      'MC 코일 차단 → 압축기 정지',
      'DH 통전 → 히터 가동',
      'EFM 정지 → 증발기 팬 정지',
      'DTS 감지 온도 도달 → 제상 종료',
      '팬 지연 후 EFM 재가동',
      'MC 재여자 → 냉동 사이클 재개'
    ],
    troubleshooting: [
      '성에 축적 시 → DH 저항 측정, DS 설정 확인',
      '과제상 시 → DTS 센서 위치/동작 확인'
    ]
  },
  {
    id: 'pressure-protection',
    name: '압력 보호 회로',
    description: '고압/저압 이상 시 압축기를 보호하는 안전 회로',
    components: ['DPS', 'HPC', 'LPC', 'MC', 'F.HPC'],
    sequence: [
      'DPS 정상 → 접점 닫힘 → MC 회로 유지',
      'LP 이상 (저압 낮음) → LP 접점 열림 → 압축기 정지',
      'HP 이상 (고압 높음) → HP 접점 열림 → 압축기 정지',
      'F.HPC 동작 → 고압 시 응축기 팬 강제 작동'
    ],
    troubleshooting: [
      'LP 트립 반복 → 냉매 부족, 팽창밸브 막힘',
      'HP 트립 반복 → 응축기 청소, 팬 작동 확인'
    ]
  }
]

// ============================================================
// 퀴즈 문제
// ============================================================

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
}

export const CIRCUIT_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'MC(전자접촉기)의 코일에 전압이 인가되면 어떤 일이 일어나나요?',
    options: [
      '아무 일도 일어나지 않는다',
      '주접점이 닫혀 모터에 전원이 공급된다',
      '퓨즈가 끊어진다',
      '모터가 역회전한다'
    ],
    correctIndex: 1,
    explanation: 'MC 코일에 전압이 인가되면 전자석 원리로 주접점이 닫히고, 이를 통해 모터에 3상 전원이 공급됩니다.',
    difficulty: 'beginner',
    category: 'components'
  },
  {
    id: 'q2',
    question: 'THR(열동계전기)이 트립되는 원인은 무엇인가요?',
    options: [
      '전압이 너무 낮을 때',
      '모터 과부하로 전류가 높을 때',
      '냉매가 부족할 때',
      '온도가 너무 낮을 때'
    ],
    correctIndex: 1,
    explanation: 'THR은 과전류가 흐르면 내부 바이메탈이 열로 휘어져 접점을 열어 모터를 보호합니다. 정격의 105~120%에서 동작합니다.',
    difficulty: 'beginner',
    category: 'protection'
  },
  {
    id: 'q3',
    question: '제어회로와 동력회로의 가장 큰 차이점은?',
    options: [
      '제어회로가 더 굵은 선을 사용한다',
      '동력회로가 모터를 직접 제어한다',
      '제어회로는 소전류, 동력회로는 대전류',
      '차이가 없다'
    ],
    correctIndex: 2,
    explanation: '제어회로는 수 mA~수 A의 소전류로 릴레이/접촉기를 제어하고, 동력회로는 수십~수백 A의 대전류로 모터를 직접 구동합니다.',
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'q4',
    question: 'DPS 저압(LP) 스위치가 트립되었습니다. 가장 먼저 의심해야 할 것은?',
    options: [
      '팬 모터 고장',
      '냉매 부족 또는 팽창밸브 막힘',
      '응축기 오염',
      '온도 조절기 불량'
    ],
    correctIndex: 1,
    explanation: '저압 트립은 흡입 압력이 설정값 이하로 떨어졌다는 의미입니다. 주 원인은 냉매 부족, 팽창밸브 막힘, 필터드라이어 막힘 등입니다.',
    difficulty: 'intermediate',
    category: 'troubleshooting'
  },
  {
    id: 'q5',
    question: '제상 중 증발기 팬을 정지시키는 이유는?',
    options: [
      '전력 절약',
      '소음 감소',
      '녹은 물이 다시 얼지 않도록',
      '히터 보호'
    ],
    correctIndex: 2,
    explanation: '제상 중 팬이 돌면 아직 차가운 코일에서 녹은 물이 다시 얼어붙습니다. 제상 효율을 위해 팬을 정지시킵니다.',
    difficulty: 'intermediate',
    category: 'defrost'
  },
  {
    id: 'q6',
    question: '멀티미터로 MC 코일 양단 전압을 측정했더니 0V입니다. 가능한 원인이 아닌 것은?',
    options: [
      'TIC 접점 열림',
      'THR 트립',
      'DPS 트립',
      'MC 주접점 고착'
    ],
    correctIndex: 3,
    explanation: 'MC 주접점 고착은 코일 회로와 무관합니다. TIC, THR, DPS는 모두 코일 회로에 직렬 연결되어 있어 열리면 코일에 전압이 인가되지 않습니다.',
    difficulty: 'advanced',
    category: 'troubleshooting'
  },
  {
    id: 'q7',
    question: '3상 모터 결선에서 R-S-T 순서를 바꾸면 어떻게 되나요?',
    options: [
      '모터가 작동하지 않는다',
      '모터가 역회전한다',
      '모터가 과열된다',
      '변화가 없다'
    ],
    correctIndex: 1,
    explanation: '3상 중 2상의 위치를 바꾸면 회전 자기장의 방향이 바뀌어 모터가 역회전합니다. 팬 방향 확인이 중요한 이유입니다.',
    difficulty: 'intermediate',
    category: 'motors'
  },
  {
    id: 'q8',
    question: '워크인 냉장고에서 FOX-2SA1의 dF(차동값) 설정의 역할은?',
    options: [
      '제상 시간 설정',
      '팬 속도 제어',
      '헌팅(반복 ON/OFF) 방지',
      '냉매량 조절'
    ],
    correctIndex: 2,
    explanation: 'dF(Differential)는 ON 온도와 OFF 온도의 차이입니다. 예: 설정 -20도, dF 2도면 -18도에서 ON, -20도에서 OFF. 차동값이 너무 작으면 잦은 ON/OFF(헌팅)가 발생합니다.',
    difficulty: 'advanced',
    category: 'control'
  }
]

// ============================================================
// 실전 고장 진단 시나리오
// ============================================================

export interface TroubleshootingScenario {
  id: string
  title: string
  situation: string
  symptoms: string[]
  stepByStep: {
    step: number
    action: string
    expectedResult: string
    actualResult: string
    conclusion: string
  }[]
  rootCause: string
  solution: string
  prevention: string
  safetyNotes: string[]
}

export const TROUBLESHOOTING_SCENARIOS: TroubleshootingScenario[] = [
  {
    id: 'scenario-1',
    title: '압축기가 전혀 작동하지 않음',
    situation: '워크인 냉동고 온도가 올라가고 있으나 압축기 작동 소리가 전혀 없음',
    symptoms: [
      '고내 온도 상승 중',
      '압축기 무음',
      '응축기 팬 미작동',
      '판넬 표시등 점등'
    ],
    stepByStep: [
      {
        step: 1,
        action: 'NFB/ELB 상태 확인',
        expectedResult: 'ON 위치',
        actualResult: 'ON 위치 (정상)',
        conclusion: '전원 공급은 정상'
      },
      {
        step: 2,
        action: 'TIC 온도 설정 확인',
        expectedResult: '고내 온도보다 낮게 설정',
        actualResult: '-18도 설정, 고내 -5도 (정상)',
        conclusion: 'TIC가 운전 신호를 보내야 하는 상태'
      },
      {
        step: 3,
        action: 'THR 상태 확인',
        expectedResult: '트립 안 됨',
        actualResult: '빨간 버튼 돌출 (트립 상태)',
        conclusion: 'THR 트립으로 MC 회로 차단됨'
      },
      {
        step: 4,
        action: 'THR 리셋 후 재시도',
        expectedResult: '압축기 정상 기동',
        actualResult: '5분 후 다시 트립',
        conclusion: '과부하 원인 추가 조사 필요'
      },
      {
        step: 5,
        action: '압축기 운전 전류 측정',
        expectedResult: '정격 전류 이하',
        actualResult: '정격의 150% (과전류)',
        conclusion: '압축기 과부하 발생'
      }
    ],
    rootCause: '응축기 오염으로 방열 불량 → 고압 상승 → 압축비 증가 → 과부하',
    solution: '응축기 코일 청소 후 정상 운전 확인. THR 정격 설정값도 재확인',
    prevention: '월 1회 응축기 청소, 분기 1회 전류 측정',
    safetyNotes: [
      '전류 측정 시 클램프 미터 사용',
      'THR 리셋 전 원인 파악 우선',
      '반복 트립 시 무리한 재기동 금지'
    ]
  },
  {
    id: 'scenario-2',
    title: '제상 후 온도가 내려가지 않음',
    situation: '제상은 완료되었으나 이후 냉동 사이클이 정상적으로 재개되지 않음',
    symptoms: [
      '고내 온도 계속 상승',
      '증발기 팬은 작동',
      '압축기 미작동',
      '증발기에 성에 없음 (제상 완료)'
    ],
    stepByStep: [
      {
        step: 1,
        action: 'DS 타이머 상태 확인',
        expectedResult: '냉동 모드',
        actualResult: '제상 모드 유지 (고장)',
        conclusion: 'DS 타이머가 냉동 모드로 복귀하지 않음'
      },
      {
        step: 2,
        action: 'DTS 센서 확인',
        expectedResult: '상온에서 접점 닫힘',
        actualResult: '접점 열림 상태',
        conclusion: 'DTS 센서 고장 또는 배선 문제'
      },
      {
        step: 3,
        action: 'DTS 단자 연속성 측정',
        expectedResult: '0옴 (도통)',
        actualResult: '무한대 (개방)',
        conclusion: 'DTS 센서 고장'
      }
    ],
    rootCause: 'DTS 센서 고장으로 제상 종료 신호가 발생하지 않아 DS가 계속 제상 모드 유지',
    solution: 'DTS 센서 교체. 임시로 DS 수동 모드 전환하여 냉동 운전',
    prevention: '제상 주기 점검 시 DTS 동작도 함께 확인',
    safetyNotes: [
      '수동 운전 시 제상 필요 시점 수동 전환 필요',
      'DTS 교체 후 동작 온도 확인'
    ]
  },
  {
    id: 'scenario-3',
    title: 'ELB(누전차단기) 반복 트립',
    situation: '전원 투입 시마다 ELB가 트립되어 시스템 전체 정지',
    symptoms: [
      'ELB 투입 즉시 또는 수 분 내 트립',
      '테스트 버튼 눌러도 정상 트립',
      '비오는 날 증상 심화'
    ],
    stepByStep: [
      {
        step: 1,
        action: '각 회로 분리 후 개별 투입',
        expectedResult: '문제 회로 특정',
        actualResult: '압축기 회로 투입 시 트립',
        conclusion: '압축기 계통 누전'
      },
      {
        step: 2,
        action: '압축기 절연저항 측정 (메가)',
        expectedResult: '1MΩ 이상',
        actualResult: '0.3MΩ (불량)',
        conclusion: '압축기 절연 불량'
      },
      {
        step: 3,
        action: '압축기 단자함 육안 점검',
        expectedResult: '건조, 깨끗',
        actualResult: '수분 침투 흔적, 녹 발생',
        conclusion: '빗물 침투로 인한 절연 저하'
      }
    ],
    rootCause: '압축기 단자함 실링 불량으로 빗물 침투 → 절연 저하 → 누전',
    solution: '단자함 건조 후 절연저항 재측정. 회복 안 되면 압축기 교체. 실링 강화',
    prevention: '우기 전 단자함 실링 상태 점검, 방수 커버 설치',
    safetyNotes: [
      '절연저항 측정 전 반드시 전원 차단',
      '메가 테스터 500V DC 사용',
      '전자부품(TIC 등) 분리 후 측정'
    ]
  }
]

// ============================================================
// 측정 도구 상세 가이드
// ============================================================

export interface MeasurementTool {
  id: string
  name: string
  name_en: string
  purpose: string
  specifications: string[]
  usage: {
    step: number
    instruction: string
    caution?: string
  }[]
  commonMeasurements: {
    target: string
    method: string
    normalRange: string
    abnormalAction: string
  }[]
  safetyWarnings: string[]
  fieldTips: string[]
}

export const MEASUREMENT_TOOLS_GUIDE: MeasurementTool[] = [
  {
    id: 'multimeter',
    name: '디지털 멀티미터',
    name_en: 'Digital Multimeter',
    purpose: '전압, 저항, 전류 등 전기 특성을 측정하는 다기능 계측기',
    specifications: [
      'AC/DC 전압: 0~600V',
      'AC/DC 전류: 0~10A (직접), 별도 클램프 사용',
      '저항: 0~40MΩ',
      '연속성(도통) 테스트 기능'
    ],
    usage: [
      {
        step: 1,
        instruction: '측정 모드 선택 (V~: AC전압, V-: DC전압, Ω: 저항)',
        caution: '잘못된 모드에서 측정 시 미터 손상'
      },
      {
        step: 2,
        instruction: '리드선 연결 (검정: COM, 빨강: VΩ 또는 A)',
        caution: '전류 측정 시 A 단자 사용'
      },
      {
        step: 3,
        instruction: '측정 대상에 리드 접촉',
        caution: '감전 주의, 절연 부분 파지'
      },
      {
        step: 4,
        instruction: '디스플레이 값 확인 및 기록'
      }
    ],
    commonMeasurements: [
      {
        target: 'MC 코일 전압',
        method: '코일 양 단자에 AC 전압 측정',
        normalRange: 'AC 220V (±10%)',
        abnormalAction: '0V면 제어회로 점검 (TIC, THR, DPS)'
      },
      {
        target: '모터 단자 전압',
        method: 'R-S, S-T, T-R 간 전압 측정',
        normalRange: 'AC 380V (±10%), 3상 균등',
        abnormalAction: '결상 시 해당 상 배선 점검'
      },
      {
        target: '히터 저항',
        method: '전원 차단 후 히터 양 끝 저항 측정',
        normalRange: '20~50Ω (용량별 상이)',
        abnormalAction: '무한대면 히터 단선, 교체'
      },
      {
        target: 'THR 연속성',
        method: '리셋 상태에서 접점 도통 확인',
        normalRange: '0Ω (도통)',
        abnormalAction: '개방 시 트립 상태 확인'
      }
    ],
    safetyWarnings: [
      '활선 측정 시 CAT III 등급 이상 미터 사용',
      '리드선 피복 손상 여부 사전 확인',
      '젖은 손 또는 젖은 환경에서 측정 금지',
      '저항 측정 시 반드시 전원 차단'
    ],
    fieldTips: [
      '자동 레인지보다 수동 레인지가 안정적인 경우 있음',
      '배터리 부족 시 오측정 주의',
      'Min/Max 홀드 기능 활용하면 편리',
      '측정 전 알려진 전압(콘센트 등)으로 미터 동작 확인'
    ]
  },
  {
    id: 'megger',
    name: '절연저항계 (메가테스터)',
    name_en: 'Insulation Resistance Tester (Megger)',
    purpose: '전기 기기의 절연 상태를 고전압(500~1000V DC)으로 측정',
    specifications: [
      '측정 전압: 500V DC (일반), 1000V DC (고압기기)',
      '측정 범위: 0~2000MΩ',
      '출력: 고전압 DC'
    ],
    usage: [
      {
        step: 1,
        instruction: '측정 대상 전원 완전 차단 확인',
        caution: '잔류 전하 방전 필수'
      },
      {
        step: 2,
        instruction: '제어기기(TIC, DPS 등) 회로에서 분리',
        caution: '고전압으로 전자부품 파손 위험'
      },
      {
        step: 3,
        instruction: 'LINE 리드를 피측정 도체에, EARTH 리드를 접지에 연결'
      },
      {
        step: 4,
        instruction: '테스트 버튼 누르고 값 안정될 때까지 유지 (약 1분)',
        caution: '측정 중 리드 분리 시 감전 위험'
      },
      {
        step: 5,
        instruction: '측정 후 방전 기능 사용 또는 접지로 방전'
      }
    ],
    commonMeasurements: [
      {
        target: '압축기 절연',
        method: '각 상(R,S,T)과 케이스(E) 간 측정',
        normalRange: '1MΩ 이상',
        abnormalAction: '0.5MΩ 미만 시 누전 의심, 압축기 점검/교체'
      },
      {
        target: '팬모터 절연',
        method: '모터 단자와 케이스 간 측정',
        normalRange: '1MΩ 이상',
        abnormalAction: '저항 낮으면 모터 교체'
      },
      {
        target: '히터 절연',
        method: '히터 단자와 케이스 간 측정',
        normalRange: '1MΩ 이상',
        abnormalAction: '저항 낮으면 히터 교체'
      }
    ],
    safetyWarnings: [
      '측정 전 전원 차단 3중 확인 (차단기 OFF + 표시 + 잠금)',
      '측정 중 타인 접근 금지 표시',
      '측정 후 반드시 방전',
      '전자부품 연결된 상태로 측정 금지'
    ],
    fieldTips: [
      '습도 높은 날은 절연저항이 낮게 나올 수 있음',
      '측정 직전 잔류 전압 확인 (멀티미터로)',
      '케이블 길이가 길면 정전용량 영향 고려',
      '1분간 측정값 변화 추이도 중요 (PI 지수)'
    ]
  },
  {
    id: 'clamp-meter',
    name: '클램프미터',
    name_en: 'Clamp Meter',
    purpose: '배선을 자르지 않고 전류를 비접촉으로 측정',
    specifications: [
      'AC 전류: 0~600A (기종에 따라 상이)',
      'DC 전류: 일부 기종만 지원',
      '전압, 저항 측정 기능 포함 (일부 기종)'
    ],
    usage: [
      {
        step: 1,
        instruction: 'AC 전류 모드 선택'
      },
      {
        step: 2,
        instruction: '클램프 열고 측정할 전선 1가닥만 넣기',
        caution: '2가닥 이상 넣으면 상쇄되어 0A 표시'
      },
      {
        step: 3,
        instruction: '전선이 클램프 중앙에 오도록 조정'
      },
      {
        step: 4,
        instruction: '값 안정되면 기록'
      }
    ],
    commonMeasurements: [
      {
        target: '압축기 운전 전류',
        method: '각 상(R,S,T) 개별 측정 후 평균',
        normalRange: '정격 전류 ±10%',
        abnormalAction: '과전류 시 과부하 원인 조사'
      },
      {
        target: '팬모터 전류',
        method: '각 상 개별 측정',
        normalRange: '정격 전류 이하',
        abnormalAction: '과전류 시 베어링 또는 권선 점검'
      },
      {
        target: '3상 불평형',
        method: '각 상 전류 비교',
        normalRange: '상간 차이 5% 이내',
        abnormalAction: '불평형 시 결선 또는 모터 불량'
      }
    ],
    safetyWarnings: [
      '측정 전 레인지 확인 (과전류 손상 방지)',
      '고압부 접근 시 절연장갑 착용',
      '클램프 완전히 닫혔는지 확인'
    ],
    fieldTips: [
      '기동 전류 측정 시 Peak Hold 기능 활용',
      '미세 전류는 전선을 여러 바퀴 감아 측정 후 나누기',
      '정기적으로 영점(0A) 조정',
      '교류만 측정 가능한 기종이 대부분임을 주의'
    ]
  }
]

// ============================================================
// 안전 경고 및 초보자 팁
// ============================================================

export interface SafetyWarning {
  id: string
  title: string
  description: string
  severity: 'critical' | 'warning' | 'caution'
  relatedComponents: string[]
}

export const ELECTRICAL_SAFETY_WARNINGS: SafetyWarning[] = [
  {
    id: 'sw-1',
    title: '작업 전 전원 차단 필수',
    description: '모든 전기 작업은 반드시 전원 차단 후 진행. NFB OFF → ELB OFF → 검전기로 무전압 확인',
    severity: 'critical',
    relatedComponents: ['NFB', 'ELB']
  },
  {
    id: 'sw-2',
    title: '잔류 전하 주의',
    description: '전원 차단 후에도 콘덴서에 잔류 전하 존재. 방전 후 작업 시작',
    severity: 'critical',
    relatedComponents: ['콘덴서', '인버터']
  },
  {
    id: 'sw-3',
    title: 'THR 반복 트립 시 무리한 재기동 금지',
    description: 'THR이 반복 트립되면 과부하 원인 파악이 우선. 무리한 재기동은 모터 소손 초래',
    severity: 'warning',
    relatedComponents: ['THR', 'COMP']
  },
  {
    id: 'sw-4',
    title: '메가 측정 시 전자부품 분리',
    description: '절연저항 측정 시 고전압(500V DC)이 인가되므로 TIC, DPS 등 전자부품 회로 분리',
    severity: 'warning',
    relatedComponents: ['TIC', 'DPS', '릴레이']
  },
  {
    id: 'sw-5',
    title: '젖은 환경 작업 금지',
    description: '젖은 손, 젖은 바닥에서 전기 작업 금지. 감전 위험 극대화',
    severity: 'critical',
    relatedComponents: ['전체']
  },
  {
    id: 'sw-6',
    title: '단독 작업 지양',
    description: '전기 작업 시 2인 1조 권장. 감전 사고 시 즉각 구호 가능',
    severity: 'caution',
    relatedComponents: ['전체']
  }
]

export interface BeginnerTip {
  id: string
  title: string
  content: string
  category: 'basics' | 'measurement' | 'troubleshooting' | 'safety'
}

export const BEGINNER_TIPS: BeginnerTip[] = [
  {
    id: 'bt-1',
    title: '회로도 색상의 의미',
    content: '빨강(R), 황(S), 청(T)은 3상 전원. 백색(N)은 중성선. 녹황(E)은 접지. 현장 배선과 대조해보세요.',
    category: 'basics'
  },
  {
    id: 'bt-2',
    title: 'a접점과 b접점',
    content: 'a접점(NO)은 평상시 열림, 신호 시 닫힘. b접점(NC)은 평상시 닫힘, 신호 시 열림. 안전장치는 대부분 b접점 사용.',
    category: 'basics'
  },
  {
    id: 'bt-3',
    title: '멀티미터 사용 전 점검',
    content: '측정 전 알려진 전압(콘센트 220V)으로 미터 동작 확인. 배터리 부족 시 오측정 발생.',
    category: 'measurement'
  },
  {
    id: 'bt-4',
    title: '증상에서 원인으로',
    content: '고장 진단은 증상 → 영향받는 회로 → 해당 부품 순으로 좁혀가세요. 섣부른 부품 교체는 금물.',
    category: 'troubleshooting'
  },
  {
    id: 'bt-5',
    title: '점검 기록의 중요성',
    content: '측정값, 점검 일자, 조치 내용을 기록하면 다음 고장 시 비교 분석 가능. 패턴이 보입니다.',
    category: 'troubleshooting'
  },
  {
    id: 'bt-6',
    title: '모르면 멈추기',
    content: '확신이 없을 때는 작업을 멈추고 선배나 제조사에 문의. 무리한 작업은 더 큰 손상 초래.',
    category: 'safety'
  }
]
