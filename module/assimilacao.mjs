import "./dice/assimilacao-roll.mjs";
import "./dice/macro-setup.mjs";
import { InfectadoData } from "./data/actor-infectado.mjs";
import { ItemInventarioData } from "./data/item-inventario.mjs";

Hooks.once("init", () => {
    console.log("Assimilação RPG | Inicializando O Sistema");
    
    // Registro de DataModels
    CONFIG.Actor.dataModels.infectado = InfectadoData;
    CONFIG.Item.dataModels["item-inventario"] = ItemInventarioData;
    
    // Registro de Sheets vai aqui futuramente
});
