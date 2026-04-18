import { DieAssimilacaoD6, DieAssimilacaoD10, DieAssimilacaoD12 } from './die.mjs';

Hooks.once("init", () => {
    CONFIG.Dice.terms["a"] = DieAssimilacaoD6;
    CONFIG.Dice.terms["b"] = DieAssimilacaoD10;
    CONFIG.Dice.terms["c"] = DieAssimilacaoD12;
});

Hooks.once('diceSoNiceReady', (dice3d) => {
    // Second arg: any value != "default" sets this as the preferred system when user is on "standard"
    dice3d.addSystem({ id: "assimilacao", name: "Assimilacao" }, true);

    dice3d.addDicePreset({
        type: "da",
        labels: [
            'systems/assimilacao/assets/images/vazio.png',
            'systems/assimilacao/assets/images/vazio.png',
            'systems/assimilacao/assets/images/D6_3.png',
            'systems/assimilacao/assets/images/D6_4_5.png',
            'systems/assimilacao/assets/images/D6_4_5.png',
            'systems/assimilacao/assets/images/D6_6.png'
        ],
        bumpMaps: [
            'systems/assimilacao/assets/images/vazio_bump.png',
            'systems/assimilacao/assets/images/vazio_bump.png',
            'systems/assimilacao/assets/images/D6_3_bump.png',
            'systems/assimilacao/assets/images/D6_4_5_bump.png',
            'systems/assimilacao/assets/images/D6_4_5_bump.png',
            'systems/assimilacao/assets/images/D6_6_bump.png'
        ],
        system: "assimilacao",
        shape: "d6"
    });

    dice3d.addDicePreset({
        type: "db",
        labels: [
            'systems/assimilacao/assets/images/vazio.png',
            'systems/assimilacao/assets/images/vazio.png',
            'systems/assimilacao/assets/images/D10_3.png',
            'systems/assimilacao/assets/images/D10_4_5.png',
            'systems/assimilacao/assets/images/D10_4_5.png',
            'systems/assimilacao/assets/images/D10_6.png',
            'systems/assimilacao/assets/images/D10_7.png',
            'systems/assimilacao/assets/images/D10_8.png',
            'systems/assimilacao/assets/images/D10_9.png',
            'systems/assimilacao/assets/images/D10_10.png'
        ],
        bumpMaps: [
            'systems/assimilacao/assets/images/vazio_bump.png',
            'systems/assimilacao/assets/images/vazio_bump.png',
            'systems/assimilacao/assets/images/D10_3_bump.png',
            'systems/assimilacao/assets/images/D10_4_5_bump.png',
            'systems/assimilacao/assets/images/D10_4_5_bump.png',
            'systems/assimilacao/assets/images/D10_6_bump.png',
            'systems/assimilacao/assets/images/D10_7_bump.png',
            'systems/assimilacao/assets/images/D10_8_bump.png',
            'systems/assimilacao/assets/images/D10_9_bump.png',
            'systems/assimilacao/assets/images/D10_10_bump.png'
        ],
        system: "assimilacao",
        shape: "d10"
    });

    dice3d.addDicePreset({
        type: "dc",
        labels: [
            'systems/assimilacao/assets/images/vazio.png',
            'systems/assimilacao/assets/images/vazio.png',
            'systems/assimilacao/assets/images/D12_3.png',
            'systems/assimilacao/assets/images/D12_4_5.png',
            'systems/assimilacao/assets/images/D12_4_5.png',
            'systems/assimilacao/assets/images/D12_6.png',
            'systems/assimilacao/assets/images/D12_7.png',
            'systems/assimilacao/assets/images/D12_8.png',
            'systems/assimilacao/assets/images/D12_9.png',
            'systems/assimilacao/assets/images/D12_10.png',
            'systems/assimilacao/assets/images/D12_11.png',
            'systems/assimilacao/assets/images/D12_12.png'
        ],
        bumpMaps: [
            'systems/assimilacao/assets/images/vazio_bump.png',
            'systems/assimilacao/assets/images/vazio_bump.png',
            'systems/assimilacao/assets/images/D12_3_bump.png',
            'systems/assimilacao/assets/images/D12_4_5_bump.png',
            'systems/assimilacao/assets/images/D12_4_5_bump.png',
            'systems/assimilacao/assets/images/D12_6_bump.png',
            'systems/assimilacao/assets/images/D12_7_bump.png',
            'systems/assimilacao/assets/images/D12_8_bump.png',
            'systems/assimilacao/assets/images/D12_9_bump.png',
            'systems/assimilacao/assets/images/D12_10_bump.png',
            'systems/assimilacao/assets/images/D12_11_bump.png',
            'systems/assimilacao/assets/images/D12_12_bump.png'
        ],
        system: "assimilacao",
        shape: "d12"
    });
});

// v13+: ChatMessage uses ApplicationV2, html is HTMLElement
Hooks.on("renderChatMessageHTML", (message, html) => {
    _patchChatFormula(message, html);
});

function _patchChatFormula(message, element) {
    if (!message.rolls?.some(roll => roll.formula.match(/d[abc]/))) return;

    const formulaEl = element.querySelector(".dice-formula");
    if (formulaEl) {
        formulaEl.textContent = _replaceFormula(message.rolls[0].formula);
    }

    for (const el of element.querySelectorAll(".part-formula")) {
        el.textContent = _replaceFormula(el.textContent);
    }
}

function _replaceFormula(text) {
    return text
        .replace(/(\d+)da/g, "$1d6 ($1da)")
        .replace(/(\d+)db/g, "$1d10 ($1db)")
        .replace(/(\d+)dc/g, "$1d12 ($1dc)");
}
