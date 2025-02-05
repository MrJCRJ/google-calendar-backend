// controllers/calendar.ts
import { Request, Response } from "express";
import { google } from "googleapis";
import oauth2Client from "../config/auth";

// Interface para o formato dos eventos
interface FormattedEvent {
  title: string;
  start: string;
  end: string;
  link: string;
}

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
  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    // Formata os eventos antes de enviar a resposta
    const formattedEvents = formatEvents(response.data.items || []);
    res.json(formattedEvents);
  } catch (error: any) {
    res.status(500).send("Erro ao buscar eventos: " + error.message);
  }
};

// Função para iniciar o fluxo de autenticação
export const startAuth = (req: Request, res: Response): void => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.readonly"],
  });
  res.redirect(url);
};

// Função para lidar com o callback de autenticação
export const handleAuthCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);
    res.redirect("/events");
  } catch (error: any) {
    res.status(500).send("Erro ao autenticar: " + error.message);
  }
};
