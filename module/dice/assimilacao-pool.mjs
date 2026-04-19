import { D6_FACES, D10_FACES, D12_FACES } from "./assimilacao-dice-faces.mjs";

export async function submitAssimilacaoRoll({ actor, label, nInstinto, nAptidao = 0, tipo = "normal" }) {
    const isAssimilada = tipo === "assimilada";
    const isMutacao = tipo === "mutacao";
    
    let totalD6 = 0;
    let totalD10 = 0;
    let totalD12 = 0;

    if (isMutacao) {
        totalD12 = nInstinto;
    } else if (isAssimilada) {
        totalD12 = nInstinto + nAptidao;
        totalD10 = 0;
    } else {
        totalD6 = nInstinto;
        totalD10 = nAptidao;
    }
    
    if (totalD6 === 0 && totalD10 === 0 && totalD12 === 0) {
        ui.notifications.warn("Não há dados para jogar neste teste.");
        return;
    }

    const formulaParts = [];
    if (totalD6 > 0) formulaParts.push(`${totalD6}da`);
    if (totalD10 > 0) formulaParts.push(`${totalD10}db`);
    if (totalD12 > 0) formulaParts.push(`${totalD12}dc`);
    
    if (formulaParts.length === 0) return;
    const formulaStr = formulaParts.join(" + ");

    const roll = await new Roll(formulaStr).evaluate();

    const flavor = isMutacao ? "Teste de Assimilação (Mutações)" : 
                  (isAssimilada ? `Ação Instintiva <br> ${label}` : `Teste <br> ${label}`);

    // Tabula resultados pros ícones sem interferir no SVG nativo
    const poolData = [];
    const _getMap = (f) => f === 6 ? D6_FACES : (f === 10 ? D10_FACES : D12_FACES);
    
    roll.dice.forEach(die => {
        const faceMap = _getMap(die.faces);
        die.results.forEach(res => {
            if (!res.active) return;
            const abstrato = faceMap[res.result - 1] || { a:0, b:0, c:0 };
            poolData.push({
                faces: die.faces,
                result: res.result,
                a: abstrato.a, b: abstrato.b, c: abstrato.c
            });
        });
    });

    const sortScore = (d) => (d.a * 100) + (d.b * 10) - d.c;
    const sortedPool = poolData.sort((x, y) => sortScore(y) - sortScore(x));

    let bestHtml = "";
    if (sortedPool.length > 0) {
        const d1 = sortedPool[0];
        bestHtml += `<div style="text-align:center; padding: 5px; background: rgba(0,0,0,0.1); border: 1px solid #ccc; margin-bottom: 5px;">
            <strong>Melhor Dado:</strong> Face ${d1.result} (d${d1.faces}) 
            <br><span style="font-size:12px;">Sucessos: ${d1.a} | Assimi: ${d1.b} | Conseq: ${d1.c}</span>
        </div>`;
        if ((isAssimilada || isMutacao) && sortedPool.length > 1) {
            const d2 = sortedPool[1];
            bestHtml += `<div style="text-align:center; padding: 5px; background: rgba(0,0,0,0.1); border: 1px solid #ccc; margin-bottom: 5px;">
                <strong>2º Melhor Dado:</strong> Face ${d2.result} (d${d2.faces})
                <br><span style="font-size:12px;">Sucessos: ${d2.a} | Assimi: ${d2.b} | Conseq: ${d2.c}</span>
            </div>`;
        }
    }

    // Pega as caixas de ferramentas originais do Foundry e injeta display block 
    let rollHtml = await roll.render();
    rollHtml = rollHtml.replace(/class="dice-tooltip"/g, 'class="dice-tooltip expanded" style="display: block;"');
    // Escondemos os somatórios abstratos (16, 20) pra não confundir o jogador
    rollHtml = rollHtml.replace(/class="dice-formula"/g, 'class="dice-formula" style="display: none;"');
    rollHtml = rollHtml.replace(/class="dice-total"/g, 'class="dice-total" style="display: none;"');

    const finalContent = `
        <div class="assimilacao-chat-roll">
            <h4 style="margin-bottom: 5px;">${flavor}</h4>
            <hr>
            ${bestHtml}
            ${rollHtml}
        </div>
    `;

    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: finalContent,
        rolls: [roll]
    });
}
