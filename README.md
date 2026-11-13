# API de Cadastro

API desenvolvida em Node.js para gerenciamento de produtos, clientes, categorias e fornecedores.

## Tecnologias utilizadas

- Node.js
- JavaScript
- SQLite
- Insomnia (para testes das requisições HTTP)

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/ericksantos202/desenvolvimento-3.git
   ```

2. Entre na pasta do projeto:

   ```bash
   cd desenvolvimento-3
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

## Executando a API

Inicie o servidor com:

```bash
npm start
```

A API estará disponível em:

`http://localhost:3000`

## Rotas disponíveis

| Método | Rota | Descrição |
|---|---|---|
| GET | /produtos | Lista produtos |
| POST | /produtos | Cadastra produto |
| PUT | /produtos/:id | Atualiza produto |
| DELETE | /produtos/:id | Exclui produto |
| GET | /categorias | Lista categorias |
| POST | /categorias | Cadastra categoria |
| GET | /clientes | Lista clientes |
| POST | /clientes | Cadastra cliente |
| PUT | /clientes/:id | Atualiza cliente |
| DELETE | /clientes/:id | Exclui cliente |
| GET | /fornecedores | Lista fornecedores |
| POST | /fornecedores | Cadastra fornecedor |

## Banco de dados

O projeto utiliza SQLite para armazenar os dados de produtos e categorias, garantindo que essas informações permaneçam salvas mesmo após o encerramento da aplicação.

As tabelas são criadas automaticamente na inicialização da API.

Clientes e fornecedores continuam utilizando armazenamento em memória.
