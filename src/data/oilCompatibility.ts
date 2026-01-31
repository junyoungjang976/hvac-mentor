// 냉동오일 호환성 차트

export interface OilType {
  name: string
  chemical: string
  applications: string[]
  viscosity?: string
  hygroscopic: boolean // 흡습성 여부
  notes: string
}

export interface OilCompatibility {
  refrigerant: string
  compatibleOils: string[]
  recommended: string
  chargingMethod: "액상" | "기상" | "액상/기상"
  notes: string
}

export interface OilMixingWarning {
  combination: string
  severity: "위험" | "경고" | "주의"
  problem: string
  result: string
  action: string
}

export interface OilChargeGuideline {
  checkPoint: string
  method: string
  frequency: string
  notes: string
}

// 1. 냉동오일 종류
export const OIL_TYPES: Record<string, OilType> = {
  "Mineral": {
    name: "광유 (Mineral Oil)",
    chemical: "탄화수소 계열",
    applications: ["R-12", "R-22", "HCFC 계열"],
    viscosity: "3GS, 5GS, 7GS",
    hygroscopic: false,
    notes: "전통적 냉매용, 2030년 퇴출 예정. 저렴하나 HFC 냉매와 비호환."
  },
  "AB": {
    name: "알킬벤젠 (Alkyl Benzene)",
    chemical: "합성유",
    applications: ["R-22", "과도기 대체"],
    hygroscopic: false,
    notes: "광유 대비 열안정성 우수. R-22 대체 과도기용."
  },
  "POE": {
    name: "폴리올에스터 (Polyol Ester)",
    chemical: "에스터 계열",
    applications: ["R-404A", "R-134a", "R-407C", "R-410A", "R-32"],
    hygroscopic: true,
    notes: "⚠️ 흡습성 강함 - 작업 시 진공 작업 필수, 개봉 후 즉시 밀폐."
  },
  "PVE": {
    name: "폴리비닐에테르 (Polyvinyl Ether)",
    chemical: "에테르 계열",
    applications: ["R-410A", "R-32"],
    hygroscopic: false,
    notes: "POE 대비 흡습성 낮음. 고압 시스템 권장."
  },
  "PAG": {
    name: "폴리알킬렌글리콜 (Polyalkylene Glycol)",
    chemical: "글리콜 계열",
    applications: ["R-134a (자동차)", "R-1234yf"],
    hygroscopic: true,
    notes: "⚠️ 절대 광유와 혼합 금지! 주로 자동차 에어컨용."
  }
}

// 2. 냉매-오일 호환성 매트릭스
export const OIL_COMPATIBILITY: OilCompatibility[] = [
  {
    refrigerant: "R-22",
    compatibleOils: ["Mineral", "AB"],
    recommended: "Mineral",
    chargingMethod: "기상",
    notes: "2030년 퇴출 예정. 신규 설치 지양. 기존 시스템 유지보수만."
  },
  {
    refrigerant: "R-404A",
    compatibleOils: ["POE"],
    recommended: "POE",
    chargingMethod: "액상",
    notes: "⚠️ 액상 충전 필수 (3혼합냉매). 포화압력 높음 - 액면계 감시."
  },
  {
    refrigerant: "R-134a",
    compatibleOils: ["POE", "PAG"],
    recommended: "POE",
    chargingMethod: "액상/기상",
    notes: "테이블냉장고, 냉장차량 주로 사용. PAG는 자동차 전용."
  },
  {
    refrigerant: "R-407C",
    compatibleOils: ["POE"],
    recommended: "POE",
    chargingMethod: "액상",
    notes: "⚠️ 액상 충전 필수 (혼합냉매). R-22 대체용."
  },
  {
    refrigerant: "R-410A",
    compatibleOils: ["POE", "PVE"],
    recommended: "PVE",
    chargingMethod: "액상/기상",
    notes: "고압 시스템 (R-22 대비 1.6배). PVE 사용 시 흡습성 문제 감소."
  },
  {
    refrigerant: "R-32",
    compatibleOils: ["POE"],
    recommended: "POE",
    chargingMethod: "액상/기상",
    notes: "친환경 냉매 (GWP 675). R-410A 대체 추세. 가연성 주의."
  },
  {
    refrigerant: "R-507A",
    compatibleOils: ["POE"],
    recommended: "POE",
    chargingMethod: "액상/기상",
    notes: "R-404A 대체 (혼합냉매). 저온용 주로 사용."
  },
  {
    refrigerant: "R-290 (프로판)",
    compatibleOils: ["Mineral", "AB"],
    recommended: "Mineral",
    chargingMethod: "기상",
    notes: "⚠️⚠️ 가연성 냉매 - 전기 차단 확인! 충전량 제한 (150g 이하)."
  }
]

// 3. 오일 혼합 주의사항
export const MIXING_WARNINGS: OilMixingWarning[] = [
  {
    combination: "Mineral + POE",
    severity: "위험",
    problem: "용해도 차이로 분리층 형성",
    result: "압축기 윤활 불량 → 베어링 마모 → 압축기 소손",
    action: "⚠️ 냉매 교체 시 전량 회수 → 진공 작업 → 신유 충전. 혼합률 5% 초과 시 압축기 교체 검토."
  },
  {
    combination: "PAG + Mineral",
    severity: "위험",
    problem: "화학적 반응으로 슬러지 발생",
    result: "배관 막힘 → 냉각 불량 → 시스템 전체 오염",
    action: "⚠️⚠️ 절대 혼합 금지! 자동차 에어컨 작업 시 전용 장비 사용 필수."
  },
  {
    combination: "POE + 수분",
    severity: "경고",
    problem: "흡습성으로 수분 흡수 (1시간 개봉 시 포화)",
    result: "가수분해 → 산 생성 → 동판 부식 → 모터 절연 파괴",
    action: "개봉 후 24시간 내 사용. 진공 작업 500미크론 이하 확인. 드라이어 필수 교체."
  },
  {
    combination: "PVE + POE",
    severity: "주의",
    problem: "호환성은 있으나 특성 변화",
    result: "점도 변화로 윤활 효율 저하 가능",
    action: "가능하면 단일 오일 사용. 혼합 시 10% 이내 제한."
  },
  {
    combination: "다른 냉매 잔류 시",
    severity: "위험",
    problem: "냉매 호환성 불일치",
    result: "압력 이상 → 오일 열화 → 시스템 손상",
    action: "⚠️ 냉매 교체 전 반드시 전량 회수. 진공 작업 후 신유 투입. 드라이어 교체."
  }
]

// 4. 오일 충전 가이드라인
export const OIL_CHARGE_GUIDELINES: OilChargeGuideline[] = [
  {
    checkPoint: "압축기 오일량 확인",
    method: "사이트 글라스로 오일 레벨 확인. 반밀폐형은 상하한선 사이 유지.",
    frequency: "매월 1회",
    notes: "⚠️ 과충전 시 액압축 위험, 부족 시 소손 위험."
  },
  {
    checkPoint: "배관 연장 시 추가 오일량 계산",
    method: "흡입관 +3m당 50cc, 토출관 +3m당 30cc 추가 투입.",
    frequency: "설치/개조 시",
    notes: "실외기 높이차 5m 이상 시 오일 리턴 확인 필수."
  },
  {
    checkPoint: "오일 교체 시기",
    method: "산가 측정 (0.1mgKOH/g 초과 시 교체) 또는 육안 확인 (갈색 변색 시).",
    frequency: "5년 또는 major repair 시",
    notes: "압축기 교체, 냉매 전환, 모터 번아웃 후 필수 교체."
  },
  {
    checkPoint: "오일 투입 방법",
    method: "POE: 흡입측 서비스 밸브로 주입. 운전 중 소량씩 투입 (액압축 방지).",
    frequency: "필요 시",
    notes: "⚠️ 토출측 투입 절대 금지 (역류로 밸브 파손)."
  },
  {
    checkPoint: "진공 작업 (POE/PAG)",
    method: "500미크론 이하 달성 후 30분 유지 (진공 게이지 상승 시 누설 점검).",
    frequency: "냉매 교체/오일 교체 시",
    notes: "⚠️ 흡습성 오일은 진공 작업 없이 절대 충전 불가!"
  },
  {
    checkPoint: "오일 호환성 확인",
    method: "압축기 명판 확인 → 냉매 종류 확인 → 호환성 차트 참조.",
    frequency: "작업 전 필수",
    notes: "⚠️⚠️ 호환성 미확인 시 압축기 즉시 소손 위험!"
  }
]

// 5. 오일 점도 선택 가이드
export const VISCOSITY_GUIDE = {
  "저온 (-40°C 이하)": {
    recommended: "3GS (저점도)",
    refrigerants: ["R-404A", "R-507A"],
    notes: "저온에서 유동성 확보"
  },
  "중온 (-10~5°C)": {
    recommended: "5GS (중점도)",
    refrigerants: ["R-22", "R-134a"],
    notes: "일반 냉장/냉동 표준"
  },
  "고온 (에어컨)": {
    recommended: "7GS (고점도)",
    refrigerants: ["R-410A"],
    notes: "고압 압축기 윤활 강화"
  }
}

// 6. 오일 교체 절차 (POE 기준)
export const OIL_CHANGE_PROCEDURE = [
  {
    step: 1,
    action: "냉매 전량 회수",
    detail: "회수기 사용하여 저압/고압 0kg/cm²G 확인",
    warning: "⚠️ 대기 방출 절대 금지 (불법)"
  },
  {
    step: 2,
    action: "압축기 오일 배출",
    detail: "드레인 플러그 제거 (밀폐형은 흡입관 절단)",
    warning: "폐오일은 지정 용기에 수거"
  },
  {
    step: 3,
    action: "드라이어 교체",
    detail: "POE는 흡습성으로 드라이어 필수 교체",
    warning: "⚠️ 작업 시간 최소화 (공기 중 수분 흡수)"
  },
  {
    step: 4,
    action: "진공 작업",
    detail: "500미크론 이하 30분 유지 확인",
    warning: "⚠️ 진공 게이지 상승 시 누설 점검"
  },
  {
    step: 5,
    action: "신유 투입",
    detail: "압축기 명판 용량 확인 후 투입 (개봉 즉시)",
    warning: "⚠️ POE는 개봉 후 1시간 내 사용"
  },
  {
    step: 6,
    action: "냉매 충전",
    detail: "액관으로 정량 충전 (전자저울 사용)",
    warning: "과열도 5~8°C 확인"
  },
  {
    step: 7,
    action: "시운전 점검",
    detail: "전류, 압력, 오일 레벨, 이상 소음 확인",
    warning: "24시간 후 재점검"
  }
]
