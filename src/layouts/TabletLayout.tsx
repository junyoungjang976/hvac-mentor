import { useState } from 'react'
import { Search, FileText, BookOpen, AlertTriangle, CheckSquare, Syringe, Zap, Smartphone } from 'lucide-react'

// Data imports
import { getFieldStandard, REFRIGERANT_INFO } from '../data/fieldStandards'
import { getHighPressureTarget, calculateSuperheat, calculateSubcooling, calculateCompressionRatio, interpolatePT } from '../data/ptChart'
import { FAULT_PATTERNS } from '../data/faultPatterns'
import { EMERGENCY_MANUAL } from '../data/emergency'
import { CHECKLIST } from '../data/checklist'
import { CHARGING_GUIDE } from '../data/chargingGuide'

// Lib imports
import { diagnoseSystem, generateReportText } from '../lib/diagnosis'
import { getAIMentorResponse } from '../lib/gemini'

// Tab components
import ElectricTab from '../components/tabs/ElectricTab'
import ReportTab from '../components/tabs/ReportTab'

type TabType = 'diagnosis' | 'report' | 'faults' | 'emergency' | 'checklist' | 'charging' | 'electric'

interface TabletLayoutProps {
  onDeviceChange: () => void
}

export default function TabletLayout({ onDeviceChange }: TabletLayoutProps) {
  // Settings state
  const [refrigerant, setRefrigerant] = useState<'R-22' | 'R-404A' | 'R-134a'>('R-22')
  const [facilityType, setFacilityType] = useState('냉장 (0°C)')
  const [ambientTemp, setAmbientTemp] = useState(30)

  // Measurement state
  const [lowP, setLowP] = useState(2.0)
  const [highP, setHighP] = useState(12.0)
  const [usePipeTemp, setUsePipeTemp] = useState(false)
  const [suctionTemp, setSuctionTemp] = useState(0)
  const [liquidTemp, setLiquidTemp] = useState(35)
  const [symptoms, setSymptoms] = useState<string[]>([])

  // Results state
  const [diagnosisResult, setDiagnosisResult] = useState<ReturnType<typeof diagnoseSystem> | null>(null)
  const [aiResponse, setAiResponse] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  // UI state
  const [activeTab, setActiveTab] = useState<TabType>('diagnosis')

  // Derived values
  const fieldStd = getFieldStandard(refrigerant, facilityType)
  const { targetHighP } = getHighPressureTarget(refrigerant, ambientTemp)

  const facilityOptions = refrigerant === 'R-134a'
    ? ['냉장 (테이블냉장고)', '냉동 (테이블냉동고)']
    : ['냉장 (0°C)', '냉동 (-20°C)', '초저온 (-35°C)']

  const handleSymptomToggle = (symptom: string) => {
    setSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    )
  }

  const handleDiagnosis = async () => {
    setIsLoading(true)
    let superheat: number | undefined
    let subcooling: number | undefined
    let evapTemp = interpolatePT(refrigerant, lowP, 'press_to_temp')
    let condTemp = interpolatePT(refrigerant, highP, 'press_to_temp')

    if (usePipeTemp) {
      const sh = calculateSuperheat(refrigerant, lowP, suctionTemp)
      const sc = calculateSubcooling(refrigerant, highP, liquidTemp)
      superheat = sh.superheat
      subcooling = sc.subcooling
      evapTemp = sh.evapTemp
      condTemp = sc.condTemp
    }

    const compRatio = calculateCompressionRatio(lowP, highP)
    const result = diagnoseSystem(refrigerant, lowP, highP, fieldStd, targetHighP, superheat, subcooling, compRatio, symptoms)
    setDiagnosisResult(result)

    try {
      const response = await getAIMentorResponse({
        refrigerant, facilityType, ambientTemp,
        lowPressure: lowP, highPressure: highP, targetHighPressure: targetHighP,
        fieldStandard: fieldStd, evapTemp, condTemp, superheat, compressionRatio: compRatio,
        symptoms, issues: result.issues
      })
      setAiResponse(response)
    } catch {
      setAiResponse('AI 응답을 가져오지 못했습니다.')
    }
    setIsLoading(false)
  }

  const handleDownloadReport = () => {
    if (!diagnosisResult) return
    let superheat: number | undefined
    let subcooling: number | undefined
    if (usePipeTemp) {
      superheat = calculateSuperheat(refrigerant, lowP, suctionTemp).superheat
      subcooling = calculateSubcooling(refrigerant, highP, liquidTemp).subcooling
    }
    const reportText = generateReportText(diagnosisResult, refrigerant, facilityType, lowP, highP, targetHighP, fieldStd, superheat, subcooling)
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hvac_report_${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'diagnosis', label: '진단', icon: Search },
    { id: 'report', label: '고객 보고서', icon: FileText },
    { id: 'faults', label: '고장 패턴', icon: BookOpen },
    { id: 'emergency', label: '비상 대응', icon: AlertTriangle },
    { id: 'checklist', label: '체크리스트', icon: CheckSquare },
    { id: 'charging', label: '충전 가이드', icon: Syringe },
    { id: 'electric', label: '전기 회로', icon: Zap },
  ]

  const severityEmoji: Record<string, string> = {
    '정상': '🟢', '주의': '🟡', '경고': '🟠', '위험': '🔴'
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="gradient-header text-white p-6 rounded-b-3xl shadow-xl mx-4 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">🔧 AI HVAC 현장 멘토</h1>
            <p className="text-white/80 mt-1">PDF 검증 P-T 차트 | 실시간 진단 | AI 멘토링</p>
          </div>
          <button
            onClick={onDeviceChange}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
          >
            <Smartphone size={20} />
            <span className="text-sm">스마트폰 모드</span>
          </button>
        </div>
      </header>

      <div className="flex gap-4 p-4">
        {/* Sidebar */}
        <aside className="w-72 gradient-sidebar rounded-2xl p-4 text-white shrink-0">
          <div className="text-center mb-4">
            <span className="text-4xl">🔧</span>
            <h2 className="text-lg font-bold mt-2">HVAC 멘토</h2>
            <p className="text-gray-400 text-sm">v2.0 태블릿</p>
          </div>
          <hr className="border-gray-600 my-4" />
          {/* Refrigerant */}
          <label className="block text-teal-400 font-bold text-sm mb-1">🧪 냉매 선택</label>
          <select
            value={refrigerant}
            onChange={(e) => setRefrigerant(e.target.value as 'R-22' | 'R-404A' | 'R-134a')}
            className="w-full p-2 rounded-lg bg-gray-700 text-white mb-4"
          >
            <option>R-22</option>
            <option>R-404A</option>
            <option>R-134a</option>
          </select>
          {/* Facility */}
          <label className="block text-teal-400 font-bold text-sm mb-1">🏭 설비 용도</label>
          <div className="space-y-1 mb-4">
            {facilityOptions.map(opt => (
              <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="facility" checked={facilityType === opt} onChange={() => setFacilityType(opt)} className="accent-teal-500" />
                {opt}
              </label>
            ))}
          </div>
          {/* Standard Range */}
          <div className="bg-teal-900/30 p-3 rounded-lg mb-4">
            <p className="text-teal-400 font-bold text-sm">📊 {refrigerant} 정상 범위</p>
            <p className="text-xl font-bold">{fieldStd.low_p_range[0]} ~ {fieldStd.low_p_range[1]} kg/cm²G</p>
          </div>
          <hr className="border-gray-600 my-4" />
          {/* Ambient Temp */}
          <label className="block text-orange-400 font-bold text-sm mb-1">🌤️ 외기온도</label>
          <input type="number" value={ambientTemp} onChange={(e) => setAmbientTemp(Number(e.target.value))} className="w-full p-2 rounded-lg bg-gray-700 text-white mb-2" />
          <div className="bg-orange-900/30 p-3 rounded-lg mb-4">
            <p className="text-orange-400 font-bold text-sm">🎯 목표 고압</p>
            <p className="text-xl font-bold">{targetHighP} kg/cm²G</p>
          </div>
          <hr className="border-gray-600 my-4" />
          {/* Pipe Temps */}
          <label className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-2 cursor-pointer">
            <input type="checkbox" checked={usePipeTemp} onChange={(e) => setUsePipeTemp(e.target.checked)} className="accent-purple-500" />
            🌡️ 배관 온도 입력
          </label>
          {usePipeTemp && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label className="text-xs text-gray-400">흡입관</label>
                <input type="number" value={suctionTemp} onChange={(e) => setSuctionTemp(Number(e.target.value))} className="w-full p-2 rounded-lg bg-gray-700 text-white text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-400">액관</label>
                <input type="number" value={liquidTemp} onChange={(e) => setLiquidTemp(Number(e.target.value))} className="w-full p-2 rounded-lg bg-gray-700 text-white text-sm" />
              </div>
            </div>
          )}
          {/* Refrigerant Info */}
          <div className="mt-4 text-xs text-gray-400">
            <p>오일: {REFRIGERANT_INFO[refrigerant].oil}</p>
            <p>특이사항: {REFRIGERANT_INFO[refrigerant].note}</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Tabs */}
          <div className="flex gap-2 bg-white p-2 rounded-xl shadow mb-4 flex-wrap">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)} className={`tab-btn flex items-center gap-1 ${activeTab === tab.id ? 'active' : ''}`}>
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'diagnosis' && (
            <div className="space-y-4">
              {/* Pressure Input Card */}
              <div className="card">
                <h3 className="text-lg font-bold mb-4">1️⃣ 압력 입력</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">🔵 저압 ({fieldStd.low_p_range[0]}~{fieldStd.low_p_range[1]} kg)</label>
                    <input type="number" step="0.1" value={lowP} onChange={(e) => setLowP(Number(e.target.value))} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">🔴 고압 (목표 {targetHighP} kg)</label>
                    <input type="number" step="0.5" value={highP} onChange={(e) => setHighP(Number(e.target.value))} className="input-field" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">현장 증상</label>
                  <div className="flex gap-4 flex-wrap">
                    {['헌팅', '배관 성에', '액면계 거품', '압축기 소음'].map(s => (
                      <label key={s} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={symptoms.includes(s)} onChange={() => handleSymptomToggle(s)} className="accent-indigo-500" />
                        <span className="text-sm">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button onClick={handleDiagnosis} disabled={isLoading} className="btn-primary w-full mt-6">
                  {isLoading ? '⏳ 분석 중...' : '🚀 진단 시작'}
                </button>
              </div>

              {/* Results */}
              {diagnosisResult && (
                <>
                  <div className="card">
                    <h3 className="text-lg font-bold mb-4">2️⃣ 진단 결과</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">{severityEmoji[diagnosisResult.severity]}</span>
                      <span className="text-xl font-bold">상태: {diagnosisResult.severity}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="metric-card">
                        <p className="text-sm text-gray-500">저압</p>
                        <p className="text-xl font-bold">{lowP.toFixed(2)} kg</p>
                        <p className={`text-sm ${diagnosisResult.diffLow > 0.2 || diagnosisResult.diffLow < -0.2 ? 'text-red-500' : 'text-green-500'}`}>
                          {diagnosisResult.diffLow > 0 ? '+' : ''}{diagnosisResult.diffLow}
                        </p>
                      </div>
                      <div className="metric-card">
                        <p className="text-sm text-gray-500">고압</p>
                        <p className="text-xl font-bold">{highP.toFixed(1)} kg</p>
                        <p className={`text-sm ${Math.abs(diagnosisResult.diffHigh) > 2 ? 'text-red-500' : 'text-green-500'}`}>
                          {diagnosisResult.diffHigh > 0 ? '+' : ''}{diagnosisResult.diffHigh}
                        </p>
                      </div>
                      {usePipeTemp && (
                        <div className="metric-card">
                          <p className="text-sm text-gray-500">과열도</p>
                          <p className="text-xl font-bold">{calculateSuperheat(refrigerant, lowP, suctionTemp).superheat}°C</p>
                        </div>
                      )}
                      <div className="metric-card">
                        <p className="text-sm text-gray-500">압축비</p>
                        <p className="text-xl font-bold">{calculateCompressionRatio(lowP, highP)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-bold mb-4">3️⃣ 진단 내용</h3>
                    <div className="space-y-2 mb-4">
                      {diagnosisResult.issues.map((issue, i) => <p key={i} className="text-lg">{issue}</p>)}
                    </div>
                    {diagnosisResult.actions.length > 0 && (
                      <>
                        <h4 className="font-bold text-gray-700 mt-4 mb-2">📋 조치사항:</h4>
                        <ul className="space-y-1">
                          {diagnosisResult.actions.map((action, i) => <li key={i} className="text-gray-600">{action}</li>)}
                        </ul>
                      </>
                    )}
                    {diagnosisResult.patternKey && FAULT_PATTERNS[diagnosisResult.patternKey] && (
                      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                        <p className="font-bold text-yellow-800">⚠️ {FAULT_PATTERNS[diagnosisResult.patternKey].주의}</p>
                      </div>
                    )}
                    <button onClick={handleDownloadReport} className="mt-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                      📄 진단 리포트 다운로드
                    </button>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-bold mb-4">4️⃣ AI 멘토 가이드</h3>
                    {aiResponse ? (
                      <div className="prose max-w-none">
                        {aiResponse.includes('@@@') ? (
                          <>
                            <div className="p-4 bg-yellow-50 rounded-lg mb-4">
                              <h4 className="font-bold text-yellow-800 mb-2">👷 작업 지시</h4>
                              <div className="whitespace-pre-wrap">{aiResponse.split('@@@')[0]}</div>
                            </div>
                            <details className="bg-blue-50 rounded-lg">
                              <summary className="p-4 cursor-pointer font-bold text-blue-800">🎓 원리 설명 (클릭하여 펼치기)</summary>
                              <div className="p-4 pt-0 whitespace-pre-wrap">{aiResponse.split('@@@')[1]}</div>
                            </details>
                          </>
                        ) : (
                          <div className="whitespace-pre-wrap">{aiResponse}</div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">AI 응답을 기다리는 중...</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'report' && (
            <ReportTab refrigerant={refrigerant} facilityType={facilityType} lowPressure={lowP} highPressure={highP} diagnosisResult={diagnosisResult} />
          )}

          {activeTab === 'faults' && (
            <div className="card">
              <h3 className="text-lg font-bold mb-4">📚 고장 패턴 사전</h3>
              <div className="space-y-4">
                {Object.entries(FAULT_PATTERNS).map(([key, pattern]) => (
                  <details key={key} className="bg-gray-50 rounded-lg">
                    <summary className="p-4 cursor-pointer font-bold hover:bg-gray-100 rounded-lg">{key}</summary>
                    <div className="p-4 pt-0 space-y-3">
                      <div><p className="font-semibold text-gray-700">가능한 원인:</p><p className="text-gray-600">{pattern.원인.join(', ')}</p></div>
                      <div><p className="font-semibold text-gray-700">동반 증상:</p><p className="text-gray-600">{pattern.증상.join(', ')}</p></div>
                      <div><p className="font-semibold text-gray-700">조치사항:</p><ul className="text-gray-600 list-none">{pattern.조치.map((a, i) => <li key={i}>{a}</li>)}</ul></div>
                      <div className="p-3 bg-yellow-100 rounded-lg"><p className="font-semibold text-yellow-800">⚠️ {pattern.주의}</p></div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="card">
              <h3 className="text-lg font-bold mb-4">🚨 비상 대응 매뉴얼</h3>
              <div className="space-y-4">
                {Object.entries(EMERGENCY_MANUAL).map(([key, item]) => (
                  <div key={key} className="border-l-4 border-red-500 pl-4 py-2">
                    <h4 className="font-bold text-lg">{key}</h4>
                    <p className="text-sm text-gray-600 mb-2">기준: {item.기준}</p>
                    <p className="text-red-600 font-semibold mb-2">{item.위험}</p>
                    <div className="mb-2"><p className="font-semibold">즉시 조치:</p><ul className="text-gray-700 list-none">{item.즉시조치.map((a, i) => <li key={i}>{a}</li>)}</ul></div>
                    <p className="text-red-700 font-bold">{item.금지사항}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="card">
              <h3 className="text-lg font-bold mb-4">✅ 정비 체크리스트</h3>
              <div className="space-y-6">
                {Object.entries(CHECKLIST).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="font-bold text-indigo-600 mb-2">{category}</h4>
                    <div className="space-y-2">
                      {items.map(([name, desc], i) => (
                        <label key={i} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input type="checkbox" className="mt-1 accent-indigo-500" />
                          <div><p className="font-medium">{name}</p><p className="text-sm text-gray-500">{desc}</p></div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'charging' && (
            <div className="card">
              <h3 className="text-lg font-bold mb-4">💉 냉매 충전 가이드</h3>
              <div className="space-y-6">
                <div><h4 className="font-bold text-indigo-600 mb-2">충전 전 준비</h4><ul className="space-y-1">{CHARGING_GUIDE["충전 전 준비"].map((item, i) => <li key={i} className="text-gray-700">{item}</li>)}</ul></div>
                <div>
                  <h4 className="font-bold text-indigo-600 mb-2">냉매별 충전 방법</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(CHARGING_GUIDE["충전 방법"]).map(([ref, methods]) => (
                      <div key={ref} className="bg-gray-50 p-3 rounded-lg"><p className="font-bold mb-2">{ref}</p><ul className="text-sm space-y-1">{methods.map((m, i) => <li key={i}>{m}</li>)}</ul></div>
                    ))}
                  </div>
                </div>
                <div><h4 className="font-bold text-indigo-600 mb-2">충전 중 확인</h4><ul className="space-y-1">{CHARGING_GUIDE["충전 중 확인"].map((item, i) => <li key={i} className="text-gray-700">{item}</li>)}</ul></div>
                <div className="bg-green-50 p-4 rounded-lg"><h4 className="font-bold text-green-700 mb-2">충전 완료 기준</h4><ul className="space-y-1">{CHARGING_GUIDE["충전 완료 기준"].map((item, i) => <li key={i} className="text-green-800">{item}</li>)}</ul></div>
                <div className="bg-red-50 p-4 rounded-lg"><h4 className="font-bold text-red-700 mb-2">주의사항</h4><ul className="space-y-1">{CHARGING_GUIDE["주의사항"].map((item, i) => <li key={i} className="text-red-800">{item}</li>)}</ul></div>
              </div>
            </div>
          )}

          {activeTab === 'electric' && <ElectricTab />}
        </main>
      </div>

      {/* Footer */}
      <footer className="text-center p-4 text-gray-500 text-sm border-t mt-8">
        Made with ❤️ | HVAC Mentor v2.0 | Busungtk System
      </footer>
    </div>
  )
}
