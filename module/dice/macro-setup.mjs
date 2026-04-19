import { macroCommand } from './macros/roll-assimilacao.mjs';

const MACRO_NAME = "Rolagem de Assimilação";

async function setupMacro() {
    const moduleVersion = game.system.version;
    const existing = game.macros.find(m => m.name === MACRO_NAME);

    if (existing?.getFlag("assimilacao", "version") === moduleVersion) return;

    if (existing) await existing.delete();

    await Macro.create({
        name: MACRO_NAME,
        type: "script",
        img: "systems/assimilacao/assets/images/icon.jpeg",
        command: macroCommand,
        scope: "global",
        flags: { "assimilacao": { version: moduleVersion } }
    });
}

Hooks.once("init", () => {
    // Kept registered so existing worlds don't throw "unknown setting" errors
    game.settings.register("assimilacao", "macro-setup-done", {
        scope: "world",
        config: false,
        type: Boolean,
        default: false
    });
});

Hooks.once("ready", async () => {
    await setupMacro();
    await game.settings.set("assimilacao", "macro-setup-done", true);
});
