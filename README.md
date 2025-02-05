# Google Calendar Backend

Este é um backend em Node.js que se integra à API do Google Calendar para listar eventos de um calendário específico. Ele fornece uma API simples para acessar e exibir eventos em formato JSON.

## Funcionalidades

- Autenticação com o Google Calendar API.
- Listagem de eventos futuros do calendário.
- Formatação dos eventos em uma estrutura simplificada.

## Como Usar

### Pré-requisitos

- Node.js (v18 ou superior)
- Conta no Google Cloud Console
- Credenciais OAuth 2.0 configuradas no Google Cloud Console

### Passos para Configuração

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/google-calendar-backend.git
   cd google-calendar-backend
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure as credenciais do Google:**

- Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais:
  ```env
  CLIENT_ID=seu_client_id
  CLIENT_SECRET=seu_client_secret
  REDIRECT_URI=http://localhost:3000/auth/callback
  ```

4. **Inicie o servidor:**

   ```bash
   npm start
   ```

5. **Acesse as rotas:**

- Autenticação: http://localhost:3000/auth/google
- Listar eventos: http://localhost:3000/events

## Exemplo de Resposta da API

Ao acessar a rota /events, você receberá uma resposta no seguinte formato:

```json
[
  {
    "title": "Trabalho",
    "start": "2025-02-06T05:30:00-03:00",
    "end": "2025-02-06T09:30:00-03:00",
    "link": "https://www.google.com/calendar/event?eid=MjcyM2tvb2E2cDFtOWIwdHF2NTJqNDlpamZfMjAyNTAyMDZUMDgzMDAwWiBtci5qb2NpcmlqdUBt"
  },
  {
    "title": "Trabalho",
    "start": "2025-02-07T05:30:00-03:00",
    "end": "2025-02-07T09:30:00-03:00",
    "link": "https://www.google.com/calendar/event?eid=MjcyM2tvb2E2cDFtOWIwdHF2NTJqNDlpamZfMjAyNTAyMDdUMDgzMDAwWiBtci5qb2NpcmlqdUBt"
  }
]
```

## Estrutura do Projeto

```
google-calendar-backend/
├── config/
│   └── auth.js          # Configuração do OAuth2
├── controllers/
│   └── calendar.js      # Lógica para manipular o Google Calendar
├── routes/
│   └── index.js         # Definição das rotas
├── .env                 # Variáveis de ambiente
├── app.js               # Ponto de entrada do servidor
├── README.md            # Documentação do projeto
└── package.json         # Dependências do projeto
```

## Dependências

- express: Framework para criar o servidor.
- googleapis: Biblioteca para integrar com a API do Google.
- dotenv: Carregar variáveis de ambiente.

## Como Contribuir

1. Faça um fork do repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`).
4. Faça push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.

### Passos para Publicar no GitHub

1. **Crie um Repositório no GitHub:**

   - Acesse [GitHub](https://github.com) e crie um novo repositório.
   - Dê um nome ao repositório, por exemplo, `google-calendar-backend`.

2. **Inicialize o Git no Seu Projeto:**
   No terminal, dentro da pasta do seu projeto, execute:

   ```bash
   git init
   git add .
   git commit -m "Primeiro commit: backend para integrar com Google Calendar"
   ```

3. **Conecte o Repositório Local ao GitHub:**

   ```bash
   git remote add origin https://github.com/seu-usuario/google-calendar-backend.git
   git branch -M main
   git push -u origin main
   ```

4. **Acesse o Repositório no GitHub:**

- Agora, seu projeto estará disponível em https://github.com/seu-usuario/google-calendar-backend.
