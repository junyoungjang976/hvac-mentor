import { useState } from 'react'
import { MEASUREMENT_TOOLS_GUIDE } from '../../data/circuitLearning'

export default function MeasurementToolsSection() {
  const [selectedTool, setSelectedTool] = useState<string>('multimeter')
  const [expandedMeasurement, setExpandedMeasurement] = useState<string | null>(null)

  const currentTool = MEASUREMENT_TOOLS_GUIDE.find(t => t.id === selectedTool)

  return (
    <div className="space-y-4">
      {/* Tool Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {MEASUREMENT_TOOLS_GUIDE.map(tool => (
          <button
            key={tool.id}
            onClick={() => {
              setSelectedTool(tool.id)
              setExpandedMeasurement(null)
            }}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all min-h-[48px] ${
              selectedTool === tool.id
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tool.name}
          </button>
        ))}
      </div>

      {currentTool && (
        <div className="space-y-4">
          {/* Tool Header */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h3 className="font-bold text-teal-800 text-lg">{currentTool.name}</h3>
            <p className="text-teal-700 text-sm">{currentTool.name_en}</p>
            <p className="text-teal-900 mt-2">{currentTool.purpose}</p>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-800 mb-3">주요 사양</h4>
            <ul className="space-y-1">
              {currentTool.specifications.map((spec, i) => (
                <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                  <span className="text-teal-500">*</span>
                  {spec}
                </li>
              ))}
            </ul>
          </div>

          {/* Usage Steps */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-800 mb-3">사용 방법</h4>
            <div className="space-y-3">
              {currentTool.usage.map(step => (
                <div key={step.step} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800">{step.instruction}</p>
                    {step.caution && (
                      <p className="text-orange-700 text-sm mt-1 bg-orange-50 p-2 rounded">
                        ! {step.caution}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Measurements */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-800 mb-3">주요 측정 항목</h4>
            <div className="space-y-2">
              {currentTool.commonMeasurements.map((measurement, i) => (
                <details
                  key={i}
                  className="bg-gray-50 rounded-lg"
                  open={expandedMeasurement === measurement.target}
                  onToggle={() => setExpandedMeasurement(
                    expandedMeasurement === measurement.target ? null : measurement.target
                  )}
                >
                  <summary className="p-3 cursor-pointer hover:bg-gray-100 rounded-lg font-medium text-gray-800 min-h-[48px] flex items-center">
                    {measurement.target}
                  </summary>
                  <div className="p-3 pt-0 space-y-2 text-sm">
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <p className="text-gray-500 text-xs mb-1">측정 방법</p>
                      <p className="text-gray-700">{measurement.method}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded border border-green-200">
                      <p className="text-green-600 text-xs mb-1">정상 범위</p>
                      <p className="text-green-800 font-medium">{measurement.normalRange}</p>
                    </div>
                    <div className="bg-red-50 p-2 rounded border border-red-200">
                      <p className="text-red-600 text-xs mb-1">이상 시 조치</p>
                      <p className="text-red-800">{measurement.abnormalAction}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Safety Warnings */}
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
            <h4 className="font-bold text-red-800 mb-2">안전 주의사항</h4>
            <ul className="space-y-1">
              {currentTool.safetyWarnings.map((warning, i) => (
                <li key={i} className="text-red-900 text-sm flex items-start gap-2">
                  <span className="text-red-500 font-bold">!</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>

          {/* Field Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">현장 팁</h4>
            <ul className="space-y-1">
              {currentTool.fieldTips.map((tip, i) => (
                <li key={i} className="text-yellow-900 text-sm flex items-start gap-2">
                  <span className="text-yellow-600">*</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Video Placeholder */}
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <div className="text-gray-400 mb-2">[ 동영상 가이드 ]</div>
            <p className="text-gray-500 text-sm">
              {currentTool.name} 사용법 동영상이 추가될 예정입니다
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
