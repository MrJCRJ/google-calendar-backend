// routes/index.js
const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar');

// Rota para iniciar o fluxo de autenticação
router.get('/auth/google', calendarController.startAuth);

// Rota de callback após a autenticação
router.get('/auth/callback', calendarController.handleAuthCallback);

// Rota para listar eventos do Google Calendar
router.get('/events', calendarController.listEvents);

module.exports = router;