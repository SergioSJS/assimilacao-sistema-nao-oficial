# STATUS - Assimilação VTT

**Última Fase Concluída:** Fase 3 — UI da Ficha de Personagem (Estática)
**Próxima Fase:** Fase 4 — Integração Ficha <--> Dice Roller

## Estado Atual do Repositório
O repósitorio assumiu a estrutura natural do Foundry VTT (`system.json` na raiz, pastas `module`, `styles`, etc).
O antigo módulo "assimilacao-dice-roller" foi dissolvido na estrutura.
Os DataModels `InfectadoData` e `ItemInventarioData` foram completamente implementados e registrados na configuração do Foundry.
O visual e a ficha base do Actor (Fase 3) foram concebidos com um design SCSS rico, baseado na ficha do livro de regras e layout em duas abas (Frente e Verso). 

## Próxima Tarefa Imediata (Fase 4)
Implementar a funcionalidade dos botões na classe `actor-infectado-sheet.mjs`. Conectar os cliques dos instintos/conhecimentos à integração do `assimilacao-roll.mjs`. Refazer e adicionar mensagens de chat customizadas no format sugerido para a jogada mostrando o "Pool", e a seleção do melhor dado automaticamente.

## Instruções para o Próximo Agente (Claude Code ou Antigravity)
Leia o plano `/docs/assimilacao-fvtt-plan-v1.md` com foco na Fase 4 e `docs/assimilacao-fvtt-plan-v0.md` para relembrar as regras mecânicas dos símbolos de Rollings (Dados personalizados d6 e d10 que já estão definidos no arquivo de roll da Fase 1). Modifique o `.hbs` da ficha para incluir ícones interativos e crie os listeners nas classes de interface.
