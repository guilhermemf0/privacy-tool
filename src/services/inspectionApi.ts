import type { Choice } from '@/data/questions'

// ---------------------------------------------------------------------------
// Contrato de entrada — idêntico ao spec.md §1 "Contrato de Dados"
// ---------------------------------------------------------------------------
export interface AnsweredItem {
  questionId: string
  choice: Choice
}

export interface InspectionPayload {
  inspectionId: string
  softwareName: string
  answers: AnsweredItem[]
}

// ---------------------------------------------------------------------------
// Contrato de saída — retornado pelo backend (SSOT conforme spec.md §4)
// ---------------------------------------------------------------------------
export type Medal = 'OURO' | 'PRATA' | 'BRONZE' | 'INCIPIENTE'

export interface InspectionResult {
  inspectionId: string
  softwareName: string
  score: number
  medal: Medal
}

// ---------------------------------------------------------------------------
// Mock da API — simula a latência de rede (1500ms)
// NÃO realiza nenhum cálculo. O valor retornado é o contrato fixo
// definido na história 3 do stories.md: score=79.16, medal=PRATA
// ---------------------------------------------------------------------------
export async function submitInspection(
  payload: InspectionPayload,
): Promise<InspectionResult> {
  // Simula latência de rede
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Resposta estática conforme stories.md — Cenário 3
  // "apresenta o componente centralizado com o texto 79 / 100 e a insígnia
  //  metálica vetorial da Medalha Prata"
  return {
    inspectionId: payload.inspectionId,
    softwareName: payload.softwareName,
    score: 79.16,
    medal: 'PRATA',
  }
}
