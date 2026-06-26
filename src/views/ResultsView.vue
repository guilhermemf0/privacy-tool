<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useInspectionStore } from '@/stores/useInspectionStore'
import ScoreDisplay from '@/components/ScoreDisplay.vue'
import MedalBadge from '@/components/MedalBadge.vue'
import type { Medal } from '@/services/inspectionApi'

const router = useRouter()
const store = useInspectionStore()

// result is guaranteed non-null by router guard
const result = computed(() => store.result!)

// Descriptive text per medal — no calculation logic
const MEDAL_DESCRIPTION: Record<Medal, string> = {
  OURO: 'Excelente! Seu software demonstra alto nível de conformidade com os requisitos da LGPD. Mantenha as práticas e realize revisões periódicas.',
  PRATA: 'Bom trabalho. Seu software atende operacionalmente à maioria dos critérios da LGPD. Há pontos de melhoria que podem elevar sua classificação.',
  BRONZE: 'Atenção necessária. Seu software cobre os requisitos básicos, mas apresenta lacunas significativas que devem ser corrigidas.',
  INCIPIENTE: 'Risco elevado. O software apresenta conformidade insuficiente com a LGPD e requer ação imediata para mitigar riscos legais.',
}

function restartInspection() {
  router.push({ name: 'home' })
}
</script>

<template>
  <main
    class="min-h-screen flex flex-col items-center justify-center px-4 py-16"
    role="main"
  >
    <!-- Background glow -->
    <div
      class="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-6"
        style="background: radial-gradient(circle, #3B6CF8 0%, transparent 65%)"
      />
    </div>

    <div class="relative z-10 w-full max-w-xl animate-fade-up">

      <!-- Header -->
      <div class="text-center mb-10">
        <div class="flex items-center justify-center gap-2 mb-4">
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs
                   font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            Análise Concluída
          </span>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">
          Resultado de Conformidade
        </h1>
        <p class="text-slate-400 text-sm">
          Software avaliado:
          <span class="text-slate-200 font-semibold">{{ result.softwareName }}</span>
        </p>
      </div>

      <!-- Result card -->
      <div class="card-surface p-8 mb-6">

        <!-- Score display — animated counter -->
        <div class="text-center mb-8">
          <ScoreDisplay :score="result.score" />
        </div>

        <!-- Divider -->
        <div class="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-8" />

        <!-- Medal badge -->
        <div class="flex justify-center mb-8">
          <MedalBadge :medal="result.medal" />
        </div>

        <!-- Divider -->
        <div class="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-6" />

        <!-- Contextual description per medal -->
        <p class="text-sm text-slate-400 text-center leading-relaxed">
          {{ MEDAL_DESCRIPTION[result.medal] }}
        </p>
      </div>

      <!-- Answer summary -->
      <div class="card-surface p-5 mb-6">
        <p class="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase mb-4">
          Resumo das respostas
        </p>
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="(label, choice) in { SUFICIENTE: 'Suficiente', INSUFICIENTE: 'Insuficiente', INEXISTENTE: 'Inexistente' }"
            :key="choice"
            class="text-center px-3 py-3 rounded-lg bg-slate-800/60"
          >
            <p
              class="text-2xl font-black tabular-nums mb-1"
              :class="{
                'text-emerald-400': choice === 'SUFICIENTE',
                'text-amber-400': choice === 'INSUFICIENTE',
                'text-red-400': choice === 'INEXISTENTE',
              }"
            >
              {{ store.answers.filter(a => a.choice === choice).length }}
            </p>
            <p class="text-xs text-slate-500">{{ label }}</p>
          </div>
        </div>
      </div>

      <!-- Technical footer -->
      <div class="card-surface px-5 py-3.5 mb-8 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
          </svg>
          <span class="text-xs text-slate-600 font-mono truncate max-w-[200px]">
            {{ result.inspectionId }}
          </span>
        </div>
        <span class="text-xs text-slate-600">Score calculado pelo servidor</span>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          id="new-inspection-btn"
          type="button"
          class="btn-primary flex-1 justify-center"
          @click="restartInspection"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Nova Avaliação
        </button>
      </div>
    </div>
  </main>
</template>
