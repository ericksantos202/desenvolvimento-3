import { randomUUID } from "crypto";

const produtos = [];

export const manipuladorDeRotas = (request, response) => {
  const { method, url, body } = request;

  if (url === "/produtos" && method === "GET") {
    response.writeHead(200, {
      "Content-Type": "application/json",
    });

    return response.end(JSON.stringify(produtos));
  }

  // Cadastrar novo produto
  if (url === "/produtos" && method === "POST") {
    const { nome, preco, categoria } = body;

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
        mensagem: "Produto cadastrado com sucesso",
        produto: novoProduto,
      }),
    );
  }
};
