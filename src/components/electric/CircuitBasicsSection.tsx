import { useState } from 'react'
import {
  CIRCUIT_SYMBOLS,
  CIRCUIT_READING_GUIDE,
  POWER_VS_CONTROL,
  type CircuitSymbol
} from '../../data/circuitLearning'

type BasicSubTab = 'symbols' | 'reading' | 'comparison'

const getCategoryColor = (category: CircuitSymbol['category']): string => {
  const colors = {
    power: 'bg-red-100 text-red-700 border-red-200',
    control: 'bg-blue-100 text-blue-700 border-blue-200',
    protection: 'bg-orange-100 text-orange-700 border-orange-200',
    sensor: 'bg-green-100 text-green-700 border-green-200',
    motor: 'bg-purple-100 text-purple-700 border-purple-200'
  }
  return colors[category]
}

const getCategoryLabel = (category: CircuitSymbol['category']): string => {
  const labels = {
    power: '전원',
    control: '제어',
    protection: '보호',
    sensor: '센서',
    motor: '모터'
  }
  return labels[category]
}

export default function CircuitBasicsSection() {
  const [activeSubTab, setActiveSubTab] = useState<BasicSubTab>('symbols')
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null)
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const subTabs = [
    { id: 'symbols', label: '회로 기호 읽기' },
    { id: 'reading', label: '회로도 읽는 순서' },
    { id: 'comparison', label: '동력 vs 제어회로' }
  ]

  const categories = ['all', 'power', 'control', 'protection', 'sensor', 'motor']
  const categoryLabels: Record<string, string> = {
    all: '전체', power: '전원', control: '제어',
    protection: '보호', sensor: '센서', motor: '모터'
  }

  const filteredSymbols = categoryFilter === 'all'
    ? CIRCUIT_SYMBOLS
    : CIRCUIT_SYMBOLS.filter(s => s.category === categoryFilter)

  return (
    <div className="space-y-4">
      {/* Sub-navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as BasicSubTab)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all min-h-[48px] ${
              activeSubTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Symbol Guide */}
      {activeSubTab === 'symbols' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">
              회로 기호를 하나씩 클릭하면 상세 설명과 현장 팁을 볼 수 있습니다.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all min-h-[40px] ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>

          {/* Symbols List */}
          <div className="space-y-2">
            {filteredSymbols.map(symbol => (
              <details
                key={symbol.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                open={expandedSymbol === symbol.id}
                onToggle={() => setExpandedSymbol(expandedSymbol === symbol.id ? null : symbol.id)}
              >
                <summary className="p-4 cursor-pointer hover:bg-gray-50 flex items-center gap-3 min-h-[56px]">
                  <span className="font-mono font-bold text-lg text-indigo-700 min-w-[60px]">
                    {symbol.symbol}
                  </span>
                  <span className="font-semibold">{symbol.name_kr}</span>
                  <span className="text-gray-500 text-sm">({symbol.name_en})</span>
                  <span className={`ml-auto px-2 py-0.5 rounded text-xs border ${getCategoryColor(symbol.category)}`}>
                    {getCategoryLabel(symbol.category)}
                  </span>
                </summary>
                <div className="p-4 pt-0 space-y-3 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">기능</p>
                    <p className="text-gray-700">{symbol.description}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500 mb-1">회로도에서 모양</p>
                    <p className="text-gray-700">{symbol.visualDescription}</p>
                  </div>
                  {symbol.fieldTip && (
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                      <p className="text-sm font-medium text-yellow-800 mb-1">현장 포인트</p>
                      <p className="text-yellow-900">{symbol.fieldTip}</p>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Reading Guide */}
      {activeSubTab === 'reading' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              회로도는 처음엔 복잡해 보이지만, 순서대로 따라가면 이해할 수 있습니다.
            </p>
          </div>

          <div className="space-y-3">
            {CIRCUIT_READING_GUIDE.map(step => (
              <details
                key={step.step}
                className="bg-white rounded-lg border border-gray-200"
                open={expandedStep === step.step}
                onToggle={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
              >
                <summary className="p-4 cursor-pointer hover:bg-gray-50 flex items-center gap-3 min-h-[56px]">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </span>
                  <span className="font-semibold text-gray-800">{step.title}</span>
                </summary>
                <div className="p-4 pt-0 space-y-3 border-t border-gray-100">
                  <p className="text-gray-700">{step.description}</p>
                  <div className="bg-gray-50 p-3 rounded space-y-1">
                    {step.tips.map((tip, i) => (
                      <p key={i} className="text-gray-600 text-sm flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">*</span>
                        {tip}
                      </p>
                    ))}
                  </div>
                  {step.example && (
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">예시: </span>{step.example}
                      </p>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Power vs Control Comparison */}
      {activeSubTab === 'comparison' && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-800 font-medium">
              동력회로는 모터를 돌리는 힘, 제어회로는 그 힘을 제어하는 두뇌입니다.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border-b font-semibold text-gray-700">구분</th>
                  <th className="p-3 text-left border-b font-semibold text-red-700">동력회로</th>
                  <th className="p-3 text-left border-b font-semibold text-blue-700">제어회로</th>
                </tr>
              </thead>
              <tbody>
                {POWER_VS_CONTROL.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3 border-b font-medium text-gray-800">{row.aspect}</td>
                    <td className="p-3 border-b text-gray-700">{row.powerCircuit}</td>
                    <td className="p-3 border-b text-gray-700">{row.controlCircuit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="font-medium text-yellow-800 mb-2">초보자 팁</p>
            <p className="text-yellow-900 text-sm">
              고장 시 동력회로 문제면 모터가 아예 안 돌고,
              제어회로 문제면 수동으로는 작동 가능한 경우가 많습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
