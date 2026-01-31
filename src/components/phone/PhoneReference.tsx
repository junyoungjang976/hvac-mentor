import { useState } from 'react'
import { ChevronDown, ChevronUp, BookOpen, AlertTriangle, CheckSquare, Syringe, GraduationCap } from 'lucide-react'
import { FAULT_PATTERNS } from '../../data/faultPatterns'
import { EMERGENCY_MANUAL } from '../../data/emergency'
import { CHECKLIST } from '../../data/checklist'
import { CHARGING_GUIDE } from '../../data/chargingGuide'
import { REFRIGERATION_QUIZ, shuffleQuizArray, type RefrigerationQuizQuestion } from '../../data/refrigerationQuiz'

type SectionId = 'faults' | 'emergency' | 'checklist' | 'charging' | 'quiz'

export default function PhoneReference() {
  const [openSection, setOpenSection] = useState<SectionId | null>('faults')
  const [openItem, setOpenItem] = useState<string | null>(null)

  // Quiz state
  const QUIZ_SIZE = 5
  const [quizQuestions, setQuizQuestions] = useState<RefrigerationQuizQuestion[]>(() =>
    shuffleQuizArray([...REFRIGERATION_QUIZ]).slice(0, QUIZ_SIZE)
  )
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const currentQuestion = quizQuestions[currentQuestionIndex]

  const toggleSection = (id: SectionId) => {
    setOpenSection(openSection === id ? null : id)
    setOpenItem(null)
  }

  const handleAnswerSelect = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    setShowResult(true)
    if (selectedAnswer === currentQuestion.correctIndex) {
      setCorrectCount(prev => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const handleRestartQuiz = () => {
    setQuizQuestions(shuffleQuizArray([...REFRIGERATION_QUIZ]).slice(0, QUIZ_SIZE))
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setCorrectCount(0)
    setQuizCompleted(false)
  }

  const sections = [
    { id: 'faults' as const, label: '고장 패턴', icon: BookOpen, color: 'text-blue-600' },
    { id: 'emergency' as const, label: '비상 대응', icon: AlertTriangle, color: 'text-red-600' },
    { id: 'checklist' as const, label: '체크리스트', icon: CheckSquare, color: 'text-green-600' },
    { id: 'charging' as const, label: '충전 가이드', icon: Syringe, color: 'text-purple-600' },
    { id: 'quiz' as const, label: '냉동 퀴즈', icon: GraduationCap, color: 'text-indigo-600' },
  ]

  return (
    <div className="p-4 space-y-2">
      {sections.map((section) => (
        <div key={section.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Section Header */}
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <section.icon className={section.color} size={24} />
              <span className="font-bold text-slate-800">{section.label}</span>
            </div>
            {openSection === section.id ? <ChevronUp /> : <ChevronDown />}
          </button>

          {/* Section Content */}
          {openSection === section.id && (
            <div className="px-4 pb-4">
              {/* Fault Patterns */}
              {section.id === 'faults' && (
                <div className="space-y-2">
                  {Object.entries(FAULT_PATTERNS).map(([key, pattern]) => (
                    <div key={key} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenItem(openItem === key ? null : key)}
                        className="w-full p-3 text-left flex justify-between items-center bg-slate-50"
                      >
                        <span className="font-medium text-sm">{key}</span>
                        {openItem === key ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {openItem === key && (
                        <div className="p-3 space-y-3 text-sm">
                          <div>
                            <p className="text-slate-500 text-xs mb-1">원인</p>
                            <p>{pattern.원인.join(', ')}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-1">증상</p>
                            <p>{pattern.증상.join(', ')}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-1">조치</p>
                            <ul className="space-y-1">
                              {pattern.조치.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                          </div>
                          <div className="p-2 bg-yellow-50 rounded-lg">
                            <p className="text-yellow-800 text-xs">⚠️ {pattern.주의}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Emergency Manual */}
              {section.id === 'emergency' && (
                <div className="space-y-2">
                  {Object.entries(EMERGENCY_MANUAL).map(([key, item]) => (
                    <div key={key} className="border-l-4 border-red-500 bg-red-50 rounded-r-xl p-3">
                      <h4 className="font-bold text-red-800 mb-1">{key}</h4>
                      <p className="text-xs text-red-600 mb-2">{item.기준}</p>
                      <p className="text-sm text-red-700 mb-2">{item.위험}</p>
                      <div className="space-y-1 mb-2">
                        {item.즉시조치.map((a, i) => (
                          <p key={i} className="text-sm">{a}</p>
                        ))}
                      </div>
                      <p className="text-xs font-bold text-red-800">{item.금지사항}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Checklist */}
              {section.id === 'checklist' && (
                <div className="space-y-4">
                  {Object.entries(CHECKLIST).map(([category, items]) => (
                    <div key={category}>
                      <h4 className="font-medium text-green-700 mb-2 text-sm">{category}</h4>
                      <div className="space-y-2">
                        {items.map(([name, desc], i) => (
                          <label key={i} className="flex items-start gap-3 p-2 bg-slate-50 rounded-lg">
                            <input type="checkbox" className="mt-1 w-5 h-5 accent-green-600" />
                            <div>
                              <p className="font-medium text-sm">{name}</p>
                              <p className="text-xs text-slate-500">{desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Charging Guide */}
              {section.id === 'charging' && (
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-purple-700 mb-2">충전 전 준비</h4>
                    <ul className="space-y-1">
                      {CHARGING_GUIDE["충전 전 준비"].map((item, i) => (
                        <li key={i} className="text-slate-600">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-700 mb-2">냉매별 충전 방법</h4>
                    <div className="space-y-2">
                      {Object.entries(CHARGING_GUIDE["충전 방법"]).map(([ref, methods]) => (
                        <div key={ref} className="bg-purple-50 p-3 rounded-xl">
                          <p className="font-medium mb-1">{ref}</p>
                          <ul className="text-xs space-y-1">
                            {methods.map((m, i) => <li key={i}>{m}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl">
                    <h4 className="font-medium text-green-700 mb-2">충전 완료 기준</h4>
                    <ul className="text-xs space-y-1">
                      {CHARGING_GUIDE["충전 완료 기준"].map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Refrigeration Quiz */}
              {section.id === 'quiz' && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500">
                    총 {REFRIGERATION_QUIZ.length}문제 중 {QUIZ_SIZE}문제가 랜덤 출제됩니다
                  </p>

                  {quizCompleted ? (
                    // Quiz Result
                    <div className="bg-slate-50 rounded-xl p-6 text-center">
                      <div className="text-5xl mb-3">
                        {correctCount >= quizQuestions.length * 0.8 ? '🏆' :
                         correctCount >= quizQuestions.length * 0.5 ? '👍' : '📚'}
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 mb-2">퀴즈 완료!</h4>
                      <p className="text-2xl font-bold text-indigo-600 mb-2">
                        {correctCount} / {quizQuestions.length}
                      </p>
                      <p className="text-slate-600 text-sm mb-4">
                        {correctCount >= quizQuestions.length * 0.8
                          ? '훌륭합니다!'
                          : correctCount >= quizQuestions.length * 0.5
                          ? '잘했어요!'
                          : '다시 학습해보세요!'}
                      </p>
                      <button
                        onClick={handleRestartQuiz}
                        className="w-full py-3 bg-indigo-500 text-white rounded-xl font-bold"
                      >
                        🔄 새 퀴즈 풀기
                      </button>
                    </div>
                  ) : (
                    // Quiz Question
                    <div className="space-y-3">
                      {/* Progress */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 transition-all"
                            style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          {currentQuestionIndex + 1}/{quizQuestions.length}
                        </span>
                      </div>

                      {/* Question */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${
                          currentQuestion.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                          currentQuestion.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {currentQuestion.difficulty === 'beginner' ? '초급' :
                           currentQuestion.difficulty === 'intermediate' ? '중급' : '고급'}
                        </span>
                        <p className="font-bold text-slate-800">{currentQuestion.question}</p>
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        {currentQuestion.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={showResult}
                            className={`w-full p-3 rounded-xl text-left text-sm transition-all ${
                              showResult
                                ? index === currentQuestion.correctIndex
                                  ? 'bg-green-100 border-2 border-green-500'
                                  : index === selectedAnswer
                                  ? 'bg-red-100 border-2 border-red-500'
                                  : 'bg-white border-2 border-transparent'
                                : selectedAnswer === index
                                ? 'bg-indigo-100 border-2 border-indigo-500'
                                : 'bg-white border-2 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                showResult
                                  ? index === currentQuestion.correctIndex
                                    ? 'bg-green-500 text-white'
                                    : index === selectedAnswer
                                    ? 'bg-red-500 text-white'
                                    : 'bg-slate-200 text-slate-600'
                                  : selectedAnswer === index
                                  ? 'bg-indigo-500 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}>
                                {index + 1}
                              </span>
                              <span className="font-medium">{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Explanation */}
                      {showResult && (
                        <div className={`p-3 rounded-xl text-sm ${
                          selectedAnswer === currentQuestion.correctIndex
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-blue-50 border border-blue-200'
                        }`}>
                          <p className="font-bold mb-1">
                            {selectedAnswer === currentQuestion.correctIndex ? '✅ 정답!' : '❌ 오답'}
                          </p>
                          <p className="text-slate-700">{currentQuestion.explanation}</p>
                        </div>
                      )}

                      {/* Action Button */}
                      {!showResult ? (
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={selectedAnswer === null}
                          className={`w-full py-3 rounded-xl font-bold ${
                            selectedAnswer === null
                              ? 'bg-slate-200 text-slate-400'
                              : 'bg-indigo-500 text-white'
                          }`}
                        >
                          정답 확인
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          className="w-full py-3 bg-indigo-500 text-white rounded-xl font-bold"
                        >
                          {currentQuestionIndex < quizQuestions.length - 1 ? '다음 문제' : '결과 보기'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
