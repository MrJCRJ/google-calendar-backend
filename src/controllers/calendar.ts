import { Request, Response } from "express";
import { google, calendar_v3 } from "googleapis";
import type { GaxiosResponse } from "gaxios";
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
const formatEvents = (events: calendar_v3.Schema$Event[]) => {
  return events.map((event) => ({
    id: event.id,
    title: event.summary,
    start: event.start?.dateTime || event.start?.date,
    end: event.end?.dateTime || event.end?.date,
    link: event.htmlLink,
    description: event.description,
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

    // Obtenha as datas de início e fim da consulta
    let { startDate, endDate } = req.query;
    const clientTimeZone = req.headers["timezone"];

    console.log(`[LOG] Fuso horário do cliente: ${clientTimeZone}`);
    const currentYear = new Date().getFullYear();

    // Se não forem fornecidos, use datas padrão do ano atual NO FUSO DO CLIENTE
    if (!startDate || !endDate) {
      // Converta para UTC mantendo o horário local
      startDate = `${currentYear}-01-01T00:00:00.000${clientTimeZone}`;
      endDate = `${currentYear}-12-31T23:59:59.999${clientTimeZone}`;

      console.warn(
        `[WARN] Datas padrão usadas (UTC): ${startDate} até ${endDate}`
      );
    } else {
      // Converta as datas do cliente (em seu fuso) para UTC
      startDate = String(startDate);
      endDate = String(endDate);
    }

    console.log(`[LOG] Buscando eventos entre ${startDate} e ${endDate}...`);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    let allEvents: calendar_v3.Schema$Event[] = [];
    let pageToken: string | undefined = undefined;

    do {
      // Defina explicitamente o tipo da resposta
      const response: GaxiosResponse<calendar_v3.Schema$Events> =
        await calendar.events.list({
          calendarId: "primary",
          timeMin: startDate,
          timeMax: endDate,
          singleEvents: true,
          orderBy: "startTime",
          maxResults: 2500, // Limite máximo da API
          pageToken: pageToken,
        }); // Defina o tipo da resposta

      const data = response.data as calendar_v3.Schema$Events;

      if (data.items) {
        allEvents = allEvents.concat(data.items);
      }

      pageToken = response.data.nextPageToken ?? undefined; // Se houver mais páginas, continua a busca
    } while (pageToken);

    const formattedEvents = formatEvents(allEvents);

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
