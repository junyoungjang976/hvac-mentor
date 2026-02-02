import { Warehouse, Snowflake, Store, Building2, MoreHorizontal, type LucideIcon } from 'lucide-react'
import { equipmentTypes } from '../../data/customerDiagnosis'

interface EquipmentSelectProps {
  selectedEquipment: string
  onSelect: (equipmentId: string) => void
}

const iconMap: Record<string, LucideIcon> = {
  'warehouse': Warehouse,
  'snowflake': Snowflake,
  'store': Store,
  'building-2': Building2,
  'more-horizontal': MoreHorizontal
}

export default function EquipmentSelect({ selectedEquipment, onSelect }: EquipmentSelectProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          어떤 장비에 문제가 있나요?
        </h2>
        <p className="text-gray-600">
          해당하는 장비 종류를 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipmentTypes.map((equipment) => {
          const Icon = iconMap[equipment.icon]
          const isSelected = selectedEquipment === equipment.id

          return (
            <button
              key={equipment.id}
              onClick={() => onSelect(equipment.id)}
              className={`
                relative overflow-hidden rounded-xl p-6 text-left transition-all duration-200
                min-h-[180px] flex flex-col items-center justify-center gap-4
                ${
                  isSelected
                    ? 'bg-blue-50 border-2 border-blue-500 shadow-lg scale-[1.02]'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.01]'
                }
              `}
            >
              {/* Isometric background effect */}
              <div className={`
                absolute inset-0 opacity-5
                ${isSelected ? 'bg-blue-500' : 'bg-gray-400'}
              `}>
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id={`grid-${equipment.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill={`url(#grid-${equipment.id})`} />
                </svg>
              </div>

              {/* Icon */}
              <div className={`
                relative rounded-full p-4 transition-colors
                ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
              `}>
                <Icon className="w-12 h-12" strokeWidth={1.5} />
              </div>

              {/* Text content */}
              <div className="relative text-center space-y-1">
                <h3 className={`
                  text-xl font-bold transition-colors
                  ${isSelected ? 'text-blue-700' : 'text-gray-900'}
                `}>
                  {equipment.name}
                </h3>
                <p className={`
                  text-sm transition-colors
                  ${isSelected ? 'text-blue-600' : 'text-gray-500'}
                `}>
                  {equipment.description}
                </p>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
