# HVAC Mentor Enhancement Specification

## Requirements Analysis

### Functional Requirements
| ID | Requirement |
|----|-------------|
| FR-1 | Display 2 walk-in refrigerator circuit diagram images in electric tab |
| FR-2 | Show circuit descriptions: main components (MC, THR, TIC), control sequence, fault diagnosis points |
| FR-3 | Electrical parts dictionary with definitions for: MC, THR, NFB, TIC, DPS, F.HPC, 52C, OL |
| FR-4 | Pipe sizing guide: size by refrigerant type, equivalent pipe length, oil return considerations |
| FR-5 | Oil compatibility chart: refrigerant-oil combinations, mixing warnings |
| FR-6 | Defrost cycle guide: electric/hot gas/natural defrost types, cycle timing, drain management |
| FR-7 | Navigate to electric circuit tab from main interface |

### Non-Functional Requirements
| ID | Requirement |
|----|-------------|
| NFR-1 | Images load in <2 seconds on 4G |
| NFR-2 | Readable on mobile screens (320px min width) |
| NFR-3 | TypeScript strict mode compliance, no `any` types |
| NFR-4 | Components <150 lines each |
| NFR-5 | Consistent UI patterns |
| NFR-6 | Korean language interface |

## Technical Architecture

### New File Structure
```
src/
├── data/
│   ├── electricCircuit.ts      # NEW
│   ├── pipeSizing.ts           # NEW
│   ├── oilCompatibility.ts     # NEW
│   └── defrostCycle.ts         # NEW
├── components/
│   ├── tabs/
│   │   ├── DiagnosisTab.tsx    # EXTRACT
│   │   ├── FaultsTab.tsx       # EXTRACT
│   │   ├── EmergencyTab.tsx    # EXTRACT
│   │   ├── ChecklistTab.tsx    # EXTRACT
│   │   ├── ChargingTab.tsx     # EXTRACT
│   │   ├── ReportTab.tsx       # EXTRACT
│   │   └── ElectricTab.tsx     # NEW
│   ├── electric/
│   │   ├── CircuitDiagram.tsx  # NEW
│   │   ├── ComponentDict.tsx   # NEW
│   │   ├── PipeSizing.tsx      # NEW
│   │   ├── OilChart.tsx        # NEW
│   │   └── DefrostGuide.tsx    # NEW
│   └── common/
│       ├── Card.tsx            # EXTRACT
│       └── LazyImage.tsx       # NEW
└── App.tsx                     # REFACTOR
```

### Image Assets
- `public/circuits/walk-in-diagram-1.jpg`
- `public/circuits/walk-in-diagram-2.jpg`

## Implementation Phases

### Phase 1: Data Layer
Create 4 data files with complete HVAC technical content

### Phase 2: Component Extraction
Extract existing tab contents into separate components

### Phase 3: Electric Tab Implementation
Build new electrical circuit tab with sub-components

### Phase 4: Image Setup
Copy and optimize circuit diagram images

### Phase 5: Integration
Wire everything together and test
