import { InfectadoSheet } from "./sheets/actor-infectado-sheet.mjs";

export function registerSheets() {
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("assimilacao", InfectadoSheet, {
        types: ["infectado"],
        makeDefault: true,
        label: "ASSIMILACAO.ActorType.infectado"
    });
}
