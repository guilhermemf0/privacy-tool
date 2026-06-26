<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useInspectionStore } from '@/stores/useInspectionStore'
import { QUESTIONS } from '@/data/questions'
import ScoreDisplay from '@/components/ScoreDisplay.vue'
import MedalBadge from '@/components/MedalBadge.vue'
import type { Medal } from '@/services/inspectionApi'

const router = useRouter()
const store = useInspectionStore()

// result is guaranteed non-null by router guard
const result = computed(() => store.result!)
const isGeneratingPdf = ref(false)

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

// ---------------------------------------------------------------------------
// generateProfessionalPdf — desenha o relatório diretamente no PDF via jsPDF.
// Não captura tela. Não depende de CSS. Fontes e alinhamentos são precisos.
// ---------------------------------------------------------------------------
async function generateProfessionalPdf() {
  if (isGeneratingPdf.value) return
  isGeneratingPdf.value = true

  try {
    // Importações dinâmicas — mantém o bundle inicial leve
    const { jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
    const W = doc.internal.pageSize.getWidth()   // 210 mm
    const H = doc.internal.pageSize.getHeight()  // 297 mm
    const ML = 14  // margin left / right

    // ── Paleta (espelho do design system — ux.md Calm Technology) ────────────
    type RGB = [number, number, number]
    const C: Record<string, RGB> = {
      bg:      [15,  23,  42],   // slate-900
      surface: [30,  41,  59],   // slate-800
      altRow:  [22,  35,  58],   // entre bg e surface
      border:  [51,  65,  85],   // slate-700
      cobalt:  [59,  108, 248],  // cobalt (#3B6CF8)
      white:   [255, 255, 255],
      muted:   [148, 163, 184],  // slate-400
      faint:   [100, 116, 139],  // slate-500
      text:    [241, 245, 249],  // slate-100
      cobaltL: [190, 215, 255],  // cobalt claro p/ texto sobre cobalt
      emerald: [52,  211, 153],
      amber:   [251, 191, 36],
      red:     [248, 113, 113],
    }

    const MEDAL_FILL: Record<Medal, RGB> = {
      OURO:       [245, 197, 66],
      PRATA:      [192, 192, 192],
      BRONZE:     [205, 127, 50],
      INCIPIENTE: [239, 68,  68],
    }
    const MEDAL_TEXT_COLOR: Record<Medal, RGB> = {
      OURO:       [60,  40,  0],
      PRATA:      [30,  30,  30],
      BRONZE:     [55,  28,  0],
      INCIPIENTE: [255, 255, 255],
    }
    const MEDAL_SUBTITLE: Record<Medal, string> = {
      OURO:       'Alta Conformidade',
      PRATA:      'Conformidade Operacional',
      BRONZE:     'Ajustes Necessários',
      INCIPIENTE: 'Alto Risco — Ação Urgente',
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    const fill   = (c: RGB) => doc.setFillColor(...c)
    const stroke = (c: RGB) => doc.setDrawColor(...c)
    const color  = (c: RGB) => doc.setTextColor(...c)
    const font   = (style: 'bold' | 'normal', size: number) => {
      doc.setFont('helvetica', style)
      doc.setFontSize(size)
    }

    // ── 1. Fundo escuro — página 1 ────────────────────────────────────────────
    fill(C.bg)
    doc.rect(0, 0, W, H, 'F')

    // ── 2. Header band (cobalt) ───────────────────────────────────────────────
    fill(C.cobalt)
    doc.rect(0, 0, W, 26, 'F')

    font('bold', 16)
    color(C.white)
    doc.text('Privacy Tool', ML, 11)

    font('normal', 8)
    color(C.cobaltL)
    doc.text('Relatório de Auditoria LGPD', ML, 19)

    const now = new Date()
    const dateStr = now.toLocaleDateString('pt-BR') + '  ' +
                    now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    font('normal', 7.5)
    color(C.cobaltL)
    doc.text(dateStr, W - ML, 11, { align: 'right' })
    doc.text(`ID: ${result.value.inspectionId}`, W - ML, 19, { align: 'right' })

    // ── 3. Nome do software ───────────────────────────────────────────────────
    let y = 35

    font('normal', 7.5)
    color(C.faint)
    doc.text('SOFTWARE AVALIADO', ML, y)

    y += 5.5
    font('bold', 14)
    color(C.text)
    doc.text(result.value.softwareName, ML, y)

    y += 13

    // ── 4. Cards: Score | Medalha (lado a lado) ───────────────────────────────
    const CARD_H = 36
    const CARD_W = (W - ML * 2 - 5) / 2

    // Card Score — fundo cobalt
    fill(C.cobalt)
    doc.roundedRect(ML, y, CARD_W, CARD_H, 3, 3, 'F')

    font('normal', 7)
    color(C.cobaltL)
    doc.text('SCORE GERAL', ML + CARD_W / 2, y + 7, { align: 'center' })

    font('bold', 30)
    color(C.white)
    doc.text(String(Math.round(result.value.score)), ML + CARD_W / 2, y + 22, { align: 'center' })

    font('normal', 8)
    color(C.cobaltL)
    doc.text(`/ 100  (exato: ${result.value.score.toFixed(2)})`, ML + CARD_W / 2, y + 31, { align: 'center' })

    // Card Medalha — fundo com a cor da medalha
    const cardX2 = ML + CARD_W + 5
    fill(MEDAL_FILL[result.value.medal])
    doc.roundedRect(cardX2, y, CARD_W, CARD_H, 3, 3, 'F')

    font('normal', 7)
    color(MEDAL_TEXT_COLOR[result.value.medal])
    doc.text('MEDALHA CONQUISTADA', cardX2 + CARD_W / 2, y + 7, { align: 'center' })

    font('bold', 19)
    doc.text(result.value.medal, cardX2 + CARD_W / 2, y + 20, { align: 'center' })

    font('normal', 7.5)
    doc.text(MEDAL_SUBTITLE[result.value.medal], cardX2 + CARD_W / 2, y + 30, { align: 'center' })

    y += CARD_H + 9

    // ── 5. Resumo numérico (Suficiente | Insuficiente | Inexistente) ──────────
    const sumItems: Array<{ label: string; count: number; color: RGB }> = [
      { label: 'Suficiente',   count: store.answers.filter(a => a.choice === 'SUFICIENTE').length,   color: C.emerald },
      { label: 'Insuficiente', count: store.answers.filter(a => a.choice === 'INSUFICIENTE').length, color: C.amber   },
      { label: 'Inexistente',  count: store.answers.filter(a => a.choice === 'INEXISTENTE').length,  color: C.red     },
    ]
    const SUM_W = (W - ML * 2 - 10) / 3
    const SUM_H = 18

    sumItems.forEach((item, i) => {
      const sx = ML + i * (SUM_W + 5)
      fill(C.surface)
      stroke(C.border)
      doc.roundedRect(sx, y, SUM_W, SUM_H, 2, 2, 'FD')

      font('bold', 17)
      color(item.color)
      doc.text(String(item.count), sx + SUM_W / 2, y + 11, { align: 'center' })

      font('normal', 6.5)
      color(C.muted)
      doc.text(item.label, sx + SUM_W / 2, y + 16.5, { align: 'center' })
    })

    y += SUM_H + 10

    // ── 6. Separador + label da tabela ────────────────────────────────────────
    fill(C.border)
    doc.rect(ML, y, W - ML * 2, 0.3, 'F')
    y += 5

    font('bold', 7.5)
    color(C.faint)
    doc.text('DETALHAMENTO DAS RESPOSTAS — 12 CRITÉRIOS LGPD', ML, y)
    y += 3

    // ── 7. autoTable — 12 perguntas + respostas ───────────────────────────────
    const CHOICE_LABEL: Record<string, string> = {
      SUFICIENTE:   'Suficiente',
      INSUFICIENTE: 'Insuficiente',
      INEXISTENTE:  'Inexistente',
    }
    const CHOICE_COLOR: Record<string, RGB> = {
      'Suficiente':   C.emerald,
      'Insuficiente': C.amber,
      'Inexistente':  C.red,
    }

    const tableBody = QUESTIONS.map((q, idx) => {
      const ans = store.getAnswerFor(q.id)
      return [
        String(idx + 1),
        q.text,
        ans ? CHOICE_LABEL[ans] : '—',
      ]
    })

    autoTable(doc, {
      startY: y,
      head: [['#', 'Critério Avaliado (LGPD)', 'Resposta']],
      body: tableBody,
      margin: { left: ML, right: ML, bottom: 14 },
      styles: {
        fillColor:   C.surface as [number, number, number],
        textColor:   C.text    as [number, number, number],
        fontSize:    7.5,
        cellPadding: { top: 3.5, bottom: 3.5, left: 3, right: 3 },
        lineColor:   C.border  as [number, number, number],
        lineWidth:   0.15,
        overflow:    'linebreak',
        valign:      'middle',
      },
      headStyles: {
        fillColor:  C.bg     as [number, number, number],
        textColor:  C.muted  as [number, number, number],
        fontSize:   7,
        fontStyle:  'bold',
        halign:     'left',
      },
      alternateRowStyles: {
        fillColor: C.altRow as [number, number, number],
      },
      columnStyles: {
        0: { cellWidth: 9,  halign: 'center' as const },
        2: { cellWidth: 30, halign: 'center' as const },
      },
      // Colore a célula de resposta com a cor semântica da escolha
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 2) {
          const val = data.cell.raw as string
          const c = CHOICE_COLOR[val]
          if (c) {
            data.cell.styles.textColor = c as [number, number, number]
            data.cell.styles.fontStyle = 'bold'
          }
        }
      },
      // Aplica fundo escuro nas páginas de overflow (página 2+)
      willDrawPage: (data) => {
        if (data.pageNumber === 1) return
        fill(C.bg)
        doc.rect(0, 0, W, H, 'F')
        // Header compacto nas páginas de continuação
        fill(C.cobalt)
        doc.rect(0, 0, W, 16, 'F')
        font('bold', 10)
        color(C.white)
        doc.text('Privacy Tool — Relatório de Auditoria LGPD', ML, 10)
        font('normal', 7)
        color(C.cobaltL)
        doc.text('continuação', W - ML, 10, { align: 'right' })
      },
    })

    // ── 8. Footer em todas as páginas ─────────────────────────────────────────
    const pageCount = doc.getNumberOfPages()
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p)
      fill(C.surface)
      doc.rect(0, H - 10, W, 10, 'F')
      font('normal', 7)
      color(C.faint)
      doc.text('Privacy Tool — Diagnóstico de Conformidade LGPD', ML, H - 3.5)
      doc.text(`Página ${p} de ${pageCount}`, W - ML, H - 3.5, { align: 'right' })
    }

    // ── 9. Salvar ─────────────────────────────────────────────────────────────
    const safeFileName = result.value.softwareName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase()

    doc.save(`privacy-tool-${safeFileName}-${result.value.medal.toLowerCase()}.pdf`)

  } finally {
    isGeneratingPdf.value = false
  }
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
        <!-- Primária: reiniciar -->
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

        <!-- Secundária: exportar PDF (hierarquia visual menor — outline discreto) -->
        <button
          id="download-pdf-btn"
          type="button"
          class="btn-secondary flex-1 justify-center"
          :disabled="isGeneratingPdf"
          @click="generateProfessionalPdf"
        >
          <template v-if="isGeneratingPdf">
            <svg
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Gerando…
          </template>
          <template v-else>
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Baixar Relatório (PDF)
          </template>
        </button>
      </div>
    </div>
  </main>
</template>
