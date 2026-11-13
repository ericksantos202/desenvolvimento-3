
// routes.js
import { randomUUID } from "crypto";
import db from "./database.js";

// Banco de dados em memória
const clientes = [];
const fornecedores = [];

export const manipuladorDeRotas = async (request, response) => {
  try {
    const { method, url, body } = request;

    // =========================================================
    // GET (Listar registros)
    // =========================================================

    // GET /produtos
    if (url === "/produtos" && method === "GET") {
      const produtos = await db.all("SELECT * FROM produtos");

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
      const categorias = await db.all("SELECT * FROM categorias");

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

      const categoriaExiste = await db.get(
        "SELECT id FROM categorias WHERE id = ?",
        [categoria],
      );

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

      await db.run(
        `INSERT INTO produtos (id, nome, preco, categoria)
         VALUES (?, ?, ?, ?)`,
        [novoProduto.id, nome, preco, categoria],
      );

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

      await db.run(
        `INSERT INTO categorias (id, nome, descricao)
         VALUES (?, ?, ?)`,
        [novaCategoria.id, nome, descricao],
      );

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

      const produto = await db.get(
        "SELECT * FROM produtos WHERE id = ?",
        [id],
      );

      if (!produto) {
        response.writeHead(404);
        return response.end(
          JSON.stringify({ erro: "Produto não encontrado." }),
        );
      }

      // PUT /produtos/:id
      if (method === "PUT") {
        const { nome, preco, categoria } = body;

        const novaCategoria = categoria ?? produto.categoria;

        const categoriaExiste = await db.get(
          "SELECT id FROM categorias WHERE id = ?",
          [novaCategoria],
        );

        if (!categoriaExiste) {
          response.writeHead(400);
          return response.end(
            JSON.stringify({ erro: "Categoria não encontrada." }),
          );
        }

        const produtoAtualizado = {
          nome: nome ?? produto.nome,
          preco: preco ?? produto.preco,
          categoria: novaCategoria,
        };

        await db.run(
          `UPDATE produtos
           SET nome = ?, preco = ?, categoria = ?
           WHERE id = ?`,
          [
            produtoAtualizado.nome,
            produtoAtualizado.preco,
            produtoAtualizado.categoria,
            id,
          ],
        );

        response.writeHead(200);
        return response.end(
          JSON.stringify({
            mensagem: "Produto atualizado com sucesso!",
            produto: { id, ...produtoAtualizado },
          }),
        );
      }

      // DELETE /produtos/:id
      if (method === "DELETE") {
        await db.run("DELETE FROM produtos WHERE id = ?", [id]);

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
  } catch (error) {
    console.error("Erro na API:", error);

    response.writeHead(500, {
      "Content-Type": "application/json",
    });

    return response.end(
      JSON.stringify({ erro: "Erro interno do servidor." }),
    );
  }
};
