<script setup lang="ts">
defineProps<{
  current: number
  total: number
  percent: number
}>()
</script>

<template>
  <div class="w-full px-6 pt-5 pb-4">
    <!-- Label -->
    <div class="flex items-center justify-between mb-2.5">
      <span class="text-xs font-medium text-slate-400 tracking-wide">
        Pergunta <span class="text-slate-200 font-semibold">{{ current }}</span> de {{ total }}
      </span>
      <span class="text-xs font-semibold tabular-nums" :class="percent >= 80 ? 'text-cobalt-light' : 'text-slate-400'">
        {{ percent }}%
      </span>
    </div>

    <!-- Track -->
    <div class="progress-track">
      <div
        class="progress-fill"
        :style="{ width: `${percent}%` }"
        role="progressbar"
        :aria-valuenow="percent"
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
  </div>
</template>
