import { Request, Response } from "express";
import { fetchEvents } from "../services/eventService";

export const listEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log(`[LOG] Rota /events acessada por ${req.ip}`);

  try {
    let { startDate, endDate } = req.query;
    const clientTimeZone = req.headers["timezone"] as string;
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

    const events = await fetchEvents(startDate as string, endDate as string);
    res.json(events);
  } catch (error: any) {
    console.error(`[ERRO] Falha ao buscar eventos: ${error.message}`);
    res.status(500).send("Erro ao buscar eventos: " + error.message);
  }
};
