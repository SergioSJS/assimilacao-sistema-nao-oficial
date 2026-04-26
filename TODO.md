# TODO — Publicação Foundry VTT

## Problemas bloqueantes

Nenhum bloqueante.

## Avisos e recomendações

### 1. Dependência obrigatória em `dice-so-nice`

`relationships.requires` força o módulo *Dice So Nice* como dependência obrigatória.
Para publicação oficial, considerar tornar opcional (hook condicional) — evita rejeição em ambientes sem o módulo.

### 2. Cadastrar Package Version no Foundry

Após aprovação no site, acessar `foundryvtt.com/admin` e cadastrar Package Version com a URL do manifest:

```
https://github.com/SergioSJS/assimilacao-sistema-nao-oficial/releases/latest/download/system.json
```

## Status

**PRONTO PARA SUBMISSÃO** — `LICENSE` criado (CC BY-NC-SA 4.0), campo `license` adicionado ao `system.json`, workflow atualizado para incluir LICENSE no zip. Release v0.1.5 validada com assets corretos.
