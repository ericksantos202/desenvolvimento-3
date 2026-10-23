import http from "http";
import { json } from "./middleware/json.js";

const server = http.createServer(async (request, response) => {
  await json(request, response);
});

server.listen(3000, () => {
  console.log("API rodando na porta 3000");
});
