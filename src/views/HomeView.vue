<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useInspectionStore } from '@/stores/useInspectionStore'

const router = useRouter()
const store = useInspectionStore()

const softwareName = ref('')
const isLoading = ref(false)
const inputError = ref('')

function handleStart() {
  if (!softwareName.value.trim()) {
    inputError.value = 'Informe o nome do software para iniciar.'
    return
  }

  inputError.value = ''
  isLoading.value = true

  // Simula criação do ID de inspeção no backend (Story 1)
  setTimeout(() => {
    store.startInspection(softwareName.value)
    router.push({ name: 'form' })
  }, 600)
}

function clearError() {
  if (inputError.value) inputError.value = ''
}
</script>

<template>
  <main
    class="min-h-screen flex flex-col items-center justify-center px-4 py-16"
    role="main"
  >
    <!-- Background decoration -->
    <div
      class="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-5"
        style="background: radial-gradient(circle, #3B6CF8 0%, transparent 70%)"
      />
    </div>

    <!-- Content wrapper -->
    <div class="relative z-10 w-full max-w-lg animate-fade-up">

      <!-- Logo / brand mark -->
      <div class="flex items-center justify-center gap-3 mb-12">
        <div
          class="w-10 h-10 rounded-xl bg-cobalt flex items-center justify-center
                 shadow-cobalt-glow"
        >
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6
                 A11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623
                 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751
                 h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
        </div>
        <span class="text-sm font-semibold text-slate-400 tracking-widest uppercase">
          Privacy Tool
        </span>
      </div>

      <!-- Hero headline -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-extrabold leading-tight tracking-tight text-white mb-4">
          Descubra o nível de privacidade
          <span class="text-gradient-cobalt"> do seu software </span>
          em minutos.
        </h1>
        <p class="text-slate-400 text-base leading-relaxed max-w-sm mx-auto">
          Uma avaliação guiada baseada nos critérios da LGPD.
          Sem cadastro. Sem burocracia.
        </p>
      </div>

      <!-- Card form -->
      <div class="card-surface p-7">
        <!-- LGPD badge row -->
        <div class="flex items-center gap-2 mb-6">
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs
                   font-semibold bg-cobalt/15 text-cobalt-light border border-cobalt/25"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-cobalt animate-pulse" />
            LGPD · 12 critérios
          </span>
          <span class="text-slate-600 text-xs">· aprox. 3 min</span>
        </div>

        <!-- Input -->
        <label for="software-name" class="block text-sm font-medium text-slate-300 mb-2">
          Nome do software avaliado
        </label>
        <input
          id="software-name"
          v-model="softwareName"
          type="text"
          class="input-field mb-1"
          placeholder="ex: Plataforma Alfa, Sistema de Vendas Express…"
          autocomplete="off"
          maxlength="80"
          @keydown.enter="handleStart"
          @input="clearError"
          :aria-invalid="!!inputError"
          :aria-describedby="inputError ? 'name-error' : undefined"
        />
        <div class="h-5 mb-4">
          <p
            v-if="inputError"
            id="name-error"
            class="text-xs text-red-400"
            role="alert"
          >
            {{ inputError }}
          </p>
        </div>

        <!-- CTA Button -->
        <button
          id="start-inspection-btn"
          type="button"
          class="btn-primary w-full justify-center text-base py-4"
          :disabled="isLoading"
          @click="handleStart"
        >
          <template v-if="!isLoading">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 3l14 9-14 9V3z"
              />
            </svg>
            Iniciar Nova Avaliação
          </template>
          <template v-else>
            <svg
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Iniciando…
          </template>
        </button>
      </div>

      <!-- Footer note -->
      <p class="text-center text-xs text-slate-600 mt-8">
        Nenhum dado é armazenado permanentemente nesta sessão.
      </p>
    </div>
  </main>
</template>
