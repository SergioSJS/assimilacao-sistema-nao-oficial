import { submitAssimilacaoRoll } from "../dice/assimilacao-pool.mjs";

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
        
        // Listeners das rolagens
        html.find(".roll-instinto").click(this._onRollInstinto.bind(this));
        html.find(".roll-aptidao").click(this._onRollAptidao.bind(this));
    }

    async _onRollInstinto(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const instinto = element.dataset.instinto;
        
        // Pega elemento combo na grid próxima (dropdown pra segunda escolha)
        const container = $(element).closest(".stat-box")
        // Na interface atual (Fase 3) nós não pusemos um dropdown direto ali nos instintos como no V0 prevê.
        // Simulando a base para rolar normal por enquanto, apenas D6.
        const qtD6 = this.actor.system.instintos[instinto] || 1;
        
        await submitAssimilacaoRoll({
            actor: this.actor,
            label: `Instinto: ${instinto.toUpperCase()}`,
            nInstinto: qtD6,
            nAptidao: 0,
            tipo: "assimilada"
        });
    }

    async _onRollAptidao(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const aptidao = element.dataset.aptidao;
        const categoria = element.dataset.categoria; // conhecimentos | praticas

        const btnDiv = $(element).closest(".stat-box");
        const instintoCombo = btnDiv.find(".instinto-combinar").val();
        
        if (!instintoCombo) {
            ui.notifications.warn("Selecione um instinto para parear com a aptidão!");
            return;
        }

        const qtD6 = this.actor.system.instintos[instintoCombo] || 1;
        const qtD10 = this.actor.system[categoria][aptidao] || 0;

        await submitAssimilacaoRoll({
            actor: this.actor,
            label: `Teste: ${instintoCombo.toUpperCase()} + ${aptidao.toUpperCase()}`,
            nInstinto: qtD6,
            nAptidao: qtD10,
            tipo: "normal"
        });
    }
}
