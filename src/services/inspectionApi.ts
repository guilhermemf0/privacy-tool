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
// Contrato de saída — espelha o contrato do backend (spec.md §4)
// ---------------------------------------------------------------------------
export type Medal = 'OURO' | 'PRATA' | 'BRONZE' | 'INCIPIENTE'

export interface InspectionResult {
  inspectionId: string
  softwareName: string
  score: number
  medal: Medal
}

// ---------------------------------------------------------------------------
// Tabela de valores por opção de resposta — spec.md §2 (RN-01)
// ---------------------------------------------------------------------------
const CHOICE_VALUE: Record<Choice, number> = {
  SUFICIENTE: 100,
  INSUFICIENTE: 50,
  INEXISTENTE: 0,
}

// ---------------------------------------------------------------------------
// Mapeamento de faixas para Medalhas — spec.md §3 (RN-03)
// AVISO ARQUITETURAL: Esta lógica pertence exclusivamente ao Backend (SSOT).
// Está aqui PROVISORIAMENTE para fins de demonstração acadêmica do protótipo
// standalone, conforme solicitação explícita. Não deve ser portada para produção.
// ---------------------------------------------------------------------------
function mapScoreToMedal(score: number): Medal {
  if (score >= 91.0) return 'OURO'
  if (score >= 61.0) return 'PRATA'
  if (score >= 41.0) return 'BRONZE'
  return 'INCIPIENTE'
}

// ---------------------------------------------------------------------------
// Simulação do processamento do backend — calcula score e medalha
// conforme as regras de negócio do spec.md §2 e §3
// ---------------------------------------------------------------------------
export async function submitInspection(
  payload: InspectionPayload,
): Promise<InspectionResult> {
  // Simula latência de rede
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // RN-01: atribui o valor numérico de cada resposta
  const values = payload.answers.map((a) => CHOICE_VALUE[a.choice])

  // RN-03: média aritmética simples de todas as pontuações
  const total = values.reduce((sum, v) => sum + v, 0)
  const score = values.length > 0 ? total / values.length : 0

  // Arredonda para 2 casas decimais (padrão de exibição do backend)
  const roundedScore = Math.round(score * 100) / 100

  return {
    inspectionId: payload.inspectionId,
    softwareName: payload.softwareName,
    score: roundedScore,
    medal: mapScoreToMedal(roundedScore),
  }
}
