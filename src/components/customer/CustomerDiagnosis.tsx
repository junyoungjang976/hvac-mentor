'use client'

import { useState, useCallback } from 'react'
import CustomerLayout from '../../layouts/CustomerLayout'
import EquipmentSelect from './EquipmentSelect'
import SymptomSelect from './SymptomSelect'
import DetailQuestions from './DetailQuestions'
import SelfCheckGuide from './SelfCheckGuide'
import DiagnosisResult from './DiagnosisResult'
import {
  calculateDiagnosis,
  getWorkflowForSymptoms,
  type DiagnosisResult as DiagnosisResultType,
  type WorkflowRecommendation,
} from '../../data/customerDiagnosis'

export interface CustomerDiagnosisData {
  code: string
  equipment: string
  symptoms: string[]
  detailAnswers: Record<string, string[]>
  selfCheckResults: Record<string, boolean>
  minDiagnosis: DiagnosisResultType
  maxDiagnosis: DiagnosisResultType
  workflow: WorkflowRecommendation | null
  createdAt: Date
}

interface CustomerDiagnosisProps {
  onComplete: (data: CustomerDiagnosisData) => void
  onSwitchToEngineer: () => void
}

const generateCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default function CustomerDiagnosis({
  onComplete,
  onSwitchToEngineer,
}: CustomerDiagnosisProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedEquipment, setSelectedEquipment] = useState<string>('')
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [detailAnswers, setDetailAnswers] = useState<Record<string, string[]>>({})
  const [selfCheckResults, setSelfCheckResults] = useState<Record<string, boolean>>({})
  const [diagnosisCode, setDiagnosisCode] = useState<string>('')

  const handleEquipmentSelect = useCallback((equipment: string) => {
    setSelectedEquipment(equipment)
  }, [])

  const handleEquipmentNext = useCallback(() => {
    if (selectedEquipment) {
      setCurrentStep(2)
    }
  }, [selectedEquipment])

  const handleSymptomToggle = useCallback((symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    )
  }, [])

  const handleSymptomNext = useCallback(() => {
    if (selectedSymptoms.length > 0) {
      setCurrentStep(3)
    }
  }, [selectedSymptoms])

  const handleSymptomBack = useCallback(() => {
    setCurrentStep(1)
  }, [])

  const handleDetailAnswer = useCallback((questionId: string, answers: string[]) => {
    setDetailAnswers((prev) => ({
      ...prev,
      [questionId]: answers,
    }))
  }, [])

  const handleDetailNext = useCallback(() => {
    setCurrentStep(4)
  }, [])

  const handleDetailBack = useCallback(() => {
    setCurrentStep(2)
  }, [])

  const handleSelfCheckToggle = useCallback((checkId: string) => {
    setSelfCheckResults((prev) => ({
      ...prev,
      [checkId]: !prev[checkId],
    }))
  }, [])

  const handleSelfCheckNext = useCallback(() => {
    const code = generateCode()
    setDiagnosisCode(code)
    setCurrentStep(5)
  }, [])

  const handleSelfCheckBack = useCallback(() => {
    setCurrentStep(3)
  }, [])

  const handleResultShare = useCallback(
    (method: string) => {
      if (!diagnosisCode) return

      const minDiagnosis = calculateDiagnosis(selectedSymptoms, detailAnswers, 'min')
      const maxDiagnosis = calculateDiagnosis(selectedSymptoms, detailAnswers, 'max')
      const workflow = getWorkflowForSymptoms(selectedSymptoms)

      const data: CustomerDiagnosisData = {
        code: diagnosisCode,
        equipment: selectedEquipment,
        symptoms: selectedSymptoms,
        detailAnswers,
        selfCheckResults,
        minDiagnosis,
        maxDiagnosis,
        workflow,
        createdAt: new Date(),
      }

      if (method === 'engineer') {
        onSwitchToEngineer()
      } else {
        onComplete(data)
      }
    },
    [
      diagnosisCode,
      selectedEquipment,
      selectedSymptoms,
      detailAnswers,
      selfCheckResults,
      onComplete,
      onSwitchToEngineer,
    ]
  )

  const handleResultBack = useCallback(() => {
    setCurrentStep(4)
  }, [])

  const handleRestart = useCallback(() => {
    setCurrentStep(1)
    setSelectedEquipment('')
    setSelectedSymptoms([])
    setDetailAnswers({})
    setSelfCheckResults({})
    setDiagnosisCode('')
  }, [])

  // Calculate diagnosis data for Step 5
  const minDiagnosis = currentStep === 5
    ? calculateDiagnosis(selectedSymptoms, detailAnswers, 'min')
    : null
  const maxDiagnosis = currentStep === 5
    ? calculateDiagnosis(selectedSymptoms, detailAnswers, 'max')
    : null
  const workflow = currentStep === 5
    ? getWorkflowForSymptoms(selectedSymptoms)
    : null

  const stepTitles = [
    '장비 선택',
    '증상 선택',
    '상세 질문',
    '자가 점검',
    '진단 결과',
  ]

  const getStepHandlers = () => {
    switch (currentStep) {
      case 1:
        return {
          canGoBack: false,
          canGoNext: selectedEquipment !== '',
          onBack: () => {},
          onNext: handleEquipmentNext,
        }
      case 2:
        return {
          canGoBack: true,
          canGoNext: selectedSymptoms.length > 0,
          onBack: handleSymptomBack,
          onNext: handleSymptomNext,
        }
      case 3:
        return {
          canGoBack: true,
          canGoNext: true,
          onBack: handleDetailBack,
          onNext: handleDetailNext,
        }
      case 4:
        return {
          canGoBack: true,
          canGoNext: true,
          onBack: handleSelfCheckBack,
          onNext: handleSelfCheckNext,
        }
      case 5:
        return {
          canGoBack: true,
          canGoNext: false,
          onBack: handleResultBack,
          onNext: () => {},
        }
      default:
        return {
          canGoBack: false,
          canGoNext: false,
          onBack: () => {},
          onNext: () => {},
        }
    }
  }

  const handlers = getStepHandlers()

  return (
    <CustomerLayout
      currentStep={currentStep}
      totalSteps={5}
      stepTitle={stepTitles[currentStep - 1]}
      canGoBack={handlers.canGoBack}
      canGoNext={handlers.canGoNext}
      onBack={handlers.onBack}
      onNext={handlers.onNext}
      onSwitchToEngineer={onSwitchToEngineer}
      isLastStep={currentStep === 5}
    >
      {/* Step Content */}
      {currentStep === 1 && (
        <EquipmentSelect
          selectedEquipment={selectedEquipment}
          onSelect={handleEquipmentSelect}
        />
      )}

      {currentStep === 2 && (
        <SymptomSelect
          selectedSymptoms={selectedSymptoms}
          onToggle={handleSymptomToggle}
        />
      )}

      {currentStep === 3 && (
        <DetailQuestions
          selectedSymptoms={selectedSymptoms}
          answers={detailAnswers}
          onAnswer={handleDetailAnswer}
        />
      )}

      {currentStep === 4 && (
        <SelfCheckGuide
          checkResults={selfCheckResults}
          onToggle={handleSelfCheckToggle}
        />
      )}

      {currentStep === 5 && minDiagnosis && maxDiagnosis && (
        <DiagnosisResult
          code={diagnosisCode}
          equipment={selectedEquipment}
          symptoms={selectedSymptoms}
          minDiagnosis={minDiagnosis}
          maxDiagnosis={maxDiagnosis}
          workflow={workflow}
          onShare={handleResultShare}
          onRestart={handleRestart}
        />
      )}
    </CustomerLayout>
  )
}
