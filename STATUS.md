# STATUS - Assimilação VTT

**Última Fase Concluída:** Fase 5 — Lógicas Avançadas (Saúde & Cabo de Guerra)
**Próxima Fase:** Fase 6 — Inventário e Ítens

## Estado Atual do Repositório
O repósitorio assumiu a estrutura natural do Foundry VTT (`system.json` na raiz, pastas `module`, `styles`, etc).
O antigo módulo "assimilacao-dice-roller" foi dissolvido na estrutura.
Os DataModels `InfectadoData` e `ItemInventarioData` foram completamente implementados e registrados na configuração do Foundry.
O visual e a ficha base do Actor (Fase 3) foram concebidos com um design SCSS rico, baseado na ficha do livro de regras e layout em duas abas (Frente e Verso). 
Os roll pools e templates customizados do chat para a Fase 4 foram totalmente englobados. A interatividade na Character Sheet já engatilha o código do DiceSoNice do pacote incorporado.
Na Fase 5 integramos toda a lógica UI da Saúde clicável através dos Pontos de Dano que podem ser marcados/desmarcados e o visualizador dual do slider de Determinação/Assimilação.

## Próxima Tarefa Imediata (Fase 6)
Implementar inventário: Na aba de "Verso", existem os placeholders do inventário (Slots de Corpo e Slots de Mochila). Implementar arrastar-soltar para incluir `ItemInventarioData` na aba e mostrar eles visualmente nesses slots.

## Instruções para o Próximo Agente (Claude Code ou Antigravity)
Execute a Fase 6 para finalizar o projeto V1. Construa o template principal do `ItemSheet` e a renderização desses items do `actor.items` no `verso.hbs` (ou parte idêntica do sheet base). Faça interações simples como deletar ou editar.
