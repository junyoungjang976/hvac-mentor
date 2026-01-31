import { useState } from 'react'
import {
  ELECTRICAL_COMPONENTS,
  CIRCUIT_DIAGRAMS,
  CONTROL_SEQUENCE,
  FAULT_DIAGNOSIS_POINTS,
} from '../../data/electricCircuit'
import {
  PIPE_SIZING_TABLES,
  EQUIVALENT_LENGTH_FACTORS,
  OIL_RETURN_GUIDELINES,
} from '../../data/pipeSizing'
import {
  OIL_COMPATIBILITY,
  MIXING_WARNINGS,
  OIL_TYPES,
} from '../../data/oilCompatibility'
import {
  DEFROST_METHODS,
  DEFROST_TIMING,
  DRAIN_MANAGEMENT,
  DEFROST_TROUBLESHOOTING,
} from '../../data/defrostCycle'

type SubTabType = 'circuits' | 'components' | 'pipes' | 'oil' | 'defrost'

export default function ElectricTab() {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('circuits')
  const [selectedRefrigerant, setSelectedRefrigerant] = useState<'R-22' | 'R-404A' | 'R-134a'>('R-22')
  const [expandedDiagnosis, setExpandedDiagnosis] = useState<number | null>(null)
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null)
  const [expandedTroubleshooting, setExpandedTroubleshooting] = useState<string | null>(null)

  const subTabs = [
    { id: 'circuits', label: '회로도' },
    { id: 'components', label: '부품 사전' },
    { id: 'pipes', label: '배관 규격' },
    { id: 'oil', label: '오일 호환성' },
    { id: 'defrost', label: '제상 가이드' },
  ]

  const getCompatibilityColor = (status: string): string => {
    if (status === '권장') return 'bg-green-100 text-green-800'
    if (status === '호환') return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getSeverityColor = (severity: string): string => {
    if (severity === '위험') return 'bg-red-100 text-red-800 border-red-300'
    if (severity === '경고') return 'bg-orange-100 text-orange-800 border-orange-300'
    return 'bg-yellow-100 text-yellow-800 border-yellow-300'
  }

  return (
    <div className="space-y-4">
      {/* Sub-tab Navigation */}
      <div className="flex gap-2 bg-gray-50 p-2 rounded-xl flex-wrap">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as SubTabType)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeSubTab === tab.id
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Circuit Diagrams Section */}
      {activeSubTab === 'circuits' && (
        <div className="space-y-6">
          {/* Circuit Diagrams */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Circuit Diagrams</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CIRCUIT_DIAGRAMS.map(diagram => (
                <div key={diagram.id} className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold text-lg mb-2">
                    {diagram.title_kr}
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({diagram.title_en})
                    </span>
                  </h4>
                  <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={`/circuits/${diagram.filename}`}
                      alt={diagram.title_kr}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">Image not found</div>'
                        }
                      }}
                    />
                  </div>
                  <p className="text-gray-600 text-sm">{diagram.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Control Sequence */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Control Sequence (Operation Flow)</h3>
            <div className="space-y-4">
              {CONTROL_SEQUENCE.map(step => (
                <div
                  key={step.step}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-indigo-700">{step.name}</h4>
                    <p className="text-gray-600 mb-2">{step.description}</p>
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
                </div>
              ))}
            </div>
          </div>

          {/* Fault Diagnosis Points */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Fault Diagnosis Points</h3>
            <div className="space-y-3">
              {FAULT_DIAGNOSIS_POINTS.map((point, index) => (
                <details
                  key={index}
                  className="bg-gray-50 rounded-lg"
                  open={expandedDiagnosis === index}
                  onToggle={() => setExpandedDiagnosis(expandedDiagnosis === index ? null : index)}
                >
                  <summary className="p-4 cursor-pointer font-bold hover:bg-gray-100 rounded-lg text-red-700">
                    {point.symptom}
                  </summary>
                  <div className="p-4 pt-0 space-y-4">
                    <div>
                      <p className="font-semibold text-gray-700 mb-2">Check Points:</p>
                      <ul className="space-y-1">
                        {point.checkPoints.map((cp, i) => (
                          <li key={i} className="text-gray-600">{cp}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-2">Measurements:</p>
                      <ul className="space-y-1">
                        {point.measurements.map((m, i) => (
                          <li key={i} className="text-blue-700 bg-blue-50 p-2 rounded">{m}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-2">Solutions:</p>
                      <ul className="space-y-1">
                        {point.solutions.map((s, i) => (
                          <li key={i} className="text-green-700 bg-green-50 p-2 rounded">{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Component Dictionary Section */}
      {activeSubTab === 'components' && (
        <div className="card">
          <h3 className="text-lg font-bold mb-4">Electrical Components Dictionary</h3>
          <div className="space-y-3">
            {Object.entries(ELECTRICAL_COMPONENTS).map(([code, component]) => (
              <details
                key={code}
                className="bg-gray-50 rounded-lg"
                open={expandedComponent === code}
                onToggle={() => setExpandedComponent(expandedComponent === code ? null : code)}
              >
                <summary className="p-4 cursor-pointer hover:bg-gray-100 rounded-lg">
                  <span className="font-bold text-indigo-700 mr-3">{component.code}</span>
                  <span className="font-semibold">{component.name_kr}</span>
                  <span className="text-gray-500 ml-2">({component.name_en})</span>
                </summary>
                <div className="p-4 pt-0 space-y-3">
                  <div>
                    <p className="font-semibold text-gray-700">Function:</p>
                    <p className="text-gray-600">{component.function}</p>
                  </div>
                  {component.spec && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-semibold text-blue-700">Specification:</p>
                      <p className="text-blue-800">{component.spec}</p>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Pipe Sizing Section */}
      {activeSubTab === 'pipes' && (
        <div className="space-y-6">
          {/* Refrigerant Selector */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Pipe Sizing Tables</h3>
            <div className="flex gap-2 mb-4">
              {(['R-22', 'R-404A', 'R-134a'] as const).map(ref => (
                <button
                  key={ref}
                  onClick={() => setSelectedRefrigerant(ref)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedRefrigerant === ref
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {ref}
                </button>
              ))}
            </div>

            {/* Pipe Size Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border">Capacity</th>
                    <th className="p-3 text-left border">Suction Line</th>
                    <th className="p-3 text-left border">Liquid Line</th>
                    <th className="p-3 text-left border">Discharge Line</th>
                    <th className="p-3 text-left border">Max Equiv. Length</th>
                  </tr>
                </thead>
                <tbody>
                  {PIPE_SIZING_TABLES[selectedRefrigerant].표.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 border font-semibold">{row.용량}</td>
                      <td className="p-3 border text-blue-700">{row.흡입관}</td>
                      <td className="p-3 border text-green-700">{row.액관}</td>
                      <td className="p-3 border text-red-700">{row.토출관}</td>
                      <td className="p-3 border text-gray-600">
                        {PIPE_SIZING_TABLES[selectedRefrigerant].최대등가길이?.[row.용량]}m
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Equivalent Length Factors */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Fitting Equivalent Length Factors</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border">Fitting</th>
                    <th className="p-3 text-left border">Equiv. Length</th>
                    <th className="p-3 text-left border">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {EQUIVALENT_LENGTH_FACTORS.map((factor, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 border font-semibold">{factor.부품명}</td>
                      <td className="p-3 border text-indigo-700">{factor.등가길이}</td>
                      <td className="p-3 border text-gray-600">{factor.비고 || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Oil Return Guidelines */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Oil Return Guidelines</h3>
            <div className="space-y-3">
              {OIL_RETURN_GUIDELINES.map((guide, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800">{guide.항목}</h4>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                      {guide.기준}
                    </span>
                  </div>
                  {guide.설명 && <p className="text-gray-600">{guide.설명}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Oil Compatibility Section */}
      {activeSubTab === 'oil' && (
        <div className="space-y-6">
          {/* Compatibility Matrix */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Refrigerant-Oil Compatibility Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border">Refrigerant</th>
                    <th className="p-3 text-left border">Recommended Oil</th>
                    <th className="p-3 text-left border">Compatible Oils</th>
                    <th className="p-3 text-left border">Charging Method</th>
                    <th className="p-3 text-left border">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {OIL_COMPATIBILITY.map((compat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 border font-bold text-indigo-700">{compat.refrigerant}</td>
                      <td className="p-3 border">
                        <span className={`px-2 py-1 rounded ${getCompatibilityColor('권장')}`}>
                          {compat.recommended}
                        </span>
                      </td>
                      <td className="p-3 border">
                        <div className="flex gap-1 flex-wrap">
                          {compat.compatibleOils.map((oil, i) => (
                            <span
                              key={i}
                              className={`px-2 py-1 rounded text-sm ${
                                oil === compat.recommended
                                  ? getCompatibilityColor('권장')
                                  : getCompatibilityColor('호환')
                              }`}
                            >
                              {oil}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 border text-center font-medium">{compat.chargingMethod}</td>
                      <td className="p-3 border text-sm text-gray-600">{compat.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4">
              <span className={`px-3 py-1 rounded ${getCompatibilityColor('권장')}`}>Recommended</span>
              <span className={`px-3 py-1 rounded ${getCompatibilityColor('호환')}`}>Compatible</span>
              <span className={`px-3 py-1 rounded ${getCompatibilityColor('금지')}`}>Prohibited</span>
            </div>
          </div>

          {/* Oil Types Reference */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Oil Types Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(OIL_TYPES).map(([key, oil]) => (
                <div key={key} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">{oil.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">Chemical: {oil.chemical}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {oil.applications.map((app, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                        {app}
                      </span>
                    ))}
                  </div>
                  {oil.hygroscopic && (
                    <p className="text-orange-600 text-sm font-medium mb-1">Hygroscopic - handle with care</p>
                  )}
                  <p className="text-gray-600 text-sm">{oil.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mixing Warnings */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Oil Mixing Warnings</h3>
            <div className="space-y-3">
              {MIXING_WARNINGS.map((warning, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${getSeverityColor(warning.severity)}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg">{warning.combination}</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getSeverityColor(warning.severity)}`}>
                      {warning.severity}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-1"><strong>Problem:</strong> {warning.problem}</p>
                  <p className="text-gray-700 mb-1"><strong>Result:</strong> {warning.result}</p>
                  <p className="text-gray-800 font-medium"><strong>Action:</strong> {warning.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Defrost Guide Section */}
      {activeSubTab === 'defrost' && (
        <div className="space-y-6">
          {/* Defrost Methods Comparison */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Defrost Methods Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(DEFROST_METHODS).map(([name, method]) => (
                <div key={name} className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-indigo-700 mb-2">{name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{method.설명}</p>

                  <div className="space-y-2 text-sm">
                    <p><strong>Principle:</strong> {method.원리}</p>
                    <p><strong>Application:</strong> {method.적용온도}</p>
                    {method.히터용량 && <p><strong>Heater Cap:</strong> {method.히터용량}</p>}
                  </div>

                  <div className="mt-3">
                    <p className="font-semibold text-green-700 mb-1">Advantages:</p>
                    <ul className="text-sm text-gray-600 space-y-0.5">
                      {method.장점.map((adv, i) => (
                        <li key={i}>+ {adv}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-2">
                    <p className="font-semibold text-red-700 mb-1">Disadvantages:</p>
                    <ul className="text-sm text-gray-600 space-y-0.5">
                      {method.단점.map((dis, i) => (
                        <li key={i}>- {dis}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                    {method.주의사항}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Defrost Timing Table */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Defrost Timing Reference</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border">Storage Temp</th>
                    <th className="p-3 text-left border">Interval</th>
                    <th className="p-3 text-left border">Duration</th>
                    <th className="p-3 text-left border">Termination Temp</th>
                    <th className="p-3 text-left border">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {DEFROST_TIMING.map((timing, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 border font-semibold">{timing.저장온도}</td>
                      <td className="p-3 border text-blue-700">{timing.제상간격}</td>
                      <td className="p-3 border text-green-700">{timing.제상시간}</td>
                      <td className="p-3 border text-orange-700">{timing.종료온도}</td>
                      <td className="p-3 border text-gray-600 text-sm">{timing.비고}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Drain Management */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Drain Management Guidelines</h3>
            <div className="space-y-3">
              {DRAIN_MANAGEMENT.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800">{item.항목}</h4>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {item.점검주기}
                    </span>
                  </div>
                  <p className="text-indigo-700 font-medium mb-1">{item.사양}</p>
                  <p className="text-gray-600">{item.목적}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Defrost Troubleshooting */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Defrost Troubleshooting</h3>
            <div className="space-y-3">
              {Object.entries(DEFROST_TROUBLESHOOTING).map(([name, trouble]) => (
                <details
                  key={name}
                  className="bg-gray-50 rounded-lg"
                  open={expandedTroubleshooting === name}
                  onToggle={() => setExpandedTroubleshooting(expandedTroubleshooting === name ? null : name)}
                >
                  <summary className="p-4 cursor-pointer font-bold hover:bg-gray-100 rounded-lg text-red-700">
                    {name}
                  </summary>
                  <div className="p-4 pt-0 space-y-4">
                    <div className="p-3 bg-red-50 rounded">
                      <p className="font-semibold text-red-700">Symptom:</p>
                      <p className="text-red-800">{trouble.증상}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-700 mb-2">Possible Causes:</p>
                      <ul className="space-y-1">
                        {trouble.원인.map((cause, i) => (
                          <li key={i} className="text-gray-600">- {cause}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-700 mb-2">Actions:</p>
                      <ul className="space-y-1">
                        {trouble.조치.map((action, i) => (
                          <li key={i} className="text-green-700 bg-green-50 p-2 rounded">{action}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-blue-50 rounded">
                      <p className="font-semibold text-blue-700">Prevention:</p>
                      <p className="text-blue-800">{trouble.예방}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
