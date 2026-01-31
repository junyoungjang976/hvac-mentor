/**
 * HVAC 설비 카테고리 및 점검 관련 데이터
 * 고객 점검 보고서 작성 시 사용되는 구조화된 선택 항목
 */

// ============================================================================
// 설비 카테고리 타입 정의
// ============================================================================

export interface SubCategory {
  id: string;
  name: string;
  variants?: string[];
}

export interface MiddleCategory {
  id: string;
  name: string;
  subcategories: SubCategory[];
}

export interface TopCategory {
  id: string;
  name: string;
  middle: MiddleCategory[];
}

// ============================================================================
// 설비 카테고리 데이터 (대분류 → 중분류 → 소분류)
// ============================================================================

export const EQUIPMENT_CATEGORIES: TopCategory[] = [
  {
    id: 'refrigeration',
    name: '냉장 설비',
    middle: [
      {
        id: 'showcase',
        name: '쇼케이스',
        subcategories: [
          { id: 'open', name: '오픈형' },
          { id: 'closed-refrigerated', name: '냉장쇼케이스' },
          { id: 'multi-deck', name: '다단쇼케이스' }
        ]
      },
      {
        id: 'table-refrigerator',
        name: '테이블냉장고',
        subcategories: [
          { id: 'table-1200', name: '1200' },
          { id: 'table-1500', name: '1500' },
          { id: 'table-1800', name: '1800' },
          { id: 'table-2100', name: '2100' }
        ]
      },
      {
        id: 'walk-in-refrigerator',
        name: '워크인냉장고',
        subcategories: [
          { id: 'walkin-small', name: '소형' },
          { id: 'walkin-medium', name: '중형' },
          { id: 'walkin-large', name: '대형' }
        ]
      },
      {
        id: 'commercial-refrigerator',
        name: '업소용냉장고',
        subcategories: [
          { id: 'comm-2door', name: '2도어' },
          { id: 'comm-4door', name: '4도어' },
          { id: 'comm-6door', name: '6도어' }
        ]
      }
    ]
  },
  {
    id: 'freezer',
    name: '냉동 설비',
    middle: [
      {
        id: 'freezer-unit',
        name: '냉동고',
        subcategories: [
          { id: 'commercial-freezer', name: '업소용' },
          { id: 'home-freezer', name: '가정용' }
        ]
      },
      {
        id: 'walk-in-freezer',
        name: '워크인냉동고',
        subcategories: [
          { id: 'wif-small', name: '소형' },
          { id: 'wif-medium', name: '중형' },
          { id: 'wif-large', name: '대형' }
        ]
      },
      {
        id: 'blast-freezer',
        name: '급속냉동고',
        subcategories: [
          { id: 'blast-standard', name: '표준' },
          { id: 'blast-special', name: '특수' }
        ]
      },
      {
        id: 'ice-cream-freezer',
        name: '아이스크림냉동고',
        subcategories: [
          { id: 'ice-open', name: '오픈형' },
          { id: 'ice-door', name: '도어형' }
        ]
      }
    ]
  },
  {
    id: 'ac-hvac',
    name: '에어컨/공조',
    middle: [
      {
        id: 'system-ac',
        name: '시스템에어컨',
        subcategories: [
          { id: 'ceiling', name: '천장형' },
          { id: 'duct', name: '덕트형' },
          { id: 'cassette', name: '카세트형' }
        ]
      },
      {
        id: 'stand-ac',
        name: '스탠드에어컨',
        subcategories: [
          { id: 'stand-inverter', name: '인버터' },
          { id: 'stand-standard', name: '일반' }
        ]
      },
      {
        id: 'multi-ac',
        name: '멀티에어컨',
        subcategories: [
          { id: 'multi-home', name: '가정용' },
          { id: 'multi-commercial', name: '상업용' }
        ]
      },
      {
        id: 'constant-temp-humidity',
        name: '항온항습기',
        subcategories: [
          { id: 'precision', name: '정밀' },
          { id: 'industrial', name: '산업용' }
        ]
      }
    ]
  },
  {
    id: 'ice-maker',
    name: '제빙기',
    middle: [
      {
        id: 'cube-ice',
        name: '큐브제빙기',
        subcategories: [
          { id: 'cube-small', name: '소형' },
          { id: 'cube-medium', name: '중형' },
          { id: 'cube-large', name: '대형' }
        ]
      },
      {
        id: 'flake-ice',
        name: '플레이크제빙기',
        subcategories: [
          { id: 'flake-standard', name: '표준' },
          { id: 'flake-high-capacity', name: '대용량' }
        ]
      }
    ]
  },
  {
    id: 'other-equipment',
    name: '기타 설비',
    middle: [
      {
        id: 'cooling-tower',
        name: '냉각탑',
        subcategories: [
          { id: 'ct-standard', name: '표준형' }
        ]
      },
      {
        id: 'chiller',
        name: '칠러',
        subcategories: [
          { id: 'chiller-air', name: '공랭식' },
          { id: 'chiller-water', name: '수랭식' }
        ]
      },
      {
        id: 'condensing-unit',
        name: '컨덴싱유닛',
        subcategories: [
          { id: 'cond-standard', name: '표준형' }
        ]
      }
    ]
  }
];

// ============================================================================
// 점검 항목 체크리스트
// ============================================================================

export interface InspectionItem {
  id: string;
  name: string;
  category: 'pressure-temp' | 'electrical' | 'refrigerant' | 'mechanical' | 'accessories';
}

export const INSPECTION_ITEMS: InspectionItem[] = [
  // 압력/온도
  { id: 'low-pressure', name: '저압 측정', category: 'pressure-temp' },
  { id: 'high-pressure', name: '고압 측정', category: 'pressure-temp' },
  { id: 'evap-temp', name: '증발 온도', category: 'pressure-temp' },
  { id: 'cond-temp', name: '응축 온도', category: 'pressure-temp' },

  // 전기/제어
  { id: 'power-status', name: '전원 상태', category: 'electrical' },
  { id: 'ground-status', name: '접지 상태', category: 'electrical' },
  { id: 'controller-operation', name: '컨트롤러 작동', category: 'electrical' },
  { id: 'sensor-status', name: '센서 상태', category: 'electrical' },

  // 냉매 계통
  { id: 'refrigerant-amount', name: '냉매량', category: 'refrigerant' },
  { id: 'leak-check', name: '누설 점검', category: 'refrigerant' },
  { id: 'oil-status', name: '오일 상태', category: 'refrigerant' },
  { id: 'dryer-status', name: '드라이어 상태', category: 'refrigerant' },

  // 기계 작동
  { id: 'compressor-noise', name: '압축기 소음', category: 'mechanical' },
  { id: 'fan-motor', name: '팬 모터', category: 'mechanical' },
  { id: 'vibration', name: '진동 상태', category: 'mechanical' },
  { id: 'drain-status', name: '배수 상태', category: 'mechanical' },

  // 부속품
  { id: 'filter-status', name: '필터 상태', category: 'accessories' },
  { id: 'door-packing', name: '도어 패킹', category: 'accessories' },
  { id: 'exterior', name: '외관 상태', category: 'accessories' },
  { id: 'pipe-insulation', name: '배관 단열', category: 'accessories' }
];

export const INSPECTION_CATEGORIES = {
  'pressure-temp': '압력/온도',
  'electrical': '전기/제어',
  'refrigerant': '냉매 계통',
  'mechanical': '기계 작동',
  'accessories': '부속품'
} as const;

// ============================================================================
// 발견 문제 프리셋
// ============================================================================

export interface IssuePreset {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'refrigerant' | 'mechanical' | 'electrical' | 'cleaning' | 'parts';
}

export const ISSUE_PRESETS: IssuePreset[] = [
  { id: 'refrigerant-low', name: '냉매 부족', severity: 'high', category: 'refrigerant' },
  { id: 'refrigerant-leak', name: '냉매 누설', severity: 'critical', category: 'refrigerant' },
  { id: 'condenser-dirty', name: '응축기 오염', severity: 'medium', category: 'cleaning' },
  { id: 'evaporator-frost', name: '증발기 성에', severity: 'medium', category: 'mechanical' },
  { id: 'fan-motor-issue', name: '팬모터 이상', severity: 'high', category: 'mechanical' },
  { id: 'compressor-noise', name: '압축기 소음', severity: 'high', category: 'mechanical' },
  { id: 'temp-uneven', name: '온도 불균일', severity: 'medium', category: 'mechanical' },
  { id: 'defrost-malfunction', name: '제상 불량', severity: 'medium', category: 'mechanical' },
  { id: 'drain-clog', name: '드레인 막힘', severity: 'medium', category: 'cleaning' },
  { id: 'door-packing-damage', name: '도어 패킹 손상', severity: 'medium', category: 'parts' },
  { id: 'controller-error', name: '컨트롤러 오류', severity: 'high', category: 'electrical' },
  { id: 'power-unstable', name: '전원 불안정', severity: 'high', category: 'electrical' }
];

export const ISSUE_SEVERITY_LABELS = {
  low: '낮음',
  medium: '보통',
  high: '높음',
  critical: '긴급'
} as const;

export const ISSUE_CATEGORY_LABELS = {
  refrigerant: '냉매',
  mechanical: '기계',
  electrical: '전기',
  cleaning: '청소',
  parts: '부품'
} as const;

// ============================================================================
// 권장사항 프리셋
// ============================================================================

export interface RecommendationPreset {
  id: string;
  name: string;
  type: 'maintenance' | 'repair' | 'replacement' | 'cleaning' | 'observation';
  urgency: 'immediate' | 'soon' | 'scheduled' | 'monitor';
}

export const RECOMMENDATION_PRESETS: RecommendationPreset[] = [
  {
    id: 'periodic-3month',
    name: '정기 점검 권장 (3개월)',
    type: 'maintenance',
    urgency: 'scheduled'
  },
  {
    id: 'periodic-6month',
    name: '정기 점검 권장 (6개월)',
    type: 'maintenance',
    urgency: 'scheduled'
  },
  {
    id: 'periodic-1year',
    name: '정기 점검 권장 (1년)',
    type: 'maintenance',
    urgency: 'scheduled'
  },
  {
    id: 'refrigerant-refill',
    name: '냉매 보충 필요',
    type: 'repair',
    urgency: 'soon'
  },
  {
    id: 'filter-replacement',
    name: '필터 교체 권장',
    type: 'replacement',
    urgency: 'soon'
  },
  {
    id: 'packing-replacement',
    name: '패킹 교체 권장',
    type: 'replacement',
    urgency: 'soon'
  },
  {
    id: 'fan-motor-replacement',
    name: '팬모터 교체 권장',
    type: 'replacement',
    urgency: 'soon'
  },
  {
    id: 'condenser-cleaning',
    name: '응축기 청소 필요',
    type: 'cleaning',
    urgency: 'soon'
  },
  {
    id: 'evaporator-cleaning',
    name: '증발기 청소 필요',
    type: 'cleaning',
    urgency: 'soon'
  },
  {
    id: 'filter-cleaning',
    name: '필터 청소 필요',
    type: 'cleaning',
    urgency: 'soon'
  },
  {
    id: 'repair-quote',
    name: '수리 필요 (견적 별도)',
    type: 'repair',
    urgency: 'immediate'
  },
  {
    id: 'equipment-replacement',
    name: '설비 교체 검토',
    type: 'replacement',
    urgency: 'monitor'
  },
  {
    id: 'observation',
    name: '경과 관찰',
    type: 'observation',
    urgency: 'monitor'
  }
];

export const RECOMMENDATION_TYPE_LABELS = {
  maintenance: '유지보수',
  repair: '수리',
  replacement: '교체',
  cleaning: '청소',
  observation: '관찰'
} as const;

export const RECOMMENDATION_URGENCY_LABELS = {
  immediate: '즉시',
  soon: '조속히',
  scheduled: '정기',
  monitor: '모니터'
} as const;

// ============================================================================
// 헬퍼 함수
// ============================================================================

/**
 * 설비 카테고리 전체 경로를 문자열로 반환
 */
export function getEquipmentPath(
  topId: string,
  middleId: string,
  subId: string
): string {
  const top = EQUIPMENT_CATEGORIES.find(c => c.id === topId);
  if (!top) return '';

  const middle = top.middle.find(m => m.id === middleId);
  if (!middle) return top.name;

  const sub = middle.subcategories.find(s => s.id === subId);
  if (!sub) return `${top.name} > ${middle.name}`;

  return `${top.name} > ${middle.name} > ${sub.name}`;
}

/**
 * 점검 항목을 카테고리별로 그룹화
 */
export function groupInspectionItemsByCategory(): Record<string, InspectionItem[]> {
  return INSPECTION_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, InspectionItem[]>);
}

/**
 * 문제 심각도별 필터링
 */
export function getIssuesBySeverity(severity: IssuePreset['severity']): IssuePreset[] {
  return ISSUE_PRESETS.filter(issue => issue.severity === severity);
}

/**
 * 권장사항 긴급도별 필터링
 */
export function getRecommendationsByUrgency(
  urgency: RecommendationPreset['urgency']
): RecommendationPreset[] {
  return RECOMMENDATION_PRESETS.filter(rec => rec.urgency === urgency);
}
