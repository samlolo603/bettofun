# Easy Game - Backend

Small Express backend providing authentication (JWT), user balances, betting endpoints and an odds proxy stub.

Run locally:

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies: `npm install`
3. Run: `npm run dev` (requires `nodemon`) or `npm start`.

Security notes:
- Use HTTPS in production (reverse-proxy with TLS).
- Integrate a PCI-compliant payment gateway (Stripe, Adyen) for real payments.
- Use env vars for secrets and a managed MongoDB (Atlas) for production.
