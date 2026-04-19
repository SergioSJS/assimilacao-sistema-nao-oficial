# Assimilação RPG — Sistema para Foundry VTT

> ⚠️ **Este é um projeto NÃO-OFICIAL feito por fã para fã.**  
> Não é afiliado, endossado ou produzido pelos criadores do Assimilação RPG.  
> Feito com amor para a comunidade, de graça e de código aberto.

Sistema autônomo para jogar **Assimilação RPG** no [Foundry Virtual Tabletop](https://foundryvtt.com/) v13+.

---

## ✅ O que está implementado

### Ficha de Personagem (Infectado)
- **Frente:** Aptidões completas (Instintos, Conhecimentos e Práticas) com valores editáveis
- **Rolagem de Instintos** — clique no nome do instinto para rolar o pool de dados D6
- **Rolagem de Aptidões (Conhecimentos/Práticas)** — clique no nome para rolar D10 combinado com um Instinto
- **Ação Instintiva (D12)** — checkbox que converte a próxima rolagem de Instinto para dados D12, desmarcando automaticamente após o uso
- **Saúde** — sistema de pontos por nível com marcação de dano via clique
- **Cabo de Guerra (Determinação × Assimilação)** — diamantes visuais e slider interativo
- **Verso:** Propósitos Pessoais e Coletivos, Características, Assimilações/Mutações, Anotações livres
- **Inventário** — itens divididos em Corpo e Mochila, com criação, edição e exclusão

### Ficha de Item (Inventário)
- Tipo (Arma, Utilidade, Consumível, Outros)
- Localização (Corpo ou Mochila)
- Quantidade e Espaços/Peso
- Campo de Descrição e Regras livre

### Rolagem de Dados
- Pool de dados customizado com faces D6, D10 e D12 com arte própria
- Integração com **Dice So Nice!** para animação 3D
- Resultado no chat com resumo de Sucessos e Consequências

---

## 🔧 Pré-Requisitos

- **Foundry VTT v13+**
- Módulo **[Dice So Nice!](https://foundryvtt.com/packages/dice-so-nice)** (obrigatório para as faces customizadas)

---

## 📦 Instalação

*(Ainda não disponível. Quando o primeiro Release for publicado no GitHub, use o link abaixo)*

1. Abra o Foundry VTT
2. Vá em **Game Systems → Install System**
3. Cole no campo _Manifest URL_:
```
https://raw.githubusercontent.com/sergio-sousa/assimilacao-sistema-nao-oficial/main/system.json
```
4. Clique em **Install**

---

## 💻 Desenvolvimento Local (Symlink)

```bash
git clone https://github.com/sergio-sousa/assimilacao-sistema-nao-oficial.git

# Mac/Linux
ln -s "$(pwd)/assimilacao-sistema-nao-oficial" "$HOME/Library/Application Support/FoundryVTT/Data/systems/assimilacao"

# Windows (CMD como Administrador)
mklink /D "%APPDATA%\FoundryVTT\Data\systems\assimilacao" "C:\Caminho\Para\assimilacao-sistema-nao-oficial"
```

Reinicie o Foundry e o sistema aparecerá na lista.

---

## 🚀 Publicando uma Nova Versão

O projeto usa GitHub Actions para gerar releases automaticamente.  
Basta criar e enviar uma tag semântica:

```bash
git tag v0.2.0
git push origin v0.2.0
```

O CI irá empacotar o sistema, gerar o `.zip` e publicar o Release no GitHub automaticamente.

---

## 📋 Licença e Créditos

- Sistema **Assimilação RPG** criado por seus autores originais. Todo o conteúdo narrativo e de regras pertence a eles.
- Este código é livre para uso, modificação e distribuição para fins não-comerciais.
- Feito por **Sérgio Sousa** — [meioorc.com](https://meioorc.com)
