const { Die } = foundry.dice.terms;

const IMAGE_PATHS = {
    d6: [
        'systems/assimilacao/assets/images/vazio.png',
        'systems/assimilacao/assets/images/vazio.png',
        'systems/assimilacao/assets/images/D6_3_4.png',
        'systems/assimilacao/assets/images/D6_3_4.png',
        'systems/assimilacao/assets/images/D6_5.png',
        'systems/assimilacao/assets/images/D6_6.png'
    ],
    d10: [
        'systems/assimilacao/assets/images/vazio.png',
        'systems/assimilacao/assets/images/vazio.png',
        'systems/assimilacao/assets/images/D10_3_4.png',
        'systems/assimilacao/assets/images/D10_3_4.png',
        'systems/assimilacao/assets/images/D10_5.png',
        'systems/assimilacao/assets/images/D10_6.png',
        'systems/assimilacao/assets/images/D10_7.png',
        'systems/assimilacao/assets/images/D10_8.png',
        'systems/assimilacao/assets/images/D10_9.png',
        'systems/assimilacao/assets/images/D10_10.png'
    ],
    d12: [
        'systems/assimilacao/assets/images/vazio.png',
        'systems/assimilacao/assets/images/vazio.png',
        'systems/assimilacao/assets/images/D12_3_4.png',
        'systems/assimilacao/assets/images/D12_3_4.png',
        'systems/assimilacao/assets/images/D12_5.png',
        'systems/assimilacao/assets/images/D12_6.png',
        'systems/assimilacao/assets/images/D12_7.png',
        'systems/assimilacao/assets/images/D12_8.png',
        'systems/assimilacao/assets/images/D12_9.png',
        'systems/assimilacao/assets/images/D12_10.png',
        'systems/assimilacao/assets/images/D12_11.png',
        'systems/assimilacao/assets/images/D12_12.png'
    ]
};

function getUserColor() {
    return game.user.color?.css ?? "#466555";
}

export class DieAssimilacaoD6 extends Die {
    constructor(termData) {
        termData.faces = 6;
        super(termData);
    }

    static DENOMINATION = "a";

    getResultLabel(result) {
        const path = IMAGE_PATHS.d6[result.result - 1];
        return `<div class="dice-result assimilation-dice dieassimilacaod6" style="background-color: ${getUserColor()};">
            <img src="${path}" alt="D6 - ${result.result}">
            <img src="systems/assimilacao/assets/images/frame-d6.png" alt="" class="dice-frame">
        </div>`;
    }
}

export class DieAssimilacaoD10 extends Die {
    constructor(termData) {
        termData.faces = 10;
        super(termData);
    }

    static DENOMINATION = "b";

    getResultLabel(result) {
        const path = IMAGE_PATHS.d10[result.result - 1];
        return `<div class="dice-result assimilation-dice dieassimilacaod10" style="background-color: ${getUserColor()};">
            <img src="${path}" alt="D10 - ${result.result}">
            <img src="systems/assimilacao/assets/images/frame-d10.png" alt="" class="dice-frame">
        </div>`;
    }
}

export class DieAssimilacaoD12 extends Die {
    constructor(termData) {
        termData.faces = 12;
        super(termData);
    }

    static DENOMINATION = "c";

    getResultLabel(result) {
        const path = IMAGE_PATHS.d12[result.result - 1];
        return `<div class="dice-result assimilation-dice dieassimilacaod12" style="background-color: ${getUserColor()};">
            <img src="${path}" alt="D12 - ${result.result}">
            <img src="systems/assimilacao/assets/images/frame-d12.png" alt="" class="dice-frame">
        </div>`;
    }
}
