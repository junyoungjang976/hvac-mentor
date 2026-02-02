'use client'

import { useState } from 'react'
import {
  Power,
  Thermometer,
  Volume2,
  Snowflake,
  Droplet,
  DoorOpen,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  type LucideIcon
} from 'lucide-react'
import { symptomCategories, type Symptom } from '../../data/customerDiagnosis'

interface SymptomSelectProps {
  selectedSymptoms: string[]
  onToggle: (symptomId: string) => void
}

const iconMap: Record<string, LucideIcon> = {
  'power': Power,
  'thermometer': Thermometer,
  'volume': Volume2,
  'snowflake': Snowflake,
  'droplet': Droplet,
  'door': DoorOpen
}

const severityColors = {
  low: 'bg-blue-50 border-blue-200 text-blue-700',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  high: 'bg-orange-50 border-orange-200 text-orange-700',
  critical: 'bg-red-50 border-red-200 text-red-700'
}

const severityLabels = {
  low: '낮음',
  medium: '보통',
  high: '높음',
  critical: '긴급'
}

export default function SymptomSelect({ selectedSymptoms, onToggle }: SymptomSelectProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(symptomCategories.map(cat => cat.id))
  )

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const renderSymptomCard = (symptom: Symptom) => {
    const isSelected = selectedSymptoms.includes(symptom.id)

    return (
      <button
        key={symptom.id}
        onClick={() => onToggle(symptom.id)}
        className={`
          w-full text-left p-4 rounded-lg border-2 transition-all
          ${
            isSelected
              ? 'bg-teal-50 border-teal-500 shadow-md'
              : 'bg-white border-gray-200 hover:border-teal-300 hover:shadow-sm'
          }
        `}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-bold ${isSelected ? 'text-teal-900' : 'text-gray-900'}`}>
                {symptom.name}
              </h4>
              {isSelected && (
                <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
            <p className={`text-sm mb-2 ${isSelected ? 'text-teal-700' : 'text-gray-600'}`}>
              {symptom.description}
            </p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${severityColors[symptom.severity]}`}>
              긴급도: {severityLabels[symptom.severity]}
            </span>
          </div>
        </div>
      </button>
    )
  }

  const renderCategory = (category: typeof symptomCategories[0]) => {
    const Icon = iconMap[category.icon] || Power
    const isExpanded = expandedCategories.has(category.id)
    const selectedInCategory = category.symptoms.filter(s => selectedSymptoms.includes(s.id)).length

    return (
      <div key={category.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Category Header */}
        <button
          onClick={() => toggleCategory(category.id)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
              {selectedInCategory > 0 && (
                <p className="text-sm text-teal-600">
                  {selectedInCategory}개 선택됨
                </p>
              )}
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Symptoms List */}
        {isExpanded && (
          <div className="p-4 space-y-3">
            {category.symptoms.map(symptom => renderSymptomCard(symptom))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          어떤 증상이 있나요?
        </h2>
        <p className="text-gray-600">
          현재 나타나는 모든 증상을 선택해주세요. (여러 개 선택 가능)
        </p>
      </div>

      {/* Selection Summary */}
      {selectedSymptoms.length > 0 && (
        <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-teal-900">
                {selectedSymptoms.length}개의 증상이 선택되었습니다
              </p>
              <p className="text-sm text-teal-700 mt-1">
                선택한 증상에 대해 추가 질문을 드립니다
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Categories Accordion */}
      <div className="space-y-4">
        {symptomCategories.map(category => renderCategory(category))}
      </div>

      {/* Help Text */}
      <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">증상 선택 팁</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 정확한 진단을 위해 나타나는 모든 증상을 선택해주세요</li>
              <li>• 확실하지 않은 증상은 선택하지 않아도 됩니다</li>
              <li>• 긴급도가 높은 증상이 있다면 빠른 조치가 필요합니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
