# Assimilação RPG - Módulo/Sistema Oficial para Foundry VTT

Sistema autônomo (não-oficial/oficial) para jogar **Assimilação RPG** no [Foundry Virtual Tabletop](https://foundryvtt.com/). 
Este sistema inclui as rolagens customizadas 3D, a ficha completa de personagem com automatização de saúde, regras flexíveis de inventário, controle unificado do Cabo de Guerra de Determinação/Assimilação, entre outras características do livro.

***

## Pré-Requisitos

Para desfrutar da experiência tridimensional das faces e cálculos visuais de dados no tabuleiro, este sistema requer nativamente que você possua instalado o módulo gratuito **[Dice So Nice!](https://foundryvtt.com/packages/dice-so-nice)**. Recomenda-se ativá-lo antes de rolar qualquer teste com suas Aptidões.

## Instalação Rápida (Jogadores e Mestres)

*(Ainda não disponível até o primeiro release público. Quando a v1 for gerada através da aba de Releases do GitHub, você utilizará o link abaixo).*

1. Abra o Foundry VTT
2. Vá em **Game Systems**
3. Clique em **Install System**
4. No campo _Manifest URL_, cole a URL do `system.json` gerado pelo projeto (ex: `https://raw.githubusercontent.com/SEU-USUARIO/assimilacao-sistema-nao-oficial/main/system.json`)
5. Clique em **Install**

## Teste Local e Desenvolvimento

Se você está ajudando a desenvolver ou quer apenas testar a versão atual (V1) diretamente em seu computador sem precisar esperar a pipeline publicar:

1. Baixe os arquivos do projeto clonando o repósitorio:
```bash
git clone https://github.com/SEU-USUARIO/assimilacao-sistema-nao-oficial.git assimilacao
```
2. Instale as dependências Node (NPM) para compilar os visuais, caso queira editar alguma coisa:
```bash
cd assimilacao
npm install
npm run build:css  # Isso irá gerar o styles/assimilacao.css
```
 *(Se você apenas baixou o `.zip` gerado do repositório contendo o `styles/assimilacao.css` criado, não há necessidade do npm)*

3. Conecte o sistema no Foundry:
Crie um _Symlink_ (Atalho / Vínculo Simbólico) da pasta local onde este repositório está na sua máquina, apontando direto para a pasta `Data/systems/assimilacao` do seu diretório *Foundry User Data*. 

**👉 Windows (CMD via Administrador):**
```cmd
mklink /D "C:\Users\VOCE\AppData\Local\FoundryVTT\Data\systems\assimilacao" "C:\Caminho\Ate\Sua\Baixada\Pasta\assimilacao-sistema-nao-oficial"
```
**👉 Mac/Linux (Terminal):**
```bash
ln -s "/Caminho/Ate/Sua/Baixada/Pasta/assimilacao-sistema-nao-oficial" "$HOME/Library/Application Support/FoundryVTT/Data/systems/assimilacao"
```

4. Reinicie o seu Foundry VTT, acesse as opções de Sistemas e ateste que **Assimilação RPG** aparece na lista. Crie um Mundo novo selecionando o sistema! 

***

## Ciclo de Release (Para Desenvolvedores)

O projeto possui **Integração de CI/CD** automática vinculada ao GitHub Actions.
Toda vez que você criar e enviar (**Push**) uma *Tag* formatada em versionamento Semântico iniciando com `v*`, a automação irá compilar o CSS, zipar tudo o que interessa, atualizar as URLs de download e publicar oficialmente!

Para gerar e lançar uma nova versão:
```bash
git tag v1.0.0
git push origin v1.0.0
```
O Github lançará seu .ZIP automaticamente.
