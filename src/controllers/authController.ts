import { Request, Response } from "express";
import { oauth2Client } from "../config/auth";
import { saveTokens } from "../utils/tokenUtils";

export const startAuth = (req: Request, res: Response): void => {
  console.log(`[LOG] Rota /auth/google acessada por ${req.ip}`);
  console.log("[LOG] Iniciando autenticação...");

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.readonly"],
  });

  console.log(`[LOG] Redirecionando para URL de autenticação: ${url}`);
  res.redirect(url);
};

export const handleAuthCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log(`[LOG] Rota /auth/callback acessada por ${req.ip}`);

  const { code, redirect } = req.query;

  if (!code) {
    console.error("[ERRO] Código de autenticação ausente na requisição.");
    res.status(400).send("Código de autenticação ausente");
    return;
  }

  try {
    console.log("[LOG] Obtendo tokens de acesso...");
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    console.log("[LOG] Tokens obtidos e armazenados.");
    saveTokens(tokens);

    // Redireciona o usuário de volta para o frontend com o token
    const frontendUrl = redirect || "http://localhost:3000";
    console.log(`[LOG] Redirecionando para ${frontendUrl} com token.`);
    res.redirect(`${frontendUrl}?token=${tokens.access_token}`);
  } catch (error: any) {
    console.error(`[ERRO] Erro ao autenticar: ${error.message}`);
    res.status(500).send("Erro ao autenticar: " + error.message);
  }
};
