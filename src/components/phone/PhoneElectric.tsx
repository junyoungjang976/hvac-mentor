import { useState } from 'react'
import { ChevronDown, ChevronUp, Zap, BookOpen, Wrench, Search, HelpCircle, AlertTriangle } from 'lucide-react'
import { CIRCUIT_SYMBOLS, CIRCUIT_READING_GUIDE, MEASUREMENT_TOOLS_GUIDE, type MeasurementTool } from '../../data/circuitLearning'
import { ELECTRICAL_COMPONENTS, FAULT_DIAGNOSIS_POINTS, ELECTRICAL_SAFETY_RULES } from '../../data/electricCircuit'

type SubSection = 'symbols' | 'diagrams' | 'components' | 'diagnosis' | 'tools' | 'safety'

export default function PhoneElectric() {
  const [activeSection, setActiveSection] = useState<SubSection>('symbols')
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const sections = [
    { id: 'symbols' as const, label: '기호', icon: BookOpen },
    { id: 'diagrams' as const, label: '회로도', icon: Zap },
    { id: 'components' as const, label: '부품', icon: Search },
    { id: 'diagnosis' as const, label: '진단', icon: Wrench },
    { id: 'tools' as const, label: '측정', icon: HelpCircle },
    { id: 'safety' as const, label: '안전', icon: AlertTriangle },
  ]

  const filteredComponents = Object.entries(ELECTRICAL_COMPONENTS).filter(([code, comp]) =>
    code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.name_kr.includes(searchTerm) ||
    comp.name_en.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      {/* Section Tabs - Scrollable */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex overflow-x-auto px-2 py-2 gap-1 no-scrollbar">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === section.id
                  ? 'bg-yellow-500 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <section.icon size={16} />
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Symbols Section */}
        {activeSection === 'symbols' && (
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-slate-800 mb-4">📖 회로 기호 사전</h3>
            <p className="text-sm text-slate-600 mb-4">
              회로도를 읽으려면 먼저 기호를 알아야 합니다. 각 기호를 탭해서 자세히 알아보세요.
            </p>

            {CIRCUIT_SYMBOLS.map((symbol) => (
              <div
                key={symbol.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedItem(expandedItem === symbol.id ? null : symbol.id)}
                  className="w-full p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-mono bg-slate-100 w-12 h-12 flex items-center justify-center rounded-lg">
                      {symbol.symbol}
                    </span>
                    <div className="text-left">
                      <p className="font-bold text-slate-800">{symbol.name_kr}</p>
                      <p className="text-xs text-slate-500">{symbol.category}</p>
                    </div>
                  </div>
                  {expandedItem === symbol.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedItem === symbol.id && (
                  <div className="px-4 pb-4 space-y-3">
                    <p className="text-sm text-slate-600">{symbol.description}</p>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">회로도 표시</p>
                      <p className="text-sm text-slate-700">{symbol.visualDescription}</p>
                    </div>
                    {symbol.fieldTip && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <span className="font-bold">💡 현장 팁:</span> {symbol.fieldTip}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Reading Steps */}
            <h3 className="font-bold text-lg text-slate-800 mt-8 mb-4">📝 회로도 읽는 순서</h3>
            <div className="space-y-3">
              {CIRCUIT_READING_GUIDE.map((step) => (
                <div key={step.step} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step.step}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">{step.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                      {step.tips.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {step.tips.map((tip, i) => (
                            <p key={i} className="text-xs text-indigo-600">💡 {tip}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diagrams Section */}
        {activeSection === 'diagrams' && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-800 mb-2">📐 워크인 냉장고 회로도</h3>
            <p className="text-sm text-slate-600 mb-4">
              이미지를 탭하면 확대해서 볼 수 있습니다. 손가락으로 확대/축소하세요.
            </p>

            {/* Diagram 1 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h4 className="font-bold text-slate-800">동력 및 제어회로</h4>
                <p className="text-xs text-slate-500">Power & Control Circuit</p>
              </div>
              <a href="/circuits/walk-in-diagram-1.jpg" target="_blank" className="block">
                <img
                  src="/circuits/walk-in-diagram-1.jpg"
                  alt="동력 및 제어회로"
                  className="w-full"
                  loading="lazy"
                />
              </a>
              <div className="p-4 bg-slate-50">
                <p className="text-sm text-slate-600">
                  전체 전기 회로도. 동력 회로(압축기, 팬모터)와 제어 회로(TIC, DPS, MC) 포함.
                  아래에 제어판 외형도와 내부 배치도도 있습니다.
                </p>
              </div>
            </div>

            {/* Diagram 2 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h4 className="font-bold text-slate-800">상세 제어회로</h4>
                <p className="text-xs text-slate-500">Detailed Control Circuit</p>
              </div>
              <a href="/circuits/walk-in-diagram-2.jpg" target="_blank" className="block">
                <img
                  src="/circuits/walk-in-diagram-2.jpg"
                  alt="상세 제어회로"
                  className="w-full"
                  loading="lazy"
                />
              </a>
              <div className="p-4 bg-slate-50">
                <p className="text-sm text-slate-600">
                  TIC(온도조절기) 연결, 52C(압축기접촉기), F.HPC(고압차단) 상세.
                  단자대 배치와 배선 연결 확인용.
                </p>
              </div>
            </div>

            {/* Key Points */}
            <div className="bg-yellow-50 rounded-xl p-4">
              <h4 className="font-bold text-yellow-800 mb-2">📍 회로도 핵심 포인트</h4>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li>• <strong>N100/N200</strong>: 2개의 독립된 냉동 시스템</li>
                <li>• <strong>TIC (FOX-23A7)</strong>: 온도 설정 및 제어 핵심</li>
                <li>• <strong>52C</strong>: 압축기 전자접촉기 (MC와 동일 기능)</li>
                <li>• <strong>THR</strong>: 과부하 보호, 트립 시 수동 리셋 필요</li>
              </ul>
            </div>
          </div>
        )}

        {/* Components Section */}
        {activeSection === 'components' && (
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-slate-800 mb-2">📚 전기 부품 사전</h3>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="부품명 검색 (예: MC, 접촉기)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-base"
              />
            </div>

            {filteredComponents.map(([code, component]) => (
              <div
                key={code}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedItem(expandedItem === code ? null : code)}
                  className="w-full p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                      {component.code}
                    </span>
                    <div className="text-left">
                      <p className="font-bold text-slate-800">{component.name_kr}</p>
                      <p className="text-xs text-slate-500">{component.name_en}</p>
                    </div>
                  </div>
                  {expandedItem === code ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedItem === code && (
                  <div className="px-4 pb-4 space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">기능</p>
                      <p className="text-sm text-slate-700">{component.function}</p>
                    </div>
                    {component.spec && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 mb-1">사양</p>
                        <p className="text-sm text-blue-800">{component.spec}</p>
                      </div>
                    )}
                    {component.fieldTips && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-600 mb-1">📍 현장 팁</p>
                        <ul className="text-sm text-green-800 space-y-1">
                          {component.fieldTips.map((tip: string, i: number) => (
                            <li key={i}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Diagnosis Section */}
        {activeSection === 'diagnosis' && (
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-slate-800 mb-2">🔍 전기 고장 진단</h3>
            <p className="text-sm text-slate-600 mb-4">
              증상별로 점검 포인트와 해결 방법을 확인하세요.
            </p>

            {FAULT_DIAGNOSIS_POINTS.map((point, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedItem(expandedItem === `diag-${index}` ? null : `diag-${index}`)}
                  className="w-full p-4 flex items-center justify-between"
                >
                  <span className="font-bold text-red-700 text-left">{point.symptom}</span>
                  {expandedItem === `diag-${index}` ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedItem === `diag-${index}` && (
                  <div className="px-4 pb-4 space-y-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-2">✅ 점검 포인트</p>
                      <ul className="text-sm space-y-2">
                        {point.checkPoints.map((cp, i) => (
                          <li key={i} className="p-2 bg-slate-50 rounded-lg">{cp}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600 mb-2">📏 측정 방법</p>
                      <ul className="text-sm space-y-2">
                        {point.measurements.map((m, i) => (
                          <li key={i} className="p-2 bg-blue-50 rounded-lg text-blue-800">{m}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-600 mb-2">🔧 해결 방법</p>
                      <ul className="text-sm space-y-2">
                        {point.solutions.map((s, i) => (
                          <li key={i} className="p-2 bg-green-50 rounded-lg text-green-800">{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tools Section */}
        {activeSection === 'tools' && (
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-slate-800 mb-2">📏 측정 도구 사용법</h3>

            {MEASUREMENT_TOOLS_GUIDE.map((tool: MeasurementTool) => (
              <div
                key={tool.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedItem(expandedItem === `tool-${tool.id}` ? null : `tool-${tool.id}`)}
                  className="w-full p-4 flex items-center justify-between"
                >
                  <div className="text-left">
                    <p className="font-bold text-slate-800">{tool.name}</p>
                    <p className="text-xs text-slate-500">{tool.name_en}</p>
                  </div>
                  {expandedItem === `tool-${tool.id}` ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedItem === `tool-${tool.id}` && (
                  <div className="px-4 pb-4 space-y-3">
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-2">용도</p>
                      <p className="text-sm text-slate-700">{tool.purpose}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-2">사용 방법</p>
                      <ol className="text-sm space-y-2">
                        {tool.usage.map((step) => (
                          <li key={step.step} className="flex gap-2">
                            <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {step.step}
                            </span>
                            <div>
                              <span className="text-slate-700">{step.instruction}</span>
                              {step.caution && (
                                <p className="text-xs text-red-600 mt-1">⚠️ {step.caution}</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Safety Section */}
        {activeSection === 'safety' && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-800 mb-2">⚠️ 전기 작업 안전 수칙</h3>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-red-800 font-bold text-center mb-2">
                🚨 감전 사고는 생명을 위협합니다!
              </p>
              <p className="text-red-700 text-sm text-center">
                아래 안전 수칙을 반드시 준수하세요.
              </p>
            </div>

            <div className="space-y-3">
              {ELECTRICAL_SAFETY_RULES.map((rule, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-500"
                >
                  <p className="text-slate-800">{rule}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mt-6">
              <h4 className="font-bold text-blue-800 mb-2">💡 초보자 필수 체크</h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>☑️ 작업 전 전원 차단 확인 (NFB OFF)</li>
                <li>☑️ 검전기로 무전압 상태 확인</li>
                <li>☑️ 절연 장갑 착용</li>
                <li>☑️ 젖은 바닥에서 작업 금지</li>
                <li>☑️ 2인 1조 작업 권장</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
