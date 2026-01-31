import { useState } from 'react'
import { ChevronDown, ChevronUp, BookOpen, AlertTriangle, CheckSquare, Syringe, Zap } from 'lucide-react'
import { FAULT_PATTERNS } from '../../data/faultPatterns'
import { EMERGENCY_MANUAL } from '../../data/emergency'
import { CHECKLIST } from '../../data/checklist'
import { CHARGING_GUIDE } from '../../data/chargingGuide'

type SectionId = 'faults' | 'emergency' | 'checklist' | 'charging' | 'electric'

export default function PhoneReference() {
  const [openSection, setOpenSection] = useState<SectionId | null>('faults')
  const [openItem, setOpenItem] = useState<string | null>(null)

  const toggleSection = (id: SectionId) => {
    setOpenSection(openSection === id ? null : id)
    setOpenItem(null)
  }

  const sections = [
    { id: 'faults' as const, label: '고장 패턴', icon: BookOpen, color: 'text-blue-600' },
    { id: 'emergency' as const, label: '비상 대응', icon: AlertTriangle, color: 'text-red-600' },
    { id: 'checklist' as const, label: '체크리스트', icon: CheckSquare, color: 'text-green-600' },
    { id: 'charging' as const, label: '충전 가이드', icon: Syringe, color: 'text-purple-600' },
    { id: 'electric' as const, label: '전기 회로', icon: Zap, color: 'text-yellow-600' },
  ]

  return (
    <div className="p-4 space-y-2">
      {sections.map((section) => (
        <div key={section.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Section Header */}
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <section.icon className={section.color} size={24} />
              <span className="font-bold text-slate-800">{section.label}</span>
            </div>
            {openSection === section.id ? <ChevronUp /> : <ChevronDown />}
          </button>

          {/* Section Content */}
          {openSection === section.id && (
            <div className="px-4 pb-4">
              {/* Fault Patterns */}
              {section.id === 'faults' && (
                <div className="space-y-2">
                  {Object.entries(FAULT_PATTERNS).map(([key, pattern]) => (
                    <div key={key} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenItem(openItem === key ? null : key)}
                        className="w-full p-3 text-left flex justify-between items-center bg-slate-50"
                      >
                        <span className="font-medium text-sm">{key}</span>
                        {openItem === key ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {openItem === key && (
                        <div className="p-3 space-y-3 text-sm">
                          <div>
                            <p className="text-slate-500 text-xs mb-1">원인</p>
                            <p>{pattern.원인.join(', ')}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-1">증상</p>
                            <p>{pattern.증상.join(', ')}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-1">조치</p>
                            <ul className="space-y-1">
                              {pattern.조치.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                          </div>
                          <div className="p-2 bg-yellow-50 rounded-lg">
                            <p className="text-yellow-800 text-xs">⚠️ {pattern.주의}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Emergency Manual */}
              {section.id === 'emergency' && (
                <div className="space-y-2">
                  {Object.entries(EMERGENCY_MANUAL).map(([key, item]) => (
                    <div key={key} className="border-l-4 border-red-500 bg-red-50 rounded-r-xl p-3">
                      <h4 className="font-bold text-red-800 mb-1">{key}</h4>
                      <p className="text-xs text-red-600 mb-2">{item.기준}</p>
                      <p className="text-sm text-red-700 mb-2">{item.위험}</p>
                      <div className="space-y-1 mb-2">
                        {item.즉시조치.map((a, i) => (
                          <p key={i} className="text-sm">{a}</p>
                        ))}
                      </div>
                      <p className="text-xs font-bold text-red-800">{item.금지사항}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Checklist */}
              {section.id === 'checklist' && (
                <div className="space-y-4">
                  {Object.entries(CHECKLIST).map(([category, items]) => (
                    <div key={category}>
                      <h4 className="font-medium text-green-700 mb-2 text-sm">{category}</h4>
                      <div className="space-y-2">
                        {items.map(([name, desc], i) => (
                          <label key={i} className="flex items-start gap-3 p-2 bg-slate-50 rounded-lg">
                            <input type="checkbox" className="mt-1 w-5 h-5 accent-green-600" />
                            <div>
                              <p className="font-medium text-sm">{name}</p>
                              <p className="text-xs text-slate-500">{desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Charging Guide */}
              {section.id === 'charging' && (
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-purple-700 mb-2">충전 전 준비</h4>
                    <ul className="space-y-1">
                      {CHARGING_GUIDE["충전 전 준비"].map((item, i) => (
                        <li key={i} className="text-slate-600">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-700 mb-2">냉매별 충전 방법</h4>
                    <div className="space-y-2">
                      {Object.entries(CHARGING_GUIDE["충전 방법"]).map(([ref, methods]) => (
                        <div key={ref} className="bg-purple-50 p-3 rounded-xl">
                          <p className="font-medium mb-1">{ref}</p>
                          <ul className="text-xs space-y-1">
                            {methods.map((m, i) => <li key={i}>{m}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl">
                    <h4 className="font-medium text-green-700 mb-2">충전 완료 기준</h4>
                    <ul className="text-xs space-y-1">
                      {CHARGING_GUIDE["충전 완료 기준"].map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Electric */}
              {section.id === 'electric' && (
                <div className="text-center py-4">
                  <p className="text-slate-500 text-sm">전기 회로 정보는 태블릿 모드에서 더 자세히 확인할 수 있습니다.</p>
                  <a href="/circuits/walk-in-diagram-1.jpg" target="_blank" className="inline-block mt-3 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                    📷 회로도 1 보기
                  </a>
                  <a href="/circuits/walk-in-diagram-2.jpg" target="_blank" className="inline-block mt-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm ml-2">
                    📷 회로도 2 보기
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
