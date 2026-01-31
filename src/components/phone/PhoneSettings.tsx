import { Smartphone, Tablet } from 'lucide-react'
import { REFRIGERANT_INFO } from '../../data/fieldStandards'

interface PhoneSettingsProps {
  refrigerant: 'R-22' | 'R-404A' | 'R-134a'
  facilityType: string
  ambientTemp: number
  onRefrigerantChange: (v: 'R-22' | 'R-404A' | 'R-134a') => void
  onFacilityTypeChange: (v: string) => void
  onAmbientTempChange: (v: number) => void
  onDeviceChange: () => void
}

export default function PhoneSettings({
  refrigerant,
  facilityType,
  ambientTemp,
  onRefrigerantChange,
  onFacilityTypeChange,
  onAmbientTempChange,
  onDeviceChange,
}: PhoneSettingsProps) {
  const facilityOptions = refrigerant === 'R-134a'
    ? ['냉장 (테이블냉장고)', '냉동 (테이블냉동고)']
    : ['냉장 (0°C)', '냉동 (-20°C)', '초저온 (-35°C)']

  return (
    <div className="p-4 space-y-4">
      {/* Refrigerant Selection */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-xl">🧪</span> 냉매 선택
        </h3>
        <div className="space-y-2">
          {(['R-22', 'R-404A', 'R-134a'] as const).map((ref) => (
            <button
              key={ref}
              onClick={() => onRefrigerantChange(ref)}
              className={`w-full p-4 rounded-xl flex items-center justify-between ${
                refrigerant === ref
                  ? 'bg-indigo-100 border-2 border-indigo-500'
                  : 'bg-slate-50 border-2 border-transparent'
              }`}
            >
              <div className="text-left">
                <p className={`font-bold ${refrigerant === ref ? 'text-indigo-700' : 'text-slate-700'}`}>
                  {ref}
                </p>
                <p className="text-xs text-slate-500">{REFRIGERANT_INFO[ref].note}</p>
              </div>
              {refrigerant === ref && (
                <span className="text-indigo-600 text-xl">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Facility Type */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-xl">🏭</span> 설비 용도
        </h3>
        <div className="space-y-2">
          {facilityOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => onFacilityTypeChange(opt)}
              className={`w-full p-4 rounded-xl text-left ${
                facilityType === opt
                  ? 'bg-teal-100 border-2 border-teal-500 text-teal-700 font-bold'
                  : 'bg-slate-50 border-2 border-transparent text-slate-700'
              }`}
            >
              {facilityType === opt && '✓ '}{opt}
            </button>
          ))}
        </div>
      </div>

      {/* Ambient Temperature */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-xl">🌤️</span> 외기 온도
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onAmbientTempChange(Math.max(-10, ambientTemp - 1))}
            className="w-14 h-14 bg-slate-100 rounded-xl text-2xl font-bold active:bg-slate-200"
          >−</button>
          <div className="flex-1 text-center">
            <span className="text-4xl font-bold text-slate-800">{ambientTemp}</span>
            <span className="text-xl text-slate-500 ml-1">°C</span>
          </div>
          <button
            onClick={() => onAmbientTempChange(Math.min(50, ambientTemp + 1))}
            className="w-14 h-14 bg-slate-100 rounded-xl text-2xl font-bold active:bg-slate-200"
          >+</button>
        </div>
      </div>

      {/* Device Change */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-xl">📱</span> 디바이스 설정
        </h3>
        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl mb-3">
          <Smartphone className="text-indigo-600" size={24} />
          <div className="flex-1">
            <p className="font-medium text-slate-800">현재: 스마트폰 모드</p>
            <p className="text-xs text-slate-500">이동 중 빠른 진단에 최적화</p>
          </div>
        </div>
        <button
          onClick={onDeviceChange}
          className="w-full p-4 bg-purple-100 text-purple-700 rounded-xl font-medium flex items-center justify-center gap-2"
        >
          <Tablet size={20} />
          태블릿 모드로 전환
        </button>
      </div>

      {/* Oil Info */}
      <div className="bg-slate-800 rounded-2xl p-4 text-white">
        <h3 className="font-bold mb-2">💧 현재 냉매 정보</h3>
        <div className="text-sm space-y-1 text-slate-300">
          <p>오일: {REFRIGERANT_INFO[refrigerant].oil}</p>
          <p>충전: {REFRIGERANT_INFO[refrigerant].charge_rate}</p>
          <p>특이사항: {REFRIGERANT_INFO[refrigerant].note}</p>
        </div>
      </div>
    </div>
  )
}
