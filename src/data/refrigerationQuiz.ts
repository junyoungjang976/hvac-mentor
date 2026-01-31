// 냉동 기술 퀴즈 데이터

export interface RefrigerationQuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'basics' | 'pt-chart' | 'troubleshooting' | 'refrigerant' | 'components' | 'charging'
}

export const REFRIGERATION_QUIZ: RefrigerationQuizQuestion[] = [
  // 기초 (basics)
  {
    id: 'r1',
    question: '냉동 사이클에서 냉매가 액체에서 기체로 변할 때 열을 흡수하는 곳은?',
    options: ['압축기', '응축기', '증발기', '팽창밸브'],
    correctIndex: 2,
    explanation: '증발기에서 냉매가 저압의 액체에서 기체로 기화하면서 주변의 열을 흡수합니다. 이것이 냉각 효과의 원리입니다.',
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'r2',
    question: '냉동 사이클에서 열을 방출하는 곳은?',
    options: ['증발기', '압축기', '응축기', '팽창밸브'],
    correctIndex: 2,
    explanation: '응축기에서 고온고압의 냉매가스가 열을 방출하며 액체로 응축됩니다. 팬으로 열을 외부로 배출합니다.',
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'r3',
    question: '압축기의 역할은?',
    options: [
      '냉매를 저압으로 만든다',
      '냉매를 고온고압으로 압축한다',
      '냉매를 액체로 만든다',
      '냉매를 기화시킨다'
    ],
    correctIndex: 1,
    explanation: '압축기는 저온저압의 가스 냉매를 고온고압으로 압축하여 응축기로 보냅니다. 냉동 사이클의 심장 역할을 합니다.',
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'r4',
    question: '팽창밸브(TXV)의 역할은?',
    options: [
      '냉매를 압축한다',
      '냉매를 가열한다',
      '고압 액냉매를 저압으로 팽창시킨다',
      '냉매를 응축한다'
    ],
    correctIndex: 2,
    explanation: '팽창밸브는 고압의 액냉매를 저압으로 팽창시켜 증발기로 보냅니다. 이 과정에서 냉매 온도도 급격히 낮아집니다.',
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'r5',
    question: '과열도(Superheat)란?',
    options: [
      '응축 온도와 외기 온도의 차이',
      '실제 흡입 온도와 증발 온도의 차이',
      '고압과 저압의 차이',
      '설정 온도와 실제 온도의 차이'
    ],
    correctIndex: 1,
    explanation: '과열도 = 흡입 배관 온도 - 증발 온도. 과열도가 너무 낮으면 액압축 위험, 너무 높으면 압축기 과열 우려가 있습니다. 정상 범위: 5~10°C',
    difficulty: 'intermediate',
    category: 'basics'
  },
  {
    id: 'r6',
    question: '과냉도(Subcooling)란?',
    options: [
      '증발 온도와 고내 온도의 차이',
      '응축 온도와 실제 액관 온도의 차이',
      '저압과 대기압의 차이',
      '압축기 토출 온도와 외기 온도의 차이'
    ],
    correctIndex: 1,
    explanation: '과냉도 = 응축 온도 - 액관 온도. 과냉도가 너무 낮으면 플래시 가스 발생, 너무 높으면 냉매 과충전 의심. 정상 범위: 5~10°C',
    difficulty: 'intermediate',
    category: 'basics'
  },

  // P-T 차트 (pt-chart)
  {
    id: 'r7',
    question: 'P-T 차트에서 저압 2.0kg/cm²G일 때 R-22의 증발 온도는 약 몇 도인가?',
    options: ['-10°C', '-5°C', '0°C', '+5°C'],
    correctIndex: 1,
    explanation: 'R-22는 저압 2.0kg/cm²G에서 약 -5°C의 증발 온도를 갖습니다. P-T 차트를 참고하세요.',
    difficulty: 'intermediate',
    category: 'pt-chart'
  },
  {
    id: 'r8',
    question: '외기 온도 30°C일 때 R-22의 정상 고압 범위는?',
    options: ['8~10kg/cm²G', '12~14kg/cm²G', '16~18kg/cm²G', '20~22kg/cm²G'],
    correctIndex: 1,
    explanation: '정상 응축 온도는 외기+10~15°C. 30+12=42°C → R-22 P-T 차트에서 약 12~14kg/cm²G입니다.',
    difficulty: 'intermediate',
    category: 'pt-chart'
  },
  {
    id: 'r9',
    question: '냉장고(0°C 유지) R-22 시스템의 정상 저압 범위는?',
    options: ['0.5~1.0kg/cm²G', '1.5~2.5kg/cm²G', '3.0~4.0kg/cm²G', '5.0~6.0kg/cm²G'],
    correctIndex: 1,
    explanation: '증발 온도는 고내 온도보다 8~10°C 낮게 설정. 0-10=-10°C → R-22 P-T 차트에서 약 1.5~2.5kg/cm²G입니다.',
    difficulty: 'intermediate',
    category: 'pt-chart'
  },
  {
    id: 'r10',
    question: '압축비가 너무 높으면(8:1 이상) 발생하는 문제는?',
    options: [
      '냉매 부족',
      '압축기 과열 및 효율 저하',
      '냉매 과충전',
      '응축기 결빙'
    ],
    correctIndex: 1,
    explanation: '압축비 = (고압+1)/(저압+1). 압축비가 높으면 압축기 온도 상승, 윤활유 탄화, 효율 저하가 발생합니다. 정상 범위: 3~6:1',
    difficulty: 'advanced',
    category: 'pt-chart'
  },

  // 고장 진단 (troubleshooting)
  {
    id: 'r11',
    question: '저압이 낮고 고압도 낮은 경우, 가장 가능성 높은 원인은?',
    options: ['응축기 오염', '냉매 부족', '팬 모터 고장', '온도조절기 불량'],
    correctIndex: 1,
    explanation: '저압↓ + 고압↓ = 냉매 부족(Undercharge)의 전형적인 패턴입니다. 액면계 확인 및 누설 점검이 필요합니다.',
    difficulty: 'intermediate',
    category: 'troubleshooting'
  },
  {
    id: 'r12',
    question: '저압이 높고 고압도 높은 경우, 가장 가능성 높은 원인은?',
    options: ['냉매 부족', '응축 불량 (응축기 오염/팬 고장)', '팽창밸브 막힘', '증발기 결빙'],
    correctIndex: 1,
    explanation: '저압↑ + 고압↑ = 응축 불량의 전형적인 패턴입니다. 응축기 청소, 팬 모터 점검, 통풍 확인이 필요합니다.',
    difficulty: 'intermediate',
    category: 'troubleshooting'
  },
  {
    id: 'r13',
    question: '저압이 높고 고압이 낮은 경우, 가장 가능성 높은 원인은?',
    options: ['냉매 과충전', '압축기 효율 저하', '응축기 오염', '팽창밸브 과개방'],
    correctIndex: 1,
    explanation: '저압↑ + 고압↓ = 압축기 효율 저하의 전형적인 패턴입니다. 밸브 마모, 가스켓 손상 등으로 압축 능력이 떨어진 상태입니다.',
    difficulty: 'advanced',
    category: 'troubleshooting'
  },
  {
    id: 'r14',
    question: '저압이 낮고 고압이 정상인 경우, 가장 가능성 높은 원인은?',
    options: ['냉매 부족', '응축기 오염', '증발기 이상 (성에/팽창밸브 막힘)', '압축기 불량'],
    correctIndex: 2,
    explanation: '저압↓ + 고압 정상 = 증발기 쪽 문제입니다. 증발기 성에, TXV 막힘, 필터드라이어 막힘 등을 점검하세요.',
    difficulty: 'intermediate',
    category: 'troubleshooting'
  },
  {
    id: 'r15',
    question: '흡입 배관에 땀(결로)이 맺히면 의미하는 것은?',
    options: [
      '정상 운전 상태',
      '과열도 부족 (액백 위험)',
      '냉매 부족',
      '응축기 오염'
    ],
    correctIndex: 1,
    explanation: '흡입관 결로는 과열도가 낮다는 신호입니다. 심하면 액냉매가 압축기로 들어가 액압축(Liquid Slugging)을 일으킬 수 있습니다.',
    difficulty: 'intermediate',
    category: 'troubleshooting'
  },
  {
    id: 'r16',
    question: '액면계에 거품이 보이면 의미하는 것은?',
    options: [
      '냉매가 충분하다',
      '냉매가 부족하다',
      '냉매가 과충전되었다',
      '정상 운전 상태'
    ],
    correctIndex: 1,
    explanation: '액면계에 거품(기포)이 보이면 냉매가 부족하다는 의미입니다. 정상 시에는 맑은 액체만 보여야 합니다.',
    difficulty: 'beginner',
    category: 'troubleshooting'
  },

  // 냉매 (refrigerant)
  {
    id: 'r17',
    question: 'R-22 냉매에 사용하는 오일은?',
    options: ['POE 오일', '광유(Mineral Oil)', 'PAG 오일', 'AB 오일'],
    correctIndex: 1,
    explanation: 'R-22는 HCFC 계열로 광유(Mineral Oil)를 사용합니다. R-404A, R-134a 등 HFC 계열은 POE 오일을 사용합니다.',
    difficulty: 'beginner',
    category: 'refrigerant'
  },
  {
    id: 'r18',
    question: 'R-404A 냉매의 특징이 아닌 것은?',
    options: [
      '비공비 혼합 냉매이다',
      'POE 오일을 사용한다',
      '액상 충전이 권장된다',
      '단일 냉매이다'
    ],
    correctIndex: 3,
    explanation: 'R-404A는 R-125/R-143a/R-134a의 혼합 냉매입니다. 조성 변화를 막기 위해 액상 충전해야 합니다.',
    difficulty: 'intermediate',
    category: 'refrigerant'
  },
  {
    id: 'r19',
    question: 'POE 오일의 특성으로 올바른 것은?',
    options: [
      '흡습성이 없다',
      '흡습성이 강해 밀봉 보관이 필수',
      '광유와 혼합해도 된다',
      'R-22 전용이다'
    ],
    correctIndex: 1,
    explanation: 'POE(Polyol Ester) 오일은 흡습성이 강합니다. 대기 노출 시 수분을 흡수하므로 밀봉 보관하고, 개봉 후 빠르게 사용해야 합니다.',
    difficulty: 'intermediate',
    category: 'refrigerant'
  },
  {
    id: 'r20',
    question: 'R-134a 냉매는 주로 어디에 사용되나요?',
    options: [
      '대형 저온 냉동고',
      '에어컨/중온 냉장고',
      '초저온 냉동고',
      '암모니아 대체용'
    ],
    correctIndex: 1,
    explanation: 'R-134a는 비교적 높은 증발 온도(-10°C 이상)에 적합하여 에어컨, 자동차 에어컨, 중온 냉장고에 주로 사용됩니다.',
    difficulty: 'beginner',
    category: 'refrigerant'
  },

  // 부품 (components)
  {
    id: 'r21',
    question: '필터드라이어의 역할이 아닌 것은?',
    options: ['수분 제거', '이물질 필터링', '산 제거', '냉매 압축'],
    correctIndex: 3,
    explanation: '필터드라이어는 수분, 이물질, 산을 제거하여 냉매 계통을 보호합니다. 압축은 압축기의 역할입니다.',
    difficulty: 'beginner',
    category: 'components'
  },
  {
    id: 'r22',
    question: '어큐뮬레이터(Accumulator)의 역할은?',
    options: [
      '냉매를 압축한다',
      '액냉매가 압축기로 들어가는 것을 방지한다',
      '응축 압력을 조절한다',
      '제상 시간을 제어한다'
    ],
    correctIndex: 1,
    explanation: '어큐뮬레이터는 증발기에서 나온 액냉매를 저장하여 가스만 압축기로 보내 액압축을 방지합니다.',
    difficulty: 'intermediate',
    category: 'components'
  },
  {
    id: 'r23',
    question: '리시버 탱크(Receiver Tank)의 역할은?',
    options: [
      '냉매 가스 저장',
      '잉여 액냉매 저장 및 안정적 공급',
      '오일 저장',
      '압축기 보호'
    ],
    correctIndex: 1,
    explanation: '리시버 탱크는 응축된 액냉매를 저장하여 부하 변동에도 안정적으로 팽창밸브에 액냉매를 공급합니다.',
    difficulty: 'intermediate',
    category: 'components'
  },
  {
    id: 'r24',
    question: 'TXV 감온통(Sensing Bulb)의 올바른 설치 위치는?',
    options: [
      '증발기 입구',
      '증발기 출구 흡입관 (3~9시 방향)',
      '응축기 출구',
      '압축기 토출측'
    ],
    correctIndex: 1,
    explanation: '감온통은 증발기 출구 흡입관의 3~9시 방향(수평부)에 밀착 설치합니다. 12시 방향은 오일이 고여 오측정될 수 있습니다.',
    difficulty: 'intermediate',
    category: 'components'
  },

  // 충전 (charging)
  {
    id: 'r25',
    question: '냉매 충전 전 반드시 해야 할 작업은?',
    options: [
      '압축기 교체',
      '진공 건조 (진공 펌프 작업)',
      '오일 교체',
      '팬 모터 점검'
    ],
    correctIndex: 1,
    explanation: '냉매 충전 전 진공 건조로 수분과 공기를 제거해야 합니다. 수분은 냉동유 열화, 결빙, 부식의 원인이 됩니다.',
    difficulty: 'beginner',
    category: 'charging'
  },
  {
    id: 'r26',
    question: '진공 건조 시 목표 진공도는?',
    options: ['-0.05MPa', '-0.08MPa', '-0.1MPa (500micron 이하)', '-0.15MPa'],
    correctIndex: 2,
    explanation: '목표 진공도는 -0.1MPa(약 500micron) 이하입니다. 이 진공도에서 물의 끓는점이 상온 이하가 되어 수분이 증발합니다.',
    difficulty: 'intermediate',
    category: 'charging'
  },
  {
    id: 'r27',
    question: 'R-404A 충전 시 주의사항은?',
    options: [
      '가스 상태로 충전한다',
      '액상으로 충전한다',
      '어떤 상태로 충전해도 된다',
      'R-22와 혼합해도 된다'
    ],
    correctIndex: 1,
    explanation: 'R-404A는 혼합 냉매이므로 반드시 액상 충전해야 합니다. 가스 충전 시 조성 비율이 변하여 성능이 저하됩니다.',
    difficulty: 'intermediate',
    category: 'charging'
  },
  {
    id: 'r28',
    question: '냉매 충전 완료 판단 기준이 아닌 것은?',
    options: [
      '정상 저압/고압 범위',
      '액면계 맑음',
      '과열도/과냉도 정상',
      '압축기 소음 증가'
    ],
    correctIndex: 3,
    explanation: '정상 압력, 액면계 맑음, 과열도/과냉도 정상이 충전 완료 기준입니다. 압축기 소음 증가는 오히려 이상 신호입니다.',
    difficulty: 'beginner',
    category: 'charging'
  },
  {
    id: 'r29',
    question: '냉매 과충전 시 나타나는 증상은?',
    options: [
      '저압과 고압 모두 낮다',
      '고압이 높고 액면계 거품',
      '고압이 높고 과냉도 과다',
      '저압이 낮고 흡입관 결로'
    ],
    correctIndex: 2,
    explanation: '냉매 과충전 시 고압 상승, 과냉도 증가(15°C 이상), 운전 전류 증가가 나타납니다. 심하면 액압축 위험도 있습니다.',
    difficulty: 'intermediate',
    category: 'charging'
  },
  {
    id: 'r30',
    question: '누설 점검에 사용하지 않는 방법은?',
    options: [
      '비눗물 도포',
      '전자식 누설 탐지기',
      '자외선 형광 검사',
      '멀티미터 전압 측정'
    ],
    correctIndex: 3,
    explanation: '누설 점검에는 비눗물, 전자식 탐지기, UV 형광 방법을 사용합니다. 멀티미터는 전기 측정 장비입니다.',
    difficulty: 'beginner',
    category: 'charging'
  }
]

// 헬퍼 함수: 배열 셔플
export function shuffleQuizArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// 카테고리별 라벨
export const QUIZ_CATEGORY_LABELS: Record<string, string> = {
  basics: '기초 이론',
  'pt-chart': 'P-T 차트',
  troubleshooting: '고장 진단',
  refrigerant: '냉매',
  components: '부품',
  charging: '충전'
}
