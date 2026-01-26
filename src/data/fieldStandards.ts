// 현장 운전 기준
export interface FieldStandard {
  storage_temp: number
  evap_temp: number
  low_p_range: [number, number]
  low_p_target: number
}

export const FIELD_STANDARDS: Record<string, Record<string, FieldStandard>> = {
  "R-22": {
    "냉장": {
      storage_temp: 0,
      evap_temp: -15,
      low_p_range: [1.9, 2.1],
      low_p_target: 2.0,
    },
    "냉동": {
      storage_temp: -20,
      evap_temp: -27,
      low_p_range: [0.8, 1.2],
      low_p_target: 1.0,
    },
    "초저온": {
      storage_temp: -35,
      evap_temp: -45,
      low_p_range: [0.1, 0.3],
      low_p_target: 0.2,
    },
  },
  "R-404A": {
    "냉장": {
      storage_temp: 0,
      evap_temp: -10,
      low_p_range: [3.0, 3.8],
      low_p_target: 3.4,
    },
    "냉동": {
      storage_temp: -20,
      evap_temp: -30,
      low_p_range: [0.8, 1.3],
      low_p_target: 1.0,
    },
    "초저온": {
      storage_temp: -35,
      evap_temp: -45,
      low_p_range: [-0.2, 0.2],
      low_p_target: 0.0,
    },
  },
  "R-134a": {
    "냉장": {
      storage_temp: 3,
      evap_temp: -10,
      low_p_range: [0.9, 1.2],
      low_p_target: 1.0,
    },
    "냉동": {
      storage_temp: -18,
      evap_temp: -30,
      low_p_range: [-0.2, 0.3],
      low_p_target: 0.0,
    },
  }
}

// 냉매 정보
export const REFRIGERANT_INFO: Record<string, { name: string; oil: string; note: string; charge_rate: string }> = {
  "R-22": { name: "HCFC-22", oil: "광유(Mineral)", note: "2030년 퇴출", charge_rate: "액상 충전" },
  "R-404A": { name: "HFC 혼합", oil: "POE", note: "저온용", charge_rate: "액상 충전 필수" },
  "R-134a": { name: "HFC-134a", oil: "POE", note: "테이블 냉장/냉동용", charge_rate: "액상 충전" },
}

// 현장 기준 조회
export function getFieldStandard(refrigerant: string, facilityType: string): FieldStandard {
  const refData = FIELD_STANDARDS[refrigerant] || {}

  let key = "냉장"
  if (facilityType.includes("초저온")) {
    key = "초저온"
  } else if (facilityType.includes("냉동")) {
    key = "냉동"
  }

  return refData[key] || {
    storage_temp: 0,
    evap_temp: -15,
    low_p_range: [1.9, 2.1] as [number, number],
    low_p_target: 2.0
  }
}
