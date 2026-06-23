# Histórias de Usuário (BDD): Privacy Tool

## História 1: Inicialização Diagnóstica Sem Fricção
**Como um** desenvolvedor independente de sistemas web  
**Quero** iniciar um novo diagnóstico de privacidade informando apenas o nome do meu software  
**Para** mapear a adequação à LGPD sem passar por cadastros burocráticos que aumentem a carga mental  

* **Cenário: Acesso bem-sucedido à tela do formulário guiado**
    * **Given** que o usuário está navegando na página inicial da Privacy Tool (Tela Home)
    * **And** o campo de texto para identificação do sistema avaliado está vazio
    * **When** o usuário preenche o campo com o valor "Sistema de Vendas Express"
    * **And** clica sobre o botão tátil `[ Iniciar Nova Avaliação ]`
    * **Then** o sistema processa a criação de um novo identificador único de inspeção no backend
    * **And** redireciona a interface de forma fluida para a primeira pergunta do Formulário Guiado.

---

## História 2: Resposta Consciente no Fluxo de Divulgação Progressiva
**Como um** gestor de produto não técnico  
**Quero** responder a uma pergunta de privacidade por vez e ver o botão de avanço bloqueado até que eu decida  
**Para** garantir que eu não pule etapas por engano e que eu compreenda o critério avaliado  

* **Cenário: Seleção de opção e destravamento do fluxo de navegação**
    * **Given** que o usuário está na etapa Pergunta 3 de 12 do Formulário Guiado
    * **And** o botão `[ Avançar → ]` encontra-se desabilitado com opacidade reduzida (estado bloqueado)
    * **When** o usuário clica sobre o card tátil correspondente à opção `SUFICIENTE`
    * **Then** o card selecionado recebe a borda azul-cobalto de destaque visual
    * **And** o botão `[ Avançar → ]` torna-se imediatamente ativo, alterando seu estado visual para habilitado.

---

## História 3: Consolidação dos Resultados e Emissão de Medalha
**Como um** analista de sistemas leigo em conformidade jurídica  
**Quero** finalizar o preenchimento e ver o Score consolidado calculado pelo servidor com a respectiva medalha  
**Para** entender imediatamente o quão seguro meu produto digital está perante a lei  

* **Cenário: Conclusão do formulário e exibição do Dashboard de Resultados**
    * **Given** que o usuário acaba de responder a última pergunta do fluxo
    * **When** o usuário pressiona o botão tátil `[ Finalizar Inspeção ]`
    * **Then** o frontend envia o payload estruturado de respostas JSON para o backend
    * **And** o backend calcula a média aritmética e enquadra o score na faixa de conformidade correspondente à medalha PRATA
    * **And** o frontend recebe a resposta bem-sucedida e renderiza a Tela Dashboard de Resultados
    * **And** apresenta o componente centralizado com o texto 79 / 100 e a insígnia metálica vetorial da Medalha Prata, sem realizar qualquer recomputação de dados no cliente.