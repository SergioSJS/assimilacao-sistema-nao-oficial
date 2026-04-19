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
      caracteristicas: new fields.StringField({ required: false, initial: "" }),
      mutacoes: new fields.StringField({ required: false, initial: "" }),

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
