'use client'

import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import {
  AlertCircle,
  Clock,
  Wrench,
  CheckCircle2,
  Share2,
  Download,
  Mail,
  Smartphone,
  RotateCcw,
  Package,
  Settings,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react'
import {
  getSymptomName,
  getEquipmentName,
  type DiagnosisResult as DiagnosisResultType,
  type WorkflowRecommendation
} from '../../data/customerDiagnosis'

interface DiagnosisResultProps {
  code: string
  equipment: string
  symptoms: string[]
  minDiagnosis: DiagnosisResultType
  maxDiagnosis: DiagnosisResultType
  workflow: WorkflowRecommendation | null
  onShare: (method: string) => void
  onRestart: () => void
}

const urgencyColors = {
  low: 'bg-blue-100 text-blue-700 border-blue-300',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  high: 'bg-orange-100 text-orange-700 border-orange-300',
  critical: 'bg-red-100 text-red-700 border-red-300'
}

const urgencyLabels = {
  low: '낮음',
  medium: '보통',
  high: '높음',
  critical: '긴급'
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-orange-100 text-orange-700',
  expert: 'bg-red-100 text-red-700'
}

const difficultyLabels = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
  expert: '전문가 필요'
}

export default function DiagnosisResult({
  code,
  equipment,
  symptoms,
  minDiagnosis,
  maxDiagnosis,
  workflow,
  onShare,
  onRestart
}: DiagnosisResultProps) {
  const [selectedScenario, setSelectedScenario] = useState<'min' | 'max'>('min')
  const [copied, setCopied] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  const currentDiagnosis = selectedScenario === 'min' ? minDiagnosis : maxDiagnosis

  // Generate shareable text
  const getShareText = () => {
    const symptomNames = symptoms.map(s => getSymptomName(s)).join(', ')
    return `[HVAC 진단 코드: ${code}]
장비: ${getEquipmentName(equipment)}
증상: ${symptomNames}
긴급도: ${urgencyLabels[minDiagnosis.urgency]} ~ ${urgencyLabels[maxDiagnosis.urgency]}
예상원인: ${minDiagnosis.cause}

👉 상세 내용은 엔지니어에게 코드를 전달해주세요.`
  }

  // Copy code to clipboard
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('코드 복사에 실패했습니다: ' + code)
    }
  }

  // SMS share
  const handleSmsShare = () => {
    const text = encodeURIComponent(getShareText())
    window.location.href = `sms:?body=${text}`
  }

  // Email share
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`[HVAC 진단] 코드: ${code}`)
    const body = encodeURIComponent(getShareText())
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  // Download as image
  const handleDownload = async () => {
    if (!resultRef.current) return

    setIsGeneratingPdf(true)
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        backgroundColor: '#f8fafc',
        logging: false
      })

      const link = document.createElement('a')
      link.download = `hvac-diagnosis-${code}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download failed:', err)
      alert('이미지 생성에 실패했습니다.')
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  // Web Share API
  const handleShare = async () => {
    const shareData = {
      title: `HVAC 진단 코드: ${code}`,
      text: getShareText(),
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          // Fallback: copy to clipboard
          handleCopyCode()
        }
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(getShareText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      alert('공유 내용이 클립보드에 복사되었습니다.')
    }

    onShare('share')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div ref={resultRef}>
      {/* Header with Code */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">진단 완료</h2>
            <p className="text-teal-50">
              진단 결과가 준비되었습니다
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-teal-100 mb-1">진단 코드</div>
            <div className="text-2xl font-mono font-bold tracking-wider bg-white/20 px-4 py-2 rounded-lg">
              {code}
            </div>
          </div>
        </div>
      </div>

      {/* Equipment and Symptoms Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">진단 정보</h3>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-600">장비:</span>
            <span className="ml-2 font-medium text-gray-900">{getEquipmentName(equipment)}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">선택한 증상:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {symptoms.map(symptomId => (
                <span
                  key={symptomId}
                  className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium"
                >
                  {getSymptomName(symptomId)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 mb-2">진단 시나리오</h3>
          <p className="text-sm text-gray-600">
            최선/최악의 경우를 비교해보세요
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedScenario('min')}
            className={`
              flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all
              ${
                selectedScenario === 'min'
                  ? 'bg-green-50 border-green-500 text-green-900'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300'
              }
            `}
          >
            <div className="text-sm mb-1">최선의 경우</div>
            <div className="text-xs opacity-70">간단한 문제일 가능성</div>
          </button>
          <button
            onClick={() => setSelectedScenario('max')}
            className={`
              flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all
              ${
                selectedScenario === 'max'
                  ? 'bg-orange-50 border-orange-500 text-orange-900'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-orange-300'
              }
            `}
          >
            <div className="text-sm mb-1">최악의 경우</div>
            <div className="text-xs opacity-70">심각한 문제일 가능성</div>
          </button>
        </div>
      </div>

      {/* Diagnosis Details */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className={`px-6 py-4 ${selectedScenario === 'min' ? 'bg-green-50' : 'bg-orange-50'}`}>
          <h3 className="font-bold text-gray-900">
            {selectedScenario === 'min' ? '낙관적 진단' : '보수적 진단'}
          </h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Urgency */}
          <div>
            <div className="text-sm text-gray-600 mb-2">긴급도</div>
            <span className={`inline-block px-4 py-2 rounded-lg border font-medium ${urgencyColors[currentDiagnosis.urgency]}`}>
              {urgencyLabels[currentDiagnosis.urgency]}
            </span>
          </div>

          {/* Cause */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">추정 원인</span>
            </div>
            <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
              {currentDiagnosis.cause}
            </p>
          </div>

          {/* Action */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">권장 조치</span>
            </div>
            <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
              {currentDiagnosis.action}
            </p>
          </div>

          {/* Time */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">예상 소요 시간</span>
            </div>
            <p className="text-gray-900 font-medium">
              {currentDiagnosis.estimatedTime}
            </p>
          </div>

          {/* Self Fixable */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">자가 수리 가능 여부</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentDiagnosis.selfFixable
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}>
              {currentDiagnosis.selfFixable ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">셀프 수리 시도 가능</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">전문가 필요</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Recommendation */}
      {workflow && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-8">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <h3 className="font-bold text-gray-900">작업 가이드</h3>
          </div>
          <div className="p-6 space-y-6">
            {/* Difficulty */}
            <div>
              <div className="text-sm text-gray-600 mb-2">난이도</div>
              <span className={`inline-block px-4 py-2 rounded-lg font-medium ${difficultyColors[workflow.difficulty]}`}>
                {difficultyLabels[workflow.difficulty]}
              </span>
            </div>

            {/* Time */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">예상 작업 시간</span>
              </div>
              <p className="text-gray-900 font-medium">
                {workflow.estimatedDuration.min}분 ~ {workflow.estimatedDuration.max}분
              </p>
            </div>

            {/* Required Tools */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">필요 공구</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {workflow.requiredTools.map((tool, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Optional Parts */}
            {workflow.optionalParts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">필요할 수 있는 부품</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {workflow.optionalParts.map((part, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm">
                      {part}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Check Sequence */}
            <div>
              <div className="text-sm font-medium text-gray-600 mb-3">점검 순서</div>
              <div className="space-y-3">
                {workflow.checkSequence.map((step) => (
                  <div key={step.order} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {step.order}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">{step.title}</div>
                      <div className="text-sm text-gray-600">{step.description}</div>
                      {step.cautionNote && (
                        <div className="mt-2 flex items-start gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-yellow-800">{step.cautionNote}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>{/* End of resultRef */}

      {/* Copy Code Button */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">진단 코드 복사</h3>
        <button
          onClick={handleCopyCode}
          className={`w-full flex items-center justify-center gap-2 px-4 py-4 rounded-lg font-medium text-lg transition-all ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-dashed border-gray-300'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-6 h-6" />
              <span>복사됨!</span>
            </>
          ) : (
            <>
              <Copy className="w-6 h-6" />
              <span className="font-mono text-2xl tracking-widest">{code}</span>
            </>
          )}
        </button>
      </div>

      {/* Share Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">진단 결과 공유</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={handleSmsShare}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            <Smartphone className="w-5 h-5" />
            <span>문자로 기사에게 전송</span>
          </button>
          <button
            onClick={handleEmailShare}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span>이메일로 전송</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={isGeneratingPdf}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>{isGeneratingPdf ? '생성 중...' : '이미지 다운로드'}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span>공유하기</span>
          </button>
        </div>
      </div>

      {/* Restart Button */}
      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>새로운 진단 시작</span>
        </button>
      </div>

      {/* Disclaimer */}
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">안내사항</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 이 진단은 자동화된 예비 진단이며, 전문가의 직접 점검을 대체할 수 없습니다</li>
              <li>• 안전과 관련된 문제는 즉시 전문 기술자에게 연락하시기 바랍니다</li>
              <li>• 자가 수리 시도 중 문제가 악화되면 즉시 작업을 중단하세요</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
