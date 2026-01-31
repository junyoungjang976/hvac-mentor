import { useState } from 'react'
import {
  COMMON_CIRCUIT_PATTERNS,
  TROUBLESHOOTING_SCENARIOS
} from '../../data/circuitLearning'

type GuideSubTab = 'patterns' | 'scenarios'

export default function PracticalGuideSection() {
  const [activeSubTab, setActiveSubTab] = useState<GuideSubTab>('patterns')
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null)
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null)

  const subTabs = [
    { id: 'patterns', label: '회로 패턴' },
    { id: 'scenarios', label: '실전 시나리오' }
  ]

  return (
    <div className="space-y-4">
      {/* Sub-navigation */}
      <div className="flex gap-2">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as GuideSubTab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all min-h-[48px] ${
              activeSubTab === tab.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Circuit Patterns */}
      {activeSubTab === 'patterns' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              HVAC에서 자주 만나는 회로 패턴입니다. 패턴을 알면 고장 진단이 빨라집니다.
            </p>
          </div>

          <div className="space-y-3">
            {COMMON_CIRCUIT_PATTERNS.map(pattern => (
              <details
                key={pattern.id}
                className="bg-white rounded-lg border border-gray-200"
                open={expandedPattern === pattern.id}
                onToggle={() => setExpandedPattern(
                  expandedPattern === pattern.id ? null : pattern.id
                )}
              >
                <summary className="p-4 cursor-pointer hover:bg-gray-50 flex items-center gap-3 min-h-[56px]">
                  <span className="font-bold text-gray-800">{pattern.name}</span>
                </summary>
                <div className="p-4 pt-0 space-y-4 border-t border-gray-100">
                  <p className="text-gray-700">{pattern.description}</p>

                  {/* Components */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">구성 부품</p>
                    <div className="flex gap-2 flex-wrap">
                      {pattern.components.map(comp => (
                        <span
                          key={comp}
                          className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm font-medium"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sequence */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">동작 순서</p>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                      {pattern.sequence.map((step, i) => (
                        <p key={i} className="text-gray-700 text-sm flex items-start gap-2">
                          <span className="font-mono text-indigo-600">{i + 1}.</span>
                          {step}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Troubleshooting */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">고장 진단 포인트</p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-1">
                      {pattern.troubleshooting.map((tip, i) => (
                        <p key={i} className="text-yellow-800 text-sm">
                          * {tip}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Troubleshooting Scenarios */}
      {activeSubTab === 'scenarios' && (
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-800 font-medium">
              현장에서 만날 수 있는 실제 고장 상황입니다. 단계별로 따라가 보세요.
            </p>
          </div>

          <div className="space-y-4">
            {TROUBLESHOOTING_SCENARIOS.map(scenario => (
              <details
                key={scenario.id}
                className="bg-white rounded-lg border border-gray-200"
                open={expandedScenario === scenario.id}
                onToggle={() => setExpandedScenario(
                  expandedScenario === scenario.id ? null : scenario.id
                )}
              >
                <summary className="p-4 cursor-pointer hover:bg-gray-50 min-h-[56px]">
                  <span className="font-bold text-red-700">{scenario.title}</span>
                </summary>
                <div className="p-4 pt-0 space-y-4 border-t border-gray-100">
                  {/* Situation */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 mb-1">상황</p>
                    <p className="text-gray-700">{scenario.situation}</p>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">증상</p>
                    <ul className="space-y-1">
                      {scenario.symptoms.map((symptom, i) => (
                        <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                          <span className="text-red-500">*</span> {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Step by Step */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">점검 순서</p>
                    <div className="space-y-2">
                      {scenario.stepByStep.map(step => (
                        <div key={step.step} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {step.step}
                            </span>
                            <span className="font-medium text-gray-800">{step.action}</span>
                          </div>
                          <div className="ml-8 space-y-1 text-sm">
                            <p className="text-gray-600">
                              <span className="font-medium">예상 결과:</span> {step.expectedResult}
                            </p>
                            <p className="text-blue-700">
                              <span className="font-medium">실제 결과:</span> {step.actualResult}
                            </p>
                            <p className="text-green-700 font-medium">
                              결론: {step.conclusion}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Root Cause & Solution */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="font-medium text-red-800 mb-1">근본 원인</p>
                    <p className="text-red-900">{scenario.rootCause}</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="font-medium text-green-800 mb-1">해결책</p>
                    <p className="text-green-900">{scenario.solution}</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="font-medium text-blue-800 mb-1">예방법</p>
                    <p className="text-blue-900">{scenario.prevention}</p>
                  </div>

                  {/* Safety Notes */}
                  {scenario.safetyNotes.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                      <p className="font-medium text-yellow-800 mb-2">안전 주의사항</p>
                      <ul className="space-y-1">
                        {scenario.safetyNotes.map((note, i) => (
                          <li key={i} className="text-yellow-900 text-sm flex items-start gap-2">
                            <span>!</span> {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
