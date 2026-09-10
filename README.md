# Processos Atribuídos

Página em formato de tabela para controle de processos, com os campos:

1. **Natureza** (AI- Liminar, AI- Voto, RemNecCiv, ApCiv, ApelRemNec)
2. **Nº Processo**
3. **Status** (A SER ELABORADO / ENCAMINHADA PARA CORREÇÃO / PRONTA)
4. **Distribuição** (data)
5. **Assunto** (lista pré-definida, com opção de acrescentar novos)

Os dados são salvos em uma **planilha do Google Sheets**, usada como banco de dados. A comunicação entre a página e a planilha é feita por um script publicado no **Google Apps Script**.

## Arquivos

- `index.html` — a página (tabela, filtros, formulário de cadastro/edição). Pode ser aberta direto no navegador ou hospedada (ex.: GitHub Pages).
- `apps-script/Code.gs` — script que deve ser colado no editor do Google Apps Script, vinculado a uma planilha do Google Sheets. Ele cria a aba `Processos` automaticamente e expõe endpoints para listar, criar, atualizar e excluir registros.

## Passo a passo da configuração

### 1. Criar a planilha

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma planilha nova (ex.: "Processos Atribuídos - Base").

### 2. Publicar o Apps Script

1. Na planilha, vá em **Extensões > Apps Script**.
2. Apague o conteúdo do arquivo `Code.gs` que abrir e cole todo o conteúdo do arquivo [`apps-script/Code.gs`](apps-script/Code.gs) deste repositório.
3. Salve o projeto (ícone de disquete).
4. Clique em **Implantar > Nova implantação**.
5. Em "Selecionar tipo", escolha **App da Web**.
6. Configure:
   - **Executar como:** Eu (sua conta)
   - **Quem pode acessar:** Qualquer pessoa
7. Clique em **Implantar** e autorize as permissões solicitadas (é o seu próprio script acessando sua própria planilha).
8. Copie a **URL do app da Web** gerada (algo como `https://script.google.com/macros/s/AKfycb.../exec`).

### 3. Configurar a página

1. Abra o arquivo `index.html` (localmente ou via link, se hospedado).
2. Clique em **⚙️ Configurar planilha**.
3. Cole a URL copiada no passo anterior e clique em **Salvar**.
4. A página passará a ler e gravar diretamente na planilha. O indicador no topo mostra "Conectado à planilha do Google Sheets".

A partir daí, a aba **Processos** da planilha funciona como banco de dados: cada linha corresponde a um processo cadastrado pela página.

### Uso sem a planilha configurada (modo local)

Se a URL do Apps Script ainda não foi configurada, a página funciona normalmente salvando os dados no navegador (`localStorage`). Isso é útil para testar a página antes de concluir a integração — mas os dados não ficam salvos entre navegadores/computadores diferentes. Assim que a integração for configurada, os novos registros passam a ser gravados na planilha.

### Se você já tinha publicado o Apps Script antes

Os campos "Data do retorno" e "Elaborar o voto" foram removidos da página. Se você já publicou uma implantação do `apps-script/Code.gs` anteriormente, copie o conteúdo atualizado do arquivo para o editor do Apps Script e publique uma **nova versão** da implantação (Implantar > Gerenciar implantações > editar > Nova versão) para manter a gravação de registros funcionando corretamente. As colunas antigas na planilha não são apagadas, só deixam de ser usadas.

## Hospedando a página (opcional)

Para acessar a página de qualquer lugar (não só do computador local), é possível publicar este repositório com o **GitHub Pages**:

1. No GitHub, acesse **Settings > Pages** do repositório.
2. Em "Source", selecione a branch atual e a pasta raiz (`/`).
3. Salve. Após alguns instantes, o GitHub fornecerá uma URL pública para o `index.html`.

## Funcionalidades da página

- Cadastro, edição e exclusão de processos.
- Filtro por texto (nº do processo/assunto), por natureza e por status.
- Ordenação por qualquer coluna (clique no cabeçalho).
- Contadores resumo (total, a ser elaborado, para correção, prontas).
- Exportação da lista filtrada em CSV.
- Importação em massa via CSV (botão "Importar CSV" no topo): cadastra vários processos de uma vez, no mesmo formato gerado pela exportação (colunas Natureza;Nº Processo;Status;Distribuição;Assunto, separadas por `;`, datas em `dd/mm/aaaa`). Útil para trazer dados de uma planilha antiga sem digitar processo por processo.
- Lista de assuntos pré-cadastrada, com opção de acrescentar novos assuntos pelo próprio formulário.
