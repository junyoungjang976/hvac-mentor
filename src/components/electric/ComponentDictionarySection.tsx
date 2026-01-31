import { useState } from 'react'
import { ELECTRICAL_COMPONENTS } from '../../data/electricCircuit'

interface EnhancedComponent {
  code: string
  icon: string
  fieldTips: string[]
  commonFailures: string[]
}

const ENHANCED_DATA: Record<string, EnhancedComponent> = {
  MC: {
    code: 'MC',
    icon: '[접점]',
    fieldTips: [
      '코일 웅웅 소리 → 전압 부족 또는 코일 불량',
      '접점 검게 변색 → 과부하 또는 교체 시기',
      '코일 저항 측정으로 단락/단선 확인 가능'
    ],
    commonFailures: [
      '접점 고착 (붙어서 안 떨어짐)',
      '접점 마모 (접촉 불량)',
      '코일 단선 (전자석 작동 안 함)'
    ]
  },
  THR: {
    code: 'THR',
    icon: '[보호]',
    fieldTips: [
      '트립 시 빨간 버튼 돌출 확인',
      '냉각 후 리셋 (3~5분 대기)',
      '설정값: 모터 정격 전류 105~120%'
    ],
    commonFailures: [
      '바이메탈 피로로 오동작',
      '설정값 부적절',
      '리셋 불가 (내부 손상)'
    ]
  },
  NFB: {
    code: 'NFB',
    icon: '[차단]',
    fieldTips: [
      '트립 시 레버가 중간 위치',
      'OFF로 내린 후 다시 ON',
      '반복 트립 시 원인 파악 필수'
    ],
    commonFailures: [
      '내부 접점 손상',
      '과전류 시 차단 지연',
      '레버 기구 고장'
    ]
  },
  TIC: {
    code: 'TIC',
    icon: '[온도]',
    fieldTips: [
      'dF(차동값) 설정으로 헌팅 방지',
      '센서 위치가 냉기 흐름 중에 있어야',
      'FOX-2SA1 모델이 일반적'
    ],
    commonFailures: [
      '센서 단선/단락',
      '접점 고착',
      '설정값 이탈'
    ]
  },
  DPS: {
    code: 'DPS',
    icon: '[압력]',
    fieldTips: [
      'LP 트립 → 냉매 부족 우선 의심',
      'HP 트립 → 응축기 점검 우선',
      '설정 압력 확인 (현장 조건 맞게)'
    ],
    commonFailures: [
      '압력 포트 막힘',
      '다이어프램 손상',
      '접점 고착'
    ]
  },
  'F.HPC': {
    code: 'F.HPC',
    icon: '[안전]',
    fieldTips: [
      '동작 압력 14kg/cm2 일반적',
      '복귀 압력 12kg/cm2 일반적',
      '고압 시 응축기 팬 강제 작동'
    ],
    commonFailures: [
      '설정 압력 이탈',
      '접점 불량',
      '감지 지연'
    ]
  },
  '52C': {
    code: '52C',
    icon: '[압축기]',
    fieldTips: [
      'MC와 동일 점검 방법',
      '압축기 기동 전류 고려해 용량 선정',
      '정격의 1.5배 이상 여유'
    ],
    commonFailures: [
      '접점 용착 (붙음)',
      '코일 단선',
      '접점 마모'
    ]
  },
  OL: {
    code: 'OL',
    icon: '[보호]',
    fieldTips: [
      'THR과 동일한 기능',
      '다른 표기법일 뿐',
      '설정 및 점검 방법 동일'
    ],
    commonFailures: [
      'THR과 동일'
    ]
  },
  ELB: {
    code: 'ELB',
    icon: '[누전]',
    fieldTips: [
      '월 1회 테스트 버튼 동작 확인',
      '트립 시 절연저항 측정 우선',
      '빗물 침투 여부 확인'
    ],
    commonFailures: [
      '감도 저하',
      '테스트 버튼 고장',
      '내부 회로 이상'
    ]
  },
  PB: {
    code: 'PB',
    icon: '[버튼]',
    fieldTips: [
      'a접점: 누르면 ON',
      'b접점: 누르면 OFF',
      'THR 리셋용은 순간 접점'
    ],
    commonFailures: [
      '접점 고착',
      '스프링 피로',
      '배선 단선'
    ]
  },
  DS: {
    code: 'DS',
    icon: '[타이머]',
    fieldTips: [
      '제상 간격: 6~8시간 일반적',
      '제상 시간: 20~30분 일반적',
      '현장 조건에 맞게 조정'
    ],
    commonFailures: [
      '타이머 모터 고장',
      '접점 마모',
      '설정 오류'
    ]
  },
  DH: {
    code: 'DH',
    icon: '[히터]',
    fieldTips: [
      '저항 측정으로 단선 확인',
      '무한대 → 단선, 교체 필요',
      '정상 저항: 20~50옴 (용량별 상이)'
    ],
    commonFailures: [
      '히터 단선',
      '절연 저하 (누전)',
      '용량 감소 (노후)'
    ]
  },
  DTS: {
    code: 'DTS',
    icon: '[센서]',
    fieldTips: [
      '동작 온도: +10~15도',
      '센서가 증발기 핀에 밀착되어야',
      '제상 종료 신호 발생'
    ],
    commonFailures: [
      '센서 고장 (오동작)',
      '위치 이탈',
      '배선 단선'
    ]
  }
}

export default function ComponentDictionarySection() {
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredComponents = Object.entries(ELECTRICAL_COMPONENTS).filter(
    ([code, comp]) =>
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.name_kr.includes(searchTerm) ||
      comp.name_en.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="부품 검색 (코드, 이름, 영문명)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          Q
        </span>
      </div>

      {/* Components List */}
      <div className="space-y-2">
        {filteredComponents.map(([code, component]) => {
          const enhanced = ENHANCED_DATA[code]
          return (
            <details
              key={code}
              className="bg-white rounded-lg border border-gray-200"
              open={expandedComponent === code}
              onToggle={() => setExpandedComponent(
                expandedComponent === code ? null : code
              )}
            >
              <summary className="p-4 cursor-pointer hover:bg-gray-50 flex items-center gap-3 min-h-[56px]">
                {enhanced && (
                  <span className="text-gray-400 text-sm font-mono">{enhanced.icon}</span>
                )}
                <span className="font-mono font-bold text-indigo-700 min-w-[50px]">
                  {component.code}
                </span>
                <span className="font-semibold">{component.name_kr}</span>
                <span className="text-gray-500 text-sm hidden sm:inline">
                  ({component.name_en})
                </span>
              </summary>
              <div className="p-4 pt-0 space-y-3 border-t border-gray-100">
                {/* Basic Info */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">기능</p>
                  <p className="text-gray-700">{component.function}</p>
                </div>

                {component.spec && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-600 mb-1">규격</p>
                    <p className="text-blue-800 font-medium">{component.spec}</p>
                  </div>
                )}

                {/* Field Tips */}
                {enhanced?.fieldTips && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800 mb-2">현장 팁</p>
                    <ul className="space-y-1">
                      {enhanced.fieldTips.map((tip, i) => (
                        <li key={i} className="text-yellow-900 text-sm flex items-start gap-2">
                          <span className="text-yellow-600">*</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Common Failures */}
                {enhanced?.commonFailures && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-2">주요 고장 모드</p>
                    <ul className="space-y-1">
                      {enhanced.commonFailures.map((failure, i) => (
                        <li key={i} className="text-red-900 text-sm flex items-start gap-2">
                          <span className="text-red-600">!</span>
                          {failure}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          )
        })}
      </div>

      {filteredComponents.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          검색 결과가 없습니다
        </div>
      )}
    </div>
  )
}
