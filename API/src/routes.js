// routes.js
import { randomUUID } from "crypto";

// Banco de dados em memória
const produtos = [];
const clientes = [];
const categorias = [];
const fornecedores = [];

export const manipuladorDeRotas = (request, response) => {
  const { method, url, body } = request;

  // =========================================================
  // GET (Listar registros)
  // =========================================================

  // GET /produtos
  if (url === "/produtos" && method === "GET") {
    response.writeHead(200);
    return response.end(JSON.stringify(produtos));
  }

  // GET /clientes
  if (url === "/clientes" && method === "GET") {
    response.writeHead(200);
    return response.end(JSON.stringify(clientes));
  }

  // GET /categorias
  if (url === "/categorias" && method === "GET") {
    response.writeHead(200);
    return response.end(JSON.stringify(categorias));
  }

  // GET /fornecedores
  if (url === "/fornecedores" && method === "GET") {
    response.writeHead(200);
    return response.end(JSON.stringify(fornecedores));
  }

  // =========================================================
  // POST (Cadastrar registros)
  // =========================================================

  // POST /produtos
  if (url === "/produtos" && method === "POST") {
    const { nome, preco, categoria } = body;
    const categoriaExiste = categorias.some((item) => item.id === categoria);

    if (!categoriaExiste) {
      response.writeHead(400);
      return response.end(
        JSON.stringify({ erro: "Categoria não encontrada." }),
      );
    }

    const novoProduto = {
      id: randomUUID(),
      nome,
      preco,
      categoria,
    };

    produtos.push(novoProduto);

    response.writeHead(201);
    return response.end(
      JSON.stringify({
        mensagem: "Produto cadastrado com sucesso!",
        produto: novoProduto,
      }),
    );
  }

  // POST /clientes
  if (url === "/clientes" && method === "POST") {
    const { nome, email, telefone, ativo } = body;

    // Verificar se o e-mail já existe
    const emailExiste = clientes.some((cliente) => cliente.email === email);

    if (emailExiste) {
      response.writeHead(409);
      return response.end(JSON.stringify({ erro: "E-mail já cadastrado." }));
    }

    const novoCliente = {
      id: randomUUID(),
      nome,
      email,
      telefone,
      ativo,
    };

    clientes.push(novoCliente);

    response.writeHead(201);
    return response.end(
      JSON.stringify({
        mensagem: "Cliente cadastrado com sucesso!",
        cliente: novoCliente,
      }),
    );
  }

  // POST /categorias
  if (url === "/categorias" && method === "POST") {
    const { nome, descricao } = body;

    const novaCategoria = {
      id: randomUUID(),
      nome,
      descricao,
    };

    categorias.push(novaCategoria);

    response.writeHead(201);
    return response.end(
      JSON.stringify({
        mensagem: "Categoria cadastrada com sucesso!",
        categoria: novaCategoria,
      }),
    );
  }

  // POST /fornecedores
  if (url === "/fornecedores" && method === "POST") {
    const { razaoSocial, cnpj, contato } = body;

    // Verificar se o CNPJ possui 14 caracteres
    if (!cnpj || cnpj.length !== 14) {
      response.writeHead(400);
      return response.end(
        JSON.stringify({ erro: "CNPJ deve possuir 14 caracteres." }),
      );
    }

    const novoFornecedor = {
      id: randomUUID(),
      razaoSocial,
      cnpj,
      contato,
    };

    fornecedores.push(novoFornecedor);

    response.writeHead(201);
    return response.end(
      JSON.stringify({
        mensagem: "Fornecedor cadastrado com sucesso!",
        fornecedor: novoFornecedor,
      }),
    );
  }

  // =========================================================
  // ROTAS COM ID (PUT e DELETE)
  // =========================================================

  // PUT /produtos/:id e DELETE /produtos/:id
  const isRotaProdutoComId =
    url.startsWith("/produtos/") && url.split("/").length === 3;

  if (isRotaProdutoComId) {
    const id = url.split("/")[2];

    const indexProduto = produtos.findIndex((produto) => produto.id === id);

    if (indexProduto === -1) {
      response.writeHead(404);
      return response.end(JSON.stringify({ erro: "Produto não encontrado." }));
    }

    // PUT /produtos/:id
    if (method === "PUT") {
      const { nome, preco, categoria } = body;

      produtos[indexProduto] = {
        ...produtos[indexProduto],
        nome: nome ?? produtos[indexProduto].nome,
        preco: preco ?? produtos[indexProduto].preco,
        categoria: categoria ?? produtos[indexProduto].categoria,
      };

      response.writeHead(200);
      return response.end(
        JSON.stringify({
          mensagem: "Produto atualizado com sucesso!",
          produto: produtos[indexProduto],
        }),
      );
    }

    // DELETE /produtos/:id
    if (method === "DELETE") {
      produtos.splice(indexProduto, 1);

      response.writeHead(204);
      return response.end();
    }
  }

  // PUT /clientes/:id e DELETE /clientes/:id
  const isRotaClienteComId =
    url.startsWith("/clientes/") && url.split("/").length === 3;

  if (isRotaClienteComId) {
    const id = url.split("/")[2];

    const indexCliente = clientes.findIndex((cliente) => cliente.id === id);

    if (indexCliente === -1) {
      response.writeHead(404);
      return response.end(JSON.stringify({ erro: "Cliente não encontrado." }));
    }

    // PUT /clientes/:id
    if (method === "PUT") {
      const { nome, email, telefone, ativo } = body;

      clientes[indexCliente] = {
        ...clientes[indexCliente],
        nome: nome ?? clientes[indexCliente].nome,
        email: email ?? clientes[indexCliente].email,
        telefone: telefone ?? clientes[indexCliente].telefone,
        ativo: ativo ?? clientes[indexCliente].ativo,
      };

      response.writeHead(200);
      return response.end(
        JSON.stringify({
          mensagem: "Cliente atualizado com sucesso!",
          cliente: clientes[indexCliente],
        }),
      );
    }

    // DELETE /clientes/:id
    if (method === "DELETE") {
      clientes.splice(indexCliente, 1);

      response.writeHead(204);
      return response.end();
    }
  }

  // =========================================================
  // ROTA 404 (Fallback)
  // =========================================================

  response.writeHead(404);
  return response.end(
    JSON.stringify({ erro: "Rota ou método não encontrado." }),
  );
};
