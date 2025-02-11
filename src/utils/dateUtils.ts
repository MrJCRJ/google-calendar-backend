import { calendar_v3 } from "googleapis";

export interface FormattedEvent {
  id?: string | null;
  title?: string | null;
  start: string | null; // Garanta que seja uma string ou null
  end: string | null; // Garanta que seja uma string ou null
  link?: string | null;
  description?: string | null;
}

export const formatEvents = (
  events: calendar_v3.Schema$Event[]
): FormattedEvent[] => {
  return events.map((event) => ({
    id: event.id || null,
    title: event.summary || null,
    start: event.start?.dateTime || event.start?.date || null, // Garanta que seja uma string ou null
    end: event.end?.dateTime || event.end?.date || null, // Garanta que seja uma string ou null
    link: event.htmlLink || null,
    description: event.description || null,
  }));
};
