import { useState } from 'react'
import CircuitBasicsSection from '../electric/CircuitBasicsSection'
import CircuitDiagramsSection from '../electric/CircuitDiagramsSection'
import PracticalGuideSection from '../electric/PracticalGuideSection'
import ComponentDictionarySection from '../electric/ComponentDictionarySection'
import TroubleshootingSection from '../electric/TroubleshootingSection'
import MeasurementToolsSection from '../electric/MeasurementToolsSection'
import QuizSection from '../electric/QuizSection'
import {
  ELECTRICAL_SAFETY_WARNINGS,
  BEGINNER_TIPS
} from '../../data/circuitLearning'

type MainTab = 'basics' | 'diagrams' | 'practical' | 'components' | 'troubleshooting' | 'tools' | 'quiz'

const MAIN_TABS = [
  { id: 'basics', label: '회로 기초', icon: 'A', description: '기호와 기본 개념' },
  { id: 'diagrams', label: '회로도', icon: 'D', description: '다이어그램 분석' },
  { id: 'practical', label: '실전 가이드', icon: 'P', description: '현장 적용' },
  { id: 'components', label: '부품 사전', icon: 'C', description: '부품별 상세' },
  { id: 'troubleshooting', label: '고장 진단', icon: 'T', description: '증상별 점검' },
  { id: 'tools', label: '측정 도구', icon: 'M', description: '계측기 사용법' },
  { id: 'quiz', label: '퀴즈', icon: 'Q', description: '학습 확인' }
]

export default function ElectricTab() {
  const [activeTab, setActiveTab] = useState<MainTab>('basics')
  const [showSafetyModal, setShowSafetyModal] = useState(false)
  const [showTipsModal, setShowTipsModal] = useState(false)

  return (
    <div className="space-y-4">
      {/* Header with Safety & Tips */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-bold text-gray-800">
          전기 회로 가이드
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSafetyModal(true)}
            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 min-h-[40px]"
          >
            안전 수칙
          </button>
          <button
            onClick={() => setShowTipsModal(true)}
            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 min-h-[40px]"
          >
            초보자 팁
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="bg-gray-50 p-2 rounded-xl overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {MAIN_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MainTab)}
              className={`px-4 py-3 rounded-lg font-medium transition-all min-h-[56px] flex flex-col items-center justify-center min-w-[80px] ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg font-bold">{tab.icon}</span>
              <span className="text-xs mt-0.5">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Description */}
      <div className="bg-gray-100 px-4 py-2 rounded-lg">
        <p className="text-sm text-gray-600">
          {MAIN_TABS.find(t => t.id === activeTab)?.description}
        </p>
      </div>

      {/* Tab Content */}
      <div className="card">
        {activeTab === 'basics' && <CircuitBasicsSection />}
        {activeTab === 'diagrams' && <CircuitDiagramsSection />}
        {activeTab === 'practical' && <PracticalGuideSection />}
        {activeTab === 'components' && <ComponentDictionarySection />}
        {activeTab === 'troubleshooting' && <TroubleshootingSection />}
        {activeTab === 'tools' && <MeasurementToolsSection />}
        {activeTab === 'quiz' && <QuizSection />}
      </div>

      {/* Safety Modal */}
      {showSafetyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-red-600 text-white p-4 rounded-t-xl flex items-center justify-between">
              <h3 className="font-bold text-lg">안전 수칙</h3>
              <button
                onClick={() => setShowSafetyModal(false)}
                className="text-white hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center"
              >
                X
              </button>
            </div>
            <div className="p-4 space-y-3">
              {ELECTRICAL_SAFETY_WARNINGS.map(warning => (
                <div
                  key={warning.id}
                  className={`p-3 rounded-lg border-2 ${
                    warning.severity === 'critical'
                      ? 'bg-red-50 border-red-300'
                      : warning.severity === 'warning'
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-yellow-50 border-yellow-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold ${
                      warning.severity === 'critical'
                        ? 'text-red-700'
                        : warning.severity === 'warning'
                        ? 'text-orange-700'
                        : 'text-yellow-700'
                    }`}>
                      {warning.severity === 'critical' ? '!' :
                       warning.severity === 'warning' ? '!' : '*'}
                    </span>
                    <span className="font-semibold text-gray-800">{warning.title}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{warning.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tips Modal */}
      {showTipsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-blue-600 text-white p-4 rounded-t-xl flex items-center justify-between">
              <h3 className="font-bold text-lg">초보자 팁</h3>
              <button
                onClick={() => setShowTipsModal(false)}
                className="text-white hover:bg-blue-700 rounded-full w-8 h-8 flex items-center justify-center"
              >
                X
              </button>
            </div>
            <div className="p-4 space-y-3">
              {BEGINNER_TIPS.map(tip => (
                <div key={tip.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-semibold text-blue-800 mb-1">{tip.title}</p>
                  <p className="text-blue-900 text-sm">{tip.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
