import { Request, Response } from "express";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import oauth2Client from "../config/auth";

// Caminho para o arquivo de tokens
const TOKEN_PATH = path.resolve(__dirname, "../../tokens.json");

// Interface para o formato dos eventos
interface FormattedEvent {
  title: string;
  start: string;
  end: string;
  link: string;
}

// Função para salvar os tokens em um arquivo
const saveTokens = (tokens: any) => {
  console.log("[LOG] Salvando tokens no arquivo...");
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
};

// Função para carregar os tokens do arquivo
const loadTokens = () => {
  if (fs.existsSync(TOKEN_PATH)) {
    console.log("[LOG] Carregando tokens do arquivo...");
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    oauth2Client.setCredentials(tokens);
  } else {
    console.log("[LOG] Nenhum token salvo encontrado.");
  }
};

// Carrega os tokens ao iniciar o servidor
loadTokens();

// Função para formatar os eventos
const formatEvents = (events: any[]): FormattedEvent[] => {
  return events.map((event) => ({
    title: event.summary,
    start: event.start.dateTime || event.start.date,
    end: event.end.dateTime || event.end.date,
    link: event.htmlLink,
  }));
};

// Função para listar eventos do Google Calendar
export const listEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log(`[LOG] Rota /events acessada por ${req.ip}`);

  try {
    if (!oauth2Client.credentials.access_token) {
      console.warn("[WARN] Usuário não autenticado. Nenhum token encontrado.");
      res.status(401).send("Usuário não autenticado");
      return;
    }

    const { startDate, endDate } = req.query;
    console.log(
      `[LOG] Buscando eventos entre ${startDate || "∞"} e ${endDate || "∞"}...`
    );

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: startDate
        ? new Date(startDate as string).toISOString()
        : undefined,
      timeMax: endDate ? new Date(endDate as string).toISOString() : undefined,
      singleEvents: true,
      orderBy: "startTime",
    });

    const formattedEvents = formatEvents(response.data.items || []);
    console.log(`[LOG] ${formattedEvents.length} eventos encontrados.`);
    res.json(formattedEvents);
  } catch (error: any) {
    console.error(`[ERRO] Falha ao buscar eventos: ${error.message}`);
    res.status(500).send("Erro ao buscar eventos: " + error.message);
  }
};

// Função para iniciar o fluxo de autenticação
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

// Função para lidar com o callback de autenticação
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
