import { useState } from 'react'
import { Search, BookOpen, FileText, Settings, Zap } from 'lucide-react'

// Data imports (same as App.tsx)
import { getFieldStandard } from '../data/fieldStandards'
import { getHighPressureTarget, calculateSuperheat, calculateSubcooling, calculateCompressionRatio, interpolatePT } from '../data/ptChart'

// Lib imports
import { diagnoseSystem } from '../lib/diagnosis'
import { getAIMentorResponse } from '../lib/gemini'

// Phone components
import PhoneDiagnosis from '../components/phone/PhoneDiagnosis'
import PhoneReference from '../components/phone/PhoneReference'
import PhoneReport from '../components/phone/PhoneReport'
import PhoneSettings from '../components/phone/PhoneSettings'
import PhoneElectric from '../components/phone/PhoneElectric'

type PhoneTab = 'diagnosis' | 'reference' | 'electric' | 'report' | 'settings'

interface PhoneLayoutProps {
  onDeviceChange: () => void
  onSwitchToCustomer?: () => void
}

export default function PhoneLayout({ onDeviceChange, onSwitchToCustomer }: PhoneLayoutProps) {
  const [activeTab, setActiveTab] = useState<PhoneTab>('diagnosis')

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

  // Derived values
  const fieldStd = getFieldStandard(refrigerant, facilityType)
  const { targetHighP } = getHighPressureTarget(refrigerant, ambientTemp)

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

  const tabs = [
    { id: 'diagnosis' as const, label: '진단', icon: Search },
    { id: 'reference' as const, label: '참고', icon: BookOpen },
    { id: 'electric' as const, label: '회로', icon: Zap },
    { id: 'report' as const, label: '보고서', icon: FileText },
    { id: 'settings' as const, label: '설정', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 flex items-center justify-between safe-area-top">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔧</span>
          <div>
            <h1 className="font-bold">HVAC 멘토</h1>
            <p className="text-xs text-white/70">{refrigerant} | {facilityType}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {onSwitchToCustomer && (
            <button
              onClick={onSwitchToCustomer}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 rounded-lg text-xs font-medium transition-colors"
            >
              👤 고객
            </button>
          )}
          <div className="text-right text-sm">
            <p className="text-white/80">외기 {ambientTemp}°C</p>
            <p className="text-white/60 text-xs">목표고압 {targetHighP}kg</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'diagnosis' && (
          <PhoneDiagnosis
            refrigerant={refrigerant}
            fieldStd={fieldStd}
            targetHighP={targetHighP}
            lowP={lowP}
            highP={highP}
            symptoms={symptoms}
            usePipeTemp={usePipeTemp}
            suctionTemp={suctionTemp}
            liquidTemp={liquidTemp}
            diagnosisResult={diagnosisResult}
            aiResponse={aiResponse}
            isLoading={isLoading}
            onLowPChange={setLowP}
            onHighPChange={setHighP}
            onSymptomsChange={setSymptoms}
            onUsePipeTempChange={setUsePipeTemp}
            onSuctionTempChange={setSuctionTemp}
            onLiquidTempChange={setLiquidTemp}
            onDiagnose={handleDiagnosis}
          />
        )}
        {activeTab === 'reference' && <PhoneReference />}
        {activeTab === 'electric' && <PhoneElectric />}
        {activeTab === 'report' && (
          <PhoneReport
            refrigerant={refrigerant}
            facilityType={facilityType}
            lowPressure={lowP}
            highPressure={highP}
            diagnosisResult={diagnosisResult}
          />
        )}
        {activeTab === 'settings' && (
          <PhoneSettings
            refrigerant={refrigerant}
            facilityType={facilityType}
            ambientTemp={ambientTemp}
            onRefrigerantChange={setRefrigerant}
            onFacilityTypeChange={setFacilityType}
            onAmbientTempChange={setAmbientTemp}
            onDeviceChange={onDeviceChange}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-bottom">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-2 ${
                activeTab === tab.id
                  ? 'text-indigo-600'
                  : 'text-slate-400'
              }`}
            >
              <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 1.5} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
