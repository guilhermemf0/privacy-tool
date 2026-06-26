export type Choice = 'SUFICIENTE' | 'INSUFICIENTE' | 'INEXISTENTE'

export type QuestionCategory =
  | 'AVISO_PRIVACIDADE'
  | 'BASE_LEGAL'
  | 'DIREITOS_TITULAR'
  | 'GOVERNANCA'
  | 'CONSENTIMENTO'
  | 'RETENCAO'
  | 'SEGURANCA'
  | 'TRANSFERENCIA'

export interface Question {
  id: string
  text: string
  detail: string
  category: QuestionCategory
}

export const QUESTIONS: Question[] = [
  {
    id: 'q-001',
    text: 'O software exibe uma Política de Privacidade acessível e em linguagem clara para o usuário?',
    detail: 'Art. 9º da LGPD — O titular deve ser informado sobre o tratamento de seus dados de forma transparente.',
    category: 'AVISO_PRIVACIDADE',
  },
  {
    id: 'q-002',
    text: 'Cada operação de tratamento de dados possui uma Base Legal documentada e identificada?',
    detail: 'Art. 7º da LGPD — Todo tratamento de dados pessoais deve estar amparado em uma das hipóteses legais previstas.',
    category: 'BASE_LEGAL',
  },
  {
    id: 'q-003',
    text: 'Existe um canal funcional para que o titular exerça seus direitos (acesso, correção, exclusão)?',
    detail: 'Art. 18º da LGPD — O titular dos dados tem o direito de obter do controlador respostas em prazo razoável.',
    category: 'DIREITOS_TITULAR',
  },
  {
    id: 'q-004',
    text: 'O Encarregado pelo Tratamento de Dados (DPO) foi formalmente designado e publicado?',
    detail: 'Art. 41º da LGPD — O controlador deverá indicar encarregado pelo tratamento de dados pessoais.',
    category: 'GOVERNANCA',
  },
  {
    id: 'q-005',
    text: 'O Registro das Atividades de Tratamento (ROPA) está mantido e atualizado?',
    detail: 'Art. 37º da LGPD — O controlador e o operador devem manter registro das operações de tratamento de dados.',
    category: 'GOVERNANCA',
  },
  {
    id: 'q-006',
    text: 'Foi elaborado um Relatório de Impacto à Proteção de Dados (RIPD) para tratamentos de dados sensíveis?',
    detail: 'Art. 38º da LGPD — A autoridade nacional poderá determinar ao controlador que elabore relatório de impacto.',
    category: 'GOVERNANCA',
  },
  {
    id: 'q-007',
    text: 'O consentimento do titular é coletado de forma granular, explícita e destacada dos demais termos?',
    detail: 'Art. 8º da LGPD — O consentimento deverá ser fornecido por escrito ou por outro meio que demonstre a manifestação de vontade.',
    category: 'CONSENTIMENTO',
  },
  {
    id: 'q-008',
    text: 'O usuário consegue revogar o consentimento de forma tão simples quanto o concedeu?',
    detail: 'Art. 8º §5º da LGPD — O consentimento pode ser revogado a qualquer momento mediante manifestação expressa.',
    category: 'CONSENTIMENTO',
  },
  {
    id: 'q-009',
    text: 'Os prazos de retenção de dados estão definidos por categoria e são efetivamente aplicados?',
    detail: 'Art. 15º da LGPD — O término do tratamento de dados ocorre nas hipóteses previstas, incluindo finalidade alcançada.',
    category: 'RETENCAO',
  },
  {
    id: 'q-010',
    text: 'Existe um Protocolo de Resposta a Incidentes de segurança documentado e testado?',
    detail: 'Art. 48º da LGPD — O controlador deverá comunicar à autoridade nacional e ao titular a ocorrência de incidente de segurança.',
    category: 'SEGURANCA',
  },
  {
    id: 'q-011',
    text: 'As transferências internacionais de dados pessoais estão mapeadas e cumprem as salvaguardas exigidas?',
    detail: 'Art. 33º da LGPD — A transferência internacional de dados pessoais somente é permitida nos casos específicos previstos.',
    category: 'TRANSFERENCIA',
  },
  {
    id: 'q-012',
    text: 'A equipe envolvida no tratamento de dados recebeu treinamento específico em proteção de dados?',
    detail: 'Art. 50º da LGPD — Os controladores e operadores devem adotar medidas para promover boas práticas de governança.',
    category: 'GOVERNANCA',
  },
]
