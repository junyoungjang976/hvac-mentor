// P-T 차트 데이터 (PDF 검증 완료 - °C 기준)
export const PT_CHART: Record<string, Record<number, number>> = {
  "R-22": {
    "-45": 0.19, "-40": 0.04, "-35": 0.32, "-30": 0.64, "-25": 1.02,
    "-20": 1.47, "-15": 1.99, "-10": 2.59, "-5": 3.27, "0": 4.04,
    "5": 4.92, "10": 5.91, "15": 7.02, "20": 8.25, "25": 9.61,
    "30": 11.12, "35": 12.78, "40": 14.60, "45": 16.60, "50": 18.78,
    "55": 21.15, "60": 23.72
  },
  "R-404A": {
    "-45": 0.02, "-40": 0.30, "-35": 0.63, "-30": 1.03, "-25": 1.49,
    "-20": 2.02, "-15": 2.65, "-10": 3.36, "-5": 4.17, "0": 5.09,
    "5": 6.12, "10": 7.28, "15": 8.58, "20": 10.02, "25": 11.62,
    "30": 13.39, "35": 15.33, "40": 17.47, "45": 19.82, "50": 22.36
  },
  "R-134a": {
    "-25": 0.49, "-20": 0.69, "-15": 0.88, "-10": 1.01, "-5": 1.24,
    "0": 1.48, "5": 1.72, "10": 2.01, "15": 2.33, "20": 2.67,
    "25": 3.04, "30": 3.43, "35": 3.86, "40": 4.32, "45": 4.79,
    "50": 5.31, "55": 5.87, "60": 6.48
  }
}

// 선형 보간 P-T 변환
export function interpolatePT(refrigerant: string, value: number, mode: 'temp_to_press' | 'press_to_temp'): number {
  const chart = PT_CHART[refrigerant] || PT_CHART["R-22"]
  const temps = Object.keys(chart).map(Number).sort((a, b) => a - b)
  const pressures = temps.map(t => chart[t])

  if (mode === 'temp_to_press') {
    const temp = value
    if (temp <= temps[0]) return pressures[0]
    if (temp >= temps[temps.length - 1]) return pressures[pressures.length - 1]

    for (let i = 0; i < temps.length - 1; i++) {
      if (temps[i] <= temp && temp <= temps[i + 1]) {
        const ratio = (temp - temps[i]) / (temps[i + 1] - temps[i])
        return pressures[i] + ratio * (pressures[i + 1] - pressures[i])
      }
    }
    return 0
  } else {
    const pressure = value
    if (pressure <= pressures[0]) return temps[0]
    if (pressure >= pressures[pressures.length - 1]) return temps[temps.length - 1]

    for (let i = 0; i < pressures.length - 1; i++) {
      if (pressures[i] <= pressure && pressure <= pressures[i + 1]) {
        const ratio = (pressure - pressures[i]) / (pressures[i + 1] - pressures[i])
        return temps[i] + ratio * (temps[i + 1] - temps[i])
      }
    }
    return temps[0]
  }
}

// 과열도 계산
export function calculateSuperheat(refrigerant: string, lowPressure: number, suctionTemp: number): { superheat: number; evapTemp: number } {
  const evapTemp = interpolatePT(refrigerant, lowPressure, 'press_to_temp')
  return {
    superheat: Math.round((suctionTemp - evapTemp) * 10) / 10,
    evapTemp: Math.round(evapTemp * 10) / 10
  }
}

// 과냉도 계산
export function calculateSubcooling(refrigerant: string, highPressure: number, liquidTemp: number): { subcooling: number; condTemp: number } {
  const condTemp = interpolatePT(refrigerant, highPressure, 'press_to_temp')
  return {
    subcooling: Math.round((condTemp - liquidTemp) * 10) / 10,
    condTemp: Math.round(condTemp * 10) / 10
  }
}

// 압축비 계산
export function calculateCompressionRatio(lowP: number, highP: number): number {
  const absLow = lowP + 1.033
  const absHigh = highP + 1.033
  if (absLow <= 0.1) return 99.9
  return Math.round((absHigh / absLow) * 10) / 10
}

// 고압 목표 계산
export function getHighPressureTarget(refrigerant: string, ambientTemp: number): { targetHighP: number; targetCondTemp: number } {
  const targetCondTemp = ambientTemp + 15
  const targetHighP = interpolatePT(refrigerant, targetCondTemp, 'temp_to_press')
  return {
    targetHighP: Math.round(targetHighP * 10) / 10,
    targetCondTemp: Math.round(targetCondTemp * 10) / 10
  }
}
