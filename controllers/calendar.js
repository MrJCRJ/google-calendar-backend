// controllers/calendar.js
const { google } = require('googleapis');
const oauth2Client = require('../config/auth');

// Função para formatar os eventos
const formatEvents = (events) => {
  return events.map(event => ({
    title: event.summary,
    start: event.start.dateTime || event.start.date,
    end: event.end.dateTime || event.end.date,
    link: event.htmlLink,
  }));
};

// Função para listar eventos do Google Calendar
const listEvents = async (req, res) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    // Formata os eventos antes de enviar a resposta
    const formattedEvents = formatEvents(response.data.items);
    res.json(formattedEvents);
  } catch (error) {
    res.status(500).send('Erro ao buscar eventos: ' + error.message);
  }
};

// Função para iniciar o fluxo de autenticação
const startAuth = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
  });
  res.redirect(url);
};

// Função para lidar com o callback de autenticação
const handleAuthCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.redirect('/events');
  } catch (error) {
    res.status(500).send('Erro ao autenticar: ' + error.message);
  }
};

module.exports = {
  listEvents,
  startAuth,
  handleAuthCallback,
};