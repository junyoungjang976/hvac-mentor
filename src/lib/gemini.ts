import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GOOGLE_AI_KEY || ''

let genAI: GoogleGenerativeAI | null = null

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey)
}

export interface DiagnosisInput {
  refrigerant: string
  facilityType: string
  ambientTemp: number
  lowPressure: number
  highPressure: number
  targetHighPressure: number
  fieldStandard: { low_p_range: [number, number] }
  evapTemp: number
  condTemp: number
  superheat?: number
  compressionRatio: number
  symptoms: string[]
  issues: string[]
}

export async function getAIMentorResponse(input: DiagnosisInput): Promise<string> {
  if (!genAI) {
    return 'AI 멘토링을 사용하려면 Google AI API 키를 설정하세요.'
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `25년 경력 냉동공조 명장입니다.

[설비] ${input.facilityType}, ${input.refrigerant}, 외기 ${input.ambientTemp}°C
[측정] 저압 ${input.lowPressure}kg (정상 ${input.fieldStandard.low_p_range}), 고압 ${input.highPressure}kg (목표 ${input.targetHighPressure})
[상태] 증발 ${input.evapTemp.toFixed(1)}°C, 응축 ${input.condTemp.toFixed(1)}°C, 과열도 ${input.superheat ?? '-'}, 압축비 ${input.compressionRatio}
[증상] ${input.symptoms.length > 0 ? input.symptoms.join(', ') : '없음'}
[진단] ${input.issues.join(', ')}

신입 기술자에게 작업 지시와 원리 설명을 해주세요. '@@@'로 구분:
[Part 1: 작업 지시] 간결하게
@@@
[Part 2: 원리 설명] 친절하게`

  try {
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error('AI Error:', error)
    return '⚠️ AI 응답 생성 중 오류가 발생했습니다.'
  }
}

export async function readGaugeImage(imageBase64: string): Promise<{ low: number; high: number } | null> {
  if (!genAI) return null

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `냉동/공조 매니폴드 게이지입니다.
파란색(저압), 빨간색(고압) 바늘 값을 읽으세요. 단위: kg/cm²
출력: "Low: X.X, High: XX.X"`

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
    ])

    const text = result.response.text()
    const nums = text.match(/[-+]?\d*\.?\d+/g)

    if (nums && nums.length >= 2) {
      return { low: parseFloat(nums[0]), high: parseFloat(nums[1]) }
    }
  } catch (error) {
    console.error('Gauge reading error:', error)
  }

  return null
}
