import { InfectadoSheet } from "../sheets/actor-infectado-sheet.mjs";
import { ItemInventarioSheet } from "../sheets/item-inventario-sheet.mjs";

export function registerSheets() {
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
        label: "ASSIMILACAO.ItemType.inventario"
    });
}
