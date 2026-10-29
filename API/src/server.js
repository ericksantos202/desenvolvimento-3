// server.js
import http from 'http';
import { manipuladorDeRotas } from './routes.js';
import { json } from './middleware/json.js';

const server = http.createServer(async (request, response) => {
  // 1. Passa pelo Middleware para formatar o JSON
  await json(request, response);

  // 2. Encaminha para as rotas processarem a lógica
  manipuladorDeRotas(request, response);
});

// Inicializa o servidor
server.listen(3000, () => {
  console.log('🚀 API de Produtos rodando em http://localhost:3000');
});