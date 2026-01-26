import { FAULT_PATTERNS } from '../data/faultPatterns'
import type { FieldStandard } from '../data/fieldStandards'

export interface DiagnosisResult {
  issues: string[]
  actions: string[]
  severity: '정상' | '주의' | '경고' | '위험'
  patternKey: string | null
  diffLow: number
  diffHigh: number
  lowRange: [number, number]
  lowTarget: number
}

export function diagnoseSystem(
  _refrigerant: string,
  lowP: number,
  highP: number,
  fieldStd: FieldStandard,
  targetHighP: number,
  superheat?: number,
  _subcooling?: number,
  _compRatio?: number,
  symptoms: string[] = []
): DiagnosisResult {
  const issues: string[] = []
  let actions: string[] = []
  let severity: DiagnosisResult['severity'] = '정상'
  let patternKey: string | null = null

  const [lowMin, lowMax] = fieldStd.low_p_range
  const lowTarget = fieldStd.low_p_target
  const diffLow = lowP - lowTarget
  const diffHigh = highP - targetHighP

  // 패턴 진단
  if (lowP < lowMin - 0.2 && diffHigh < -1.5) {
    patternKey = "저압 낮음 + 고압 낮음"
    issues.push("🔴 냉매 부족 (Undercharge)")
    severity = symptoms.includes("액면계 거품") ? "위험" : "경고"
  } else if (lowP < lowMin - 0.2 && diffHigh >= -1) {
    patternKey = "저압 낮음 + 고압 정상"
    issues.push("🟠 팽창장치/증발기 이상")
    severity = "경고"
  } else if (lowP > lowMax + 0.2 && diffHigh > 2) {
    patternKey = "저압 높음 + 고압 높음"
    issues.push("🔴 응축 불량")
    severity = diffHigh > 4 ? "위험" : "경고"
  } else if (lowP > lowMax + 0.3 && diffHigh < 0) {
    patternKey = "저압 높음 + 고압 낮음"
    issues.push("🔴 압축기 효율 저하")
    severity = symptoms.includes("압축기 소음") ? "위험" : "경고"
  }

  // 과열도 진단
  if (superheat !== undefined) {
    if (superheat < 3) {
      patternKey = "과열도 부족 (3°C 미만)"
      issues.push("🔴 과열도 부족 → 액압축 위험!")
      severity = "위험"
    } else if (superheat > 15) {
      patternKey = "과열도 과다 (15°C 초과)"
      issues.push("🟠 과열도 과다")
      if (severity !== "위험") severity = "경고"
    }
  }

  // 증상 기반 진단
  if (symptoms.includes("헌팅")) {
    patternKey = "헌팅 (바늘 흔들림)"
    issues.push("🟡 TXV 헌팅")
  }
  if (symptoms.includes("압축기 소음")) {
    patternKey = "압축기 이상 소음"
    issues.push("🔴 압축기 이상 소음 - 즉시 점검!")
    severity = "위험"
  }

  // 패턴 사전에서 조치사항 가져오기
  if (patternKey && FAULT_PATTERNS[patternKey]) {
    actions = FAULT_PATTERNS[patternKey].조치
  }

  if (issues.length === 0) {
    issues.push("✅ 시스템 정상")
    actions = ["정기 점검 주기 준수"]
  }

  return {
    issues,
    actions,
    severity,
    patternKey,
    diffLow: Math.round(diffLow * 100) / 100,
    diffHigh: Math.round(diffHigh * 10) / 10,
    lowRange: [lowMin, lowMax],
    lowTarget
  }
}

// 텍스트 리포트 생성
export function generateReportText(
  diagnosis: DiagnosisResult,
  refrigerant: string,
  facilityType: string,
  lowP: number,
  highP: number,
  targetHighP: number,
  fieldStd: FieldStandard,
  superheat?: number,
  subcooling?: number
): string {
  const now = new Date().toLocaleString('ko-KR')

  let report = `
================================================================================
                    HVAC 진단 리포트
================================================================================
생성일시: ${now}
--------------------------------------------------------------------------------

[설비 정보]
• 냉매: ${refrigerant}
• 용도: ${facilityType}
• 정상 저압 범위: ${fieldStd.low_p_range[0]} ~ ${fieldStd.low_p_range[1]} kg/cm²G

[측정값]
• 저압: ${lowP} kg/cm²G (목표: ${fieldStd.low_p_target} kg)
• 고압: ${highP} kg/cm²G (목표: ${targetHighP} kg)
• 과열도: ${superheat ?? '-'}°C
• 과냉도: ${subcooling ?? '-'}°C

[진단 결과]
• 상태: ${diagnosis.severity}
• 저압 편차: ${diagnosis.diffLow > 0 ? '+' : ''}${diagnosis.diffLow} kg
• 고압 편차: ${diagnosis.diffHigh > 0 ? '+' : ''}${diagnosis.diffHigh} kg

[발견된 문제]
`

  for (const issue of diagnosis.issues) {
    report += `  ${issue}\n`
  }

  report += "\n[권장 조치사항]\n"
  for (const action of diagnosis.actions) {
    report += `  ${action}\n`
  }

  if (diagnosis.patternKey && FAULT_PATTERNS[diagnosis.patternKey]) {
    const pattern = FAULT_PATTERNS[diagnosis.patternKey]
    report += `\n[주의사항]\n  ${pattern.주의}\n`
  }

  report += `
--------------------------------------------------------------------------------
※ 본 리포트는 참고용이며, 실제 작업은 자격을 갖춘 기술자가 수행해야 합니다.
================================================================================
`

  return report
}
