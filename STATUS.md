# STATUS - Assimilação VTT

**Última Fase Concluída:** Fase 2 — DataModels (Actor & Item)
**Próxima Fase:** Fase 3 — UI da Ficha de Personagem (Estática e Layout)

## Estado Atual do Repositório
O repósitorio assumiu a estrutura natural do Foundry VTT (`system.json` na raiz, pastas `module`, `styles`, etc).
O antigo módulo "assimilacao-dice-roller" foi dissolvido na estrutura.
Os DataModels `InfectadoData` e `ItemInventarioData` foram completamente implementados e registrados na configuração do Foundry.

## Próxima Tarefa Imediata (Fase 3)
Implementar `InfectadoSheet` herdando de `ActorSheetV2` (ou similar) e todo o markup e estilo (SCSS) da ficha de personagem usando Handlebars, seguindo a estrutura do "assimilacao-fvtt-plan-v1.md".

## Instruções para o Próximo Agente (Claude Code ou Antigravity)
Leia o plano `/docs/assimilacao-fvtt-plan-v1.md` com foco na Fase 3. Os métodos DataModel já estão expostos para o template HTML. Siga a separação recomendada (templates/actors/parts/*.hbs). Lembre-se de registrar a Sheet no `module/assimilacao.mjs` e gerar commits limpos com um Handoff no final.
