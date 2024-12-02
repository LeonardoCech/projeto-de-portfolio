# Minhas Finanças - Server Side

## Resumo

- [Introdução](#introdução)
    - [Python 3.12](#python-312)
    - [Política de Execução no Windows](#política-de-execução-no-windows)
    - [Python UV](#python-uv)
    - [Instalar dependências](#instalar-dependências)
    - [Executar](#executar)
    - [Executar testes unitários](#executar-testes-unitários)

## Introdução

### Python 3.12
[Baixe o Python diretamente do site oficial](https://www.python.org/downloads/)

Após a instalação, siga estes passos:

- Abra o menu do Windows
- Procure por "python"
- Clique com o botão direito em "IDLE (Python 3.12 64-bit)"
- Clique em "Abrir local do arquivo"
- Repita o processo no atalho "IDLE (Python..."
- Você deve chegar a um diretório com o aplicativo "Python" e um diretório chamado "Scripts"
- Clique no caminho do diretório e copie-o
    - Exemplo: `C:\Users\cech\AppData\Local\Programs\Python\Python312`

- Novamente, no menu do Windows, procure por "Editar variáveis de ambiente do sistema"
- Clique em "Variáveis de Ambiente" no canto inferior direito da janela
- Procure pela variável "Path" em "Variáveis de Sistema"
- Abra a variável no modo de edição (dar um duplo clique também funciona)
- Adicione as seguintes linhas:
    - `{Caminho copiado anteriormente}`
    - `{Caminho copiado anteriormente}\Scripts`
    - Exemplo:
        - `C:\Users\cech\AppData\Local\Programs\Python\Python312`
        - `C:\Users\cech\AppData\Local\Programs\Python\Python312\Scripts`
    - Clique em cada um dos valores adicionados e use o botão "Mover para cima"
    - Certifique-se de que os valores adicionados sejam os primeiros da variável (em ordem de prioridade)
- Após isso, feche as janelas "Variáveis de Ambiente" e "Propriedades do Sistema"
- Abra o CMD
- Digite `python --version`, se não funcionar, tente `py --version`

Pronto!

### Política de Execução no Windows
No terminal do PowerShell do Windows, execute como Administrador o comando:

    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned

Isso permitirá que o comando `uv` execute um `venv` (ambiente virtual).

### Python UV
No terminal do PowerShell do Windows (pode ser diretamente do terminal do VS Code), execute o comando:

    python -m pip install uv
    
Se não funcionar, execute também:

    (Invoke-WebRequest -Uri https://install.python-uv.org -UseBasicParsing).Content | python -

Se ocorrer um erro dizendo que o parâmetro `"python"` não foi reconhecido, tente `"py"`. Isso vale para ambos os comandos acima.

#### Instalar dependências

Após instalar o Python UV, ainda no terminal do PowerShell do VS Code, execute os comandos:

    uv venv
    .venv\Scripts\activate

O comando ativará um Ambiente Virtual (venv). Após isso, execute o comando:

    uv sync

O comando instalará todas as bibliotecas Python necessárias para rodar o projeto, assim como suas dependências.

#### Executar

Antes de executar, lembre-se sempre de rodar os comandos `uv activate` e `uv update` no terminal do PowerShell do VS Code, respectivamente.

Pronto! Agora basta rodar o comando `python main.py` e tudo deve funcionar.

#### Executar testes unitários

Antes de executar, lembre-se sempre de rodar os comandos `uv activate` e `uv update` no terminal do PowerShell do VS Code, respectivamente.

Pronto! Agora basta rodar o comando `python .\tests\main.py` e tudo deve funcionar.
