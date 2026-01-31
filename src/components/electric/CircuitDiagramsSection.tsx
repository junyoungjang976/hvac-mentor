import { useState } from 'react'
import { CIRCUIT_DIAGRAMS, CONTROL_SEQUENCE } from '../../data/electricCircuit'

interface DiagramAnnotation {
  id: string
  diagramId: string
  label: string
  description: string
  position: { top: string; left: string }
}

const DIAGRAM_ANNOTATIONS: DiagramAnnotation[] = [
  // Diagram 1 annotations
  {
    id: 'a1-1',
    diagramId: 'walk-in-1',
    label: 'NFB',
    description: '주 차단기 - 전체 전원을 ON/OFF하는 곳. 트립 시 여기부터 확인',
    position: { top: '15%', left: '10%' }
  },
  {
    id: 'a1-2',
    diagramId: 'walk-in-1',
    label: 'MC',
    description: '전자접촉기 - 코일에 전원이 오면 모터에 전력을 공급',
    position: { top: '40%', left: '25%' }
  },
  {
    id: 'a1-3',
    diagramId: 'walk-in-1',
    label: 'THR',
    description: '열동계전기 - 과전류 시 자동 차단하여 모터 보호',
    position: { top: '55%', left: '35%' }
  },
  {
    id: 'a1-4',
    diagramId: 'walk-in-1',
    label: 'COMP',
    description: '압축기 모터 - 냉매를 압축하는 핵심 장치',
    position: { top: '75%', left: '20%' }
  },
  // Diagram 2 annotations
  {
    id: 'a2-1',
    diagramId: 'walk-in-2',
    label: 'TIC',
    description: 'FOX-23A7 온도조절기 - 고내 온도에 따라 압축기 ON/OFF',
    position: { top: '20%', left: '15%' }
  },
  {
    id: 'a2-2',
    diagramId: 'walk-in-2',
    label: '52C',
    description: '압축기 접촉기 - TIC 신호로 압축기 전원 제어',
    position: { top: '45%', left: '30%' }
  },
  {
    id: 'a2-3',
    diagramId: 'walk-in-2',
    label: 'F.HPC',
    description: '고압차단스위치 - 고압 이상 시 팬 강제 가동',
    position: { top: '35%', left: '60%' }
  },
  {
    id: 'a2-4',
    diagramId: 'walk-in-2',
    label: 'TB',
    description: '터미널 블록(380V 4P) - 전선 연결 및 분배 단자대',
    position: { top: '80%', left: '50%' }
  }
]

export default function CircuitDiagramsSection() {
  const [selectedDiagram, setSelectedDiagram] = useState<string>('walk-in-1')
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [expandedSequence, setExpandedSequence] = useState<number | null>(null)

  const currentDiagram = CIRCUIT_DIAGRAMS.find(d => d.id === selectedDiagram)
  const currentAnnotations = DIAGRAM_ANNOTATIONS.filter(a => a.diagramId === selectedDiagram)

  return (
    <div className="space-y-6">
      {/* Diagram Selector */}
      <div className="flex gap-2 flex-wrap">
        {CIRCUIT_DIAGRAMS.map(diagram => (
          <button
            key={diagram.id}
            onClick={() => {
              setSelectedDiagram(diagram.id)
              setActiveAnnotation(null)
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all min-h-[48px] ${
              selectedDiagram === diagram.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {diagram.title_kr}
          </button>
        ))}
      </div>

      {/* Diagram Viewer */}
      {currentDiagram && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-lg">{currentDiagram.title_kr}</h3>
              <p className="text-sm text-gray-500">{currentDiagram.title_en}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAnnotations(!showAnnotations)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium min-h-[40px] ${
                  showAnnotations
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {showAnnotations ? '설명 표시' : '설명 숨김'}
              </button>
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 min-h-[40px]"
              >
                {isZoomed ? '축소' : '확대'}
              </button>
            </div>
          </div>

          <div className="p-4 bg-gray-50">
            <p className="text-gray-600 text-sm mb-4">{currentDiagram.description}</p>

            {/* Image Container with Annotations */}
            <div
              className={`relative bg-white rounded-lg overflow-auto ${
                isZoomed ? 'max-h-[80vh]' : 'max-h-[400px]'
              }`}
              style={{ touchAction: 'pan-x pan-y' }}
            >
              <img
                src={`/circuits/${currentDiagram.filename}`}
                alt={currentDiagram.title_kr}
                className={`w-full ${isZoomed ? 'min-w-[800px]' : ''} object-contain`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex items-center justify-center h-64 text-gray-500">
                        <div class="text-center">
                          <p class="text-lg mb-2">이미지를 찾을 수 없습니다</p>
                          <p class="text-sm">/circuits/${currentDiagram.filename}</p>
                        </div>
                      </div>
                    `
                  }
                }}
              />

              {/* Annotation Markers */}
              {showAnnotations && currentAnnotations.map(annotation => (
                <button
                  key={annotation.id}
                  onClick={() => setActiveAnnotation(
                    activeAnnotation === annotation.id ? null : annotation.id
                  )}
                  className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                    activeAnnotation === annotation.id
                      ? 'bg-red-500 text-white scale-125'
                      : 'bg-yellow-400 text-yellow-900 hover:scale-110'
                  }`}
                  style={{
                    top: annotation.position.top,
                    left: annotation.position.left,
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={annotation.label}
                >
                  ?
                </button>
              ))}
            </div>

            {/* Active Annotation Detail */}
            {activeAnnotation && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                {(() => {
                  const annotation = currentAnnotations.find(a => a.id === activeAnnotation)
                  if (!annotation) return null
                  return (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-yellow-800 text-lg">{annotation.label}</span>
                        <button
                          onClick={() => setActiveAnnotation(null)}
                          className="text-yellow-600 hover:text-yellow-800 text-xl"
                        >
                          X
                        </button>
                      </div>
                      <p className="text-yellow-900">{annotation.description}</p>
                    </>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Control Sequence */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-lg">제어 시퀀스 (운전 순서)</h3>
          <p className="text-sm text-gray-500">전원 투입부터 냉동 사이클까지의 동작 순서</p>
        </div>

        <div className="p-4 space-y-2">
          {CONTROL_SEQUENCE.map(step => (
            <details
              key={step.step}
              className="bg-gray-50 rounded-lg"
              open={expandedSequence === step.step}
              onToggle={() => setExpandedSequence(
                expandedSequence === step.step ? null : step.step
              )}
            >
              <summary className="p-3 cursor-pointer hover:bg-gray-100 rounded-lg flex items-center gap-3 min-h-[52px]">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.step}
                </span>
                <span className="font-semibold text-indigo-700">{step.name}</span>
              </summary>
              <div className="p-3 pt-0 space-y-2 border-t border-gray-200">
                <p className="text-gray-700">{step.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {step.components.map(comp => (
                    <span
                      key={comp}
                      className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm font-medium"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Beginner Tip */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="font-medium text-blue-800 mb-2">초보자 팁</p>
        <p className="text-blue-900 text-sm">
          회로도 위의 ? 버튼을 클릭하면 해당 부품의 역할을 바로 확인할 수 있습니다.
          확대 버튼으로 회로도를 크게 보면서 따라가 보세요.
        </p>
      </div>
    </div>
  )
}
