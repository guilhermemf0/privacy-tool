<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useInspectionStore } from '@/stores/useInspectionStore'
import { submitInspection } from '@/services/inspectionApi'
import { QUESTIONS, type Choice } from '@/data/questions'
import AppProgressBar from '@/components/AppProgressBar.vue'
import AnswerCard from '@/components/AnswerCard.vue'

const router = useRouter()
const store = useInspectionStore()

const isSubmitting = ref(false)

// Current question derived from store index
const currentQ = computed(() => QUESTIONS[store.currentQuestionIndex])

// Selected choice for current question (preserved via store — H5 Nielsen)
const selectedChoice = ref<Choice | null>(
  store.getAnswerFor(currentQ.value.id),
)

// Advance is only enabled when a choice is selected (H5 Nielsen — Prevenção de Erros)
const canAdvance = computed(() => selectedChoice.value !== null)

// Update selected choice when question index changes (back navigation)
watch(
  () => store.currentQuestionIndex,
  () => {
    selectedChoice.value = store.getAnswerFor(currentQ.value.id)
  },
)

function onSelect(choice: Choice) {
  selectedChoice.value = choice
  store.answerQuestion(currentQ.value.id, choice)
}

function onNext() {
  if (!canAdvance.value) return

  if (store.isLastQuestion) {
    onFinalize()
  } else {
    store.nextQuestion()
  }
}

function onBack() {
  if (store.currentQuestionIndex === 0) {
    router.push({ name: 'home' })
    return
  }
  store.prevQuestion()
}

async function onFinalize() {
  isSubmitting.value = true
  try {
    const payload = store.buildPayload()
    const result = await submitInspection(payload)
    store.setResult(result)
    router.push({ name: 'results' })
  } catch {
    isSubmitting.value = false
  }
}

// 1-based for display
const displayIndex = computed(() => store.currentQuestionIndex + 1)
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top progress bar — persists across all questions (H1 Nielsen) -->
    <header class="max-w-2xl w-full mx-auto pt-2">
      <AppProgressBar
        :current="displayIndex"
        :total="store.totalQuestions"
        :percent="store.progressPercent"
      />
    </header>

    <!-- Main content — one question at a time -->
    <main
      class="flex-1 flex items-center justify-center px-4 py-8"
      role="main"
    >
      <div class="w-full max-w-2xl">

        <!-- Question block — animates on index change -->
        <Transition name="question" mode="out-in">
          <div :key="store.currentQuestionIndex" class="animate-fade-up">

            <!-- Category chip -->
            <p class="text-xs font-semibold tracking-[0.15em] text-cobalt-light uppercase mb-4">
              Critério {{ displayIndex }} · {{ currentQ.category.replace('_', ' ') }}
            </p>

            <!-- Question text -->
            <h2 class="text-xl font-bold text-white leading-snug mb-3">
              {{ currentQ.text }}
            </h2>

            <!-- Detail / legal reference (H2 Nielsen — linguagem natural) -->
            <div
              class="flex items-start gap-2.5 mb-8 px-4 py-3 rounded-xl
                     bg-slate-800/60 border border-slate-700/50"
            >
              <svg
                class="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836
                     a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
              <p class="text-xs text-slate-400 leading-relaxed">{{ currentQ.detail }}</p>
            </div>

            <!-- Answer cards (3 tactile options) -->
            <div class="flex flex-col gap-3" role="radiogroup" aria-label="Opções de resposta">
              <AnswerCard
                v-for="choice in (['SUFICIENTE', 'INSUFICIENTE', 'INEXISTENTE'] as Choice[])"
                :key="choice"
                :choice="choice"
                :selected="selectedChoice === choice"
                @select="onSelect"
              />
            </div>
          </div>
        </Transition>

        <!-- Navigation row -->
        <div class="flex items-center justify-between mt-8 gap-4">
          <!-- Back button -->
          <button
            id="form-back-btn"
            type="button"
            class="flex items-center gap-2 px-5 py-3 rounded-xl border border-surface-border
                   text-sm font-medium text-slate-400 cursor-pointer
                   hover:border-slate-500 hover:text-slate-200
                   transition-all duration-150 active:scale-[0.97]"
            @click="onBack"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Voltar
          </button>

          <!-- Advance / Finalize button — disabled until selection (H5 Nielsen) -->
          <button
            id="form-advance-btn"
            type="button"
            class="btn-primary flex-1 max-w-xs justify-center"
            :disabled="!canAdvance || isSubmitting"
            @click="onNext"
          >
            <template v-if="isSubmitting">
              <svg
                class="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Enviando…
            </template>
            <template v-else-if="store.isLastQuestion">
              Finalizar Inspeção
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
            <template v-else>
              Avançar
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </template>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.question-enter-active,
.question-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.question-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.question-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
