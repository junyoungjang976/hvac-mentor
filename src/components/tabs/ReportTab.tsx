import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { FileImage, Share2, ClipboardCheck, Thermometer } from 'lucide-react'

interface ReportTabProps {
  refrigerant?: 'R-22' | 'R-404A' | 'R-134a'
  facilityType?: string
  lowPressure?: number
  highPressure?: number
  diagnosisResult?: {
    severity: '정상' | '주의' | '경고' | '위험'
    issues: string[]
    actions: string[]
  } | null
}

type InspectionStatus = '정상운전' | '점검필요' | '수리필요' | '긴급수리'

const STATUS_COLORS: Record<InspectionStatus, { bg: string; text: string; border: string }> = {
  '정상운전': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
  '점검필요': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
  '수리필요': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' },
  '긴급수리': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
}

const STATUS_EMOJI: Record<InspectionStatus, string> = {
  '정상운전': '✅',
  '점검필요': '🔶',
  '수리필요': '🔧',
  '긴급수리': '🚨',
}

export default function ReportTab({
  refrigerant,
  facilityType,
  lowPressure,
  highPressure,
  diagnosisResult,
}: ReportTabProps) {
  const reportCardRef = useRef<HTMLDivElement>(null)

  // Form state
  const [equipmentName, setEquipmentName] = useState('')
  const [inspectionDate, setInspectionDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [technicianName, setTechnicianName] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState<InspectionStatus>('정상운전')
  const [remarks, setRemarks] = useState('')
  const [recommendations, setRecommendations] = useState('')

  // UI state
  const [isGenerating, setIsGenerating] = useState(false)
  const [shareMessage, setShareMessage] = useState<string | null>(null)

  // Validation
  const isFormValid = equipmentName.trim() && inspectionDate && technicianName.trim()

  const handleSaveImage = async () => {
    if (!reportCardRef.current || !isFormValid) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(reportCardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      })

      const link = document.createElement('a')
      link.download = `HVAC_점검보고서_${equipmentName}_${inspectionDate}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('이미지 생성 실패:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    if (!reportCardRef.current || !isFormValid) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(reportCardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      })

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      )

      if (blob && navigator.share && navigator.canShare) {
        const file = new File([blob], `HVAC_점검보고서_${equipmentName}.png`, {
          type: 'image/png',
        })

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'HVAC 점검 보고서',
            text: `${equipmentName} 점검 보고서 (${inspectionDate})`,
            files: [file],
          })
          setShareMessage('공유 완료!')
        } else {
          // Fallback: download
          handleSaveImage()
          setShareMessage('공유 미지원 - 이미지 다운로드됨')
        }
      } else {
        // Fallback: download
        handleSaveImage()
        setShareMessage('공유 미지원 - 이미지 다운로드됨')
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('공유 실패:', error)
        setShareMessage('공유 실패 - 이미지로 저장하세요')
      }
    } finally {
      setIsGenerating(false)
      setTimeout(() => setShareMessage(null), 3000)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Input Form Section */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <ClipboardCheck className="text-indigo-600" size={24} />
          점검 정보 입력
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Required fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              장비명/모델 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              placeholder="예: 냉장 쇼케이스 SC-500"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              점검일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={inspectionDate}
              onChange={(e) => setInspectionDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기술자명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              placeholder="홍길동"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              고객명
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="OO마트"
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설치 장소
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="서울시 강남구 OO빌딩 지하 1층"
              className="input-field"
            />
          </div>

          {/* Status Radio */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              점검 결과
            </label>
            <div className="flex flex-wrap gap-4">
              {(Object.keys(STATUS_COLORS) as InspectionStatus[]).map((s) => (
                <label
                  key={s}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                    status === s
                      ? `${STATUS_COLORS[s].bg} ${STATUS_COLORS[s].border}`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    className="sr-only"
                  />
                  <span>{STATUS_EMOJI[s]}</span>
                  <span className={status === s ? STATUS_COLORS[s].text : 'text-gray-700'}>
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              특이사항{' '}
              <span className="text-gray-400 text-xs">({remarks.length}/200)</span>
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value.slice(0, 200))}
              placeholder="점검 중 발견된 특이사항을 기록하세요"
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Recommendations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              권장사항{' '}
              <span className="text-gray-400 text-xs">({recommendations.length}/200)</span>
            </label>
            <textarea
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value.slice(0, 200))}
              placeholder="고객에게 권장하는 조치사항을 기록하세요"
              rows={3}
              className="input-field resize-none"
            />
          </div>
        </div>

        {!isFormValid && (
          <p className="mt-4 text-sm text-orange-600">
            * 표시된 필수 항목을 모두 입력해주세요
          </p>
        )}
      </div>

      {/* Report Card Preview Section */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FileImage className="text-indigo-600" size={24} />
          보고서 카드 미리보기
        </h3>

        <div className="flex justify-center">
          {/* Report Card */}
          <div
            ref={reportCardRef}
            id="report-card"
            className="w-[400px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Thermometer className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">HVAC 점검 보고서</h2>
                  <p className="text-white/80 text-sm">냉동공조 설비 점검 결과</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Basic Info */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">점검일</span>
                  <span className="font-medium">
                    {inspectionDate ? formatDate(inspectionDate) : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">장비명</span>
                  <span className="font-medium">{equipmentName || '-'}</span>
                </div>
                {location && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">설치장소</span>
                    <span className="font-medium text-right max-w-[200px] truncate">
                      {location}
                    </span>
                  </div>
                )}
                {customerName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">고객명</span>
                    <span className="font-medium">{customerName}</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* Status Badge */}
              <div className="flex justify-center">
                <div
                  className={`px-6 py-3 rounded-xl ${STATUS_COLORS[status].bg} ${STATUS_COLORS[status].text} text-lg font-bold flex items-center gap-2`}
                >
                  <span className="text-2xl">{STATUS_EMOJI[status]}</span>
                  {status}
                </div>
              </div>

              {/* Measurements (if diagnosis data available) */}
              {(lowPressure !== undefined || highPressure !== undefined) && (
                <>
                  <hr className="border-gray-200" />
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">측정값</p>
                    <div className="grid grid-cols-2 gap-4">
                      {lowPressure !== undefined && (
                        <div className="text-center">
                          <p className="text-xs text-gray-500">저압</p>
                          <p className="text-lg font-bold text-blue-600">
                            {lowPressure.toFixed(1)} kg/cm²G
                          </p>
                        </div>
                      )}
                      {highPressure !== undefined && (
                        <div className="text-center">
                          <p className="text-xs text-gray-500">고압</p>
                          <p className="text-lg font-bold text-red-600">
                            {highPressure.toFixed(1)} kg/cm²G
                          </p>
                        </div>
                      )}
                    </div>
                    {refrigerant && (
                      <p className="text-center text-xs text-gray-500 mt-2">
                        냉매: {refrigerant} | {facilityType}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Diagnosis Issues (if available) */}
              {diagnosisResult && diagnosisResult.issues.length > 0 && (
                <>
                  <hr className="border-gray-200" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">진단 결과</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {diagnosisResult.issues.slice(0, 3).map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Remarks */}
              {remarks && (
                <>
                  <hr className="border-gray-200" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">특이사항</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {remarks}
                    </p>
                  </div>
                </>
              )}

              {/* Recommendations */}
              {recommendations && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">권장사항</p>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                    {recommendations}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-5 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium text-gray-800">
                    담당: {technicianName || '-'}
                  </p>
                  <p className="text-gray-500 text-xs">HVAC Mentor System</p>
                </div>
                <div className="text-right text-gray-500 text-xs">
                  <p>생성일: {new Date().toLocaleDateString('ko-KR')}</p>
                  <p>hvac-mentor.vercel.app</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4">보고서 저장/공유</h3>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleSaveImage}
            disabled={!isFormValid || isGenerating}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              isFormValid && !isGenerating
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FileImage size={20} />
            {isGenerating ? '생성 중...' : '이미지 저장'}
          </button>

          <button
            onClick={handleShare}
            disabled={!isFormValid || isGenerating}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              isFormValid && !isGenerating
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Share2 size={20} />
            {isGenerating ? '처리 중...' : '공유하기'}
          </button>
        </div>

        {shareMessage && (
          <p className="mt-3 text-sm text-indigo-600 font-medium">{shareMessage}</p>
        )}

        <p className="mt-4 text-sm text-gray-500">
          * 이미지 저장: PNG 파일로 다운로드됩니다 (고해상도 1080px)
          <br />* 공유하기: 모바일에서 카카오톡, 문자 등으로 바로 공유할 수 있습니다
        </p>
      </div>
    </div>
  )
}
