'use client'

import { HelpCircle, CheckCircle2, Circle } from 'lucide-react'
import { getQuestionsForSymptom, getSymptomName, type DetailQuestion } from '../../data/customerDiagnosis'

interface DetailQuestionsProps {
  selectedSymptoms: string[]
  answers: Record<string, string[]>
  onAnswer: (questionId: string, answers: string[]) => void
}

export default function DetailQuestions({ selectedSymptoms, answers, onAnswer }: DetailQuestionsProps) {
  // Get all questions for selected symptoms
  const allQuestions: DetailQuestion[] = []
  selectedSymptoms.forEach(symptomId => {
    const questions = getQuestionsForSymptom(symptomId)
    allQuestions.push(...questions)
  })

  const handleSingleChoice = (questionId: string, optionValue: string) => {
    onAnswer(questionId, [optionValue])
  }

  const handleMultipleChoice = (questionId: string, optionValue: string) => {
    const currentAnswers = answers[questionId] || []
    if (currentAnswers.includes(optionValue)) {
      onAnswer(questionId, currentAnswers.filter(v => v !== optionValue))
    } else {
      onAnswer(questionId, [...currentAnswers, optionValue])
    }
  }

  const renderQuestion = (question: DetailQuestion) => {
    const currentAnswers = answers[question.id] || []
    const symptomName = getSymptomName(question.symptomId)

    return (
      <div key={question.id} className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Question Header */}
        <div className="mb-4">
          <div className="flex items-start gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm text-teal-600 font-medium mb-1">
                [{symptomName}]
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {question.question}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </h3>
            </div>
          </div>
          {question.type === 'multiple' && (
            <p className="text-sm text-gray-500 ml-7">
              (여러 개 선택 가능)
            </p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map(option => {
            const isSelected = currentAnswers.includes(option.value)

            return (
              <button
                key={option.id}
                onClick={() => {
                  if (question.type === 'single') {
                    handleSingleChoice(question.id, option.value)
                  } else {
                    handleMultipleChoice(question.id, option.value)
                  }
                }}
                className={`
                  w-full flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all
                  ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-teal-300 hover:shadow-sm'
                  }
                `}
              >
                {/* Radio/Checkbox Indicator */}
                <div className="flex-shrink-0">
                  {question.type === 'single' ? (
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${isSelected ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}
                    `}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                  ) : (
                    isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300" />
                    )
                  )}
                </div>

                {/* Label */}
                <span className={`font-medium ${isSelected ? 'text-teal-900' : 'text-gray-700'}`}>
                  {option.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (allQuestions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            상세 질문
          </h2>
          <p className="text-gray-600">
            선택한 증상에 대한 추가 정보를 알려주세요
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <p className="text-gray-700">
            선택한 증상에 대한 추가 질문이 없습니다. 다음 단계로 진행해주세요.
          </p>
        </div>
      </div>
    )
  }

  const answeredCount = allQuestions.filter(q => {
    const ans = answers[q.id] || []
    return ans.length > 0
  }).length

  const requiredQuestions = allQuestions.filter(q => q.required)
  const answeredRequiredCount = requiredQuestions.filter(q => {
    const ans = answers[q.id] || []
    return ans.length > 0
  }).length

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          상세 질문
        </h2>
        <p className="text-gray-600">
          선택한 증상에 대한 추가 정보를 알려주세요
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-900">
            답변 진행률
          </span>
          <span className="text-sm text-gray-600">
            {answeredCount}/{allQuestions.length} 완료
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full transition-all duration-300"
            style={{ width: `${(answeredCount / allQuestions.length) * 100}%` }}
          />
        </div>
        {requiredQuestions.length > 0 && (
          <p className="text-xs text-gray-600 mt-2">
            필수 질문: {answeredRequiredCount}/{requiredQuestions.length} 완료
          </p>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {allQuestions.map(question => renderQuestion(question))}
      </div>

      {/* Help Text */}
      <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">질문 답변 안내</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <span className="text-red-500">*</span> 표시가 있는 질문은 필수 항목입니다</li>
              <li>• 정확한 진단을 위해 솔직하게 답변해주세요</li>
              <li>• 확실하지 않으면 &quot;모르겠음&quot;을 선택해주세요</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
