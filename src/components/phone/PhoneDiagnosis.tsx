import { useState } from 'react'
import { ChevronDown, ChevronUp, Zap } from 'lucide-react'
import { FAULT_PATTERNS } from '../../data/faultPatterns'
import { calculateCompressionRatio } from '../../data/ptChart'
import type { FieldStandard } from '../../data/fieldStandards'

interface PhoneDiagnosisProps {
  refrigerant: 'R-22' | 'R-404A' | 'R-134a'
  fieldStd: FieldStandard
  targetHighP: number
  lowP: number
  highP: number
  symptoms: string[]
  usePipeTemp: boolean
  suctionTemp: number
  liquidTemp: number
  diagnosisResult: {
    severity: '정상' | '주의' | '경고' | '위험'
    issues: string[]
    actions: string[]
    patternKey: string | null
    diffLow: number
    diffHigh: number
  } | null
  aiResponse: string
  isLoading: boolean
  onLowPChange: (v: number) => void
  onHighPChange: (v: number) => void
  onSymptomsChange: (v: string[]) => void
  onUsePipeTempChange: (v: boolean) => void
  onSuctionTempChange: (v: number) => void
  onLiquidTempChange: (v: number) => void
  onDiagnose: () => void
}

const SYMPTOM_OPTIONS = ['헌팅', '배관 성에', '액면계 거품', '압축기 소음']

const SEVERITY_STYLES = {
  '정상': { bg: 'bg-green-500', text: 'text-green-800', emoji: '✅' },
  '주의': { bg: 'bg-yellow-500', text: 'text-yellow-800', emoji: '🟡' },
  '경고': { bg: 'bg-orange-500', text: 'text-orange-800', emoji: '🟠' },
  '위험': { bg: 'bg-red-500', text: 'text-red-800', emoji: '🔴' },
}

export default function PhoneDiagnosis({
  fieldStd, targetHighP,
  lowP, highP, symptoms, usePipeTemp, suctionTemp, liquidTemp,
  diagnosisResult, aiResponse, isLoading,
  onLowPChange, onHighPChange, onSymptomsChange,
  onUsePipeTempChange, onSuctionTempChange, onLiquidTempChange,
  onDiagnose
}: PhoneDiagnosisProps) {
  const [showAI, setShowAI] = useState(false)
  const [showPipeTemp, setShowPipeTemp] = useState(false)

  const toggleSymptom = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      onSymptomsChange(symptoms.filter(s => s !== symptom))
    } else {
      onSymptomsChange([...symptoms, symptom])
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Pressure Input Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-xl">📊</span> 압력 입력
        </h3>

        {/* Low Pressure */}
        <div className="mb-4">
          <label className="block text-sm text-slate-600 mb-1">
            🔵 저압 (정상: {fieldStd.low_p_range[0]}~{fieldStd.low_p_range[1]} kg)
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onLowPChange(Math.max(0, lowP - 0.1))}
              className="w-14 h-14 bg-slate-100 rounded-xl text-2xl font-bold active:bg-slate-200"
            >−</button>
            <input
              type="number"
              value={lowP}
              onChange={(e) => onLowPChange(Number(e.target.value))}
              step="0.1"
              className="flex-1 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={() => onLowPChange(lowP + 0.1)}
              className="w-14 h-14 bg-slate-100 rounded-xl text-2xl font-bold active:bg-slate-200"
            >+</button>
            <span className="text-slate-500 w-8">kg</span>
          </div>
        </div>

        {/* High Pressure */}
        <div className="mb-4">
          <label className="block text-sm text-slate-600 mb-1">
            🔴 고압 (목표: {targetHighP} kg)
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onHighPChange(Math.max(0, highP - 0.5))}
              className="w-14 h-14 bg-slate-100 rounded-xl text-2xl font-bold active:bg-slate-200"
            >−</button>
            <input
              type="number"
              value={highP}
              onChange={(e) => onHighPChange(Number(e.target.value))}
              step="0.5"
              className="flex-1 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={() => onHighPChange(highP + 0.5)}
              className="w-14 h-14 bg-slate-100 rounded-xl text-2xl font-bold active:bg-slate-200"
            >+</button>
            <span className="text-slate-500 w-8">kg</span>
          </div>
        </div>

        {/* Pipe Temp Toggle */}
        <button
          onClick={() => {
            setShowPipeTemp(!showPipeTemp)
            onUsePipeTempChange(!usePipeTemp)
          }}
          className="w-full py-3 text-sm text-indigo-600 flex items-center justify-center gap-1"
        >
          🌡️ 배관 온도 입력 {showPipeTemp ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
        </button>

        {showPipeTemp && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block text-xs text-slate-500 mb-1">흡입관 온도</label>
              <input
                type="number"
                value={suctionTemp}
                onChange={(e) => onSuctionTempChange(Number(e.target.value))}
                className="w-full h-12 text-center text-lg border-2 border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">액관 온도</label>
              <input
                type="number"
                value={liquidTemp}
                onChange={(e) => onLiquidTempChange(Number(e.target.value))}
                className="w-full h-12 text-center text-lg border-2 border-slate-200 rounded-xl"
              />
            </div>
          </div>
        )}
      </div>

      {/* Symptoms Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-3">🔍 현장 증상</h3>
        <div className="grid grid-cols-2 gap-2">
          {SYMPTOM_OPTIONS.map((symptom) => (
            <button
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                symptoms.includes(symptom)
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-400'
                  : 'bg-slate-100 text-slate-600 border-2 border-transparent'
              }`}
            >
              {symptoms.includes(symptom) ? '✓ ' : ''}{symptom}
            </button>
          ))}
        </div>
      </div>

      {/* Diagnose Button */}
      <button
        onClick={onDiagnose}
        disabled={isLoading}
        className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 active:opacity-90 disabled:opacity-50"
      >
        {isLoading ? (
          <>⏳ 분석 중...</>
        ) : (
          <><Zap size={24} /> 진단 시작</>
        )}
      </button>

      {/* Results */}
      {diagnosisResult && (
        <>
          {/* Status Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-600">진단 결과</span>
              <span className={`px-4 py-2 rounded-full text-white font-bold ${SEVERITY_STYLES[diagnosisResult.severity].bg}`}>
                {SEVERITY_STYLES[diagnosisResult.severity].emoji} {diagnosisResult.severity}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500">저압</p>
                <p className="text-xl font-bold text-blue-600">{lowP.toFixed(1)}</p>
                <p className={`text-xs ${diagnosisResult.diffLow > 0.2 ? 'text-red-500' : diagnosisResult.diffLow < -0.2 ? 'text-blue-500' : 'text-green-500'}`}>
                  {diagnosisResult.diffLow > 0 ? '+' : ''}{diagnosisResult.diffLow.toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500">고압</p>
                <p className="text-xl font-bold text-red-600">{highP.toFixed(1)}</p>
                <p className={`text-xs ${diagnosisResult.diffHigh > 2 ? 'text-red-500' : diagnosisResult.diffHigh < -2 ? 'text-blue-500' : 'text-green-500'}`}>
                  {diagnosisResult.diffHigh > 0 ? '+' : ''}{diagnosisResult.diffHigh.toFixed(1)}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500">압축비</p>
                <p className="text-xl font-bold text-slate-700">{calculateCompressionRatio(lowP, highP)}</p>
              </div>
            </div>

            {/* Issues */}
            <div className="space-y-2">
              {diagnosisResult.issues.map((issue, i) => (
                <p key={i} className="text-slate-700">{issue}</p>
              ))}
            </div>

            {/* Actions */}
            {diagnosisResult.actions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="font-medium text-slate-700 mb-2">📋 조치사항</p>
                <ul className="space-y-1">
                  {diagnosisResult.actions.map((action, i) => (
                    <li key={i} className="text-sm text-slate-600">{action}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pattern Warning */}
            {diagnosisResult.patternKey && FAULT_PATTERNS[diagnosisResult.patternKey] && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-xl">
                <p className="text-sm font-medium text-yellow-800">
                  ⚠️ {FAULT_PATTERNS[diagnosisResult.patternKey].주의}
                </p>
              </div>
            )}
          </div>

          {/* AI Response Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => setShowAI(!showAI)}
              className="w-full p-4 flex items-center justify-between"
            >
              <span className="font-bold text-slate-800">🤖 AI 멘토 가이드</span>
              {showAI ? <ChevronUp /> : <ChevronDown />}
            </button>
            {showAI && (
              <div className="px-4 pb-4">
                {aiResponse ? (
                  <div className="prose prose-sm max-w-none">
                    {aiResponse.includes('@@@') ? (
                      <>
                        <div className="p-3 bg-yellow-50 rounded-xl mb-3">
                          <p className="font-medium text-yellow-800 mb-2">👷 작업 지시</p>
                          <div className="whitespace-pre-wrap text-sm">{aiResponse.split('@@@')[0]}</div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl">
                          <p className="font-medium text-blue-800 mb-2">🎓 원리 설명</p>
                          <div className="whitespace-pre-wrap text-sm">{aiResponse.split('@@@')[1]}</div>
                        </div>
                      </>
                    ) : (
                      <div className="whitespace-pre-wrap text-sm">{aiResponse}</div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500">AI 응답을 기다리는 중...</p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
