import { macroCommand } from './macros/roll-assimilacao.mjs';

const MACRO_NAME = "Rolagem de Assimilação";

async function setupMacro() {
    const moduleVersion = game.modules.get("assimilacao-dice-roller").version;
    const existing = game.macros.find(m => m.name === MACRO_NAME);

    if (existing?.getFlag("assimilation-rpg", "version") === moduleVersion) return;

    if (existing) await existing.delete();

    await Macro.create({
        name: MACRO_NAME,
        type: "script",
        img: "systems/assimilacao/assets/images/icon.jpeg",
        command: macroCommand,
        scope: "global",
        flags: { "assimilation-rpg": { version: moduleVersion } }
    });
}

Hooks.once("init", () => {
    // Kept registered so existing worlds don't throw "unknown setting" errors
    game.settings.register("assimilation-rpg", "macro-setup-done", {
        scope: "world",
        config: false,
        type: Boolean,
        default: false
    });
});

Hooks.once("ready", async () => {
    await setupMacro();
    await game.settings.set("assimilation-rpg", "macro-setup-done", true);
});
