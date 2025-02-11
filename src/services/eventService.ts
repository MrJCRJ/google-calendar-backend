import { google, calendar_v3 } from "googleapis";
import { oauth2Client } from "../config/auth";
import { formatEvents, FormattedEvent } from "../utils/dateUtils";
import type { GaxiosResponse } from "gaxios";

export const fetchEvents = async (
  startDate?: string,
  endDate?: string
): Promise<FormattedEvent[]> => {
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

    pageToken = response.data.nextPageToken ?? undefined;
  } while (pageToken);

  const formattedEvents = formatEvents(allEvents);
  console.log(`[LOG] ${formattedEvents.length} eventos encontrados.`);

  return formattedEvents;
};
