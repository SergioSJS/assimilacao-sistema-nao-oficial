export class ItemInventarioSheet extends ItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["assimilacao", "sheet", "item", "inventario"],
            template: "systems/assimilacao/templates/items/item-inventario-sheet.hbs",
            width: 500,
            height: 450,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "descricao" }]
        });
    }

    getData() {
        const data = super.getData();
        data.system = data.item.system;
        
        data.tipoOptions = {
            "arma": "Arma",
            "utilidade": "Utilidade",
            "consumivel": "Consumível",
            "outros": "Outros"
        };

        data.localizacaoOptions = {
            "corpo": "Equipado no Corpo",
            "mochila": "Guardado na Mochila"
        };

        return data;
    }
}
