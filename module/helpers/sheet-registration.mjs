import { InfectadoSheet } from "../sheets/actor-infectado-sheet.mjs";
import { ItemInventarioSheet } from "../sheets/item-inventario-sheet.mjs";

export function registerSheets() {
    foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
    foundry.documents.collections.Actors.registerSheet("assimilacao", InfectadoSheet, {
        types: ["infectado"],
        makeDefault: true,
        label: "ASSIMILACAO.ActorType.infectado"
    });

    foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
    foundry.documents.collections.Items.registerSheet("assimilacao", ItemInventarioSheet, {
        types: ["item-inventario"],
        makeDefault: true,
        label: "ASSIMILACAO.ItemType.inventario"
    });
}
