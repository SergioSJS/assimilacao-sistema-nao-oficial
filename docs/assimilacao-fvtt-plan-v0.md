# Planejamento: Sistema Assimilação RPG para Foundry VTT

> Documento de planejamento técnico completo para implementação do sistema **Assimilação RPG** no Foundry Virtual Tabletop. Elaborado com base no livro de regras (abr/2026, 324 pág.) e na ficha web de referência Nero Industries (assrpgsite.vercel.app). Destinado a orientar um agente de IA ou desenvolvedor na execução do projeto do zero.

---

## 1. Contexto e Objetivo

**Assimilação RPG** é um RPG brasileiro de sobrevivência pós-apocalíptica criado por Vinícius "Lau" Motta, Rafael "Rakin" Knittel e CapyCat Games, publicado pela Editora New Order (ISBN 978-85-68458-97-6, 2025).

**Objetivo:** Implementar o primeiro sistema existente para este jogo no Foundry VTT. A entrega inclui ficha de personagem funcional, roller de dados integrado ao chat, e CI/CD via GitHub Actions com release automático.

**Escopo v1.0:**
- Actor type: `infectado` (personagem jogador)
- Ficha completa com todos os campos do jogo
- Roller de dados A/B/C integrado ao chat do Foundry
- Cabo de Guerra interativo (tokens clicáveis)
- Saúde em 6 níveis com pontos marcáveis
- Inventário (Corpo 3 slots + Mochila 6 slots) com items embedados
- CI/CD automático via GitHub Actions

**Fora do escopo v1.0 (futuras versões):**
- Actor type: NPC/Ameaça com ficha própria
- Automação de Conflitos (turnos, objetivos)
- Assimilações (mutações) como items funcionais — aba placeholder apenas
- Características especiais como items — aba placeholder apenas
- Compêndios de itens
- Publicação no Foundry Package Registry (opcional)

---

## 2. Decisões Técnicas

### 2.1 Stack

| Decisão | Escolha | Justificativa |
|---|---|---|
| Linguagem | **JavaScript** (não TypeScript) | Reduz complexidade para sistema de escopo médio |
| Templates | **Handlebars** `.hbs` | Padrão AppV2 no Foundry v13+ |
| CSS | **SCSS** compilado via npm script | Manutenibilidade e variáveis compartilhadas |
| DataModel | **TypeDataModel classes** | `template.json` está deprecated; AppV2 requer DataModel |
| Sheet class | **`HandlebarsApplicationMixin(ActorSheetV2)`** | API estável no v13 e v14 |
| Dice | **Roller customizado** (não fórmulas nativas) | Os dados têm faces A/B/C simbólicas, não numéricas |

### 2.2 Compatibilidade Alvo

- **Foundry v13** (stable, lançado abr/2025) — versão mínima
- **Foundry v14** (stable, lançado abr/2026) — suportado, upgrade direto do v13
- v13 quebrou compatibilidade com ApplicationV1/template.json; toda implementação deve usar AppV2

### 2.3 Repositórios de Referência

| Repositório | URL | Uso no projeto |
|---|---|---|
| `MetaMorphic-Digital/draw-steel` | github.com/MetaMorphic-Digital/draw-steel | **Principal**: CI/CD tag-triggered, DataModel, AppV2, JS puro, atualizado diariamente |
| `Muttley/foundryvtt-shadowdark` | github.com/Muttley/foundryvtt-shadowdark | Escala de complexidade próxima do Assimilação, MIT |
| `hodpub/boilerplate` branch v13 | github.com/hodpub/boilerplate/tree/v13 | Esqueleto de sistema se necessário |
| `Capycat-Games/skyfall-fvtt` | github.com/Capycat-Games/skyfall-fvtt | Referência de qualidade BR, mesma equipe do Assimilação |

**Estratégia:** extrair `.github/workflows/` do draw-steel; usar draw-steel como referência primária de arquitetura DataModel/AppV2; usar skyfall-fvtt como referência de padrões PT-BR.

---

## 3. Regras do Sistema — Referência Completa para Implementação

### 3.1 Aptidões — Três Categorias

#### INSTINTOS (d6) — valor 1 a 5

Base de todo teste. Cada ponto = 1d6 na pilha.

| Campo interno | Label PT-BR | Descrição |
|---|---|---|
| `reacao` | Reação | Velocidade de resposta, reflexos, ações reativas |
| `percepcao` | Percepção | Sentidos, atenção, pontaria |
| `sagacidade` | Sagacidade | Inteligência, dedução, interpretação de informações |
| `potencia` | Potência | Força física, explosão muscular |
| `influencia` | Influência | Carisma, liderança, intimidação |
| `resolucao` | Resolução | Resistência física e mental, perseverança |

> **Potência + Resolução** são os instintos que calculam HP por nível de Saúde e Regeneração.

**Adjetivos por valor (Resolução como exemplo):** 1=Vacilante, 2=Estável, 3=Determinada, 4=Inquebrável, 5=Indomável. Cada Instinto tem seus próprios adjetivos no livro (pág. 44–48).

#### CONHECIMENTOS (d10) — valor 0 a 5

Adquiridos por estudo. Cada ponto = 1d10 adicional. Valor 0 = sem aptidão.

| Campo interno | Label PT-BR | Nota especial |
|---|---|---|
| `biologia` | Biologia | |
| `erudicao` | Erudição | Pode restaurar Pontos d de aliados via arte/terapia |
| `engenharia` | Engenharia | |
| `geografia` | Geografia | |
| `medicina` | Medicina | Pode recuperar Pontos de Saúde s (tratamento médico) |
| `seguranca` | Segurança | |

#### PRÁTICAS (d10) — valor 0 a 5

Desenvolvidas por treino. Mesmo mecanismo dos Conhecimentos.

| Campo interno | Label PT-BR |
|---|---|
| `armas` | Armas |
| `atletismo` | Atletismo |
| `expressao` | Expressão |
| `furtividade` | Furtividade |
| `manufaturas` | Manufaturas |
| `sobrevivencia` | Sobrevivência |
| `veiculos` | Veículos |

> Sobrevivência e Veículos aparecem na ficha Nero Industries (confirmado no HTML). Devem estar presentes mesmo que o livro não os destaque tanto quanto os outros.

### 3.2 Mecânica de Dados

Os dados do Assimilação têm **faces simbólicas**, não numéricas. Cada face exibe uma combinação de:
- **A** (Sucesso): objetivo alcançado; em Conflitos acumula para completar objetivos
- **B** (Adaptação): contornar dificuldades, ajudar aliados, ignorar penalidades
- **C** (Pressão): consequências negativas a critério do Assimilador

**Distribuição confirmada pelo livro:**

| Dado | Uso | C (Pressão) | B (Adaptação) | A (Sucesso) |
|---|---|---|---|---|
| **d6** | Instintos | 3 faces — 50% | 1 face — 17% | 1 face — 17% |
| **d10** | Conhecimentos/Práticas | 5 faces — 50% | 3 faces — 30% | 7 faces — 70% |
| **d12** | Dano | 8 faces — 67% | 5 faces — 42% | 8 faces — 67% |

> **ATENÇÃO IMPLEMENTAÇÃO:** O livro confirma o total de faces por símbolo, mas não especifica quais faces têm combinações (ex: A+C na mesma face). Isso precisa ser confirmado com imagens dos dados físicos via redes sociais do Assimilação RPG ou contato com o publisher antes de implementar o roller.

**Construção do pool:**
- Nº de d6 = valor do Instinto
- Nº de d10 = valor do Conhecimento ou Prática
- O jogador escolhe **apenas 1 dado** para manter (o mais vantajoso)

**Formas de manter dados adicionais:**
1. Gastar 1 Ponto de Determinação `d` → manter 1 dado extra (máx. 1x por rodada)
2. Ativar uma Origem → manter 1 dado extra descartável (máx. 1x/sessão por Origem)
3. **Agir por Instinto (Rolagem Assimilada):** gastar 1 Ponto de Assimilação `e`; substituir todos d10 por d6 de um segundo Instinto; manter 1 dado extra

**Rolagem de Dano:** d12; cada símbolo (A, B ou C) = 1 ponto de dano independentemente.

### 3.3 Cabo de Guerra — Determinação × Assimilação

Regra central: `Nível D + Nível E = 10` sempre.

**Determinação (D) — vermelho:**
- Nível varia 0–10; Pontos `d` disponíveis = Nível atual
- Usos de Pontos `d`: Empenho (manter dado extra, 1x/rodada), Perseverança (ignorar penalidade, 1x/rodada), cobrir custo de Assimilação (2 `d` = 1 `e`)
- Perder todos os Pontos `d` → estado Suscetível (não pode gastar mais `d`)
- Com estado Suscetível ativo + nova perda de `d` → perde 1 Nível D, Nível E sobe automaticamente, sofre mutação
- Recuperação de Pontos `d`: repouso completo (1 + Resolução por repouso), atividades de recompensa, realizar Propósitos (Clareza de Propósito)

**Assimilação (E) — azul:**
- Complemento de D (E = 10 − D)
- Pontos `e` disponíveis = Nível E atual
- Usos: Agir por Instinto, ativar características de mutação
- Recuperação: completa ao fim de cada cena (Conflito ou narrativa fluida)
- Esgotar Pontos `e` não tem consequências diretas; pode gastar 2 Pontos `d` no lugar de 1 `e`

**Clareza de Propósito** — ao realizar um Propósito, escolhe entre:
1. Recuperar 1 Nível D completo (com todos os Pontos `d` do novo Nível)
2. Neutralizar 1 C de uma Assimilação Inoportuna

### 3.4 Saúde — 6 Níveis

HP por nível = `1 + Potência + Resolução` (calculado dinamicamente).
Regeneração por descanso = `Potência + 1` Pontos s.

| Nível S | Nome | Penalidade | Recuperação natural |
|---|---|---|---|
| 6 | Saudável | Nenhuma | Repouso completo (8h + boas condições) |
| 5 | Escoriado | Nenhuma | Repouso completo |
| 4 | Lacerado | −1 A em todos os testes | Repouso semanal (1 semana de boas condições) |
| 3 | Ferido | −1 A em todos os testes | Repouso semanal |
| 2 | Arrebentado | −2 A; gastar 1d para agir; gastar BB para ignorar penalidade | Não se recupera naturalmente |
| 1 | Incapacitado | −2 A; gastar 1d por rodada só para ficar consciente | Não se recupera naturalmente |

**Fluxo de dano:**
1. Perder Pontos s dentro do nível atual
2. Quando nível esgota → baixa para próximo Nível S
3. Excesso de dano continua no nível abaixo
4. Zerar todos os 6 níveis → morte

**Níveis 2 e 1** requerem tratamento médico (Aptidão Medicina) para estabilizar e permitir recuperação.

### 3.5 Origens

Dois campos de texto livre na ficha:

- **Evento Marcante** (`origens.eventoMarcante`): situação passada que moldou o personagem. Exemplos do livro: "Sobrevivente da queda de São Leopoldo", "Abandonado pelos familiares", "Líder destronado pelo irmão"
- **Ocupação** (`origens.ocupacao`): atividade diária, expressa em ~2 palavras. Exemplos: "Naturalista Devota", "Mercador Honrado", "Beato Revolucionário"

**Mecânica:** ao realizar rolagem relacionada à Origem, pode ativá-la para manter 1 dado extra descartável (se não vantajoso, pode descartar). Máx. 1x por sessão por Origem. Rastrear `usadoNaSessao` por Origem. Limpar ao início de nova sessão.

Origens mudam durante o jogo com aprovação do Assimilador.

### 3.6 Propósitos

4 campos de texto na ficha:

| Campo | Label | Cor na ficha Nero | Descrição |
|---|---|---|---|
| `propositos.pessoal1` | Propósito Individual 1 | Vermelho/rosado | Anseio íntimo do personagem |
| `propositos.pessoal2` | Propósito Individual 2 | Vermelho/rosado | Anseio íntimo do personagem |
| `propositos.relacional1` | Prop. Relacional 1 | Azul/médio | Dinâmica com o grupo |
| `propositos.relacional2` | Prop. Relacional 2 | Azul/médio | Dinâmica com o grupo |

Propósitos Relacionais precisam de adesão de ao menos 2 jogadores para serem ativos (não-Inertes). Implementar v1.0 como texto livre sem validação de adesão.

### 3.7 Geração

Campo dropdown:

| Valor interno | Label |
|---|---|
| `preCollapse` | Pré-Colapso |
| `collapse` | Colapso |
| `postCollapse` | Pós-Colapso |

### 3.8 Inventário — Estrutura Visual

**Corpo (3 slots fixos e tipados):**
- Slot 1: Arma (ícone placeholder diferente)
- Slot 2: Utilidade
- Slot 3: Consumível

**Mochila (6 slots dinâmicos):**
- Cada item: nome, imagem, peso (number), tipo, descrição
- Ações: Mover (entre Corpo/Mochila), Editar (abre sheet), Descartar (confirmação)
- Interface: grade com ícones, drag-and-drop entre slots
- Exibir contagem: "Corpo (0/3)" e "Mochila (X/6)"

---

## 4. DataModel Completo

### 4.1 Actor: `infectado`

```javascript
// module/data/actor-infectado.mjs
export class InfectadoData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {

      // ─── IDENTIDADE ───────────────────────────────────────────
      eventoMarcante: new fields.StringField({ required: false, initial: "" }),
      geracao: new fields.StringField({
        required: true,
        initial: "postCollapse",
        choices: ["preCollapse", "collapse", "postCollapse"]
      }),
      ocupacao: new fields.StringField({ required: false, initial: "" }),
      notas: new fields.HTMLField({ required: false, initial: "" }),

      // ─── PROPÓSITOS ───────────────────────────────────────────
      propositos: new fields.SchemaField({
        pessoal1:    new fields.StringField({ required: false, initial: "" }),
        pessoal2:    new fields.StringField({ required: false, initial: "" }),
        relacional1: new fields.StringField({ required: false, initial: "" }),
        relacional2: new fields.StringField({ required: false, initial: "" }),
      }),

      // ─── INSTINTOS (d6, 1–5) ──────────────────────────────────
      instintos: new fields.SchemaField({
        reacao:    new fields.NumberField({ integer: true, min: 1, max: 5, initial: 1, required: true }),
        percepcao: new fields.NumberField({ integer: true, min: 1, max: 5, initial: 1, required: true }),
        sagacidade:new fields.NumberField({ integer: true, min: 1, max: 5, initial: 1, required: true }),
        potencia:  new fields.NumberField({ integer: true, min: 1, max: 5, initial: 1, required: true }),
        influencia:new fields.NumberField({ integer: true, min: 1, max: 5, initial: 1, required: true }),
        resolucao: new fields.NumberField({ integer: true, min: 1, max: 5, initial: 1, required: true }),
      }),

      // ─── CONHECIMENTOS (d10, 0–5) ─────────────────────────────
      conhecimentos: new fields.SchemaField({
        biologia:   new fields.NumberField({ integer: true, min: 0, max: 5, initial: 0, required: true }),
        erudicao:   new fields.NumberField({ integer: true, min: 0, max: 5, initial: 0, required: true }),
        engenharia: new fields.NumberField({ integer: true, min: 0, max: 5, initial: 0, required: true }),
        geografia:  new fields.NumberField({ integer: true, min: 0, max: 5, initial: 0, required: true }),
        medicina:   new fields.NumberField({ integer: true, min: 0, max: 5, initial: 0, required: true }),
        seguranca:  new fields.NumberField({ integer: true, min: 0, max: 5, initial: 0, required: true }),
      }),

      // ─── PRÁTICAS (d10, 0–5) ──────────────────────────────────
      praticas: new fields.SchemaField({
        armas:        new fields.NumberField({ integer: true, min: 0, max: 5, initial: 0, required: true }),
        atletismo:    new fields.NumberField({ integer: true, min: 0, max: 5, initial: 0, required: true }),
        expressao:    new fields.NumberField({ integer: true, min: 0, max: 5, initial: 0, required: true }),
        furtividade:  new fields.NumberField({ integer: true, min: 0, max: 5, initial: 0, required: true }),
        manufaturas:  new fields.NumberField({ integer: true, min: 0, max: 5, initial: 0, required: true }),
        sobrevivencia:new fields.NumberField({ integer: true, min: 0, max: 5, initial: 0, required: true }),
        veiculos:     new fields.NumberField({ integer: true, min: 0, max: 5, initial: 0, required: true }),
      }),

      // ─── CABO DE GUERRA ───────────────────────────────────────
      // Nível D + Nível E = 10 sempre. Nível E é derivado.
      // Pontos disponíveis = Nível. Pontos são gastos e recuperados.
      determinacaoNivel:  new fields.NumberField({ integer: true, min: 0, max: 10, initial: 9, required: true }),
      pontosDeterminacao: new fields.NumberField({ integer: true, min: 0, initial: 9, required: true }),
      // assimilacaoNivel = 10 - determinacaoNivel (getter)
      pontosAssimilacao:  new fields.NumberField({ integer: true, min: 0, initial: 1, required: true }),
      suscetivel:         new fields.BooleanField({ initial: false }),

      // ─── SAÚDE ────────────────────────────────────────────────
      // HP por nível = 1 + potencia + resolucao (calculado via getter)
      // nivelAtual: 6=Saudável, 5=Escoriado, ..., 1=Incapacitado
      saude: new fields.SchemaField({
        nivelAtual: new fields.NumberField({ integer: true, min: 1, max: 6, initial: 6, required: true }),
        // Pontos gastos em cada nível (6 níveis, índice 0 = nível 6/Saudável)
        nivel6: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
        nivel5: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
        nivel4: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
        nivel3: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
        nivel2: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
        nivel1: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      }),

      // ─── ORIGENS ──────────────────────────────────────────────
      origens: new fields.SchemaField({
        eventoMarcante: new fields.SchemaField({
          descricao:     new fields.StringField({ initial: "" }),
          usadoNaSessao: new fields.BooleanField({ initial: false }),
        }),
        ocupacao: new fields.SchemaField({
          descricao:     new fields.StringField({ initial: "" }),
          usadoNaSessao: new fields.BooleanField({ initial: false }),
        }),
      }),

      // ─── INVENTÁRIO ───────────────────────────────────────────
      // Items são embedded Items do Foundry. Os slots rastreiam
      // a posição/localização de cada item por ID.
      inventario: new fields.SchemaField({
        // Arrays de IDs de Item embedado (null = slot vazio)
        corpoSlots: new fields.ArrayField(
          new fields.StringField({ nullable: true, blank: true, initial: null }),
          { initial: [null, null, null] }  // 3 slots: arma, utilidade, consumível
        ),
        mochilaSlots: new fields.ArrayField(
          new fields.StringField({ nullable: true, blank: true, initial: null }),
          { initial: [null, null, null, null, null, null] }  // 6 slots
        ),
      }),
    };
  }

  // ─── GETTERS DERIVADOS ──────────────────────────────────────────
  get assimilacaoNivel() {
    return 10 - this.determinacaoNivel;
  }

  get pontosHPporNivel() {
    return 1 + this.instintos.potencia + this.instintos.resolucao;
  }

  get regeneracaoPorDescanso() {
    return this.instintos.potencia + 1;
  }

  get recuperacaoDeterminacaoPorDescanso() {
    return 1 + this.instintos.resolucao;
  }

  get nivelSaudeLabel() {
    const labels = {
      6: "Saudável", 5: "Escoriado", 4: "Lacerado",
      3: "Ferido", 2: "Arrebentado", 1: "Incapacitado"
    };
    return labels[this.saude.nivelAtual] ?? "Saudável";
  }

  // Preparar array dos 6 níveis para o template
  get saudeNiveisArray() {
    const hp = this.pontosHPporNivel;
    return [
      { num: 6, nome: "Saudável",    max: hp, gasto: this.saude.nivel6 },
      { num: 5, nome: "Escoriado",   max: hp, gasto: this.saude.nivel5 },
      { num: 4, nome: "Lacerado",    max: hp, gasto: this.saude.nivel4 },
      { num: 3, nome: "Ferido",      max: hp, gasto: this.saude.nivel3 },
      { num: 2, nome: "Arrebentado", max: hp, gasto: this.saude.nivel2 },
      { num: 1, nome: "Incapacitado",max: hp, gasto: this.saude.nivel1 },
    ];
  }
}
```

### 4.2 Item: `item-inventario`

```javascript
// module/data/item-inventario.mjs
export class ItemInventarioData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      tipo: new fields.StringField({
        required: true,
        initial: "utilidade",
        choices: ["arma", "utilidade", "consumivel", "outros"]
      }),
      peso:      new fields.NumberField({ integer: true, min: 0, max: 10, initial: 1 }),
      descricao: new fields.HTMLField({ required: false, initial: "" }),
      quantidade:new fields.NumberField({ integer: true, min: 0, initial: 1 }),
      // localização atual: "corpo" ou "mochila"
      localizacao: new fields.StringField({
        required: true,
        initial: "mochila",
        choices: ["corpo", "mochila"]
      }),
    };
  }
}
```

---

## 5. Roller de Dados — Implementação

Esta é a mecânica mais crítica. Os dados não têm números — têm faces simbólicas. O Foundry não tem suporte nativo a isso.

### 5.1 Faces dos Dados

```javascript
// module/dice/assimilacao-dice.mjs

// IMPORTANTE: As combinações abaixo são estimadas com base nas
// probabilidades do livro. CONFIRMAR com imagens dos dados físicos.
// O livro garante: d6 tem 3C, 1B, 1A (+ 1 combinada A+C).

export const D6_FACES = [
  { a: 0, b: 0, c: 1 },  // C
  { a: 0, b: 0, c: 1 },  // C
  { a: 0, b: 0, c: 1 },  // C
  { a: 0, b: 1, c: 0 },  // B
  { a: 1, b: 0, c: 0 },  // A
  { a: 1, b: 0, c: 1 },  // A+C (combinada — confirmar se existe)
];

export const D10_FACES = [
  { a: 0, b: 0, c: 1 },  // C
  { a: 0, b: 0, c: 1 },  // C
  { a: 0, b: 0, c: 1 },  // C
  { a: 0, b: 0, c: 1 },  // C
  { a: 0, b: 0, c: 1 },  // C
  { a: 0, b: 1, c: 0 },  // B
  { a: 0, b: 1, c: 0 },  // B
  { a: 1, b: 1, c: 0 },  // A+B (combinada — confirmar)
  { a: 1, b: 0, c: 0 },  // A
  { a: 1, b: 0, c: 0 },  // A
  // Total confirmado: 5C, 3B, 7A — distribuição das combinadas a confirmar
];

// Dano: d12, cada símbolo = 1 ponto de dano
export const D12_DANO_FACES = 12;

/**
 * Monta e rola o pool de dados do Assimilação.
 * @param {number} nInstinto - Valor do instinto (número de d6)
 * @param {number} nAptidao  - Valor da aptidão (número de d10); 0 = nenhum
 * @param {boolean} assimilada - Se true: Rolagem Assimilada (substituir d10 por d6 extra)
 * @returns {Array} Pool de resultados de cada dado
 */
export function rollPool({ nInstinto, nAptidao = 0, assimilada = false }) {
  const pool = [];

  // d6 do Instinto
  const totalD6 = assimilada ? nInstinto + nAptidao : nInstinto;
  for (let i = 0; i < totalD6; i++) {
    const idx = Math.floor(Math.random() * D6_FACES.length);
    pool.push({ dado: "d6", face: idx, ...D6_FACES[idx] });
  }

  // d10 da Aptidão (apenas rolagem normal)
  if (!assimilada) {
    for (let i = 0; i < nAptidao; i++) {
      const idx = Math.floor(Math.random() * D10_FACES.length);
      pool.push({ dado: "d10", face: idx, ...D10_FACES[idx] });
    }
  }

  return pool;
}

/** Seleciona automaticamente o dado mais vantajoso do pool (maior A, depois menor C) */
export function autoSelecionarMelhor(pool) {
  return pool.reduce((melhor, atual) => {
    if (atual.a > melhor.a) return atual;
    if (atual.a === melhor.a && atual.b > melhor.b) return atual;
    if (atual.a === melhor.a && atual.b === melhor.b && atual.c < melhor.c) return atual;
    return melhor;
  });
}
```

### 5.2 Integração com a Ficha

```javascript
// module/sheets/actor-infectado-sheet.mjs (trecho de ações)

static async #rolarInstinto(event, target) {
  const sheet = this; // InfectadoSheet
  const actor = sheet.actor;
  const instintoKey = target.dataset.instinto;         // ex: "reacao"
  const combinarKey = target.closest(".rowItem")
    ?.querySelector("select")?.value || null;           // ex: "percepcao" ou null

  const nInstinto = actor.system.instintos[instintoKey];
  const nInstintoCombinado = combinarKey
    ? actor.system.instintos[combinarKey] : 0;

  // Rolagem Assimilada: 2 instintos em d6, sem d10
  const pool = rollPool({
    nInstinto: nInstinto + nInstintoCombinado,
    nAptidao: 0,
    assimilada: true
  });

  await enviarRolagem({
    actor,
    tipo: "assimilada",
    label: game.i18n.localize(`ASSIMILACAO.Sheet.${instintoKey.charAt(0).toUpperCase() + instintoKey.slice(1)}`),
    pool,
    dadoEscolhido: autoSelecionarMelhor(pool),
  });
}

static async #rolarAptidao(event, target) {
  const sheet = this;
  const actor = sheet.actor;
  const aptidaoKey = target.dataset.aptidao;   // ex: "medicina"
  const categoria = target.dataset.categoria;  // "conhecimentos" ou "praticas"
  const instintoKey = target.closest(".rowItem")
    ?.querySelector("select")?.value || null;

  if (!instintoKey) {
    ui.notifications.warn("Selecione um Instinto para combinar antes de rolar.");
    return;
  }

  const nInstinto = actor.system.instintos[instintoKey];
  const nAptidao  = actor.system[categoria][aptidaoKey];

  const pool = rollPool({ nInstinto, nAptidao, assimilada: false });

  await enviarRolagem({
    actor,
    tipo: "normal",
    label: `${game.i18n.localize(`ASSIMILACAO.Sheet.${instintoKey}`)} + ${game.i18n.localize(`ASSIMILACAO.Sheet.${aptidaoKey}`)}`,
    pool,
    dadoEscolhido: autoSelecionarMelhor(pool),
  });
}
```

---

## 6. Estrutura de Arquivos

```
assimilacao-fvtt/
├── .github/
│   └── workflows/
│       └── release.yml
├── module/
│   ├── assimilacao.mjs          # Ponto de entrada; todos os Hooks
│   ├── config.mjs               # CONFIG.ASSIMILACAO — constantes
│   ├── data/
│   │   ├── actor-infectado.mjs
│   │   └── item-inventario.mjs
│   ├── sheets/
│   │   ├── actor-infectado-sheet.mjs
│   │   └── item-inventario-sheet.mjs
│   ├── dice/
│   │   ├── assimilacao-dice.mjs  # Faces, rollPool, autoSelecionarMelhor
│   │   └── roll-message.mjs      # enviarRolagem → ChatMessage
│   └── helpers/
│       ├── handlebars.mjs        # Helpers HBS (times, range, etc.)
│       └── utils.mjs
├── templates/
│   ├── actors/
│   │   ├── infectado-sheet.hbs   # Shell com tabs e PARTS
│   │   └── parts/
│   │       ├── header.hbs        # Nome, Evento Marcante, Geração, Ocupação
│   │       ├── propositos.hbs    # 4 propósitos com cores distintas
│   │       ├── instintos.hbs     # 6 instintos: valor + dropdown combinar + botão d6
│   │       ├── aptidoes.hbs      # Conhecimentos (azul) + Práticas (vermelho): valor + dropdown instinto + botão d10
│   │       ├── saude.hbs         # 6 barras com corações clicáveis
│   │       ├── cabo-guerra.hbs   # Tokens Determinação/Assimilação + slider visual
│   │       ├── inventario.hbs    # Corpo (3 slots tipados) + Mochila (6 slots)
│   │       ├── anotacoes.hbs     # Textarea / editor de texto
│   │       ├── caracteristicas.hbs  # Placeholder v1.0
│   │       └── assimilacoes.hbs     # Placeholder v1.0
│   ├── items/
│   │   └── item-inventario-sheet.hbs
│   └── chat/
│       └── roll-resultado.hbs    # Pool de dados + dado escolhido + A/B/C
├── lang/
│   └── pt-BR.json
├── styles/
│   ├── assimilacao.scss
│   └── _variables.scss           # Cores: vermelho determinação, azul assimilação, etc.
├── assets/
│   └── icons/                    # SVGs de d6 e d10 para botões de rolagem
├── system.json
├── template.json                 # Stub mínimo (pode ser vazio em v13+)
├── package.json
└── README.md
```

---

## 7. system.json

```json
{
  "id": "assimilacao",
  "title": "Assimilação RPG",
  "description": "Sistema Assimilação RPG para Foundry VTT. RPG brasileiro de sobrevivência pós-apocalíptica.",
  "version": "0.1.0",
  "compatibility": {
    "minimum": "13",
    "verified": "14"
  },
  "authors": [
    { "name": "SEU_NOME", "url": "https://github.com/SEU_USER" }
  ],
  "esmodules": ["module/assimilacao.mjs"],
  "styles": ["styles/assimilacao.css"],
  "languages": [
    {
      "lang": "pt-BR",
      "name": "Português (Brasil)",
      "path": "lang/pt-BR.json"
    }
  ],
  "documentTypes": {
    "Actor": {
      "infectado": { "htmlFields": ["system.notas"] }
    },
    "Item": {
      "item-inventario": { "htmlFields": ["system.descricao"] }
    }
  },
  "url": "https://github.com/SEU_USER/assimilacao-fvtt",
  "manifest": "https://raw.githubusercontent.com/SEU_USER/assimilacao-fvtt/main/system.json",
  "download": "https://github.com/SEU_USER/assimilacao-fvtt/releases/latest/download/assimilacao.zip"
}
```

---

## 8. Ponto de Entrada — assimilacao.mjs

```javascript
// module/assimilacao.mjs
import { InfectadoData } from "./data/actor-infectado.mjs";
import { ItemInventarioData } from "./data/item-inventario.mjs";
import { InfectadoSheet } from "./sheets/actor-infectado-sheet.mjs";
import { ItemInventarioSheet } from "./sheets/item-inventario-sheet.mjs";
import { registerHandlebarsHelpers } from "./helpers/handlebars.mjs";

Hooks.once("init", () => {
  console.log("Assimilação RPG | Inicializando sistema");

  // DataModels
  CONFIG.Actor.dataModels.infectado = InfectadoData;
  CONFIG.Item.dataModels["item-inventario"] = ItemInventarioData;

  // Sheets
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("assimilacao", InfectadoSheet, {
    types: ["infectado"],
    makeDefault: true,
    label: "ASSIMILACAO.ActorType.infectado"
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("assimilacao", ItemInventarioSheet, {
    types: ["item-inventario"],
    makeDefault: true,
    label: "ASSIMILACAO.ItemType.item-inventario"
  });

  // Helpers HBS
  registerHandlebarsHelpers();

  console.log("Assimilação RPG | Sistema inicializado");
});

// Limpar origens usadas no início de nova sessão
// (hook para quando GM inicia a sessão — implementar como macro ou automação futura)
```

---

## 9. CI/CD — GitHub Actions

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*.*.*'

permissions:
  contents: write

jobs:
  build-and-release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build SCSS
        run: npm run build:css

      - name: Extract version
        id: version
        run: echo "VERSION=${GITHUB_REF#refs/tags/v}" >> $GITHUB_OUTPUT

      - name: Update system.json
        run: |
          DOWNLOAD="https://github.com/${{ github.repository }}/releases/download/${{ github.ref_name }}/assimilacao.zip"
          jq --arg ver "${{ steps.version.outputs.VERSION }}" \
             --arg dl "$DOWNLOAD" \
             '.version = $ver | .download = $dl' \
             system.json > system.tmp.json && mv system.tmp.json system.json

      - name: Build release zip
        run: |
          zip -r assimilacao.zip \
            module/ templates/ lang/ assets/ \
            styles/assimilacao.css \
            system.json template.json \
            --exclude "*.map" "*.scss"

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          files: |
            assimilacao.zip
            system.json
          generate_release_notes: true
          fail_on_unmatched_files: true
```

```json
// package.json
{
  "name": "assimilacao-fvtt",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build:css": "sass styles/assimilacao.scss styles/assimilacao.css --style=compressed --no-source-map",
    "watch:css": "sass styles/assimilacao.scss styles/assimilacao.css --watch",
    "lint": "eslint module/**/*.mjs --fix"
  },
  "devDependencies": {
    "sass": "^1.70.0",
    "eslint": "^8.57.0"
  }
}
```

---

## 10. Localização — lang/pt-BR.json (estrutura completa)

```json
{
  "ASSIMILACAO": {
    "ActorType": { "infectado": "Infectado" },
    "ItemType": { "item-inventario": "Item de Inventário" },
    "Sheet": {
      "EventoMarcante": "Evento Marcante",
      "Geracao": "Geração",
      "Ocupacao": "Ocupação",
      "PreColapso": "Pré-Colapso",
      "Colapso": "Colapso",
      "PosColapso": "Pós-Colapso",
      "PropositoIndividual1": "Propósito Individual 1",
      "PropositoIndividual2": "Propósito Individual 2",
      "PropRelacional1": "Prop. Relacional 1",
      "PropRelacional2": "Prop. Relacional 2",
      "Instintos": "Instintos",
      "Reacao": "Reação",
      "Percepcao": "Percepção",
      "Sagacidade": "Sagacidade",
      "Potencia": "Potência",
      "Influencia": "Influência",
      "Resolucao": "Resolução",
      "ConhecimentosPraticas": "Conhecimentos & Práticas",
      "Conhecimentos": "Conhecimentos",
      "Biologia": "Biologia",
      "Erudicao": "Erudição",
      "Engenharia": "Engenharia",
      "Geografia": "Geografia",
      "Medicina": "Medicina",
      "Seguranca": "Segurança",
      "Praticas": "Práticas",
      "Armas": "Armas",
      "Atletismo": "Atletismo",
      "Expressao": "Expressão",
      "Furtividade": "Furtividade",
      "Manufaturas": "Manufaturas",
      "Sobrevivencia": "Sobrevivência",
      "Veiculos": "Veículos",
      "StatusVital": "Status Vital",
      "Saudavel": "Saudável",
      "Escoriado": "Escoriado",
      "Lacerado": "Lacerado",
      "Ferido": "Ferido",
      "Arrebentado": "Arrebentado",
      "Incapacitado": "Incapacitado",
      "CaboDeGuerra": "Cabo de Guerra",
      "Determinacao": "Determinação",
      "Assimilacao": "Assimilação",
      "RolarAssimilado": "Rolar Assimilado",
      "RolarTeste": "Rolar Teste",
      "RolagemManual": "Rolagem Manual",
      "Inventario": "Inventário",
      "Anotacoes": "Anotações",
      "Caracteristicas": "Características",
      "Assimilacoes": "Assimilações",
      "Arsenal": "Arsenal",
      "Corpo": "Corpo",
      "Mochila": "Mochila",
      "AdicionarItem": "Adicionar Item",
      "Origens": "Origens",
      "EventoMarcantePlaceholder": "Trauma ou evento chave...",
      "OcupacaoPlaceholder": "Ex: Naturalista Devota",
      "CombinarCom": "Combinar",
      "SelecioneInstinto": "Instinto",
      "Notas": "Notas"
    },
    "Dice": {
      "Sucesso": "Sucesso",
      "Adaptacao": "Adaptação",
      "Pressao": "Pressão",
      "RolamentoAssimilado": "Rolamento Assimilado",
      "RolamentoNormal": "Rolamento Normal",
      "PoolDeDados": "Pool de Dados",
      "DadoEscolhido": "Dado Escolhido"
    },
    "Item": {
      "Arma": "Arma",
      "Utilidade": "Utilidade",
      "Consumivel": "Consumível",
      "Outros": "Outros",
      "Peso": "Peso",
      "Quantidade": "Quantidade",
      "Descricao": "Descrição",
      "Mover": "Mover",
      "Editar": "Editar",
      "Descartar": "Descartar"
    }
  }
}
```

---

## 11. Fases de Implementação

### Fase 1 — Estrutura e Ficha Estática *(prioridade máxima)*

Objetivo: ficha abrível no Foundry com todos os campos editáveis e salvando.

- [ ] Criar repositório com estrutura de arquivos completa
- [ ] `system.json`, `template.json`, `package.json`, `.github/workflows/release.yml`
- [ ] Implementar `InfectadoData` (DataModel completo com todos os campos)
- [ ] Implementar `InfectadoSheet` (ActorSheetV2 básico, sem ações)
- [ ] Template: header (Nome, Evento Marcante, Geração dropdown, Ocupação)
- [ ] Template: Propósitos (4 campos com cores distintas)
- [ ] Template: Instintos (6 linhas: label + input numérico + dropdown Combinar + botão d6)
- [ ] Template: Conhecimentos & Práticas (13 linhas: label + input + dropdown Instinto + botão d10; bordas azul/vermelho)
- [ ] Template: Status Vital (6 barras de saúde com corações clicáveis; label do nível ativo em destaque)
- [ ] Template: Cabo de Guerra (tokens clicáveis D/E + slider visual)
- [ ] Template: Inventário (Corpo 3 slots tipados + Mochila 6 slots; botão Adicionar Item)
- [ ] Template: Anotações (textarea ou ProseMirror)
- [ ] Template: Características (placeholder "Em breve")
- [ ] Template: Assimilações (placeholder "Em breve")
- [ ] SCSS: variables (cores, fontes), layout geral, componentes saúde e cabo-guerra
- [ ] `lang/pt-BR.json` completo
- [ ] Getters derivados funcionando (HP por nível, Nível E)

### Fase 2 — CI/CD *(prioridade alta, paralela à Fase 1)*

- [ ] Configurar e testar workflow GitHub Actions
- [ ] Pipeline compilando SCSS e gerando zip correto
- [ ] Release gerado ao fazer push de tag

### Fase 3 — Roller de Dados *(prioridade alta após Fase 1)*

- [ ] **PRIMEIRO**: confirmar combinações exatas de faces dos dados físicos
- [ ] Implementar `assimilacao-dice.mjs` com faces d6 e d10 corretas
- [ ] Implementar `roll-message.mjs` e template de chat `roll-resultado.hbs`
- [ ] Conectar botão Instinto (d6 ícone) → Rolagem Assimilada
- [ ] Conectar botão Aptidão (d10 ícone) → Rolagem Normal com instinto selecionado
- [ ] Validação: dropdown Instinto vazio bloqueia rolagem de Aptidão com aviso
- [ ] Campo de Rolagem Manual (parsear ex: `2d6+1d10`)
- [ ] Chat: exibir pool completo + dado escolhido + símbolos A/B/C visuais

### Fase 4 — Mecânicas Cabo de Guerra e Saúde *(prioridade média)*

- [ ] Saúde: clicar em coração marca/desmarca ponto; avança nível automaticamente
- [ ] Saúde: aplicar penalidades de nível às rolagens
- [ ] Determinação: clicar em token gasta/recupera ponto
- [ ] Determinação: detectar estado Suscetível (todos os pontos gastos)
- [ ] Determinação: gastar d com Suscetível ativo → perde Nível D
- [ ] Assimilação: clicar em token gasta/recupera ponto (recupera automaticamente ao fim de cena via botão)
- [ ] Origens: toggle `usadoNaSessao` com visual de desativado; integrar com roller

### Fase 5 — Inventário Funcional *(prioridade média)*

- [ ] Criar `ItemInventarioSheet` funcional
- [ ] Embedded items visíveis nos slots corretos
- [ ] Drag-and-drop entre slots
- [ ] Ações: Mover, Editar (abre sheet do item), Descartar (confirmação)
- [ ] Contador de peso total da mochila
- [ ] Restrição: slots de Corpo aceitam apenas tipos específicos (arma/utilidade/consumível)

---

## 12. Pontos de Atenção e Riscos

### Faces dos dados — risco ALTO
As probabilidades dos dados são confirmadas pelo livro, mas as **combinações exatas de símbolos por face** (ex: uma face com A+C simultaneamente) não estão documentadas no livro nem na ficha web. Isso afeta diretamente a lógica de escolha do dado. **Ação obrigatória antes de implementar o roller:** buscar imagens dos dados físicos no Instagram/Twitter/Discord do Assimilação RPG ou contatar publisher (New Order Editora).

### "Escolher o dado" — risco MÉDIO
O jogo pede que o jogador escolha qual dado manter. A implementação pode ser automática (auto-melhor) ou interativa (popup para o jogador escolher). A ficha Nero Industries não expõe esse fluxo claramente. Recomendar implementar como auto-melhor na v1.0 com opção de rolar manualmente.

### Roller customizado vs. API Roll do Foundry — risco BAIXO
O Foundry tem uma API de Roll para dados numéricos. Para dados simbólicos, a abordagem mais limpa é simular os resultados e usar ChatMessage com template customizado (sem passar pela Roll API). Isso é tecnicamente simples e não causa problemas de compatibilidade.

### Assimilações (mutações) — fora do escopo v1.0
O sistema de mutações (Capítulo 4, pág. 122+) é complexo. Os Infectados adquirem mutações ao cair de Nível D. Implementar apenas a aba placeholder na v1.0. O DataModel pode reservar um campo `assimilacoes` como array vazio para v2.

### Propósitos Inertes — simplificado v1.0
A mecânica de adesão de Propósitos Coletivos (precisam de aprovação de 2+ jogadores) não tem suporte de automação na v1.0. Implementar como texto livre sem validação.

---

*Documento elaborado em abril de 2026. Fontes: Livro de Regras Assimilação RPG (abr/2026, Nova Order, ISBN 978-85-68458-97-6) e ficha Nero Industries (assrpgsite.vercel.app, confirmada via inspeção de HTML). Alvo: Foundry VTT v13 mínimo, v14 suportado.*
