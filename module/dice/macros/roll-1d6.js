export const macroCommand = `
(async () => {
    const roll = new Roll("1da");
    await roll.evaluate(); // Avaliar a rolagem

    // Enviar a rolagem para o chat com o formato padrão
    roll.toMessage({
        user: game.user.id,
        flavor: "Rolagem de Assimilação"
    });
})();
`;
