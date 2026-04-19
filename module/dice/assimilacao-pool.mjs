import { D6_FACES, D10_FACES, D12_FACES } from "./assimilacao-dice-faces.mjs";

const IMAGE_PATHS = {
    d6:  [
        "systems/assimilacao/assets/images/vazio.png",    // face 1: —
        "systems/assimilacao/assets/images/vazio.png",    // face 2: —
        "systems/assimilacao/assets/images/D6_3_4.png",   // face 3: C
        "systems/assimilacao/assets/images/D6_3_4.png",   // face 4: C
        "systems/assimilacao/assets/images/D6_5.png",     // face 5: B+C
        "systems/assimilacao/assets/images/D6_6.png"      // face 6: A
    ],
    d10: [
        "systems/assimilacao/assets/images/vazio.png",    // face 1: —
        "systems/assimilacao/assets/images/vazio.png",    // face 2: —
        "systems/assimilacao/assets/images/D10_3_4.png",  // face 3: C
        "systems/assimilacao/assets/images/D10_3_4.png",  // face 4: C
        "systems/assimilacao/assets/images/D10_5.png",    // face 5: B+C
        "systems/assimilacao/assets/images/D10_6.png",    // face 6: A
        "systems/assimilacao/assets/images/D10_7.png",    // face 7: A+A
        "systems/assimilacao/assets/images/D10_8.png",    // face 8: A+B
        "systems/assimilacao/assets/images/D10_9.png",    // face 9: A+B+C
        "systems/assimilacao/assets/images/D10_10.png"    // face 10: A+A+C
    ],
    d12: [
        "systems/assimilacao/assets/images/vazio.png",    // face 1: —
        "systems/assimilacao/assets/images/vazio.png",    // face 2: —
        "systems/assimilacao/assets/images/D12_3_4.png",  // face 3: C
        "systems/assimilacao/assets/images/D12_3_4.png",  // face 4: C
        "systems/assimilacao/assets/images/D12_5.png",    // face 5: B+C
        "systems/assimilacao/assets/images/D12_6.png",    // face 6: A
        "systems/assimilacao/assets/images/D12_7.png",    // face 7: A+A
        "systems/assimilacao/assets/images/D12_8.png",    // face 8: A+B
        "systems/assimilacao/assets/images/D12_9.png",    // face 9: A+B+C
        "systems/assimilacao/assets/images/D12_10.png",   // face 10: A+A+C
        "systems/assimilacao/assets/images/D12_11.png",   // face 11: A+B+B+C
        "systems/assimilacao/assets/images/D12_12.png"    // face 12: C+C
    ]
};

function _getImage(faces, result) {
    const key = `d${faces}`;
    const arr = IMAGE_PATHS[key] ?? IMAGE_PATHS.d6;
    return arr[result - 1] ?? arr[0];
}

function _getFrame(faces) {
    return `systems/assimilacao/assets/images/frame-d${faces}.png`;
}

function _getFaceMap(faces) {
    if (faces === 6)  return D6_FACES;
    if (faces === 10) return D10_FACES;
    return D12_FACES;
}

function _buildResultText(die) {
    const parts = [];
    if (die.a > 0) parts.push(`<span style="color:#2d7a2d;font-weight:bold;">${die.a} Sucesso${die.a > 1 ? "s" : ""}</span>`);
    if (die.b > 0) parts.push(`<span style="color:#2a5a9d;font-weight:bold;">${die.b} Adaptação</span>`);
    if (die.c > 0) parts.push(`<span style="color:#c63527;font-weight:bold;">${die.c} Pressão</span>`);
    return parts.length > 0 ? parts.join(" &bull; ") : "<em>Sem efeito</em>";
}

function _buildDieCardHtml(die, index, isSelected) {
    const imgSrc   = _getImage(die.faces, die.result);
    const frameSrc = _getFrame(die.faces);
    const userColor = game?.user?.color?.css ?? "#466555";

    const syms = [];
    if (die.a > 0) syms.push(`<span class="assim-sym assim-sym-a">${die.a}A</span>`);
    if (die.b > 0) syms.push(`<span class="assim-sym assim-sym-b">${die.b}B</span>`);
    if (die.c > 0) syms.push(`<span class="assim-sym assim-sym-c">${die.c}C</span>`);
    if (syms.length === 0) syms.push(`<span class="assim-sym assim-sym-vazio">—</span>`);

    return `
        <div class="assim-die-card ${isSelected ? "selected" : ""}"
             data-die-index="${index}"
             title="Clique para escolher este dado">
            <div class="assim-die-img-wrap" style="background-color:${userColor};">
                <img class="assim-die-face-img" src="${imgSrc}" alt="d${die.faces} face ${die.result}">
                <img class="assim-die-frame-img" src="${frameSrc}" alt="">
            </div>
            <div class="assim-die-syms">${syms.join(" ")}</div>
        </div>`;
}

export async function submitAssimilacaoRoll({ actor, label, nInstinto, nAptidao = 0, tipo = "normal" }) {
    const isAssimilada = tipo === "assimilada";
    const isMutacao    = tipo === "mutacao";

    let totalD6 = 0, totalD10 = 0, totalD12 = 0;
    if (isMutacao)           { totalD12 = nInstinto; }
    else if (isAssimilada)   { totalD12 = nInstinto + nAptidao; }
    else                     { totalD6 = nInstinto; totalD10 = nAptidao; }

    if (!totalD6 && !totalD10 && !totalD12) {
        ui.notifications.warn("Não há dados para jogar neste teste.");
        return;
    }

    const parts = [];
    if (totalD6  > 0) parts.push(`${totalD6}da`);
    if (totalD10 > 0) parts.push(`${totalD10}db`);
    if (totalD12 > 0) parts.push(`${totalD12}dc`);

    const roll = await new Roll(parts.join(" + ")).evaluate();

    const flavor = isMutacao    ? "Teste de Assimilação (Mutações)"
                 : isAssimilada ? `Ação Instintiva<br>${label}`
                                : `Teste<br>${label}`;

    // Monta pool de dados com os símbolos de cada face
    const poolData = [];
    roll.dice.forEach(die => {
        const faceMap = _getFaceMap(die.faces);
        die.results.forEach(res => {
            if (!res.active) return;
            const f = faceMap[res.result - 1] ?? { a: 0, b: 0, c: 0 };
            poolData.push({ faces: die.faces, result: res.result, a: f.a, b: f.b, c: f.c });
        });
    });

    // Seleciona o melhor dado por padrão
    const sortScore = d => (d.a * 100) + (d.b * 10) - (d.c * 5);
    const defaultIndex = poolData.reduce(
        (best, d, i) => sortScore(d) > sortScore(poolData[best]) ? i : best, 0
    );

    const bestDie  = poolData[defaultIndex];
    const cardsHtml = poolData.map((d, i) => _buildDieCardHtml(d, i, i === defaultIndex)).join("");

    const content = `
        <div class="assimilacao-chat-roll">
            <h4 style="margin:0 0 6px;">${flavor}</h4>
            <hr style="margin:4px 0 8px;">
            <div class="assim-result-summary">
                <strong>Dado Escolhido:</strong> d${bestDie.faces} · Face ${bestDie.result}<br>
                <span class="assim-result-text">${_buildResultText(bestDie)}</span>
            </div>
            <div class="assim-pool-grid">${cardsHtml}</div>
        </div>`;

    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content,
        rolls: [roll],
        flags: { assimilacao: { poolData, selectedIndex: defaultIndex } }
    });
}

/**
 * Aplicado via hook renderChatMessage — atualiza seleção visual e summary.
 */
export function applyPoolSelection(message, html) {
    const flags = message.flags?.assimilacao;
    if (!flags?.poolData) return;

    const { poolData, selectedIndex = 0 } = flags;
    const selectedDie = poolData[selectedIndex];
    const root = html instanceof HTMLElement ? html : html[0]; // compatibilidade

    // Atualiza summary
    const summary = root.querySelector(".assim-result-summary");
    if (summary && selectedDie) {
        summary.innerHTML = `
            <strong>Dado Escolhido:</strong> d${selectedDie.faces} · Face ${selectedDie.result}<br>
            <span class="assim-result-text">${_buildResultText(selectedDie)}</span>
        `;
    }

    // Destaca o card selecionado
    root.querySelectorAll(".assim-die-card").forEach(el => {
        el.classList.toggle("selected", parseInt(el.dataset.dieIndex) === selectedIndex);
    });

    // Listener de clique em cada dado
    root.querySelectorAll(".assim-die-card").forEach(el => {
        el.addEventListener("click", async () => {
            const idx = parseInt(el.dataset.dieIndex);
            await message.update({ flags: { assimilacao: { selectedIndex: idx } } });
        });
    });
}
