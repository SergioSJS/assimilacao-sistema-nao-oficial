export const macroCommand = `
(async () => {
    const content = \`
        <form>
            <div class="form-group">
                <label>Quantidade de D6:</label>
                <div style="display:flex;gap:5px;align-items:center">
                    <button type="button" class="btn-minus">-</button>
                    <input type="number" name="d6" value="0" min="0" style="width:50px;text-align:center">
                    <button type="button" class="btn-plus">+</button>
                </div>
            </div>
            <div class="form-group">
                <label>Quantidade de D10:</label>
                <div style="display:flex;gap:5px;align-items:center">
                    <button type="button" class="btn-minus">-</button>
                    <input type="number" name="d10" value="0" min="0" style="width:50px;text-align:center">
                    <button type="button" class="btn-plus">+</button>
                </div>
            </div>
            <div class="form-group">
                <label>Quantidade de D12:</label>
                <div style="display:flex;gap:5px;align-items:center">
                    <button type="button" class="btn-minus">-</button>
                    <input type="number" name="d12" value="0" min="0" style="width:50px;text-align:center">
                    <button type="button" class="btn-plus">+</button>
                </div>
            </div>
        </form>
    \`;

    async function doRoll(d6, d10, d12) {
        if (!d6 && !d10 && !d12) {
            ui.notifications.warn("Por favor, insira ao menos um dado para rolar.");
            return;
        }
        const parts = [];
        if (d6 > 0) parts.push(\`\${d6}da\`);
        if (d10 > 0) parts.push(\`\${d10}db\`);
        if (d12 > 0) parts.push(\`\${d12}dc\`);
        const roll = new Roll(parts.join(" + "));
        await roll.evaluate();
        await roll.toMessage({ speaker: ChatMessage.getSpeaker() });
    }

    function setupButtons(html) {
        const container = html.length ? html[0] : html;

        container.querySelectorAll('.btn-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const input = e.currentTarget.closest('div').querySelector('input');
                if (parseInt(input.value) > 0) input.value = parseInt(input.value) - 1;
            });
        });

        container.querySelectorAll('.btn-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const input = e.currentTarget.closest('div').querySelector('input');
                input.value = parseInt(input.value) + 1;
            });
        });
    }

    if (foundry?.applications?.api?.DialogV2) {
        // v13+: DialogV2 usa ApplicationV2 que não permite onclick no HTML
        Hooks.once('renderDialogV2', (app, html) => {
            setupButtons(html);
        });

        await foundry.applications.api.DialogV2.wait({
            window: { title: "Rolagem Assimilação RPG" },
            content,
            buttons: [{
                action: "roll",
                label: "Rolar",
                callback: async (event, button) => {
                    const d6 = button.form.elements.d6.valueAsNumber || 0;
                    const d10 = button.form.elements.d10.valueAsNumber || 0;
                    const d12 = button.form.elements.d12.valueAsNumber || 0;
                    await doRoll(d6, d10, d12);
                }
            }],
            rejectClose: false
        });
    } else {
        // v12: Dialog legado usa render callback
        new Dialog({
            title: "Rolagem Assimilação RPG",
            content,
            render: setupButtons,
            buttons: {
                roll: {
                    label: "Rolar",
                    callback: async (html) => {
                        const d6 = parseInt(html.find("[name=d6]").val()) || 0;
                        const d10 = parseInt(html.find("[name=d10]").val()) || 0;
                        const d12 = parseInt(html.find("[name=d12]").val()) || 0;
                        await doRoll(d6, d10, d12);
                    }
                }
            },
            default: "roll"
        }).render(true);
    }
})();
`;
