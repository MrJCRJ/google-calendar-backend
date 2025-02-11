import fs from "fs";
import path from "path";
import { oauth2Client } from "../config/auth";

const TOKEN_PATH = path.resolve(__dirname, "../../tokens.json");

export const saveTokens = (tokens: any) => {
  console.log("[LOG] Salvando tokens no arquivo...");
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
};

export const loadTokens = () => {
  if (fs.existsSync(TOKEN_PATH)) {
    console.log("[LOG] Carregando tokens do arquivo...");
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    oauth2Client.setCredentials(tokens);
  } else {
    console.log("[LOG] Nenhum token salvo encontrado.");
  }
};
