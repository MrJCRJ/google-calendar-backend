// app.js
const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());


// Usar as rotas definidas
app.use('/', routes);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});