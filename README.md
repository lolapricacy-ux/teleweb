# TeleWeb

## Deploy no Netlify

### Configuração pronta
Este projeto já está configurado para deploy no Netlify com SPA e build Vite.

### Passos
1. No Netlify, conecte o repositório ou faça upload da pasta `teleweb-main`.
2. Configure o build:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. No Netlify, defina a variável de ambiente:
   - `VITE_PAYMENT_API_URL=https://seu-backend-url`
4. Garanta que o backend de pagamento esteja hospedado separadamente e acessível.
   - Exemplo: Render, Railway, Vercel, Heroku

### Backend de pagamento
O backend deve rodar em outro serviço e expor estes endpoints:
- `POST /create-payment`
- `GET /payment-status/:id`

No backend você deve configurar:
- `MP_ACCESS_TOKEN=APP_USR-...`

### Arquivos adicionados
- `netlify.toml` — configura a build e o redirect para SPA
- `.env.example` — mostra as variáveis necessárias

### Observação
O frontend do Netlify irá usar `VITE_PAYMENT_API_URL` para se conectar ao backend Pix. Sem essa variável configurada corretamente, o pagamento não funcionará.
