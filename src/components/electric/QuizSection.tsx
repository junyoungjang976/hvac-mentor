import { useState } from 'react'
import { CIRCUIT_QUIZ, type QuizQuestion } from '../../data/circuitLearning'

interface QuizState {
  currentIndex: number
  answers: Record<string, number>
  showResult: boolean
  showExplanation: Record<string, boolean>
}

const getDifficultyColor = (difficulty: QuizQuestion['difficulty']): string => {
  const colors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700'
  }
  return colors[difficulty]
}

const getDifficultyLabel = (difficulty: QuizQuestion['difficulty']): string => {
  const labels = {
    beginner: '초급',
    intermediate: '중급',
    advanced: '고급'
  }
  return labels[difficulty]
}

export default function QuizSection() {
  const [state, setState] = useState<QuizState>({
    currentIndex: 0,
    answers: {},
    showResult: false,
    showExplanation: {}
  })

  const [mode, setMode] = useState<'quiz' | 'practice'>('practice')

  const currentQuestion = CIRCUIT_QUIZ[state.currentIndex]

  const handleAnswer = (questionId: string, optionIndex: number) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: optionIndex }
    }))
  }

  const toggleExplanation = (questionId: string) => {
    setState(prev => ({
      ...prev,
      showExplanation: {
        ...prev.showExplanation,
        [questionId]: !prev.showExplanation[questionId]
      }
    }))
  }

  const handleNext = () => {
    if (state.currentIndex < CIRCUIT_QUIZ.length - 1) {
      setState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }))
    } else {
      setState(prev => ({ ...prev, showResult: true }))
    }
  }

  const handlePrev = () => {
    if (state.currentIndex > 0) {
      setState(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }))
    }
  }

  const handleReset = () => {
    setState({
      currentIndex: 0,
      answers: {},
      showResult: false,
      showExplanation: {}
    })
  }

  const calculateScore = () => {
    return CIRCUIT_QUIZ.reduce((score, q) => {
      return state.answers[q.id] === q.correctIndex ? score + 1 : score
    }, 0)
  }

  // Practice Mode - Show all questions
  if (mode === 'practice') {
    return (
      <div className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode('practice')}
            className="px-4 py-2 rounded-lg font-medium bg-purple-600 text-white min-h-[48px]"
          >
            연습 모드
          </button>
          <button
            onClick={() => {
              setMode('quiz')
              handleReset()
            }}
            className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 min-h-[48px]"
          >
            퀴즈 모드
          </button>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-purple-800">
            연습 모드에서는 모든 문제와 해설을 자유롭게 볼 수 있습니다.
          </p>
        </div>

        {/* All Questions */}
        <div className="space-y-4">
          {CIRCUIT_QUIZ.map((question, qIndex) => {
            const selectedAnswer = state.answers[question.id]
            const isCorrect = selectedAnswer === question.correctIndex
            const showExpl = state.showExplanation[question.id]

            return (
              <div key={question.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-gray-500">Q{qIndex + 1}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(question.difficulty)}`}>
                    {getDifficultyLabel(question.difficulty)}
                  </span>
                </div>

                <p className="font-medium text-gray-800 mb-4">{question.question}</p>

                <div className="space-y-2 mb-4">
                  {question.options.map((option, i) => {
                    const isSelected = selectedAnswer === i
                    const isCorrectOption = i === question.correctIndex

                    let optionClass = 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    if (selectedAnswer !== undefined) {
                      if (isCorrectOption) {
                        optionClass = 'bg-green-100 text-green-800 border-green-300'
                      } else if (isSelected && !isCorrect) {
                        optionClass = 'bg-red-100 text-red-800 border-red-300'
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(question.id, i)}
                        className={`w-full p-3 rounded-lg text-left transition-all border ${optionClass} min-h-[48px]`}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                        {option}
                      </button>
                    )
                  })}
                </div>

                {/* Explanation Toggle */}
                <button
                  onClick={() => toggleExplanation(question.id)}
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  {showExpl ? '해설 숨기기' : '해설 보기'}
                </button>

                {showExpl && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 text-sm">{question.explanation}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Quiz Mode - One question at a time
  if (state.showResult) {
    const score = calculateScore()
    const total = CIRCUIT_QUIZ.length
    const percentage = Math.round((score / total) * 100)

    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">퀴즈 결과</h3>

          <div className="text-6xl font-bold mb-4">
            <span className={percentage >= 70 ? 'text-green-600' : 'text-red-600'}>
              {score}
            </span>
            <span className="text-gray-400">/{total}</span>
          </div>

          <p className={`text-lg font-medium mb-6 ${percentage >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
            {percentage >= 80 ? '훌륭합니다!' :
             percentage >= 60 ? '좋아요! 조금 더 학습하면 완벽해요.' :
             '다시 한번 학습해 보세요.'}
          </p>

          <div className="space-y-2">
            <button
              onClick={handleReset}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 min-h-[48px]"
            >
              다시 풀기
            </button>
            <button
              onClick={() => setMode('practice')}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 min-h-[48px]"
            >
              해설 보기 (연습 모드)
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('practice')}
          className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 min-h-[48px]"
        >
          연습 모드
        </button>
        <button
          onClick={() => setMode('quiz')}
          className="px-4 py-2 rounded-lg font-medium bg-purple-600 text-white min-h-[48px]"
        >
          퀴즈 모드
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all"
            style={{ width: `${((state.currentIndex + 1) / CIRCUIT_QUIZ.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-500">
          {state.currentIndex + 1} / {CIRCUIT_QUIZ.length}
        </span>
      </div>

      {/* Current Question */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(currentQuestion.difficulty)}`}>
            {getDifficultyLabel(currentQuestion.difficulty)}
          </span>
        </div>

        <p className="font-medium text-gray-800 text-lg mb-6">{currentQuestion.question}</p>

        <div className="space-y-2">
          {currentQuestion.options.map((option, i) => {
            const isSelected = state.answers[currentQuestion.id] === i

            return (
              <button
                key={i}
                onClick={() => handleAnswer(currentQuestion.id, i)}
                className={`w-full p-4 rounded-lg text-left transition-all border min-h-[52px] ${
                  isSelected
                    ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                {option}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={state.currentIndex === 0}
          className={`px-6 py-3 rounded-lg font-medium min-h-[48px] ${
            state.currentIndex === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          이전
        </button>
        <button
          onClick={handleNext}
          disabled={state.answers[currentQuestion.id] === undefined}
          className={`px-6 py-3 rounded-lg font-medium min-h-[48px] ${
            state.answers[currentQuestion.id] === undefined
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {state.currentIndex === CIRCUIT_QUIZ.length - 1 ? '결과 보기' : '다음'}
        </button>
      </div>
    </div>
  )
}
