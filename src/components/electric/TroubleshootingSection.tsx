import { useState } from 'react'
import { FAULT_DIAGNOSIS_POINTS } from '../../data/electricCircuit'

type SearchMode = 'symptom' | 'all'

const SYMPTOM_CATEGORIES = [
  { id: 'motor', label: '모터 문제', keywords: ['압축기', '팬', '미기동', '작동'] },
  { id: 'defrost', label: '제상 문제', keywords: ['제상', '성에', '히터'] },
  { id: 'protection', label: '보호장치', keywords: ['THR', 'DPS', 'ELB', '트립'] }
]

export default function TroubleshootingSection() {
  const [searchMode, setSearchMode] = useState<SearchMode>('all')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedDiagnosis, setExpandedDiagnosis] = useState<number | null>(null)
  const [currentStep, setCurrentStep] = useState<Record<number, number>>({})

  const filteredPoints = selectedCategory
    ? FAULT_DIAGNOSIS_POINTS.filter(point => {
        const category = SYMPTOM_CATEGORIES.find(c => c.id === selectedCategory)
        return category?.keywords.some(kw => point.symptom.includes(kw))
      })
    : FAULT_DIAGNOSIS_POINTS

  const handleNextStep = (index: number, totalSteps: number) => {
    const current = currentStep[index] || 0
    if (current < totalSteps - 1) {
      setCurrentStep({ ...currentStep, [index]: current + 1 })
    }
  }

  const handlePrevStep = (index: number) => {
    const current = currentStep[index] || 0
    if (current > 0) {
      setCurrentStep({ ...currentStep, [index]: current - 1 })
    }
  }

  const handleReset = (index: number) => {
    setCurrentStep({ ...currentStep, [index]: 0 })
  }

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setSearchMode('all')
            setSelectedCategory(null)
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-all min-h-[48px] ${
            searchMode === 'all'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          전체 보기
        </button>
        <button
          onClick={() => setSearchMode('symptom')}
          className={`px-4 py-2 rounded-lg font-medium transition-all min-h-[48px] ${
            searchMode === 'symptom'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          증상으로 찾기
        </button>
      </div>

      {/* Category Filter */}
      {searchMode === 'symptom' && (
        <div className="flex gap-2 flex-wrap">
          {SYMPTOM_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(
                selectedCategory === cat.id ? null : cat.id
              )}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all min-h-[40px] ${
                selectedCategory === cat.id
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Safety Warning */}
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
        <p className="font-bold text-red-800 mb-2">안전 주의</p>
        <ul className="text-red-900 text-sm space-y-1">
          <li>* 전기 점검 전 반드시 전원 차단</li>
          <li>* 전압 측정 시 절연 장갑 착용</li>
          <li>* 젖은 손으로 작업 금지</li>
          <li>* 불확실할 때는 전문가에게 문의</li>
        </ul>
      </div>

      {/* Diagnosis List */}
      <div className="space-y-3">
        {filteredPoints.map((point, index) => {
          const step = currentStep[index] || 0
          const steps = ['checkPoints', 'measurements', 'solutions'] as const
          const stepLabels = ['점검 포인트', '측정 방법', '해결책']

          return (
            <details
              key={index}
              className="bg-white rounded-lg border border-gray-200"
              open={expandedDiagnosis === index}
              onToggle={() => {
                setExpandedDiagnosis(expandedDiagnosis === index ? null : index)
                if (expandedDiagnosis !== index) {
                  handleReset(index)
                }
              }}
            >
              <summary className="p-4 cursor-pointer hover:bg-gray-50 min-h-[56px]">
                <span className="font-bold text-red-700">{point.symptom}</span>
              </summary>
              <div className="p-4 pt-0 space-y-4 border-t border-gray-100">
                {/* Step Indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i === step ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {step + 1} / {steps.length} : {stepLabels[step]}
                  </span>
                </div>

                {/* Current Step Content */}
                <div className="bg-gray-50 rounded-lg p-4">
                  {step === 0 && (
                    <div>
                      <p className="font-semibold text-gray-700 mb-3">1. 점검 포인트</p>
                      <ul className="space-y-2">
                        {point.checkPoints.map((cp, i) => (
                          <li key={i} className="text-gray-700 flex items-start gap-2">
                            <input type="checkbox" className="mt-1 w-4 h-4" />
                            <span>{cp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <p className="font-semibold text-gray-700 mb-3">2. 측정 방법</p>
                      <ul className="space-y-2">
                        {point.measurements.map((m, i) => (
                          <li key={i} className="bg-blue-50 p-3 rounded-lg text-blue-800">
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <p className="font-semibold text-gray-700 mb-3">3. 해결책</p>
                      <ul className="space-y-2">
                        {point.solutions.map((s, i) => (
                          <li key={i} className="bg-green-50 p-3 rounded-lg text-green-800">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handlePrevStep(index)
                    }}
                    disabled={step === 0}
                    className={`px-4 py-2 rounded-lg font-medium min-h-[44px] ${
                      step === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    이전
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleReset(index)
                    }}
                    className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 min-h-[44px]"
                  >
                    처음으로
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleNextStep(index, steps.length)
                    }}
                    disabled={step === steps.length - 1}
                    className={`px-4 py-2 rounded-lg font-medium min-h-[44px] ${
                      step === steps.length - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    다음
                  </button>
                </div>
              </div>
            </details>
          )
        })}
      </div>

      {filteredPoints.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          해당 증상을 찾을 수 없습니다
        </div>
      )}
    </div>
  )
}
