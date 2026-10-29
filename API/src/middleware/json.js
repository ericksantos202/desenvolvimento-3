// middlewares/json.js
export async function json(request, response) {
  let body = '';

  // Intercepta e junta todos os pedaços (chunks) de dados que chegam
  for await (const chunk of request) {
    body += chunk;
  }

  // Tenta transformar o texto em JSON e injeta dentro do objeto 'request'
  try {
    request.body = JSON.parse(body);
  } catch {
    request.body = null;
  }

  // Já aproveita o middleware para definir o cabeçalho padrão da API
  response.setHeader('Content-Type', 'application/json');
}