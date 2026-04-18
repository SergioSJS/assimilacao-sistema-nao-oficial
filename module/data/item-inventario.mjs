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
