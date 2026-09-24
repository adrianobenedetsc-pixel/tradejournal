# 📘 Guia Completo de Instalação - Trade Journal

**Guia passo a passo para iniciantes absolutos** 🚀

---

## 📋 O que você vai precisar

Antes de começar, tenha em mãos:

- ✅ Computador com Windows 10 ou superior
- ✅ Conexão com internet
- ✅ O arquivo do projeto (pasta `workspace` ou arquivo `.tar`)
- ✅ Cerca de 10 minutos livres
- ☕ Um café (opcional, mas recomendado!)

---

## 🎯 O que é tudo isso? (Explicação para iniciantes)

Antes de instalar, vamos entender o que cada coisa faz:

| O que é | Para que serve | Analogia |
|---------|----------------|----------|
| **Node.js** | Programa que roda JavaScript | Como o motor de um carro |
| **NPM** | Gerenciador de pacotes (vem com Node.js) | Como uma loja de peças |
| **Terminal (CMD)** | Janela onde digitamos comandos | Como conversar com o computador |
| **Projeto** | O código do Trade Journal | O carro montado |
| **Dependências** | Peças que o projeto precisa | Combustível e óleo |

---

## 🚀 PASSO 1: Instalar o Node.js

### 1.1 Baixar o Node.js

1. Abra seu navegador (Chrome, Edge, Firefox)
2. Na barra de endereço, digite: **https://nodejs.org**
3. Aperte **Enter**
4. Você verá dois botões verdes grandes:
   - **LTS** (recomendado) ← **CLIQUE NESTE**
   - Current (versão mais nova)

> 💡 **Dica:** LTS significa "Long Term Support" (suporte de longo prazo). É a versão estável.

5. O download vai começar automaticamente
6. O arquivo será salvo como: `node-v24.x.x-x64.msi` (algo assim)
7. Ele ficará na sua pasta **Downloads**

### 1.2 Instalar o Node.js

1. Vá até a pasta **Downloads**
2. Procure o arquivo `node-v24...msi` que você baixou
3. **Dê duplo clique** nele
4. Uma janela vai abrir: "Welcome to Node.js Setup"
5. Clique em **Next** (Próximo)
6. Marque a caixa "I accept the terms..." (Aceito os termos)
7. Clique em **Next**
8. **Não mude nada** nas próximas telas, só clique em **Next**
9. Clique em **Install** (Instalar)
10. O Windows pode perguntar: "Deseja permitir que este app faça alterações?"
    - Clique em **Sim**
11. Espere a instalação terminar (pode demorar 1-2 minutos)
12. Clique em **Finish** (Concluir)

### 1.3 Verificar se instalou corretamente

1. Aperte a tecla **Windows** no teclado
2. Digite: **cmd**
3. Clique em **"Prompt de Comando"** (ou "Command Prompt")
4. Uma janela preta vai abrir
5. Digite exatamente:
   ```
   node --version
   ```
6. Aperte **Enter**
7. Deve aparecer algo como: `v24.21.0`

✅ Se aparecer a versão, **Node.js está instalado!**

❌ Se aparecer erro, **reinicie o computador** e tente novamente.

8. Agora digite:
   ```
   npm --version
   ```
9. Aperte **Enter**
10. Deve aparecer algo como: `10.x.x`

✅ Se aparecer a versão, **NPM está instalado!** (ele vem junto com o Node.js)

---

## 📁 PASSO 2: Preparar o Projeto

### 2.1 Localizar o arquivo do projeto

O projeto pode estar em 2 formatos:

**Formato A:** Pasta chamada `workspace` (já extraída)
**Formato B:** Arquivo chamado `workspace` ou `workspace.tar` (precisa extrair)

### 2.2 Se for arquivo .tar (precisa extrair)

#### Método 1: Usando o Windows Explorer (mais fácil)

1. Vá até a pasta **Downloads**
2. Procure o arquivo `workspace.tar`
3. **Clique com o botão DIREITO** nele
4. Procure a opção **"Extrair aqui"** ou **"Extract here"**

> ⚠️ **Se não aparecer essa opção:** Você precisa instalar o **7-Zip**:
> 1. Acesse: https://www.7-zip.org/
> 2. Clique em **"Download"** (escolha a versão 64-bit)
> 3. Instale o 7-Zip (é só clicar Next em tudo)
> 4. Volte ao arquivo `workspace.tar`
> 5. Clique com botão direito → **7-Zip** → **Extrair aqui**

5. Uma pasta chamada `workspace` vai aparecer

#### Método 2: Usando o comando `tar` do Windows (alternativa)

Se você não quer instalar o 7-Zip, pode usar o comando `tar` que já vem no Windows 10/11:

1. Abra o **CMD** (tecla Windows + digite `cmd`)
2. Digite estes comandos, um por vez:

```bash
cd %USERPROFILE%\Desktop
mkdir projeto
tar -xf workspace -C projeto
cd projeto
```

> 💡 **O que cada comando faz:**
> - `cd Desktop` → Vai para a Área de Trabalho
> - `mkdir projeto` → Cria uma pasta chamada "projeto"
> - `tar -xf workspace -C projeto` → Extrai o arquivo `workspace` dentro da pasta `projeto`
> - `cd projeto` → Entra na pasta criada

3. Agora você está dentro da pasta do projeto! ✅

### 2.3 Mover para um local fácil de acessar

Para facilitar, vamos mover a pasta para um lugar simples:

1. **Clique** na pasta `workspace` (segure o clique)
2. **Arraste** para a área de trabalho (Desktop)
3. Solte o mouse

Agora a pasta está na sua **Área de Trabalho**, fácil de achar!

### 2.4 Como encontrar a pasta do projeto se você não lembra onde extraiu

Se você já extraiu o arquivo mas não sabe onde está a pasta, use este comando no CMD:

```bash
dir C:\Users\Adriano /s /b | findstr /i "\\package.json" | findstr /v /i node_modules
```

> 💡 **O que esse comando faz:**
> - Procura todos os arquivos `package.json` no seu computador
> - Ignora os que estão dentro de `node_modules` (que não interessam)
> - Mostra apenas os caminhos dos projetos

O resultado vai ser algo como:
```
C:\Users\Adriano\Downloads\workspace\package.json
```

A pasta do projeto é o caminho **sem o `\package.json` no final**:
```
C:\Users\Adriano\Downloads\workspace
```

Para entrar nessa pasta:
```bash
cd C:\Users\Adriano\Downloads\workspace
```

---

## 💻 PASSO 3: Abrir o Terminal na Pasta do Projeto

### Método 1: Mais fácil (recomendado)

1. Abra a pasta `workspace` (dê duplo clique)
2. Na barra de endereço do Explorer (onde mostra o caminho da pasta), **apague tudo**
3. Digite: `cmd`
4. Aperte **Enter**
5. Uma janela preta vai abrir **já dentro da pasta do projeto** ✅

### Método 2: Pelo CMD

1. Aperte **Windows + R** no teclado
2. Digite: `cmd`
3. Aperte **Enter**
4. Uma janela preta vai abrir
5. Digite (com atenção!):
   ```
   cd Desktop\workspace
   ```
6. Aperte **Enter**

> 💡 **Importante:** O comando `cd` significa "Change Directory" (mudar pasta). Você **precisa** digitar `cd` antes do caminho!

### 3.1 Verificar se está na pasta certa

Digite:
```
dir
```

Aperte **Enter**. Deve aparecer uma lista de arquivos incluindo:
- `package.json` ✅
- `src/` ✅
- `index.html` ✅

Se aparecer esses arquivos, **você está na pasta certa!** 🎉

---

## 📦 PASSO 4: Instalar as Dependências

Agora vamos "instalar as peças" que o projeto precisa.

1. No terminal (janela preta), digite:
   ```
   npm install
   ```
2. Aperte **Enter**
3. **Espere!** Vai aparecer muita coisa na tela:
   ```
   npm warn ...
   added 500 packages in 2m
   ```
4. Isso pode demorar **2 a 5 minutos** dependendo da sua internet
5. Quando terminar, vai voltar ao prompt normal (com o caminho da pasta)

> ⚠️ **IMPORTANTE:** Não feche a janela! Espere terminar.

### Possíveis mensagens (são normais):

- ✅ `added X packages` → Deu certo!
- ⚠️ `npm warn deprecated` → Aviso, pode ignorar
- ⚠️ `X vulnerabilities` → Pode ignorar por enquanto

### Se der erro:

- ❌ `npm error code ENOENT` → Você não está na pasta certa. Volte ao Passo 3
- ❌ `npm is not recognized` → Node.js não foi instalado. Volte ao Passo 1
- ❌ `network error` → Problema de internet. Tente novamente

---

## 🎬 PASSO 5: Rodar o Projeto

Agora a mágica acontece!

1. No terminal, digite:
   ```
   npm run dev
   ```
2. Aperte **Enter**
3. Espere alguns segundos
4. Vai aparecer algo como:
   ```
   VITE v6.4.3  ready in 500 ms
   
   ➜  Local:   http://localhost:3000/
   ➜  Network: http://192.168.x.x:3000/
   ```
5. **O projeto está rodando!** 🎉

---

## 🌐 PASSO 6: Abrir no Navegador

1. Abra seu navegador (Chrome, Edge, Firefox)
2. Na barra de endereço, digite:
   ```
   http://localhost:3000
   ```
3. Aperte **Enter**
4. **O Trade Journal vai abrir!** 🎊

> 💡 **Dica:** Você também pode **clicar** no link `http://localhost:3000/` que apareceu no terminal (Ctrl + clique)

---

## 📸 O que você deve ver

Quando abrir no navegador, você verá:

```
┌─────────────────────────────────────┐
│  [TJ] Trade Journal         0 trades│
│  Futures Tracker                    │
├─────────────────────────────────────┤
│                                     │
│  Novo Trade                         │
│  Registre rápido e siga em frente   │
│                                     │
│  [Formulário de trade aqui]         │
│                                     │
├─────────────────────────────────────┤
│  ➕ Trade  📈 Gráfico  📋 Histórico │
│          📊 Relatórios              │
└─────────────────────────────────────┘
```

---

## 🔄 Como Usar no Dia a Dia

### Método Simples (4 passos)

**Toda vez que quiser usar o app, são só 4 passos:**

#### 1. Abra a pasta do projeto

É a pasta onde você extraiu o arquivo. Dentro dela você vê:
- `package.json` ✅
- `src` ✅
- `index.html` ✅

#### 2. Abra a janela preta dentro dessa pasta

Lá em cima na janela da pasta, tem uma **barra branca** com o caminho (tipo `C:\Users\Adriano\Desktop\workspace`).

1. **Clique** nessa barra branca
2. **Apague** o que está escrito
3. Digite: `cmd`
4. Aperte **Enter**

Uma janela preta vai abrir **já dentro da pasta do projeto** ✅

#### 3. Digite este comando e aperte Enter

```bash
npm run dev
```

Espere aparecer o texto `ready` na tela. Vai aparecer algo como:
```
VITE v6.4.3  ready in 500 ms
➜  Local:   http://localhost:3000/
```

#### 4. Abra o navegador

1. Abra o Chrome (ou outro)
2. Clique na barra de endereço
3. Digite: `localhost:3000`
4. Aperte **Enter**

**O app abre!** 🎉

---

### ⚠️ REGRA IMPORTANTE

**Enquanto estiver usando o app, NÃO feche a janela preta!**

Se você fechar a janela preta, o app para de funcionar.

Quando terminar de usar, pode fechar a janela preta normalmente, e o app para.

---

### Método Alternativo: Atalho com dois cliques (iniciar.bat)

Você pode criar um arquivo que abre o app automaticamente com apenas 2 cliques!

#### Como criar o arquivo iniciar.bat:

1. Abra a pasta do projeto no Explorer
2. Clique com botão direito em um espaço vazio
3. Selecione **Novo** → **Documento de Texto**
4. Vai aparecer um arquivo chamado `Novo Documento.txt`
5. **Clique com botão direito** nele → **Renomear**
6. Apague tudo e digite: `iniciar.bat`
7. Aperte **Enter**
8. O Windows vai perguntar: "Tem certeza que deseja alterar a extensão?"
9. Clique em **Sim**

#### Editar o arquivo iniciar.bat:

1. Clique com botão direito no `iniciar.bat`
2. Selecione **Editar** (ou **Abrir com** → **Bloco de Notas**)
3. Cole exatamente estas linhas:

```batch
@echo off
start http://localhost:3000/
npm run dev
```

4. Salve o arquivo (Ctrl + S)
5. Feche o Bloco de Notas

#### Como usar o iniciar.bat:

1. **Dê duplo clique** no arquivo `iniciar.bat`
2. Uma janela preta vai abrir
3. O navegador vai abrir automaticamente em `http://localhost:3000`

> 💡 **Dica:** Se o navegador abrir antes do servidor ficar pronto e mostrar erro, espere 3 segundos e atualize a página com **F5**.

#### Para parar o app:

- Feche a janela preta
- Ou aperte **Ctrl + C** nela

---

### Resumo: Não precisa rodar npm install de novo!

**IMPORTANTE:** O comando `npm install` você só precisa rodar **UMA VEZ** (na primeira vez que instalar).

Depois, toda vez que quiser usar o app, é só:
- `npm run dev` (ou duplo clique no `iniciar.bat`)
- Abrir `http://localhost:3000` no navegador

---

### Para fechar o programa:

1. Volte ao terminal (janela preta)
2. Aperte **Ctrl + C**
3. Se perguntar "Deseja terminar?", digite **S** e Enter
4. Ou simplesmente feche a janela preta

---

## 💾 Backup dos Dados (MUITO IMPORTANTE!)

Os dados ficam salvos no **navegador**. Se você limpar o cache, perde tudo!

### Como fazer backup:

1. No programa, vá em **Histórico**
2. Clique em **"⬇ Backup"**
3. Um arquivo `.json` vai ser baixado
4. **Guarde esse arquivo em local seguro!** (Google Drive, pendrive, etc)

### Como restaurar:

1. Vá em **Histórico**
2. Clique em **"⬆ Importar"**
3. Selecione o arquivo `.json` de backup
4. Confirme a importação

---

## ❓ Problemas Comuns e Soluções

### Problema: "npm não é reconhecido"

**Solução:** Reinicie o computador. O Node.js precisa registrar algumas coisas no Windows.

### Problema: "Cannot find module"

**Solução:** Você não está na pasta certa. Use `cd` para navegar até a pasta do projeto.

### Problema: "The directory name is invalid" ao usar cd

**Causa:** Você digitou o caminho sem o comando `cd` antes.

**Errado:**
```
C:\Users\Adriano\Downloads\workspace
```

**Correto:**
```
cd C:\Users\Adriano\Downloads\workspace
```

**Solução:** Sempre digite `cd` antes do caminho da pasta!

### Problema: "'C:\...' is not recognized as an internal or external command"

**Causa:** Você está tentando executar um caminho como se fosse um programa.

**Solução:** Use o comando `cd` antes:
```
cd C:\Users\Adriano\Downloads\workspace
```

### Problema: "Porta 3000 já está em uso"

**Solução:** 
1. Feche outros terminais abertos
2. Ou use outra porta: `npm run dev -- --port 3001`
3. Acesse: `http://localhost:3001`

### Problema: Tela em branco no navegador

**Solução:**
1. Aperte **F5** para recarregar
2. Aperte **Ctrl + Shift + R** para recarregar sem cache
3. Tente outro navegador

### Problema: "EACCES permission denied"

**Solução:** Abra o CMD como administrador:
1. Tecla Windows
2. Digite `cmd`
3. Clique com botão direito → "Executar como administrador"

### Problema: Dados sumiram

**Solução:** Você limpou o cache do navegador. Importe o backup JSON que você fez.

### Problema: Não sei onde extraí o arquivo workspace.tar

**Solução:** Use este comando no CMD para encontrar:

```bash
dir C:\Users\Adriano /s /b | findstr /i "\\package.json" | findstr /v /i node_modules
```

Vai aparecer algo como:
```
C:\Users\Adriano\Downloads\workspace\package.json
```

A pasta do projeto é o caminho sem o `\package.json` no final:
```
C:\Users\Adriano\Downloads\workspace
```

Para entrar:
```bash
cd C:\Users\Adriano\Downloads\workspace
```

### Problema: O arquivo workspace aparece como arquivo, não pasta

**Causa:** O arquivo `workspace` na sua Desktop é o pacote original (.tar), não a pasta extraída.

**Solução:** 
1. Procure onde você extraiu o conteúdo (use o comando acima)
2. A pasta extraída tem `package.json`, `src` e `index.html`
3. O arquivo `workspace` original você pode apagar ou ignorar

### Problema: "npm error code ENOENT" ao rodar npm install

**Causa:** Você não está na pasta do projeto (não tem package.json).

**Solução:** 
1. Navegue até a pasta correta com `cd`
2. Verifique se tem `package.json` com o comando `dir`
3. Se não tiver, procure onde extraiu o projeto (veja problema anterior)

### Problema: Navegador abre mas mostra "Esta página não funciona"

**Causa:** O servidor ainda não está pronto ou você digitou o endereço errado.

**Solução:**
1. Verifique se o terminal mostra `ready in XXX ms`
2. Digite exatamente: `http://localhost:3000`
3. Se não funcionar, tente: `http://127.0.0.1:3000`
4. Espere 5 segundos e atualize com **F5**

---

## 📚 Glossário para Iniciantes

| Termo | Significado |
|-------|-------------|
| **Terminal / CMD** | Janela preta onde digitamos comandos |
| **Prompt** | A linha onde você digita (geralmente mostra `C:\...>`) |
| **cd** | "Change Directory" - mudar de pasta |
| **dir** | "Directory" - listar arquivos da pasta atual |
| **npm** | "Node Package Manager" - gerenciador de pacotes |
| **node** | Programa que executa JavaScript |
| **localhost** | Seu próprio computador (127.0.0.1) |
| **porta 3000** | "Endereço" do programa no seu computador |
| **build** | Versão final do programa (otimizada) |
| **dev** | Modo de desenvolvimento (com atualizações automáticas) |
| **dependências** | Pacotes/bibliotecas que o projeto precisa |
| **package.json** | Arquivo que lista as dependências do projeto |
| **node_modules** | Pasta onde as dependências são instaladas |
| **localhost:3000** | Endereço para acessar o programa no navegador |

---

## 🎓 Comandos que Você Vai Usar

```bash
# Entrar na pasta do projeto
cd Desktop\workspace

# Listar arquivos
dir

# Instalar dependências (só precisa fazer uma vez)
npm install

# Rodar o projeto
npm run dev

# Parar o projeto (no terminal)
Ctrl + C

# Criar versão final (avançado)
npm run build
```

---

## 🆘 Precisa de Ajuda?

Se nada funcionar:

1. **Reinicie o computador** (resolve 80% dos problemas!)
2. **Desinstale e reinstale o Node.js**
3. **Apague a pasta `node_modules`** e rode `npm install` novamente
4. **Tente outro navegador**

---

## ✅ Checklist Final

Antes de começar a usar, verifique:

- [ ] Node.js instalado (`node --version` funciona)
- [ ] NPM instalado (`npm --version` funciona)
- [ ] Pasta do projeto na Área de Trabalho
- [ ] `npm install` rodou sem erros
- [ ] `npm run dev` está rodando
- [ ] Navegador abre em `http://localhost:3000`
- [ ] Programa aparece corretamente
- [ ] Fez o primeiro backup dos dados

---

## 🎯 Resumo Rápido (Para quem já instalou)

Se você já instalou tudo e só quer usar o app no dia a dia:

### Opção 1: Manual (4 passos)
1. Abra a pasta do projeto
2. Clique na barra de endereço, apague tudo, digite `cmd`, Enter
3. Digite `npm run dev`, Enter
4. Abra `http://localhost:3000` no navegador

### Opção 2: Automática (2 cliques)
1. Duplo clique no arquivo `iniciar.bat`
2. O navegador abre automaticamente

### Para parar:
- Feche a janela preta ou aperte `Ctrl + C`

---

## 🔍 Como Verificar se Está na Pasta Certa

Antes de rodar `npm install` ou `npm run dev`, verifique se você está na pasta do projeto:

### Passo 1: Digite o comando `dir`

```bash
dir
```

### Passo 2: Verifique se aparece estes arquivos:

```
package.json
src
index.html
vite.config.js
```

✅ **Se aparecer:** Você está na pasta certa! Pode continuar.

❌ **Se não aparecer:** Você não está na pasta do projeto. Volte ao Passo 2.4 para encontrar a pasta.

---

## 📝 Comandos Essenciais (Cola Rápida)

```bash
# Verificar versão do Node
node --version

# Verificar versão do NPM
npm --version

# Navegar para pasta
cd Desktop\workspace

# Listar arquivos
dir

# Instalar dependências (só uma vez)
npm install

# Rodar o projeto
npm run dev

# Parar o projeto
Ctrl + C

# Encontrar pasta do projeto
dir C:\Users\Adriano /s /b | findstr /i "\\package.json" | findstr /v /i node_modules

# Extrair arquivo .tar (alternativa ao 7-Zip)
cd %USERPROFILE%\Desktop
mkdir projeto
tar -xf workspace -C projeto
cd projeto
```

---

## 🎉 Parabéns!

Se você chegou até aqui, **você instalou com sucesso um projeto React completo!** 🏆

Isso é o mesmo processo que desenvolvedores profissionais usam todos os dias. Você agora sabe:

- ✅ Instalar Node.js
- ✅ Usar o terminal
- ✅ Navegar entre pastas
- ✅ Instalar dependências
- ✅ Rodar um servidor de desenvolvimento
- ✅ Fazer backup de dados
- ✅ Criar atalhos .bat
- ✅ Resolver problemas comuns

**Bem-vindo ao mundo da programação!** 🚀

---

## 💡 Dicas Finais

1. **Salve este guia** em local fácil de acessar (Desktop, Documentos)
2. **Crie o arquivo iniciar.bat** para facilitar o uso diário
3. **Faça backup regularmente** dos seus trades (botão "Backup JSON")
4. **Não limpe o cache do navegador** sem fazer backup antes
5. **Se algo der errado**, consulte a seção de Problemas Comuns

---

**Boa sorte nos trades!** 📈💰

Se precisar de ajuda, releia este guia com calma. A maioria dos problemas tem solução aqui! 😉
