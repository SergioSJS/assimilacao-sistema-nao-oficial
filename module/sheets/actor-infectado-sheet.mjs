import { submitAssimilacaoRoll } from "../dice/assimilacao-pool.mjs";

const { api, sheets } = foundry.applications;

export class InfectadoSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {
    static DEFAULT_OPTIONS = {
        classes: ["assimilacao", "sheet", "actor", "infectado"],
        window: {
            resizable: true
        },
        position: {
            width: 850,
            height: 950
        },
        form: {
            submitOnChange: true,
        }
    };

    get title() {
        return `Personagem: ${this.document.name}`;
    }

    static PARTS = {
        body: {
            template: "systems/assimilacao/templates/actors/infectado-sheet.hbs"
        }
    };

    get actor() {
        return this.document;
    }

    async _prepareContext(options) {
        const context = {
            actor: this.document,
            system: this.document.system,
            flags: this.document.flags,
            editable: this.isEditable,
            owner: this.document.isOwner,
            limited: this.document.limited
        };
        
        const actor = context.actor;

        // Preparar níveis de saúde para o template
        const maxHp = actor.system.pontosHPporNivel;
        const dicasSaude = {
            6: "Ativa recuperação após cada repouso completo.",
            5: "Ativa recuperação após cada repouso completo.",
            4: "Ativa a Recuperação após uma semana (Menos 1 🐞 em todos os testes).",
            3: "Ativa a Recuperação após uma semana (Menos 1 🐞 em todos os testes).",
            2: "Incapaz de agir, mas mantém consciência. Dano dessa gravidade não regenera naturalmente, requer tratamento médico. (Menos 2 🐞 em testes)",
            1: "Inconsciente. Qualquer ação exige 2 🦌 para ativar. Dano não regenera naturalmente, requer tratamento médico."
        };

        context.saudeNiveis = actor.system.saudeNiveisArray.map(nvl => {
            return {
                ...nvl,
                tooltip: dicasSaude[nvl.num] || "",
                dots: Array.from({ length: maxHp }, (_, i) => ({
                    index: i,
                    gasto: i < nvl.gasto
                }))
            };
        });

        // Cabo de Guerra: Arrays para renderização dos SVGs
        const detNivel = actor.system.determinacaoNivel;
        const assNivel = Math.max(0, 10 - detNivel);
        const ptDet = actor.system.pontosDeterminacao;
        const ptAss = actor.system.pontosAssimilacao;

        context.cgDetDots = Array.from({length: detNivel}, (_, i) => ({ index: i, opaco: i < ptDet }));
        context.cgAssDots = Array.from({length: assNivel}, (_, i) => ({ index: i, opaco: i < ptAss }));
        
        context.geracaoOptions = {
            "preCollapse": "Pré-Colapso",
            "collapse": "Colapso",
            "postCollapse": "Pós-Colapso"
        };

        // Inventário: filtra items do ator based on their location
        context.itemsCorpo = actor.items.filter(i => i.system.localizacao === "corpo");
        context.itemsMochila = actor.items.filter(i => i.system.localizacao === "mochila");
        
        return context;
    }

    _onRender(context, options) {
        super._onRender(context, options);
        // Em V2 this.element é um HTMLElement, então embrulhamos em jQuery pro legado
        const html = $(this.element);

        // Aba manual local com persistencia sem shrinkar o DOM inteiro (Bug do Scroll)
        if (!this._activeTab) this._activeTab = 'frente';
        
        html.find(".sheet-tabs .item").click(e => {
            e.preventDefault();
            this._activeTab = $(e.currentTarget).data("tab");
            html.find(".sheet-tabs .item").removeClass("active");
            $(e.currentTarget).addClass("active");
            html.find(".tab").not("." + this._activeTab).hide();
            html.find(".tab." + this._activeTab).show();
        });
        
        html.find(".sheet-tabs .item").removeClass("active");
        html.find(`.sheet-tabs .item[data-tab='${this._activeTab}']`).addClass("active");
        html.find(".tab").not("." + this._activeTab).hide();
        html.find(".tab." + this._activeTab).show();

        // Força salvar slider pq range nao da trigger nativo qnd solta mouse sem foco no V2
        html.find('input[name="system.determinacaoNivel"]').off("change").on("change", (e) => {
            const val = parseInt(e.currentTarget.value) || 0;
            this.document.update({ "system.determinacaoNivel": val });
        });

        // Prevenir inputs numericos de perderem a atualizacao
        html.find('input[type="number"]').on('change', (e) => {
            const field = e.currentTarget.name;
            const val = parseInt(e.currentTarget.value) || 0;
            if (field) this.document.update({ [field]: val });
        });

        // Força salvar todos os campos de texto, areas e selects soltos
        html.find('input[type="text"], textarea, select').not('.instinto-combinar, #segundoInstinto').on('change', (e) => {
            const field = e.currentTarget.name;
            const val = e.currentTarget.value;
            if (field) this.document.update({ [field]: val });
        });
        
        // Listeners das rolagens
        html.find(".roll-instinto").off("click").click(this._onRollInstinto.bind(this));
        html.find(".roll-aptidao").off("click").click(this._onRollAptidao.bind(this));
        html.find(".roll-mutacao").off("click").click(this._onRollMutacao.bind(this));
        
        // Listener de Saúde e Cabo de Guerra
        html.find(".saude-ponto").off("click").click(this._onSaudeClick.bind(this));
        html.find(".cg-dot").off("click").click(this._onCgDotClick.bind(this));

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

    async _onRollInstinto(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const instintoKey = element.dataset.instinto;
        const actor = this.actor;
        const nInstinto = actor.system.instintos[instintoKey] || 1;
        
        const isAssimilada = $(this.element).find('input[name="flags.assimilacao.rolagemAssimilada"]').is(':checked');

        if (isAssimilada) {
            // Ação Instintiva: Escolhe DOIS instintos e rola com D12. Cria Dialog rapido pra pegar o 2o
            let opcoes = "";
            for (let k of Object.keys(actor.system.instintos)) {
                opcoes += `<option value="${k}">${k.toUpperCase()}</option>`;
            }
            const contentHTML = `<form><div class="form-group"><label>Escolha o segundo Instinto para somar com ${instintoKey.toUpperCase()}:</label><select id="segundoInstinto" name="segundoInstinto">${opcoes}</select></div><p style="font-size: 11px; color: #666;">Dois instintos rodando na margem de Mutação (1d12).</p></form>`;

            if (foundry?.applications?.api?.DialogV2) {
                foundry.applications.api.DialogV2.wait({
                    window: { title: "Ação Instintiva (Rolagem Assimilada)" },
                    content: contentHTML,
                    buttons: [{
                        action: "roll",
                        label: "Rolar (D12)",
                        callback: async (event, button) => {
                            const inst2 = button.form.elements.segundoInstinto.value;
                            const nInst2 = actor.system.instintos[inst2] || 1;
                            await submitAssimilacaoRoll({
                                actor,
                                label: `Ação Instintiva: ${instintoKey.toUpperCase()} + ${inst2.toUpperCase()}`,
                                nInstinto,
                                nAptidao: nInst2, 
                                tipo: "assimilada"
                            });
                            await actor.update({ "flags.assimilacao.rolagemAssimilada": false });
                        }
                    }],
                    rejectClose: false
                });
            } else {
                new Dialog({
                    title: "Ação Instintiva (Rolagem Assimilada)",
                    content: contentHTML,
                    buttons: {
                        roll: {
                            label: "Rolar (D12)",
                            callback: async (html) => {
                                const inst2 = html.find("#segundoInstinto").val();
                                const nInst2 = actor.system.instintos[inst2] || 1;
                                await submitAssimilacaoRoll({
                                    actor,
                                    label: `Ação Instintiva: ${instintoKey.toUpperCase()} + ${inst2.toUpperCase()}`,
                                    nInstinto,
                                    nAptidao: nInst2,
                                    tipo: "assimilada"
                                });
                                await actor.update({ "flags.assimilacao.rolagemAssimilada": false });
                            }
                        }
                    },
                    default: "roll"
                }).render(true);
            }
        } else {
            await submitAssimilacaoRoll({
                actor,
                label: `Teste de Instinto: ${instintoKey.toUpperCase()}`,
                nInstinto,
                nAptidao: 0,
                tipo: "normal"
            });
        }
    }

    async _onRollAptidao(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const aptidaoKey = element.dataset.aptidao;
        const categoria = element.dataset.categoria;

        const btnDiv = $(element).closest(".stat-box");
        const instintoCombo = btnDiv.find(".instinto-combinar").val();
        
        if (!instintoCombo) {
            ui.notifications.warn("Selecione um instinto para parear com a aptidão!");
            return;
        }

        const actor = this.actor;
        const nInstinto = actor.system.instintos[instintoCombo] || 1;
        const nAptidao = actor.system[categoria][aptidaoKey] || 0;

        // Rolagem normal de Aptidão SEMPRE ignora flag de Ação Instintiva
        await submitAssimilacaoRoll({
            actor,
            label: `Teste: ${instintoCombo.toUpperCase()} + ${aptidaoKey.toUpperCase()}`,
            nInstinto,
            nAptidao,
            tipo: "normal"
        });
    }

    async _onRollMutacao(event) {
        event.preventDefault();
        const actor = this.actor;
        const nAssimilacao = Math.max(0, 10 - actor.system.determinacaoNivel);
        
        await submitAssimilacaoRoll({
            actor,
            label: `Teste de Mutações (Assimilação)`,
            nInstinto: nAssimilacao,
            nAptidao: 0,
            tipo: "mutacao"
        });
    }

    async _onSaudeClick(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const nivelKey = $(element).closest(".saude-dots").data("nivel");
        const index = parseInt(element.dataset.index);
        const isGasto = $(element).hasClass("gasto");

        const gastoAtual = this.actor.system.saude[nivelKey];
        let novoGasto = index + 1;

        if (isGasto && gastoAtual === novoGasto) {
            novoGasto = index; 
        }

        await this.actor.update({
            [`system.saude.${nivelKey}`]: novoGasto
        });
    }

    async _onCgDotClick(event) {
        event.preventDefault();
        const target = $(event.currentTarget);
        const isDet = target.data("tipo") === "det";
        const clickedIdx = parseInt(target.data("index"));
        const isOpaco = target.data("opaco") === true || target.attr("opacity") === "1";

        const actor = this.actor;
        const currentPoints = isDet ? actor.system.pontosDeterminacao : actor.system.pontosAssimilacao;

        let novoValor = clickedIdx + 1;
        if (isOpaco && clickedIdx === currentPoints - 1) {
            novoValor = currentPoints - 1;
        }

        const upField = isDet ? "system.pontosDeterminacao" : "system.pontosAssimilacao";
        await actor.update({ [upField]: novoValor });
    }
}
