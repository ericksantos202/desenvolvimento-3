import path from "path";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = await open({
  filename: path.join(__dirname, "../database.sqlite"),
  driver: sqlite3.Database,
});

// Ativa chaves estrangeiras
await db.exec("PRAGMA foreign_keys = ON");

// Cria as tabelas
await db.exec(`
  CREATE TABLE IF NOT EXISTS categorias (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT
  );

  CREATE TABLE IF NOT EXISTS produtos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    categoria TEXT NOT NULL,
    FOREIGN KEY (categoria) REFERENCES categorias(id)
  );
`);

export default db;
