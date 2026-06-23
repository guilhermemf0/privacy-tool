# Especificação Técnica e Regras de Negócio: Privacy Tool

## 1. Modelo de Domínio
O modelo de domínio é estritamente determinístico, baseado em contratos imutáveis entre as camadas do sistema para mitigar efeitos colaterais.

    +-------------------+
    |    Inspection     |
    +-------------------+
    | - id: UUID        |
    | - softwareName: str|
    | - createdAt: Date |
    +---------+---------+
              | 1
              | 1..*
    +---------v---------+
    |   AnsweredItem    |
    +-------------------+
    | - questionId: UUID|
    | - choice: Choice  |
    +---------+---------+
              | Refere-se a
    +---------v---------+
    |     Question      |
    +-------------------+
    | - id: UUID        |
    | - text: String    |
    | - category: Enum  |
    +-------------------+

### Contrato de Dados (Payload de Submissão - Exemplo)
Ao finalizar o formulário, o frontend envia a coleção exata de respostas estruturada conforme o contrato abaixo:

{
  "inspectionId": "4a8b9c2d-e1f0-4a3b-8c7d-9e0f1a2b3c4d",
  "softwareName": "Plataforma Alfa",
  "answers": [
    { "questionId": "b101", "choice": "SUFICIENTE" },
    { "questionId": "b102", "choice": "INSUFICIENTE" },
    { "questionId": "b103", "choice": "INEXISTENTE" }
  ]
}

## 2. Regras de Negócio e Pontuação
Não existem pesos fracionários ou variáveis dinâmicas no cliente.

| Opção de Resposta | Valor Atribuído | Descrição de Negócio |
| :--- | :--- | :--- |
| **SUFICIENTE** | 100 | O critério atende integralmente aos requisitos exigidos. |
| **INSUFICIENTE** | 50 | O critério é executado parcialmente ou de forma ambígua. |
| **INEXISTENTE** | 0 | Não há evidência de cumprimento do critério. |

## 3. Algoritmo de Cálculo do Score e Mapeamento de Medalhas

### Cálculo do Score Geral
O Score Geral da inspeção é calculado a partir da média aritmética simples de todas as pontuações dos itens respondidos.

### Mapeamento Estrito de Medalhas
A classificação final baseia-se em faixas numéricas rígidas:

| Classificação | Intervalo Numérico | Comportamento da Interface |
| :--- | :--- | :--- |
| **OURO** | 91.00 a 100.00 | Renderiza badge ouro metálico com alta conformidade. |
| **PRATA** | 61.00 a 90.99 | Renderiza badge prata com conformidade operacional boa. |
| **BRONZE** | 41.00 a 60.99 | Renderiza badge bronze indicando necessidade de ajustes. |
| **INCIPIENTE** | 0.00 a 40.99 | Renderiza alerta vermelho/cinza indicando alto risco. |

## 4. Governança Arquitetural
* **Backend como Única Fonte da Verdade (SSOT):** Toda operação matemática e mapeamento de faixas pertencem exclusivamente à camada do Backend.
* **Frontend Stateless:** O Frontend atua estritamente como um motor de renderização visual. É expressamente proibido clonar o algoritmo de cálculo no lado do cliente.