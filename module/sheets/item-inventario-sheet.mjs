const { api, sheets } = foundry.applications;

export class ItemInventarioSheet extends api.HandlebarsApplicationMixin(sheets.ItemSheetV2) {
    static DEFAULT_OPTIONS = {
        classes: ["assimilacao", "sheet", "item", "inventario"],
        window: {
            resizable: true
        },
        position: {
            width: 500
        },
        form: {
            submitOnChange: true,
        },
        actions: {}
    };

    get title() {
        return `Item: ${this.document.name}`;
    }

    static PARTS = {
        body: {
            template: "systems/assimilacao/templates/items/item-inventario-sheet.hbs"
        }
    };

    get item() {
        return this.document;
    }

    async _prepareContext(options) {
        const context = {
            item: this.document,
            system: this.document.system,
            flags: this.document.flags,
            editable: this.isEditable,
            owner: this.document.isOwner,
            limited: this.document.limited
        };

        context.tipoOptions = {
            "arma": "Arma",
            "utilidade": "Utilidade",
            "consumivel": "Consumível",
            "outros": "Outros"
        };

        context.localizacaoOptions = {
            "corpo": "Equipado no Corpo",
            "mochila": "Guardado na Mochila"
        };

        return context;
    }

    _onRender(context, options) {
        super._onRender(context, options);
        const html = $(this.element);

        // Como só temos uma aba no item, não precisamos de lógica complexa de clique
        // Mas vamos deixar o listener básico caso o mestre adicione mais abas no futuro
        html.find(".sheet-tabs .item").click(e => {
            e.preventDefault();
            const tabUrl = $(e.currentTarget).data("tab");
            html.find(".sheet-tabs .item").removeClass("active");
            $(e.currentTarget).addClass("active");
            html.find(".tab").hide().removeClass("active");
            html.find(".tab[data-tab='" + tabUrl + "']").show().addClass("active");
        });
        // Forçar visibilidade da aba de descrição
        html.find(".tab[data-tab='descricao']").show().addClass("active");
        html.find(".sheet-tabs .item[data-tab='descricao']").addClass("active");

        // Força salvar todos os campos de texto, areas e selects soltos (proteção V2)
        html.find('input, textarea, select').on('change', (e) => {
            const field = e.currentTarget.name;
            let val = e.currentTarget.value;
            if (e.currentTarget.type === "checkbox") val = e.currentTarget.checked;
            if (e.currentTarget.type === "number") val = parseInt(e.currentTarget.value) || 0;
            if (field) this.document.update({ [field]: val });
        });
    }
}
