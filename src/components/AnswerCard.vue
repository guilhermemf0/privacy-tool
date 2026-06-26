<script setup lang="ts">
import type { Choice } from '@/data/questions'

const props = defineProps<{
  choice: Choice
  selected: boolean
}>()

const emit = defineEmits<{
  select: [choice: Choice]
}>()

const CHOICE_CONFIG: Record<
  Choice,
  { label: string; description: string; icon: string; accent: string; ring: string; bg: string }
> = {
  SUFICIENTE: {
    label: 'Suficiente',
    description: 'O critério é atendido integralmente.',
    icon: '✓',
    accent: 'text-emerald-400',
    ring: 'ring-emerald-400/60',
    bg: 'bg-emerald-500/8',
  },
  INSUFICIENTE: {
    label: 'Insuficiente',
    description: 'O critério é atendido de forma parcial.',
    icon: '◐',
    accent: 'text-amber-400',
    ring: 'ring-amber-400/60',
    bg: 'bg-amber-500/8',
  },
  INEXISTENTE: {
    label: 'Inexistente',
    description: 'Não há evidência de cumprimento.',
    icon: '✕',
    accent: 'text-red-400',
    ring: 'ring-red-400/60',
    bg: 'bg-red-500/8',
  },
}

const config = CHOICE_CONFIG[props.choice]
</script>

<template>
  <button
    type="button"
    class="answer-card group w-full flex items-center gap-5 px-5 py-4 rounded-xl border
           cursor-pointer select-none text-left
           transition-all duration-150 ease-out"
    :class="[
      selected
        ? `border-cobalt ring-2 ring-cobalt/40 bg-cobalt/10 shadow-cobalt-glow`
        : `border-surface-border bg-surface hover:border-slate-500 hover:bg-surface-muted`,
    ]"
    :aria-pressed="selected"
    @click="emit('select', choice)"
    @mousedown="(e: MouseEvent) => (e.currentTarget as HTMLElement).classList.add('scale-[0.98]')"
    @mouseup="(e: MouseEvent) => (e.currentTarget as HTMLElement).classList.remove('scale-[0.98]')"
    @mouseleave="(e: MouseEvent) => (e.currentTarget as HTMLElement).classList.remove('scale-[0.98]')"
  >
    <!-- Icon badge -->
    <div
      class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
             text-base font-bold transition-all duration-200"
      :class="[
        selected ? `${config.accent} bg-cobalt/20` : `${config.accent} bg-slate-700/60`,
      ]"
    >
      {{ config.icon }}
    </div>

    <!-- Text content -->
    <div class="flex-1 min-w-0">
      <p
        class="text-sm font-semibold leading-tight mb-0.5 transition-colors duration-150"
        :class="selected ? 'text-white' : 'text-slate-200 group-hover:text-white'"
      >
        {{ config.label }}
      </p>
      <p class="text-xs text-slate-500 leading-relaxed">
        {{ config.description }}
      </p>
    </div>

    <!-- Selected indicator -->
    <div
      class="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
             transition-all duration-200"
      :class="selected ? 'border-cobalt bg-cobalt' : 'border-slate-600'"
    >
      <svg
        v-if="selected"
        class="w-2.5 h-2.5 text-white"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  </button>
</template>
