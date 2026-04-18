import { D6_FACES, D10_FACES } from "./assimilacao-dice-faces.mjs";

export async function submitAssimilacaoRoll({ actor, label, nInstinto, nAptidao = 0, tipo = "normal" }) {
    const isAssimilada = tipo === "assimilada";
    
    // Calcula quantidades
    const totalD6 = isAssimilada ? (nInstinto + nAptidao) : nInstinto;
    const totalD10 = isAssimilada ? 0 : nAptidao;
    
    if (totalD6 === 0 && totalD10 === 0) {
        ui.notifications.warn("Não há dados para jogar neste teste.");
        return;
    }

    const formulaParts = [];
    if (totalD6 > 0) formulaParts.push(`${totalD6}da`);
    if (totalD10 > 0) formulaParts.push(`${totalD10}db`);
    
    const roll = await new Roll(formulaParts.join(" + ")).evaluate();

    // Parseia os resultados
    const poolRenderData = [];
    let melhorDado = null;

    const getDieImage = (isD6, resultNum) => {
        if (resultNum === 1 || resultNum === 2) return "systems/assimilacao/assets/images/vazio.png";
        const prefix = isD6 ? "D6" : "D10";
        if (resultNum === 3) return `systems/assimilacao/assets/images/${prefix}_3.png`;
        if (resultNum === 4 || resultNum === 5) return `systems/assimilacao/assets/images/${prefix}_4_5.png`;
        if (isD6 && resultNum === 6) return `systems/assimilacao/assets/images/${prefix}_6.png`;
        if (!isD6 && resultNum >= 6) return `systems/assimilacao/assets/images/${prefix}_${resultNum}.png`;
        return "systems/assimilacao/assets/images/vazio.png";
    };

    roll.dice.forEach(die => {
        const isD6 = die.faces === 6;
        const faceMap = isD6 ? D6_FACES : D10_FACES;
        // die.results contains an array of { result: number, active: boolean }
        die.results.forEach(res => {
            if (!res.active) return;
            const resultNum = res.result;
            const idx = resultNum - 1;
            const abstrato = faceMap[idx] || { a:0, b:0, c:0 };
            
            const dado = {
                id: foundry.utils.randomID(),
                faces: die.faces,
                resultNum,
                a: abstrato.a,
                b: abstrato.b,
                c: abstrato.c,
                imgUrl: getDieImage(isD6, resultNum),
                classeCSS: isD6 ? "dieassimilacaod6" : "dieassimilacaod10"
            };

            poolRenderData.push(dado);

            // Selecionar o melhor (Maior A. Empate em A? Maior B. Empate em B? Menor C)
            if (!melhorDado) {
                melhorDado = dado;
            } else {
                if (dado.a > melhorDado.a) {
                    melhorDado = dado;
                } else if (dado.a === melhorDado.a && dado.b > melhorDado.b) {
                    melhorDado = dado;
                } else if (dado.a === melhorDado.a && dado.b === melhorDado.b && dado.c < melhorDado.c) {
                    melhorDado = dado;
                }
            }
        });
    });

    // Assinar qual é o melhor dado pro layout
    if (melhorDado) {
        melhorDado.isBest = true;
    }

    const templateData = {
        label,
        actor: actor.name,
        tipoLabel: isAssimilada ? "Rolagem Assimilada" : "Teste",
        pool: poolRenderData,
        melhorDado
    };

    const templateRenderer = foundry.applications?.handlebars?.renderTemplate || renderTemplate;
    const content = await templateRenderer("systems/assimilacao/templates/chat/roll-resultado.hbs", templateData);

    const messageData = {
        speaker: ChatMessage.getSpeaker({ actor }),
        content,
        // Em Foundry V12+, messages detectam automaticamente o estilo como "roll" quando o array "rolls" é passado.
        rolls: [roll]
    };

    await ChatMessage.create(messageData);
}
