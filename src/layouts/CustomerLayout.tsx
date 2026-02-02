import { ArrowLeft, ArrowRight, Settings } from 'lucide-react'

interface CustomerLayoutProps {
  children: React.ReactNode
  currentStep: number
  totalSteps: number
  stepTitle: string
  canGoBack: boolean
  canGoNext: boolean
  nextLabel?: string
  onBack: () => void
  onNext: () => void
  onSwitchToEngineer: () => void
  onSubmit?: () => void
  isLastStep?: boolean
}

export default function CustomerLayout({
  children,
  currentStep,
  totalSteps,
  stepTitle,
  canGoBack,
  canGoNext,
  nextLabel = '다음',
  onBack,
  onNext,
  onSwitchToEngineer,
  onSubmit,
  isLastStep = false,
}: CustomerLayoutProps) {
  const handleNext = () => {
    if (isLastStep && onSubmit) {
      onSubmit()
    } else {
      onNext()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 flex flex-col">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b border-teal-100">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teal-700">고객 자가 진단</h1>
              <p className="text-sm text-teal-600 mt-1">설비 점검 요청</p>
            </div>
            <button
              onClick={onSwitchToEngineer}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings size={18} />
              <span className="hidden sm:inline">기술자 모드</span>
            </button>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="bg-white border-b border-teal-100">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              단계 {currentStep} / {totalSteps}
            </span>
            <span className="text-sm text-gray-500">{stepTitle}</span>
          </div>
          <div className="relative">
            <div className="h-2 bg-teal-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            {/* Step dots */}
            <div className="absolute top-0 left-0 right-0 flex justify-between">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div
                  key={step}
                  className={`w-6 h-6 -mt-2 rounded-full border-2 transition-all ${
                    step < currentStep
                      ? 'bg-teal-500 border-teal-500'
                      : step === currentStep
                      ? 'bg-white border-teal-500 ring-4 ring-teal-100'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {step < currentStep && (
                    <svg
                      className="w-full h-full text-white p-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            {children}
          </div>
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="bg-white border-t border-teal-100 safe-area-bottom">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onBack}
              disabled={!canGoBack}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                canGoBack
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">이전</span>
            </button>

            <div className="flex-1 text-center text-sm text-gray-500">
              {currentStep} / {totalSteps}
            </div>

            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                canGoNext
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:-translate-y-0.5'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{isLastStep ? '완료' : nextLabel}</span>
              {!isLastStep && <ArrowRight size={20} />}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
