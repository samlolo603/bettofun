# Easy Game (fullstack)

This repo contains a minimal production-ready scaffold for "Easy Game" — a sports betting app.

Structure:
- `backend/` — Express + MongoDB API (auth, bets, users, odds stub).
- `frontend/` — React (Vite) app using Tailwind CSS.

Security & Compliance notes:
- Authentication uses JWT; passwords hashed with bcrypt.
- Input validation using `joi` to reduce injection risks.
- Helmet, CORS and rate-limiting middleware enabled.
- For payments: integrate with a PCI-compliant provider (Stripe/Adyen). Do NOT process raw card data on your servers unless you are fully PCI-DSS compliant.
- Use HTTPS/TLS in production (terminate TLS at load balancer).

Deployment:
- Frontend: Deploy to Vercel (Vite build) or S3+CloudFront.
- Backend: Deploy to AWS ECS/Fargate, AWS Elastic Beanstalk, or a Node-ready host. Use managed MongoDB (Atlas) or Amazon DocumentDB.
- Use environment variables for secrets and rotate keys.

Quick start (local):
- Start MongoDB locally or use Atlas.
- Backend: `cd backend && npm install && cp .env.example .env && npm run dev`
- Frontend: `cd frontend && npm install && npm run dev` (set `VITE_API_URL` env if needed)

This scaffold focuses on modular code and easy extension for production features.
