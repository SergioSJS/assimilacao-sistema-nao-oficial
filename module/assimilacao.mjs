import "./dice/assimilacao-roll.mjs";
import "./dice/macro-setup.mjs";
import { InfectadoData } from "./data/actor-infectado.mjs";
import { ItemInventarioData } from "./data/item-inventario.mjs";
import { registerSheets } from "./helpers/sheet-registration.mjs";
import { applyPoolSelection } from "./dice/assimilacao-pool.mjs";

Hooks.once("init", () => {
    console.log("Assimilação RPG | Inicializando O Sistema");

    // Helper Handlebars: primeira letra maiúscula
    Handlebars.registerHelper("capitalize", str =>
        typeof str === "string" ? str.charAt(0).toUpperCase() + str.slice(1) : str
    );

    // Registro de DataModels
    CONFIG.Actor.dataModels.infectado = InfectadoData;
    CONFIG.Item.dataModels["item-inventario"] = ItemInventarioData;

    // Registro de Sheets
    registerSheets();
});

// Hook que aplica a seleção interativa de dados em mensagens do chat
Hooks.on("renderChatMessageHTML", (message, html) => {
    applyPoolSelection(message, html);
});
