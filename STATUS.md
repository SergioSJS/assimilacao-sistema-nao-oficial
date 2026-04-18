# STATUS - Assimilação VTT

**Última Fase Concluída:** Fase 4 — Integração Ficha <--> Dice Roller
**Próxima Fase:** Fase 5 — Lógicas Avançadas (Saúde & Cabo de Guerra)

## Estado Atual do Repositório
O repósitorio assumiu a estrutura natural do Foundry VTT (`system.json` na raiz, pastas `module`, `styles`, etc).
O antigo módulo "assimilacao-dice-roller" foi dissolvido na estrutura.
Os DataModels `InfectadoData` e `ItemInventarioData` foram completamente implementados e registrados na configuração do Foundry.
O visual e a ficha base do Actor (Fase 3) foram concebidos com um design SCSS rico, baseado na ficha do livro de regras e layout em duas abas (Frente e Verso). 
Os roll pools e templates customizados do chat para a Fase 4 foram totalmente englobados. A interatividade na Character Sheet já engatilha o código do DiceSoNice do pacote incorporado.

## Próxima Tarefa Imediata (Fase 5)
Lógicas Avançadas: O preenchimento da saúde da página deve possuir "corações ou quadrados" preenchíveis click by click (um `checkbox` ou um listener `.on("click")` alterando `nivelX`). As penalidades precisam ser avisadas (apenas textualmente no V1). O Cabo de Guerra (Determinação / Assimilação) precisa do evento JS `change` no slider que ajustará ambos os atributos mantendo sempre a soma absoluta igual a 10.

## Instruções para o Próximo Agente (Claude Code ou Antigravity)
Execute a Fase 5. Atualize o `InfectadoSheet` implementando os handlers para os clicks de saúde e `change` do slider do Cabo de Guerra para chamar `this.actor.update({...})`. Modifique o `.hbs` para ter o layout flexível (por exemplo os checkboxes visuais customizados para pontinhos de HP em SCSS).
