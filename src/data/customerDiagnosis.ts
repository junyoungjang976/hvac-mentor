/**
 * Customer Self-Diagnosis Data for HVAC Refrigeration Equipment
 * 냉동/냉장 설비 고객 자가 진단 데이터
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface EquipmentType {
  id: string
  name: string
  description: string
  icon: string
}

export interface Symptom {
  id: string
  categoryId: string
  name: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface SymptomCategory {
  id: string
  name: string
  icon: string
  symptoms: Symptom[]
}

export interface DetailQuestion {
  id: string
  symptomId: string
  question: string
  type: 'single' | 'multiple'
  options: QuestionOption[]
  required: boolean
}

export interface QuestionOption {
  id: string
  label: string
  value: string
  weight: number
}

export interface SelfCheckItem {
  id: string
  title: string
  description: string
  estimatedTime: string
  difficulty: 'easy' | 'medium' | 'hard'
  icon: string
  checkPoints: string[]
}

export interface DiagnosisResult {
  cause: string
  action: string
  estimatedTime: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
  selfFixable: boolean
}

export interface WorkflowRecommendation {
  symptomIds: string[]
  requiredTools: string[]
  optionalParts: string[]
  checkSequence: CheckStep[]
  estimatedDuration: { min: number; max: number }
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
}

export interface CheckStep {
  order: number
  title: string
  description: string
  cautionNote?: string
}

// ============================================================================
// DATA: EQUIPMENT TYPES
// ============================================================================

export const equipmentTypes: EquipmentType[] = [
  {
    id: 'walk-in-cooler',
    name: '워크인 냉장고',
    description: '온도 유지형 저온 저장고',
    icon: 'warehouse'
  },
  {
    id: 'walk-in-freezer',
    name: '워크인 냉동고',
    description: '냉동 온도 저장고',
    icon: 'snowflake'
  },
  {
    id: 'showcase',
    name: '쇼케이스',
    description: '진열용 냉장/냉동 장비',
    icon: 'store'
  },
  {
    id: 'warehouse',
    name: '냉동/냉장 창고',
    description: '대형 저온 물류 창고',
    icon: 'building-2'
  },
  {
    id: 'other',
    name: '기타',
    description: '기타 냉동/냉장 장비',
    icon: 'more-horizontal'
  }
]

// ============================================================================
// DATA: SYMPTOM CATEGORIES
// ============================================================================

export const symptomCategories: SymptomCategory[] = [
  {
    id: 'power-operation',
    name: '전원/작동',
    icon: 'power',
    symptoms: [
      {
        id: 'no-power',
        categoryId: 'power-operation',
        name: '전원이 안 들어옴',
        description: '전원 표시등이 꺼져있거나 디스플레이가 작동하지 않음',
        severity: 'critical',
      },
      {
        id: 'power-on-not-running',
        categoryId: 'power-operation',
        name: '전원은 들어오나 작동 안함',
        description: '전원 표시등은 켜져있으나 냉각이 되지 않음',
        severity: 'high',
      },
      {
        id: 'intermittent-operation',
        categoryId: 'power-operation',
        name: '간헐적으로 작동/정지',
        description: '작동과 정지를 반복함',
        severity: 'medium',
      },
    ],
  },
  {
    id: 'temperature',
    name: '온도',
    icon: 'thermometer',
    symptoms: [
      {
        id: 'temp-not-cooling',
        categoryId: 'temperature',
        name: '온도가 안 내려감',
        description: '설정 온도보다 높게 유지됨',
        severity: 'high',
      },
      {
        id: 'temp-too-cold',
        categoryId: 'temperature',
        name: '온도가 너무 내려감',
        description: '설정 온도보다 과도하게 낮음',
        severity: 'medium',
      },
      {
        id: 'temp-display-error',
        categoryId: 'temperature',
        name: '온도 표시 이상',
        description: '온도계가 이상한 값을 표시하거나 에러 코드 표시',
        severity: 'medium',
      },
      {
        id: 'temp-fluctuation',
        categoryId: 'temperature',
        name: '온도 변동이 심함',
        description: '온도가 계속 오르락내리락 함',
        severity: 'medium',
      },
    ],
  },
  {
    id: 'sound',
    name: '소리',
    icon: 'volume',
    symptoms: [
      {
        id: 'strange-noise',
        categoryId: 'sound',
        name: '이상한 소리가 남',
        description: '평소와 다른 소리 (덜컹거림, 쇳소리, 삑삑거림 등)',
        severity: 'medium',
      },
      {
        id: 'no-sound',
        categoryId: 'sound',
        name: '소리가 안 남',
        description: '압축기 소리가 전혀 들리지 않음',
        severity: 'high',
      },
      {
        id: 'too-loud',
        categoryId: 'sound',
        name: '너무 시끄러움',
        description: '평소보다 소음이 과도하게 큼',
        severity: 'low',
      },
    ],
  },
  {
    id: 'frost-ice',
    name: '성에/결빙',
    icon: 'snowflake',
    symptoms: [
      {
        id: 'excessive-frost',
        categoryId: 'frost-ice',
        name: '성에가 많이 낌',
        description: '증발기나 벽면에 성에가 과도하게 생김',
        severity: 'medium',
      },
      {
        id: 'ice-buildup',
        categoryId: 'frost-ice',
        name: '얼음이 얼어붙음',
        description: '두꺼운 얼음층이 생김',
        severity: 'high',
      },
    ],
  },
  {
    id: 'leak-moisture',
    name: '누수/습기',
    icon: 'droplet',
    symptoms: [
      {
        id: 'water-leak',
        categoryId: 'leak-moisture',
        name: '물이 샘',
        description: '설비 내부나 외부에서 물이 샘',
        severity: 'high',
      },
      {
        id: 'floor-water',
        categoryId: 'leak-moisture',
        name: '바닥에 물이 고임',
        description: '바닥에 물웅덩이가 생김',
        severity: 'medium',
      },
      {
        id: 'excessive-condensation',
        categoryId: 'leak-moisture',
        name: '결로가 심함',
        description: '외부 표면에 물방울이 많이 맺힘',
        severity: 'low',
      },
    ],
  },
  {
    id: 'exterior',
    name: '외관',
    icon: 'door',
    symptoms: [
      {
        id: 'door-not-closing',
        categoryId: 'exterior',
        name: '문이 안 닫힘',
        description: '문이 제대로 닫히지 않거나 밀폐가 안됨',
        severity: 'high',
      },
      {
        id: 'light-issue',
        categoryId: 'exterior',
        name: '조명이 안 들어옴',
        description: '내부 조명이 작동하지 않음',
        severity: 'low',
      },
      {
        id: 'physical-damage',
        categoryId: 'exterior',
        name: '외관 손상',
        description: '문짝, 가스켓, 패널 등의 물리적 손상',
        severity: 'medium',
      },
    ],
  },
]

// ============================================================================
// DATA: DETAIL QUESTIONS
// ============================================================================

export const detailQuestions: DetailQuestion[] = [
  // 온도가 안 내려감
  {
    id: 'temp-not-cooling-q1',
    symptomId: 'temp-not-cooling',
    question: '현재 온도가 몇 도인가요?',
    type: 'single',
    required: true,
    options: [
      { id: 'temp-0-5', label: '0~5°C', value: '0-5', weight: 1 },
      { id: 'temp-5-10', label: '5~10°C', value: '5-10', weight: 2 },
      { id: 'temp-10-15', label: '10~15°C', value: '10-15', weight: 3 },
      { id: 'temp-15plus', label: '15°C 이상', value: '15+', weight: 4 },
    ],
  },
  {
    id: 'temp-not-cooling-q2',
    symptomId: 'temp-not-cooling',
    question: '언제부터 증상이 시작되었나요?',
    type: 'single',
    required: true,
    options: [
      { id: 'duration-today', label: '오늘', value: 'today', weight: 1 },
      { id: 'duration-2-3days', label: '2~3일 전', value: '2-3days', weight: 2 },
      { id: 'duration-week', label: '일주일 전', value: 'week', weight: 3 },
      { id: 'duration-longer', label: '그 이상', value: 'longer', weight: 4 },
    ],
  },
  {
    id: 'temp-not-cooling-q3',
    symptomId: 'temp-not-cooling',
    question: '압축기(모터) 소리가 들리나요?',
    type: 'single',
    required: true,
    options: [
      { id: 'compressor-yes', label: '예, 계속 들림', value: 'yes', weight: 1 },
      { id: 'compressor-intermittent', label: '간헐적으로 들림', value: 'intermittent', weight: 2 },
      { id: 'compressor-no', label: '아니오, 안 들림', value: 'no', weight: 4 },
      { id: 'compressor-unknown', label: '모르겠음', value: 'unknown', weight: 2 },
    ],
  },
  // 전원이 안 들어옴
  {
    id: 'no-power-q1',
    symptomId: 'no-power',
    question: '차단기는 정상인가요?',
    type: 'single',
    required: true,
    options: [
      { id: 'breaker-on', label: '켜져있음', value: 'on', weight: 1 },
      { id: 'breaker-off', label: '꺼져있음', value: 'off', weight: 4 },
      { id: 'breaker-unknown', label: '확인 안 함', value: 'unknown', weight: 2 },
    ],
  },
  {
    id: 'no-power-q2',
    symptomId: 'no-power',
    question: '같은 회로의 다른 기기는 작동하나요?',
    type: 'single',
    required: true,
    options: [
      { id: 'other-working', label: '예, 작동함', value: 'yes', weight: 1 },
      { id: 'other-not-working', label: '아니오, 안 됨', value: 'no', weight: 3 },
      { id: 'other-unknown', label: '모르겠음', value: 'unknown', weight: 2 },
    ],
  },
  // 성에가 많이 낌
  {
    id: 'excessive-frost-q1',
    symptomId: 'excessive-frost',
    question: '성에가 어디에 주로 생기나요?',
    type: 'multiple',
    required: true,
    options: [
      { id: 'frost-evaporator', label: '증발기(냉각기)', value: 'evaporator', weight: 3 },
      { id: 'frost-walls', label: '벽면', value: 'walls', weight: 2 },
      { id: 'frost-door', label: '문 주변', value: 'door', weight: 2 },
      { id: 'frost-ceiling', label: '천장', value: 'ceiling', weight: 1 },
    ],
  },
  {
    id: 'excessive-frost-q2',
    symptomId: 'excessive-frost',
    question: '제상(디프로스트) 기능이 작동하나요?',
    type: 'single',
    required: true,
    options: [
      { id: 'defrost-yes', label: '예, 정상 작동', value: 'yes', weight: 1 },
      { id: 'defrost-no', label: '아니오, 안 됨', value: 'no', weight: 4 },
      { id: 'defrost-unknown', label: '모르겠음', value: 'unknown', weight: 2 },
    ],
  },
  // 물이 샘
  {
    id: 'water-leak-q1',
    symptomId: 'water-leak',
    question: '물이 어디서 새나요?',
    type: 'single',
    required: true,
    options: [
      { id: 'leak-inside', label: '설비 내부', value: 'inside', weight: 2 },
      { id: 'leak-outside', label: '설비 외부', value: 'outside', weight: 2 },
      { id: 'leak-bottom', label: '바닥/배수구 근처', value: 'bottom', weight: 3 },
      { id: 'leak-door', label: '문 틈새', value: 'door', weight: 1 },
    ],
  },
  {
    id: 'water-leak-q2',
    symptomId: 'water-leak',
    question: '물의 양이 어느 정도인가요?',
    type: 'single',
    required: true,
    options: [
      { id: 'leak-drip', label: '약간 맺힘/방울', value: 'drip', weight: 1 },
      { id: 'leak-puddle', label: '물웅덩이 생김', value: 'puddle', weight: 3 },
      { id: 'leak-continuous', label: '계속 흐름', value: 'continuous', weight: 4 },
    ],
  },
  // 이상한 소리
  {
    id: 'strange-noise-q1',
    symptomId: 'strange-noise',
    question: '어떤 종류의 소리인가요?',
    type: 'single',
    required: true,
    options: [
      { id: 'noise-rattling', label: '덜컹거리는 소리', value: 'rattling', weight: 2 },
      { id: 'noise-squealing', label: '삑삑거리는 소리', value: 'squealing', weight: 3 },
      { id: 'noise-grinding', label: '쇳소리/갈리는 소리', value: 'grinding', weight: 4 },
      { id: 'noise-humming', label: '윙윙거리는 소리', value: 'humming', weight: 1 },
    ],
  },
  // 문이 안 닫힘
  {
    id: 'door-not-closing-q1',
    symptomId: 'door-not-closing',
    question: '문의 상태는 어떤가요?',
    type: 'multiple',
    required: true,
    options: [
      { id: 'door-warped', label: '문이 휘어짐', value: 'warped', weight: 3 },
      { id: 'door-gasket-damaged', label: '가스켓(고무패킹) 손상', value: 'gasket', weight: 2 },
      { id: 'door-hinge-loose', label: '경첩이 헐거움', value: 'hinge', weight: 2 },
      { id: 'door-latch-broken', label: '잠금장치 고장', value: 'latch', weight: 3 },
    ],
  },
]

// ============================================================================
// DATA: SELF-CHECK ITEMS
// ============================================================================

export const selfCheckItems: SelfCheckItem[] = [
  {
    id: 'power-check',
    title: '전원 확인',
    description: '냉동/냉장 장비의 전원 공급 상태를 확인합니다.',
    estimatedTime: '2-3분',
    difficulty: 'easy',
    icon: 'power-plug',
    checkPoints: [
      '1. 장비의 전원 스위치가 ON 상태인지 확인하세요.',
      '2. 배전반의 차단기(브레이커)가 올라가 있는지 확인하세요.',
      '3. 전원 표시등(LED)이 정상적으로 켜져 있는지 확인하세요.',
      '4. 콘센트와 전원 플러그가 단단히 연결되어 있는지 확인하세요.',
      '5. 전원 코드에 손상이나 파손이 없는지 육안으로 확인하세요.'
    ]
  },
  {
    id: 'filter-condenser-check',
    title: '필터 및 응축기 확인',
    description: '공기 흐름을 방해하는 먼지나 이물질을 확인합니다.',
    estimatedTime: '5-10분',
    difficulty: 'medium',
    icon: 'air-filter',
    checkPoints: [
      '1. 장비 후면 또는 하단의 응축기(검은색 방열판)를 찾으세요.',
      '2. 응축기에 먼지, 기름때, 이물질이 쌓여있는지 확인하세요.',
      '3. 공기 흡입구 필터가 있다면 제거하여 상태를 확인하세요.',
      '4. 필터가 먼지로 막혀있다면 청소기나 물로 세척하세요.',
      '5. 응축기 주변에 충분한 공간(최소 30cm)이 확보되어 있는지 확인하세요.',
      '6. 응축기 팬이 정상적으로 회전하는지 확인하세요.'
    ]
  },
  {
    id: 'door-seal-check',
    title: '문 밀폐 확인',
    description: '문과 패킹의 밀폐 상태를 점검합니다.',
    estimatedTime: '3-5분',
    difficulty: 'easy',
    icon: 'door-closed',
    checkPoints: [
      '1. 문을 완전히 닫았을 때 틈이 없는지 확인하세요.',
      '2. 문 패킹(고무 씰)이 손상되거나 떨어져 나간 부분이 없는지 확인하세요.',
      '3. 문을 닫고 A4 용지를 패킹 사이에 끼운 후 당겨보세요. 용지가 쉽게 빠지면 밀폐 불량입니다.',
      '4. 문 경첩이나 힌지가 느슨하지 않은지 확인하세요.',
      '5. 문 자동 닫힘 장치가 정상 작동하는지 확인하세요.',
      '6. 문에 무리한 힘이 가해지거나 변형된 부분이 없는지 확인하세요.'
    ]
  },
  {
    id: 'temperature-setting-check',
    title: '온도 설정 확인',
    description: '온도 조절기(써모스탯)의 설정값을 확인합니다.',
    estimatedTime: '2-3분',
    difficulty: 'easy',
    icon: 'thermostat',
    checkPoints: [
      '1. 온도 조절기 디스플레이에 표시된 설정 온도를 확인하세요.',
      '2. 냉장고: 0~5°C, 냉동고: -18~-25°C가 적정 범위입니다.',
      '3. 설정 온도가 너무 낮거나 높게 되어있다면 적정 범위로 조정하세요.',
      '4. 현재 내부 온도와 설정 온도의 차이를 확인하세요.',
      '5. 온도 조절기 배터리가 방전되지 않았는지 확인하세요(디지털식인 경우).',
      '6. 제상(Defrost) 모드가 비정상적으로 계속 작동하고 있는지 확인하세요.'
    ]
  },
  {
    id: 'environment-check',
    title: '주변 환경 확인',
    description: '장비 설치 환경과 외부 조건을 점검합니다.',
    estimatedTime: '3-5분',
    difficulty: 'easy',
    icon: 'home-thermometer',
    checkPoints: [
      '1. 장비가 설치된 공간의 실내 온도를 확인하세요. (여름철 고온 주의)',
      '2. 직사광선이 장비에 직접 닿고 있지 않은지 확인하세요.',
      '3. 난방기구(히터, 보일러 등)가 장비 근처에 있지 않은지 확인하세요.',
      '4. 환기가 잘 되는 공간인지 확인하세요.',
      '5. 장비 주변에 물건이 과도하게 쌓여 공기 순환을 막고 있지 않은지 확인하세요.',
      '6. 바닥이 수평하고 안정적인지 확인하세요. (기울어진 설치는 냉매 순환 방해)',
      '7. 습도가 너무 높지 않은지 확인하세요. (결로 및 제상 문제 유발 가능)'
    ]
  }
]

// ============================================================================
// DATA: WORKFLOW RECOMMENDATIONS
// ============================================================================

export const workflowRecommendations: WorkflowRecommendation[] = [
  {
    symptomIds: ['temp-not-cooling', 'no-sound', 'power-on-not-running'],
    requiredTools: ['멀티미터', '압력 게이지', '온도계', '기본 공구 세트'],
    optionalParts: ['냉매 (R-404A/R-22)', '압축기', '팬 모터', '온도 센서'],
    checkSequence: [
      { order: 1, title: '전원 점검', description: '전압, 차단기 상태 확인', cautionNote: '전기 작업 시 안전 주의' },
      { order: 2, title: '압축기 점검', description: '작동 소리, 발열 상태 확인' },
      { order: 3, title: '냉매 압력 측정', description: '고압/저압 게이지 연결', cautionNote: '냉매 취급 시 보호장비 착용' },
      { order: 4, title: '증발기/응축기 점검', description: '성에, 먼지, 팬 작동 확인' },
    ],
    estimatedDuration: { min: 60, max: 180 },
    difficulty: 'expert',
  },
  {
    symptomIds: ['excessive-frost', 'ice-buildup'],
    requiredTools: ['멀티미터', '온도계', '드라이버 세트'],
    optionalParts: ['제상 타이머', '제상 히터', '온도 센서'],
    checkSequence: [
      { order: 1, title: '제상 타이머 확인', description: '설정값 및 작동 상태 점검' },
      { order: 2, title: '제상 히터 점검', description: '저항값 측정 및 연결 상태 확인' },
      { order: 3, title: '배수 라인 점검', description: '막힘 여부 확인' },
    ],
    estimatedDuration: { min: 45, max: 120 },
    difficulty: 'medium',
  },
  {
    symptomIds: ['water-leak', 'floor-water'],
    requiredTools: ['배수 청소 도구', '드라이버 세트', '손전등'],
    optionalParts: ['배수 호스', '배수 펌프', '배수 팬'],
    checkSequence: [
      { order: 1, title: '누수 위치 확인', description: '정확한 누수 지점 파악' },
      { order: 2, title: '배수 라인 점검', description: '막힘 또는 손상 확인' },
      { order: 3, title: '배수 팬 점검', description: '상태 및 수위 확인' },
    ],
    estimatedDuration: { min: 30, max: 90 },
    difficulty: 'easy',
  },
  {
    symptomIds: ['door-not-closing', 'physical-damage'],
    requiredTools: ['드라이버 세트', '렌치', '수평계'],
    optionalParts: ['도어 가스켓', '경첩', '도어 래치'],
    checkSequence: [
      { order: 1, title: '가스켓 점검', description: '손상, 변형, 오염 확인' },
      { order: 2, title: '도어 정렬 확인', description: '수평/수직 상태 점검' },
      { order: 3, title: '경첩/래치 점검', description: '헐거움 또는 손상 확인' },
    ],
    estimatedDuration: { min: 20, max: 90 },
    difficulty: 'easy',
  },
  {
    symptomIds: ['no-power'],
    requiredTools: ['멀티미터', '드라이버 세트'],
    optionalParts: ['퓨즈', '전원 케이블', '제어보드'],
    checkSequence: [
      { order: 1, title: '전원 공급 확인', description: '차단기, 콘센트 전압 측정' },
      { order: 2, title: '전원부 점검', description: '퓨즈, 터미널 상태 확인' },
      { order: 3, title: '제어보드 점검', description: '표시등, 이상 여부 확인' },
    ],
    estimatedDuration: { min: 30, max: 120 },
    difficulty: 'medium',
  },
  {
    symptomIds: ['strange-noise', 'too-loud'],
    requiredTools: ['청음봉', '드라이버 세트', '윤활유'],
    optionalParts: ['팬 모터', '베어링', '마운팅 고무'],
    checkSequence: [
      { order: 1, title: '소음 위치 파악', description: '압축기, 팬, 배관 등 확인' },
      { order: 2, title: '팬 점검', description: '블레이드 손상, 베어링 마모 확인' },
      { order: 3, title: '고정부 점검', description: '볼트 풀림, 진동 확인' },
    ],
    estimatedDuration: { min: 30, max: 90 },
    difficulty: 'medium',
  },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getSymptomsByCategory(categoryId: string): Symptom[] {
  const category = symptomCategories.find((cat) => cat.id === categoryId)
  return category?.symptoms || []
}

export function getQuestionsForSymptom(symptomId: string): DetailQuestion[] {
  return detailQuestions.filter((q) => q.symptomId === symptomId)
}

export function getSymptomById(symptomId: string): Symptom | undefined {
  for (const category of symptomCategories) {
    const symptom = category.symptoms.find(s => s.id === symptomId)
    if (symptom) return symptom
  }
  return undefined
}

export function getSymptomName(symptomId: string): string {
  const symptom = getSymptomById(symptomId)
  return symptom?.name || symptomId
}

export function getEquipmentById(equipmentId: string): EquipmentType | undefined {
  return equipmentTypes.find(e => e.id === equipmentId)
}

export function getEquipmentName(equipmentId: string): string {
  const equipment = getEquipmentById(equipmentId)
  return equipment?.name || equipmentId
}

export function calculateDiagnosis(
  symptomIds: string[],
  answers: Record<string, string[]>,
  type: 'min' | 'max'
): DiagnosisResult {
  // Default diagnosis
  const defaultMin: DiagnosisResult = {
    cause: '일시적인 문제 또는 설정 오류',
    action: '설정 확인 후 재시작 시도',
    estimatedTime: '10~30분',
    urgency: 'low',
    selfFixable: true,
  }
  const defaultMax: DiagnosisResult = {
    cause: '부품 고장 또는 시스템 문제',
    action: '전문가 점검 필요',
    estimatedTime: '1~4시간',
    urgency: 'high',
    selfFixable: false,
  }

  // Check for specific patterns
  if (symptomIds.includes('temp-not-cooling')) {
    const compressorAnswer = answers['temp-not-cooling-q3']?.[0]
    const tempAnswer = answers['temp-not-cooling-q1']?.[0]

    if (compressorAnswer === 'no') {
      return type === 'min'
        ? { cause: '압축기 과열 보호 작동', action: '30분 후 재시작 시도', estimatedTime: '30분~1시간', urgency: 'medium', selfFixable: true }
        : { cause: '압축기 고장 또는 냉매 누출', action: '전문가 점검 필요 (압축기 교체 가능성)', estimatedTime: '2~6시간', urgency: 'critical', selfFixable: false }
    }

    if (tempAnswer === '15+' || tempAnswer === '10-15') {
      return type === 'min'
        ? { cause: '냉매 부족 또는 필터 막힘', action: '필터 청소 후 관찰', estimatedTime: '1~2시간', urgency: 'high', selfFixable: false }
        : { cause: '냉매 누출 또는 시스템 문제', action: '누출 탐지 및 수리, 냉매 재충전', estimatedTime: '3~6시간', urgency: 'critical', selfFixable: false }
    }
  }

  if (symptomIds.includes('no-power')) {
    const breakerAnswer = answers['no-power-q1']?.[0]
    if (breakerAnswer === 'off') {
      return type === 'min'
        ? { cause: '과부하로 차단기 작동', action: '차단기 올리고 재시작', estimatedTime: '5분', urgency: 'low', selfFixable: true }
        : { cause: '전기 회로 문제 또는 단락', action: '전기 기사 점검 필요', estimatedTime: '1~3시간', urgency: 'high', selfFixable: false }
    }
  }

  if (symptomIds.includes('excessive-frost') || symptomIds.includes('ice-buildup')) {
    const defrostAnswer = answers['excessive-frost-q2']?.[0]
    if (defrostAnswer === 'no') {
      return type === 'min'
        ? { cause: '제상 타이머 설정 문제', action: '제상 타이머 재설정', estimatedTime: '30분', urgency: 'medium', selfFixable: false }
        : { cause: '제상 히터 또는 센서 고장', action: '제상 시스템 부품 교체', estimatedTime: '2~4시간', urgency: 'high', selfFixable: false }
    }
  }

  if (symptomIds.includes('water-leak') || symptomIds.includes('floor-water')) {
    const locationAnswer = answers['water-leak-q1']?.[0]
    if (locationAnswer === 'bottom') {
      return type === 'min'
        ? { cause: '배수구 막힘', action: '배수구 청소', estimatedTime: '30분', urgency: 'low', selfFixable: true }
        : { cause: '배수 펌프 고장 또는 배관 파손', action: '펌프/배관 교체', estimatedTime: '2~3시간', urgency: 'high', selfFixable: false }
    }
  }

  if (symptomIds.includes('door-not-closing')) {
    const doorAnswer = answers['door-not-closing-q1'] || []
    if (doorAnswer.includes('gasket')) {
      return type === 'min'
        ? { cause: '가스켓 오염 또는 경미한 변형', action: '가스켓 청소 또는 드라이어로 복원', estimatedTime: '20분', urgency: 'low', selfFixable: true }
        : { cause: '가스켓 완전 손상', action: '가스켓 교체', estimatedTime: '1~2시간', urgency: 'medium', selfFixable: false }
    }
  }

  if (symptomIds.includes('strange-noise')) {
    const noiseAnswer = answers['strange-noise-q1']?.[0]
    if (noiseAnswer === 'grinding') {
      return type === 'min'
        ? { cause: '팬 블레이드에 이물질', action: '팬 청소', estimatedTime: '30분', urgency: 'medium', selfFixable: false }
        : { cause: '압축기 베어링 손상', action: '압축기 교체 필요', estimatedTime: '4~8시간', urgency: 'critical', selfFixable: false }
    }
  }

  // Calculate urgency based on symptom severity
  type SeverityType = 'low' | 'medium' | 'high' | 'critical'
  const maxSeverity = symptomIds.reduce<SeverityType>((max, id) => {
    const symptom = getSymptomById(id)
    if (!symptom) return max
    const severityOrder: Record<SeverityType, number> = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4
    }
    const currentLevel = severityOrder[symptom.severity]
    const maxLevel = severityOrder[max]
    return currentLevel > maxLevel ? symptom.severity : max
  }, 'low')

  if (type === 'min') {
    return defaultMin
  } else {
    return { ...defaultMax, urgency: maxSeverity as 'low' | 'medium' | 'high' | 'critical' }
  }
}

export function getWorkflowForSymptoms(symptomIds: string[]): WorkflowRecommendation | null {
  return (
    workflowRecommendations.find((wf) =>
      symptomIds.some((id) => wf.symptomIds.includes(id))
    ) || null
  )
}

export function generateDiagnosisCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
