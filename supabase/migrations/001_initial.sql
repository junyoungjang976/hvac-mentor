-- HVAC Mentor 초기 스키마

-- 1. 설비 테이블 (먼저 생성 - 참조되는 테이블)
CREATE TABLE IF NOT EXISTS hvac_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  name TEXT NOT NULL,
  location TEXT,
  refrigerant TEXT NOT NULL,
  model TEXT,
  serial_number TEXT,
  install_date DATE,

  -- 정상 운전 기준
  normal_low_p_min DECIMAL(4,2),
  normal_low_p_max DECIMAL(4,2),

  notes TEXT
);

-- 2. 진단 기록 테이블
CREATE TABLE IF NOT EXISTS hvac_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 설비 정보
  refrigerant TEXT NOT NULL, -- R-22, R-404A, R-134a
  facility_type TEXT NOT NULL, -- 냉장, 냉동, 초저온

  -- 측정값
  low_pressure DECIMAL(5,2) NOT NULL,
  high_pressure DECIMAL(5,2) NOT NULL,
  ambient_temp DECIMAL(4,1),
  superheat DECIMAL(4,1),
  subcooling DECIMAL(4,1),

  -- 진단 결과
  severity TEXT NOT NULL, -- 정상, 주의, 경고, 위험
  issues TEXT[] DEFAULT '{}',
  actions TEXT[] DEFAULT '{}',
  pattern_key TEXT,

  -- AI 응답
  ai_response TEXT,

  -- 메타데이터
  equipment_id UUID REFERENCES hvac_equipment(id),
  technician_name TEXT,
  notes TEXT
);

-- 3. 체크리스트 완료 기록
CREATE TABLE IF NOT EXISTS hvac_checklist_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  equipment_id UUID REFERENCES hvac_equipment(id),
  checklist_type TEXT NOT NULL, -- 일일, 주간, 월간, 계절
  completed_items JSONB DEFAULT '[]',
  technician_name TEXT,
  notes TEXT
);

-- 4. 인덱스
CREATE INDEX IF NOT EXISTS idx_diagnoses_created ON hvac_diagnoses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diagnoses_equipment ON hvac_diagnoses(equipment_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_severity ON hvac_diagnoses(severity);
CREATE INDEX IF NOT EXISTS idx_equipment_refrigerant ON hvac_equipment(refrigerant);
CREATE INDEX IF NOT EXISTS idx_checklist_equipment ON hvac_checklist_records(equipment_id);
CREATE INDEX IF NOT EXISTS idx_checklist_created ON hvac_checklist_records(created_at DESC);

-- 5. RLS 정책 활성화
ALTER TABLE hvac_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac_checklist_records ENABLE ROW LEVEL SECURITY;

-- 6. 공개 읽기/쓰기 정책 (인증 없이 사용 가능)
CREATE POLICY "Allow public read hvac_equipment" ON hvac_equipment FOR SELECT USING (true);
CREATE POLICY "Allow public insert hvac_equipment" ON hvac_equipment FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update hvac_equipment" ON hvac_equipment FOR UPDATE USING (true);

CREATE POLICY "Allow public read hvac_diagnoses" ON hvac_diagnoses FOR SELECT USING (true);
CREATE POLICY "Allow public insert hvac_diagnoses" ON hvac_diagnoses FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read hvac_checklist_records" ON hvac_checklist_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert hvac_checklist_records" ON hvac_checklist_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update hvac_checklist_records" ON hvac_checklist_records FOR UPDATE USING (true);
