<script setup lang="ts">
import type { Medal } from '@/services/inspectionApi'
import { computed } from 'vue'

const props = defineProps<{
  medal: Medal
}>()

const MEDAL_CONFIG: Record<
  Medal,
  { label: string; subtitle: string; gradient: string[]; ring: string; shimmer: string; emoji: string }
> = {
  OURO: {
    label: 'Ouro',
    subtitle: 'Alta Conformidade',
    gradient: ['#FFD700', '#F5C542', '#E8A100'],
    ring: 'rgba(245, 197, 66, 0.4)',
    shimmer: 'rgba(255, 255, 255, 0.35)',
    emoji: '🥇',
  },
  PRATA: {
    label: 'Prata',
    subtitle: 'Conformidade Operacional',
    gradient: ['#E8E8E8', '#C0C0C0', '#8A8A8A'],
    ring: 'rgba(192, 192, 192, 0.4)',
    shimmer: 'rgba(255, 255, 255, 0.30)',
    emoji: '🥈',
  },
  BRONZE: {
    label: 'Bronze',
    subtitle: 'Ajustes Necessários',
    gradient: ['#E8A47A', '#CD7F32', '#A0522D'],
    ring: 'rgba(205, 127, 50, 0.4)',
    shimmer: 'rgba(255, 255, 255, 0.25)',
    emoji: '🥉',
  },
  INCIPIENTE: {
    label: 'Incipiente',
    subtitle: 'Alto Risco — Ação Urgente',
    gradient: ['#f87171', '#ef4444', '#b91c1c'],
    ring: 'rgba(239, 68, 68, 0.4)',
    shimmer: 'rgba(255, 255, 255, 0.15)',
    emoji: '⚠️',
  },
}

const config = computed(() => MEDAL_CONFIG[props.medal])

const gradientId = computed(() => `medal-grad-${props.medal.toLowerCase()}`)
const shimmerId = computed(() => `medal-shimmer-${props.medal.toLowerCase()}`)
</script>

<template>
  <div class="flex flex-col items-center gap-4 animate-medal-drop">
    <!-- SVG Medal -->
    <div
      class="relative"
      :style="{ filter: `drop-shadow(0 0 24px ${config.ring})` }"
    >
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        :aria-label="`Medalha ${config.label}`"
      >
        <defs>
          <!-- Main gradient -->
          <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :stop-color="config.gradient[0]" />
            <stop offset="50%" :stop-color="config.gradient[1]" />
            <stop offset="100%" :stop-color="config.gradient[2]" />
          </linearGradient>

          <!-- Shimmer overlay -->
          <linearGradient :id="shimmerId" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="transparent" />
            <stop offset="50%" :stop-color="config.shimmer" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>

          <!-- Inner shadow filter -->
          <filter id="inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
            <feOffset dx="0" dy="3" result="offsetBlur" />
            <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
          </filter>
        </defs>

        <!-- Ribbon top (decorative) -->
        <rect x="66" y="4" width="12" height="36" rx="3" :fill="`url(#${gradientId})`" opacity="0.9" />
        <rect x="82" y="4" width="12" height="36" rx="3" :fill="`url(#${gradientId})`" opacity="0.7" />

        <!-- Outer ring (glow border) -->
        <circle cx="80" cy="100" r="56" :fill="`url(#${gradientId})`" opacity="0.2" />

        <!-- Main medal circle -->
        <circle cx="80" cy="100" r="50" :fill="`url(#${gradientId})`" />

        <!-- Inner relief ring -->
        <circle cx="80" cy="100" r="42" fill="none" :stroke="config.gradient[2]" stroke-width="2" opacity="0.6" />

        <!-- Shimmer sweep -->
        <circle cx="80" cy="100" r="50" :fill="`url(#${shimmerId})`" opacity="0.7" />

        <!-- Center star / shield -->
        <text
          x="80"
          y="100"
          text-anchor="middle"
          dominant-baseline="central"
          font-size="36"
          style="font-family: system-ui; user-select: none;"
        >
          {{ config.emoji }}
        </text>

        <!-- Engraved label arc —
             Arco: semicírculo inferior do círculo da medalha (cx=80, cy=100, r=44).
             Comprimento de arco ≈ 138px, suficiente para "PRIVACY TOOL" sem corte. -->
        <path
          id="medal-arc"
          d="M 36 100 A 44 44 0 0 1 124 100"
          fill="none"
        />
        <text font-size="9" font-weight="700" letter-spacing="1.5" fill="white" opacity="0.85">
          <textPath href="#medal-arc" startOffset="50%" text-anchor="middle">
            PRIVACY TOOL
          </textPath>
        </text>
      </svg>
    </div>

    <!-- Medal label -->
    <div class="text-center">
      <p
        class="text-2xl font-bold tracking-wide"
        :style="{ color: config.gradient[0] }"
      >
        Medalha {{ config.label }}
      </p>
      <p class="text-sm text-slate-400 mt-1">{{ config.subtitle }}</p>
    </div>
  </div>
</template>
