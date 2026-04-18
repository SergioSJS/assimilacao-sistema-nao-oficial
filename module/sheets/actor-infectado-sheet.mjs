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
        
        // Arrays de auxílio para o HBS, agora criando array iterável para os pontinhos de vida
        data.saudeNiveis = data.system.saudeNiveisArray.map(nvl => {
            // Conta de 0 até max-1. Se index < nvl.gasto, está preenchido (dano recebido/gasto)
            // No Assimilação os PVs na verdade contabilizam "Dano sofrido". Portanto, gasto = marcado.
            nvl.dots = Array.from({length: nvl.max}, (_, i) => {
                return { index: i, gasto: i < nvl.gasto };
            });
            return nvl;
        });
        
        data.geracaoOptions = {
            "preCollapse": "Pré-Colapso",
            "collapse": "Colapso",
            "postCollapse": "Pós-Colapso"
        };

        // Inventário: filtra items do ator based on their location
        data.itemsCorpo = data.actor.items.filter(i => i.system.localizacao === "corpo");
        data.itemsMochila = data.actor.items.filter(i => i.system.localizacao === "mochila");
        
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        
        // Listeners das rolagens
        html.find(".roll-instinto").click(this._onRollInstinto.bind(this));
        html.find(".roll-aptidao").click(this._onRollAptidao.bind(this));
        
        // Listener de Saúde
        html.find(".saude-ponto").click(this._onSaudeClick.bind(this));

        // Listeners de Inventário
        html.find('.item-create').click(this._onItemCreate.bind(this));
        html.find('.item-edit').click(this._onItemEdit.bind(this));
        html.find('.item-delete').click(this._onItemDelete.bind(this));
    }

    async _onItemCreate(event) {
        event.preventDefault();
        const localizacao = event.currentTarget.dataset.loc || "mochila";
        const itemData = {
            name: "Novo Item",
            type: "item-inventario",
            system: { localizacao: localizacao }
        };
        return await Item.create(itemData, {parent: this.actor});
    }

    _onItemEdit(event) {
        event.preventDefault();
        const li = $(event.currentTarget).closest(".item");
        const item = this.actor.items.get(li.data("itemId"));
        item.sheet.render(true);
    }

    _onItemDelete(event) {
        event.preventDefault();
        const li = $(event.currentTarget).closest(".item");
        this.actor.deleteEmbeddedDocuments("Item", [li.data("itemId")]);
    }

    async _onSaudeClick(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const nivelKey = $(element).closest(".saude-dots").data("nivel"); // ex: "nivel6"
        const index = parseInt(element.dataset.index); // 0-based
        const isGasto = $(element).hasClass("gasto");

        const gastoAtual = this.actor.system.saude[nivelKey];
        let novoGasto = index + 1; // Ao clicar na posição 'index', preenche todos até ali

        // Se clicou na exatamente última bolinha que já estava preenchida, remove ela
        if (isGasto && gastoAtual === novoGasto) {
            novoGasto = index; 
        }

        await this.actor.update({
            [`system.saude.${nivelKey}`]: novoGasto
        });
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
