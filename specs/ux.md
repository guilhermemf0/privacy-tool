# Especificação de UX/IHC: Privacy Tool

## 1. Visão Geral e Premissa de Design
A interface da **Privacy Tool** foi projetada sob o paradigma do **Design Calmo (Calm Technology)** e interfaces táteis ultramodernas. O objetivo principal é desmistificar a complexidade jurídica da LGPD para usuários leigos, substituindo a ansiedade de conformidade por uma experiência de precisão, segurança e controle.

### Diretrizes Visuais e Sensoriais
* **Paleta de Cores Confiável e Sóbria:** Utilização de tons de ardósia escuros para tipografia, fundos em off-white e cinza claro acetinado para reduzir o cansaço visual, com acentos em azul-cobalto digital (foco/ação) e cores semânticas dessaturadas para os estados de conformidade.
* **Aparência Tátil:** Elementos de interface simulam profundidade física sutil através de sombras suaves. Botões e cards possuem estados ativos que transmitem a sensação de "afundar" ao serem clicados.
* **Redução de Carga Cognitiva:** Aplicação rigorosa do princípio de *Mínima Surpresa*. Interfaces limpas e ausência de elementos decorativos desnecessários.

---

## 2. Aplicação das Heurísticas de Nielsen

### H1: Visibilidade do Status do Sistema
O usuário deve saber exatamente onde está e o que está acontecendo.
* **Formulário:** Uma barra de progresso linear e persistente no topo indica a etapa atual (ex: "Pergunta 4 de 12") acompanhada de um indicador percentual discreto.

### H5: Prevenção de Erros
O design impede de forma ativa que o usuário execute ações inválidas.
* **Avanço Bloqueado:** O botão de navegação para a próxima pergunta permanece desabilitado até que uma das opções de resposta seja explicitamente selecionada.
* **Preservação de Estado:** Caso o usuário clique em voltar, a aplicação retém localmente o estado da pergunta atual.

### H2: Correspondência entre o Sistema e o Mundo Real
A linguagem jurídica da LGPD é traduzida para o vocabulário cotidiano.
* A interface substitui jargões isolados por perguntas diretas e apresenta micro-explicações contextuais em linguagem natural.

---

## 3. Layout e Arquitetura das Telas

### Tela 1: Home (Porta de Entrada)
* **Região Central (Hero Section):** 
  * Título principal: "Descubra o nível de privacidade do seu software em minutos."
  * **CTA Principal:** Botão centralizado proeminente com elevação tátil: `[ Iniciar Nova Avaliação ]`.

### Tela 2: Formulário Guiado (Progressive Disclosure)
Esta tela aplica o conceito de **uma pergunta por vez** para eliminar a sobrecarga cognitiva.
* **Estrutura Central (O Bloco de Pergunta):**
  * Título da Pergunta: Enunciado claro e direto.
  * **Opções Táteis (3 Cards Verticais):** `Suficiente`, `Insuficiente` e `Inexistente`.
* **Estrutura Inferior (Navegação):** Botão `[ Avançar → ]` posicionado à direita, destacado apenas quando uma opção for selecionada.

### Tela 3: Dashboard de Resultados
* **Painel Principal (Visão Consolidada):**
  * O **Score Geral** renderizado em tamanho grande (ex: `85 / 100`).
  * A **Medalha Visual** conquistada (Ouro, Prata, Bronze ou Incipiente).