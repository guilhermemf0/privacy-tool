import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { Choice } from '@/data/questions'
import type { InspectionResult } from '@/services/inspectionApi'

export interface AnsweredItem {
  questionId: string
  choice: Choice
}

export const useInspectionStore = defineStore('inspection', () => {
  // -----------------------------------------------------------------------
  // State
  // -----------------------------------------------------------------------
  const inspectionId = ref<string>('')
  const softwareName = ref<string>('')
  const currentQuestionIndex = ref<number>(0)
  const answers = ref<AnsweredItem[]>([])
  const result = ref<InspectionResult | null>(null)

  // -----------------------------------------------------------------------
  // Getters
  // -----------------------------------------------------------------------
  const totalQuestions = computed(() => 12)

  const progressPercent = computed(() =>
    Math.round((currentQuestionIndex.value / totalQuestions.value) * 100),
  )

  const currentAnswer = computed(() => {
    const qId = answers.value[currentQuestionIndex.value]?.questionId
    if (!qId) return null
    return answers.value.find((a) => a.questionId === qId)?.choice ?? null
  })

  const isLastQuestion = computed(
    () => currentQuestionIndex.value === totalQuestions.value - 1,
  )

  // -----------------------------------------------------------------------
  // Actions
  // -----------------------------------------------------------------------

  /** Inicia a inspeção — gera ID e persiste o nome do software */
  function startInspection(name: string) {
    inspectionId.value = uuidv4()
    softwareName.value = name.trim()
    currentQuestionIndex.value = 0
    answers.value = []
    result.value = null
  }

  /** Registra ou substitui a resposta para a pergunta atual (pelo ID) */
  function answerQuestion(questionId: string, choice: Choice) {
    const existing = answers.value.findIndex((a) => a.questionId === questionId)
    if (existing >= 0) {
      answers.value[existing].choice = choice
    } else {
      answers.value.push({ questionId, choice })
    }
  }

  /** Retorna a resposta salva para um questionId específico */
  function getAnswerFor(questionId: string): Choice | null {
    return answers.value.find((a) => a.questionId === questionId)?.choice ?? null
  }

  /** Avança para a próxima pergunta */
  function nextQuestion() {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      currentQuestionIndex.value++
    }
  }

  /** Retrocede para a pergunta anterior (preserva estado — H5 Nielsen) */
  function prevQuestion() {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--
    }
  }

  /** Armazena o resultado devolvido pelo backend */
  function setResult(res: InspectionResult) {
    result.value = res
  }

  /** Constrói o payload estruturado para envio ao backend (spec.md §1) */
  function buildPayload() {
    return {
      inspectionId: inspectionId.value,
      softwareName: softwareName.value,
      answers: answers.value,
    }
  }

  return {
    // state
    inspectionId,
    softwareName,
    currentQuestionIndex,
    answers,
    result,
    // getters
    totalQuestions,
    progressPercent,
    currentAnswer,
    isLastQuestion,
    // actions
    startInspection,
    answerQuestion,
    getAnswerFor,
    nextQuestion,
    prevQuestion,
    setResult,
    buildPayload,
  }
})
