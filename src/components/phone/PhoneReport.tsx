import ReportTab from '../tabs/ReportTab'

interface PhoneReportProps {
  refrigerant?: 'R-22' | 'R-404A' | 'R-134a'
  facilityType?: string
  lowPressure?: number
  highPressure?: number
  diagnosisResult?: {
    severity: '정상' | '주의' | '경고' | '위험'
    issues: string[]
    actions: string[]
  } | null
}

export default function PhoneReport(props: PhoneReportProps) {
  return (
    <div className="phone-report">
      <style>{`
        .phone-report .card {
          margin: 1rem;
          border-radius: 1rem;
        }
        .phone-report input,
        .phone-report select,
        .phone-report textarea {
          font-size: 16px !important; /* Prevent iOS zoom */
        }
        .phone-report #report-card {
          transform: scale(0.85);
          transform-origin: top center;
          margin-bottom: -60px;
        }
      `}</style>
      <ReportTab {...props} />
    </div>
  )
}
