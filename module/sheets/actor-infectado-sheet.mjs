export class InfectadoSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["assimilacao", "sheet", "actor", "infectado"],
            template: "systems/assimilacao/templates/actors/infectado-sheet.hbs",
            width: 850,
            height: 950,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "frente" }]
        });
    }

    getData() {
        const data = super.getData();
        data.system = data.actor.system;
        
        // Arrays de auxílio para o HBS
        data.saudeNiveis = data.system.saudeNiveisArray;
        
        data.geracaoOptions = {
            "preCollapse": "Pré-Colapso",
            "collapse": "Colapso",
            "postCollapse": "Pós-Colapso"
        };
        
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        
        // Fase 4: Listeners de clique e rolagem entrarão aqui
    }
}
