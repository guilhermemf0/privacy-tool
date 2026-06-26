<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  score: number
}>()

// Animated counter — counts up to the score value
const displayed = ref(0)

onMounted(() => {
  const target = Math.round(props.score)
  const duration = 1200
  const step = 16
  const increments = Math.ceil(duration / step)
  const increment = target / increments
  let current = 0
  let count = 0

  const timer = setInterval(() => {
    count++
    current = Math.min(Math.round(increment * count), target)
    displayed.value = current
    if (current >= target) {
      clearInterval(timer)
    }
  }, step)
})
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <p class="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
      Score Geral
    </p>

    <!-- Score number -->
    <div class="flex items-end gap-2">
      <span
        class="text-8xl font-black tabular-nums text-gradient-cobalt leading-none"
        aria-live="polite"
      >
        {{ displayed }}
      </span>
      <span class="text-3xl font-light text-slate-500 mb-3">/ 100</span>
    </div>

    <!-- Sub-label: exact decimal -->
    <p class="text-sm text-slate-600 font-mono">
      Score exato: {{ score.toFixed(2) }}
    </p>
  </div>
</template>
