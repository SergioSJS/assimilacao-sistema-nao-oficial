# STATUS - Assimilação VTT

**Última Fase Concluída:** Fase 1 — Setup Base e Integração do Roller
**Próxima Fase:** Fase 2 — DataModels (Actor & Item)

## Estado Atual do Repositório
O repósitorio assumiu a estrutura natural do Foundry VTT (`system.json` na raiz, pastas `module`, `styles`, etc).
O antigo módulo "assimilacao-dice-roller" foi dissolvido na estrutura do sistema (arquivos em `/module/dice/` e assets em `/assets/images/`). Os paths internos foram corrigidos e a compilação de SCSS configurada.
O Github Actions Setup também foi incluído em `.github/workflows/`.

## Próxima Tarefa Imediata (Fase 2)
Implementar `InfectadoData` (`TypeDataModel`) conforme estipulado na Fase 2 do `assimilacao-fvtt-plan-v1.md`.

## Instruções para o Próximo Agente (Claude Code ou Antigravity)
Dê sequência a partir do arquivo principal, lendo o modelo de atributos no V1 e definindo as classes na pasta `/module/data/`. Lembre-se de sempre gerar commits limpos e atualizar este arquivo na sua saída.
