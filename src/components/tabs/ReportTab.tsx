import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import {
  FileImage,
  Share2,
  ClipboardCheck,
  Thermometer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import {
  EQUIPMENT_CATEGORIES,
  INSPECTION_ITEMS,
  INSPECTION_CATEGORIES,
  ISSUE_PRESETS,
  RECOMMENDATION_PRESETS,
  getEquipmentPath,
  groupInspectionItemsByCategory,
  type IssuePreset,
  type RecommendationPreset,
} from '../../data/equipmentCategories'

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

// Hex colors for report card (html2canvas compatible - no oklch)
const STATUS_HEX_COLORS: Record<InspectionStatus, { bg: string; text: string }> = {
  '정상운전': { bg: '#dcfce7', text: '#166534' },
  '점검필요': { bg: '#fef9c3', text: '#854d0e' },
  '수리필요': { bg: '#ffedd5', text: '#9a3412' },
  '긴급수리': { bg: '#fee2e2', text: '#991b1b' },
}

const SEVERITY_HEX_DOT_COLORS: Record<IssuePreset['severity'], string> = {
  low: '#9ca3af',
  medium: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
}

const URGENCY_HEX_COLORS: Record<RecommendationPreset['urgency'], { bg: string; text: string }> = {
  immediate: { bg: '#fee2e2', text: '#991b1b' },
  soon: { bg: '#ffedd5', text: '#9a3412' },
  scheduled: { bg: '#eff6ff', text: '#1e40af' },
  monitor: { bg: '#f3f4f6', text: '#374151' },
}

const SEVERITY_COLORS: Record<IssuePreset['severity'], string> = {
  low: 'bg-gray-100 text-gray-700 border-gray-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  high: 'bg-orange-100 text-orange-800 border-orange-400',
  critical: 'bg-red-100 text-red-800 border-red-400',
}

const SEVERITY_DOT_COLORS: Record<IssuePreset['severity'], string> = {
  low: 'bg-gray-400',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
}

const URGENCY_COLORS: Record<RecommendationPreset['urgency'], string> = {
  immediate: 'bg-red-100 text-red-800 border-red-300',
  soon: 'bg-orange-100 text-orange-800 border-orange-300',
  scheduled: 'bg-blue-100 text-blue-800 border-blue-300',
  monitor: 'bg-gray-100 text-gray-700 border-gray-300',
}

const URGENCY_LABELS: Record<RecommendationPreset['urgency'], string> = {
  immediate: '즉시',
  soon: '조속히',
  scheduled: '정기',
  monitor: '관찰',
}

export default function ReportTab({
  refrigerant,
  facilityType,
  lowPressure,
  highPressure,
  diagnosisResult,
}: ReportTabProps) {
  const reportCardRef = useRef<HTMLDivElement>(null)

  // Equipment selection state
  const [topCategory, setTopCategory] = useState('')
  const [middleCategory, setMiddleCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [modelCapacity, setModelCapacity] = useState('')

  // Basic info state
  const [inspectionDate, setInspectionDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [technicianName, setTechnicianName] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState<InspectionStatus>('정상운전')
  const [remarks, setRemarks] = useState('')

  // Checklist state
  const [checkedInspectionItems, setCheckedInspectionItems] = useState<Set<string>>(new Set())
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set())
  const [selectedRecommendations, setSelectedRecommendations] = useState<Set<string>>(new Set())

  // Collapsible sections state
  const [inspectionOpen, setInspectionOpen] = useState(false)
  const [issuesOpen, setIssuesOpen] = useState(false)
  const [recommendationsOpen, setRecommendationsOpen] = useState(false)

  // UI state
  const [isGenerating, setIsGenerating] = useState(false)
  const [shareMessage, setShareMessage] = useState<string | null>(null)

  // Derived data
  const selectedTop = EQUIPMENT_CATEGORIES.find((c) => c.id === topCategory)
  const middleOptions = selectedTop?.middle || []
  const selectedMiddle = middleOptions.find((m) => m.id === middleCategory)
  const subOptions = selectedMiddle?.subcategories || []
  const groupedInspectionItems = groupInspectionItemsByCategory()

  // Validation
  const isFormValid = topCategory && middleCategory && inspectionDate && technicianName.trim()

  // Equipment path for display
  const equipmentPath = getEquipmentPath(topCategory, middleCategory, subCategory)

  // Handle category changes
  const handleTopCategoryChange = (value: string) => {
    setTopCategory(value)
    setMiddleCategory('')
    setSubCategory('')
  }

  const handleMiddleCategoryChange = (value: string) => {
    setMiddleCategory(value)
    setSubCategory('')
  }

  // Toggle functions
  const toggleInspectionItem = (id: string) => {
    setCheckedInspectionItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleIssue = (id: string) => {
    setSelectedIssues((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleRecommendation = (id: string) => {
    setSelectedRecommendations((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

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

      const equipmentName = equipmentPath || '장비'
      const link = document.createElement('a')
      link.download = `HVAC_점검보고서_${equipmentName.replace(/[>\s]/g, '_')}_${inspectionDate}.png`
      link.href = canvas.toDataURL('image/png')
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setShareMessage('이미지 저장 완료!')
      setTimeout(() => setShareMessage(null), 3000)
    } catch (error) {
      console.error('이미지 생성 실패:', error)
      setShareMessage('이미지 생성 실패')
      setTimeout(() => setShareMessage(null), 3000)
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

      const equipmentName = equipmentPath || '장비'
      if (blob && navigator.share && navigator.canShare) {
        const file = new File([blob], `HVAC_점검보고서_${equipmentName.replace(/[>\s]/g, '_')}.png`, {
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
          // Fallback: download instead of calling handleSaveImage
          const link = document.createElement('a')
          link.download = `HVAC_점검보고서_${equipmentName.replace(/[>\s]/g, '_')}_${inspectionDate}.png`
          link.href = canvas.toDataURL('image/png')
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          setShareMessage('공유 미지원 - 이미지 다운로드됨')
        }
      } else {
        // Fallback: download instead of calling handleSaveImage
        const link = document.createElement('a')
        link.download = `HVAC_점검보고서_${equipmentName.replace(/[>\s]/g, '_')}_${inspectionDate}.png`
        link.href = canvas.toDataURL('image/png')
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
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

  // Get selected items for display
  const getSelectedIssueItems = () =>
    ISSUE_PRESETS.filter((i) => selectedIssues.has(i.id))

  const getSelectedRecommendationItems = () =>
    RECOMMENDATION_PRESETS.filter((r) => selectedRecommendations.has(r.id))

  const getCheckedInspectionItemNames = () =>
    INSPECTION_ITEMS.filter((i) => checkedInspectionItems.has(i.id)).map((i) => i.name)

  return (
    <div className="space-y-6">
      {/* Section 1: Basic Info */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <ClipboardCheck className="text-indigo-600" size={24} />
          섹션 1: 기본 정보
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
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
        </div>
      </div>

      {/* Section 2: Equipment Selection */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4">섹션 2: 장비 선택</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              대분류 <span className="text-red-500">*</span>
            </label>
            <select
              value={topCategory}
              onChange={(e) => handleTopCategoryChange(e.target.value)}
              className="input-field"
            >
              <option value="">선택하세요</option>
              {EQUIPMENT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              중분류 <span className="text-red-500">*</span>
            </label>
            <select
              value={middleCategory}
              onChange={(e) => handleMiddleCategoryChange(e.target.value)}
              className="input-field"
              disabled={!topCategory}
            >
              <option value="">선택하세요</option>
              {middleOptions.map((mid) => (
                <option key={mid.id} value={mid.id}>
                  {mid.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              소분류
            </label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="input-field"
              disabled={!middleCategory}
            >
              <option value="">선택하세요</option>
              {subOptions.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            모델명/용량 (추가 정보)
          </label>
          <input
            type="text"
            value={modelCapacity}
            onChange={(e) => setModelCapacity(e.target.value)}
            placeholder="예: SC-500 / 3HP"
            className="input-field"
          />
        </div>

        {equipmentPath && (
          <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
            <span className="text-sm text-indigo-700 font-medium">
              선택된 장비: {equipmentPath}
              {modelCapacity && ` (${modelCapacity})`}
            </span>
          </div>
        )}
      </div>

      {/* Section 3: Inspection Result */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4">섹션 3: 점검 결과</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전체 상태
          </label>
          <div className="flex flex-wrap gap-3">
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
      </div>

      {/* Section 4: Inspection Items (Collapsible) */}
      <div className="card">
        <button
          onClick={() => setInspectionOpen(!inspectionOpen)}
          className="w-full flex items-center justify-between text-lg font-bold"
        >
          <span>섹션 4: 점검 항목 ({checkedInspectionItems.size}개 선택)</span>
          {inspectionOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>

        {inspectionOpen && (
          <div className="mt-4 space-y-4">
            {Object.entries(groupedInspectionItems).map(([categoryKey, items]) => (
              <div key={categoryKey}>
                <h4 className="text-sm font-semibold text-gray-600 mb-2">
                  {INSPECTION_CATEGORIES[categoryKey as keyof typeof INSPECTION_CATEGORIES]}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {items.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                        checkedInspectionItems.has(item.id)
                          ? 'bg-indigo-50 border-indigo-300'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checkedInspectionItems.has(item.id)}
                        onChange={() => toggleInspectionItem(item.id)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm">{item.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 5: Issues (Collapsible) */}
      <div className="card">
        <button
          onClick={() => setIssuesOpen(!issuesOpen)}
          className="w-full flex items-center justify-between text-lg font-bold"
        >
          <span>섹션 5: 발견된 문제 ({selectedIssues.size}개 선택)</span>
          {issuesOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>

        {issuesOpen && (
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ISSUE_PRESETS.map((issue) => (
                <label
                  key={issue.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedIssues.has(issue.id)
                      ? SEVERITY_COLORS[issue.severity]
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIssues.has(issue.id)}
                    onChange={() => toggleIssue(issue.id)}
                    className="w-4 h-4 rounded focus:ring-indigo-500"
                  />
                  <span
                    className={`w-2 h-2 rounded-full ${SEVERITY_DOT_COLORS[issue.severity]}`}
                  />
                  <span className="text-sm flex-1">{issue.name}</span>
                  <span className="text-xs opacity-70">
                    {issue.severity === 'low' && '낮음'}
                    {issue.severity === 'medium' && '보통'}
                    {issue.severity === 'high' && '높음'}
                    {issue.severity === 'critical' && '긴급'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 6: Recommendations (Collapsible) */}
      <div className="card">
        <button
          onClick={() => setRecommendationsOpen(!recommendationsOpen)}
          className="w-full flex items-center justify-between text-lg font-bold"
        >
          <span>섹션 6: 권장사항 ({selectedRecommendations.size}개 선택)</span>
          {recommendationsOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>

        {recommendationsOpen && (
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {RECOMMENDATION_PRESETS.map((rec) => (
                <label
                  key={rec.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedRecommendations.has(rec.id)
                      ? URGENCY_COLORS[rec.urgency]
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRecommendations.has(rec.id)}
                    onChange={() => toggleRecommendation(rec.id)}
                    className="w-4 h-4 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm flex-1">{rec.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${URGENCY_COLORS[rec.urgency]}`}
                  >
                    {URGENCY_LABELS[rec.urgency]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 7: Remarks */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4">섹션 7: 비고</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            추가 메모 <span className="text-gray-400 text-xs">({remarks.length}/200)</span>
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value.slice(0, 200))}
            placeholder="점검 중 발견된 추가 사항을 기록하세요"
            rows={3}
            className="input-field resize-none"
          />
        </div>

        {!isFormValid && (
          <p className="mt-4 text-sm text-orange-600">
            * 표시된 필수 항목을 모두 입력해주세요 (점검일, 기술자명, 대분류, 중분류)
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
            className="w-[400px] rounded-2xl shadow-xl overflow-hidden"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
          >
            {/* Header */}
            <div className="p-5" style={{ background: 'linear-gradient(to right, #4f46e5, #9333ea)', color: '#ffffff' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <Thermometer style={{ color: '#ffffff' }} size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: '#ffffff' }}>HVAC 점검 보고서</h2>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>냉동공조 설비 점검 결과</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4" style={{ backgroundColor: '#ffffff' }}>
              {/* Basic Info */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: '#6b7280' }}>점검일</span>
                  <span className="font-medium" style={{ color: '#1f2937' }}>
                    {inspectionDate ? formatDate(inspectionDate) : '-'}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm" style={{ color: '#6b7280' }}>장비</span>
                  <span className="font-medium text-right max-w-[250px]" style={{ color: '#1f2937' }}>
                    {equipmentPath || '-'}
                    {modelCapacity && (
                      <span className="block text-xs" style={{ color: '#6b7280' }}>{modelCapacity}</span>
                    )}
                  </span>
                </div>
                {location && (
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: '#6b7280' }}>설치장소</span>
                    <span className="font-medium text-right max-w-[200px] truncate" style={{ color: '#1f2937' }}>
                      {location}
                    </span>
                  </div>
                )}
                {customerName && (
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: '#6b7280' }}>고객명</span>
                    <span className="font-medium" style={{ color: '#1f2937' }}>{customerName}</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <hr style={{ borderColor: '#e5e7eb' }} />

              {/* Status Badge */}
              <div className="flex justify-center">
                <div
                  className="px-6 py-3 rounded-xl text-lg font-bold flex items-center gap-2"
                  style={{ backgroundColor: STATUS_HEX_COLORS[status].bg, color: STATUS_HEX_COLORS[status].text }}
                >
                  <span className="text-2xl">{STATUS_EMOJI[status]}</span>
                  {status}
                </div>
              </div>

              {/* Measurements (if diagnosis data available) */}
              {(lowPressure !== undefined || highPressure !== undefined) && (
                <>
                  <hr style={{ borderColor: '#e5e7eb' }} />
                  <div className="rounded-xl p-4" style={{ backgroundColor: '#f9fafb' }}>
                    <p className="text-sm font-medium mb-2" style={{ color: '#4b5563' }}>측정값</p>
                    <div className="grid grid-cols-2 gap-4">
                      {lowPressure !== undefined && (
                        <div className="text-center">
                          <p className="text-xs" style={{ color: '#6b7280' }}>저압</p>
                          <p className="text-lg font-bold" style={{ color: '#2563eb' }}>
                            {lowPressure.toFixed(1)} kg/cm²G
                          </p>
                        </div>
                      )}
                      {highPressure !== undefined && (
                        <div className="text-center">
                          <p className="text-xs" style={{ color: '#6b7280' }}>고압</p>
                          <p className="text-lg font-bold" style={{ color: '#dc2626' }}>
                            {highPressure.toFixed(1)} kg/cm²G
                          </p>
                        </div>
                      )}
                    </div>
                    {refrigerant && (
                      <p className="text-center text-xs mt-2" style={{ color: '#6b7280' }}>
                        냉매: {refrigerant} | {facilityType}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Inspection Items */}
              {checkedInspectionItems.size > 0 && (
                <>
                  <hr style={{ borderColor: '#e5e7eb' }} />
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: '#4b5563' }}>점검 항목</p>
                    <div className="flex flex-wrap gap-1">
                      {getCheckedInspectionItemNames().map((name, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded"
                          style={{ backgroundColor: '#eef2ff', color: '#4338ca' }}
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Diagnosis Issues (if available) */}
              {diagnosisResult && diagnosisResult.issues.length > 0 && (
                <>
                  <hr style={{ borderColor: '#e5e7eb' }} />
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: '#4b5563' }}>진단 결과</p>
                    <ul className="text-sm space-y-1" style={{ color: '#374151' }}>
                      {diagnosisResult.issues.slice(0, 3).map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-0.5" style={{ color: '#6366f1' }}>•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Selected Issues */}
              {selectedIssues.size > 0 && (
                <>
                  <hr style={{ borderColor: '#e5e7eb' }} />
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: '#4b5563' }}>발견된 문제</p>
                    <ul className="text-sm space-y-1" style={{ color: '#374151' }}>
                      {getSelectedIssueItems().map((issue) => (
                        <li key={issue.id} className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: SEVERITY_HEX_DOT_COLORS[issue.severity] }}
                          />
                          <span>{issue.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Selected Recommendations */}
              {selectedRecommendations.size > 0 && (
                <>
                  <hr style={{ borderColor: '#e5e7eb' }} />
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: '#4b5563' }}>권장사항</p>
                    <ul className="text-sm space-y-1" style={{ color: '#374151' }}>
                      {getSelectedRecommendationItems().map((rec) => (
                        <li key={rec.id} className="flex items-center gap-2">
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: URGENCY_HEX_COLORS[rec.urgency].bg, color: URGENCY_HEX_COLORS[rec.urgency].text }}
                          >
                            {URGENCY_LABELS[rec.urgency]}
                          </span>
                          <span>{rec.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Remarks */}
              {remarks && (
                <>
                  <hr style={{ borderColor: '#e5e7eb' }} />
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: '#4b5563' }}>비고</p>
                    <p className="text-sm p-3 rounded-lg" style={{ color: '#374151', backgroundColor: '#f9fafb' }}>
                      {remarks}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4" style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
              <div className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium" style={{ color: '#1f2937' }}>
                    담당: {technicianName || '-'}
                  </p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>HVAC Mentor System</p>
                </div>
                <div className="text-right text-xs" style={{ color: '#6b7280' }}>
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
