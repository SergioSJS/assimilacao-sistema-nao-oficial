# Planejamento: Sistema Assimilação RPG para Foundry VTT (v1)

> Documento de planejamento técnico completo, faseado e otimizado para o desenvolvimento colaborativo utilizando múltiplos Agentes de IA (Antigravity e Claude Code). Elaborado com base no livro de regras, ficha da Nero Industries e o módulo de rolagens previamente desenvolvido.

---

## 1. Contexto e Protocolo Multi-Agente (Antigravity & Claude Code)

Dado o desenvolvimento do sistema por meio de créditos limitados em diferentes assistentes de IA, é essencial estabelecer um protocolo de transição de contexto (Handoff).

### 1.1 Protocolo de Transição (Handoff)
Sempre que o desenvolvimento for trocar de agente (ex: de Antigravity para Claude Code ou vice-versa), as seguintes etapas **devem** ser seguidas pelo usuário/agente atual:
1. **Atualização do `STATUS.md`:** Manter um arquivo na raiz do projeto (ou neste próprio doc) com checkboxes precisos do que foi feito e qual a próxima subtarefa imediata.
2. **Commits incrementais explícitos:** O agente atual deve realizar o commit de tudo o que fez antes do término do seu turno. Mensagens de commit como `feat(sheet): impl propósitos - handoff` ou `chore: wip health bar styling` ajudam o próximo agente a ler o log e entender onde parou.
3. **Comando de inicialização para o próximo agente:** Ao iniciar a sessão com o novo agente, o usuário deve enviar o prompt:
   > *"Leia o arquivo `/docs/assimilacao-fvtt-plan-v1.md` (Fases de Implementação) e o arquivo `STATUS.md` (ou branch/commit atual). Analise o código feito no último commit para pegar o contexto e continue a implementação da Fase X a partir da tarefa Y."*
4. **Isolamento de Fases:** Cada agente deve, preferencialmente, focar em terminar arquivos ou componentes isolados antes de esgotar o limite, evitando deixar código quebrado no meio do arquivo.

---

## 2. Decisões Técnicas Consolidadas

| Componente | Decisão | Observação |
|---|---|---|
| **Linguagem e Stack** | JS Puro, Handlebars, SCSS | Manter simples, usando compilação mínima no Node. |
| **Foundry VTT** | AppV2, TypeDataModel | O pipeline base usa v13 (mínimo) e DataModels em vez de `template.json`. |
| **Dice Roller** | **Integrado ao Sistema** | O código do módulo `assimilacao-dice-roller` será migrado para compor o *núcleo (core)* do sistema, incluindo os dados customizados (`da`, `db`, `dc`) e integração com Dice So Nice!. |
| **Estilos/UI** | SCSS Compartilhado | UI com esquema visual compatível com a ficha web da Nero Industries. |

---

## 3. Fases de Implementação (Roadmap)

### Fase 1 — Setup Base e Integração do Roller *(Escopo: Infraestrutura)*
Objetivo: Criar a fundação do sistema no Foundry e garantir as rolagens personalizadas funcionais desde o dia 1.
- [ ] Inicializar estrutura de diretórios do sistema (module/, templates/, styles/, lang/).
- [ ] Criar manifestos `system.json` e `package.json` instalando dependências de build (SCSS, ESLint).
- [ ] **Integração do Roller:**
  - Migrar `assimilacao-roll.js` ou arquivos do módulo existente para `/module/dice/`.
  - Migrar os assets, SVGs e CSS do módulo para o sistema.
  - Registrar os dados `da`, `db`, `dc` na inicialização do sistema (`Hooks.once("init")`) com integração Dice So Nice! embutida.
- [ ] Criar o pipeline de CI/CD (GitHub Actions `release.yml`) referenciado no V0.

> **Ponto de Handoff sugerido:** O sistema carrega no Foundry, as macros nativas `2da+1db` funcionam perfeitamente sem erros de console.

### Fase 2 — DataModels (Actor & Item) *(Escopo: Dados)*
Objetivo: Definir a carga de dados que embasará a ficha. Sem UI complexa neste momento.
- [ ] Implementar classe `InfectadoData` (`TypeDataModel`).
- [ ] Adicionar os campos de Identidade, Propósitos, Instintos, Conhecimentos, Práticas, Saúde (níveis) e Cabo de Guerra (Determinação e Assimilação).
- [ ] Implementar Getters (HP por nível, cálculo de Determinação vs Assimilação = 10, etc).
- [ ] Implementar classe `ItemInventarioData` (`TypeDataModel` de itens genéricos: Arma, Utilidade, Consumível).
- [ ] Registrar os modelos no `CONFIG.Actor.dataModels` e `CONFIG.Item.dataModels`.

> **Ponto de Handoff sugerido:** Modelos instanciáveis via console (ex: `await Actor.create({name: "Teste", type: "infectado"})`) geram os dados corretamente sem exceptions.

### Fase 3 — UI da Ficha de Personagem (Estática e Layout) *(Escopo: Frontend)*
Objetivo: Montar o visual e edição básica de todos os inputs.
- [ ] Configurar a classe `InfectadoSheet` derivada de `ActorSheetV2` (ou AppV2 mixins).
- [ ] Criar arquivo raiz `infectado-sheet.hbs` com a base (Header, Nav de abas).
- [ ] Implementar Header (Eventos, Ocupação) e Propósitos (cores variadas num grid).
- [ ] Implementar Lista de Instintos, Conhecimentos e Práticas (inputs numéricos e dropdowns de combinação já visíveis, mesmo sem funcionalidade).
- [ ] CSS/SCSS: Estilizar usando as variáveis base (cores vermelho/azul, estilo Pós-colapso) parelhas ao site Nero Industries.

> **Ponto de Handoff sugerido:** A ficha é esteticamente perfeita conforme os planos. Todos os campos editam e salvam os dados no servidor, mas botões de rolar ou lógicas complexas de clique não fazem nada.

### Fase 4 — Integração Ficha <--> Dice Roller *(Escopo: Lógica/Interatividade)*
Objetivo: Dar vida à ficha do jogador.
- [ ] Conectar os botões de instintos (`d6`) na ficha à função de montar o pool de dados (`rollPool` do V0).
- [ ] Conectar os botões de Aptidão (`d10`) na ficha. Garantir a validação se um Instinto base foi selecionado no dropdown da linha.
- [ ] Montar e formatar mensagens de chat customizadas exibindo o pool, o "dado escolhido", e as faces (A/B/C) resultantes (aproveitando os templates do `assimilacao-dice-roller`).
- [ ] Implementar a "Ação Assimilada" (Rolagem apenas d6 usando dois instintos).

> **Ponto de Handoff sugerido:** O jogador pode jogar o jogo completo via ficha, clicando em testes e gerando resultados no chat com dados 3D.

### Fase 5 — Lógicas Avançadas (Saúde & Cabo de Guerra) *(Escopo: Regras do Sistema)*
Objetivo: Automação das regras de vitalidade e mutação da ficha.
- [ ] Tracker de Saúde (6 níveis): Implementar corações clicáveis. Ao esvaziar/sofrer dano, refletir o "Status Atual" visualmente na ficha.
- [ ] Cabo de Guerra: Adicionar slider interativo. Onde mexer na Determinação (D) ajusta a Assimilação (E) para manter soma absoluta de 10.
- [ ] Penalidades automáticas (opcional / se sobrar tempo): Exibir tooltip/alerta na ficha se o jogador rolar dados sob penalidade de saúde (-1 A em Lacerado/Ferido).

> **Ponto de Handoff sugerido:** A ficha é responsiva às regras e avisa sobre as condições do personagem.

### Fase 6 — Inventário e Ítens *(Escopo: Embeds)*
Objetivo: Gestão da mochila e slots de equipamento.
- [ ] Criar sheet simplificado para edição de itens (`ItemInventarioSheet`).
- [ ] Aba "Inventário" na ficha de ator: Grade visual mostrando slots de Corpo (3) e Mochila (6).
- [ ] Funções de CRUD na ficha (Criar novo item diretamente, arrastar, apagar).
- [ ] Exibir indicadores numéricos dinâmicos de peso ou preenchimento (Corpo X/3, Mochila Y/6).

> **Ponto de Handoff sugerido:** Personagem pode ser devidamente equipado. Versão **v1.0** pronta para release na comunidade!

---

## 4. Notas Finais para o Desenvolvedor IA

1. O módulo existente (`assimilacao-dice-roller`) deve servir como núcleo da **Fase 1**. Estude os arquivos `modules/assimilacao-roll.js` do módulo para entender o registro das partes Dice3D.
2. Não tente implementar todas as fases em um único prompt. Use o escopo de cada Fase para ditar um único bloco de atividades por vez no diálogo com o Agente de IA.
3. Se encontrar dúvidas ao implementar lógicas complexas (ex: regras de face do V0 que não batem com o módulo existente), pare e escreva uma observação no `STATUS.md` perguntando ao usuário humano sobre o comportamento correto dos dados nas faces combinadas.

*Fim do Plano V1.*
