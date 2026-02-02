import { useState } from 'react'
import {
  Zap,
  Wind,
  DoorClosed,
  Thermometer,
  Home,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { selfCheckItems, type SelfCheckItem } from '../../data/customerDiagnosis'

interface SelfCheckGuideProps {
  checkResults: Record<string, boolean>
  onToggle: (checkItemId: string) => void
}

const iconMap: Record<string, typeof Zap> = {
  'power-plug': Zap,
  'air-filter': Wind,
  'door-closed': DoorClosed,
  'thermostat': Thermometer,
  'home-thermometer': Home
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700'
}

const difficultyLabels = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움'
}

const illustrationGradients = {
  'power-check': 'from-amber-100 to-orange-100',
  'filter-condenser-check': 'from-blue-100 to-cyan-100',
  'door-seal-check': 'from-purple-100 to-pink-100',
  'temperature-setting-check': 'from-red-100 to-rose-100',
  'environment-check': 'from-green-100 to-emerald-100'
}

export default function SelfCheckGuide({ checkResults, onToggle }: SelfCheckGuideProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const renderCheckItem = (item: SelfCheckItem) => {
    const Icon = iconMap[item.icon] || Zap
    const isExpanded = expandedItems.has(item.id)
    const isChecked = checkResults[item.id] || false
    const gradient = illustrationGradients[item.id as keyof typeof illustrationGradients] || 'from-gray-100 to-gray-200'

    return (
      <div
        key={item.id}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
      >
        {/* Header */}
        <div className="p-6">
          {/* Illustration */}
          <div className={`w-full h-32 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4`}>
            <Icon className="w-16 h-16 text-gray-400" />
          </div>

          {/* Title and metadata */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>

              {/* Meta info */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{item.estimatedTime}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[item.difficulty]}`}>
                  {difficultyLabels[item.difficulty]}
                </span>
              </div>
            </div>
          </div>

          {/* Expand button */}
          <button
            onClick={() => toggleExpand(item.id)}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-5 h-5" />
                <span>점검 항목 숨기기</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" />
                <span>점검 항목 보기</span>
              </>
            )}
          </button>
        </div>

        {/* Expandable check points */}
        {isExpanded && (
          <div className="px-6 pb-6 pt-2 border-t border-gray-100">
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  아래 항목들을 순서대로 확인하시면서 체크해주세요. 천천히 안전하게 진행하세요.
                </p>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {item.checkPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-sm leading-relaxed">{point.replace(/^\d+\.\s*/, '')}</span>
                </li>
              ))}
            </ul>

            {/* Checkbox */}
            <button
              onClick={() => onToggle(item.id)}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isChecked
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isChecked ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>확인 완료</span>
                </>
              ) : (
                <>
                  <Circle className="w-5 h-5" />
                  <span>확인 완료 표시</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">셀프 점검 가이드</h2>
        <p className="text-gray-600">
          전문가 방문 전에 직접 확인할 수 있는 항목들입니다. 각 항목을 펼쳐서 단계별로 확인해보세요.
        </p>
      </div>

      <div className="space-y-6">
        {selfCheckItems.map(item => renderCheckItem(item))}
      </div>

      {/* Summary */}
      <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">확인 완료: {Object.values(checkResults).filter(Boolean).length}/{selfCheckItems.length}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              모든 항목을 확인하신 후에도 문제가 해결되지 않으면 전문 기술자에게 문의하시는 것을 권장합니다.
              안전과 관련된 문제(전기, 가스 누출 등)는 즉시 전문가에게 연락하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
