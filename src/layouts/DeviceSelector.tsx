import { Smartphone, Tablet } from 'lucide-react'
import type { DeviceType } from '../hooks/useDeviceType'

interface DeviceSelectorProps {
  onSelect: (type: DeviceType) => void
}

export default function DeviceSelector({ onSelect }: DeviceSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🔧</div>
          <h1 className="text-3xl font-bold text-white mb-2">HVAC 현장 멘토</h1>
          <p className="text-slate-300">사용 환경을 선택하세요</p>
        </div>

        {/* Device Options */}
        <div className="grid grid-cols-2 gap-6">
          {/* Phone Option */}
          <button
            onClick={() => onSelect('phone')}
            className="bg-white/10 backdrop-blur border-2 border-white/20 rounded-3xl p-8 hover:bg-white/20 hover:border-white/40 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-sky-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-sky-500/30 transition-colors">
                <Smartphone className="w-10 h-10 text-sky-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">스마트폰</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                이동 중 빠른 진단<br />
                단일 작업에 최적화<br />
                한 손 조작 가능
              </p>
            </div>
          </button>

          {/* Tablet Option */}
          <button
            onClick={() => onSelect('tablet')}
            className="bg-white/10 backdrop-blur border-2 border-white/20 rounded-3xl p-8 hover:bg-white/20 hover:border-white/40 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Tablet className="w-10 h-10 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">태블릿</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                넓은 화면 활용<br />
                멀티뷰 지원<br />
                상세 정보 확인
              </p>
            </div>
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-slate-500 text-sm mt-8">
          언제든지 설정에서 변경할 수 있습니다
        </p>
      </div>
    </div>
  )
}
