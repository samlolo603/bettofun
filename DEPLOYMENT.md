# Deployment Guide

Recommended architecture:
- Frontend: Vercel (static) or S3 + CloudFront
- Backend: AWS ECS/Fargate, Heroku, or similar with autoscaling
- DB: MongoDB Atlas (managed) or AWS DocumentDB
- TLS: Use managed TLS (CloudFront/ALB/Load Balancer)
- Secrets: use environment variables via your platform or AWS Secrets Manager

Quick deploy with Docker Compose (local testing):

1. Ensure Docker Desktop is running.
2. From repo root run:

```bash
docker compose up --build
```

Expose ports: frontend at `http://localhost:3000`, backend at `http://localhost:4000`.

Production notes:
- Use a managed DB and lock down network access.
- Add HTTPS at the edge.
- Configure health checks and autoscaling policies.
- Use a CDN for frontend assets.
- Use CI to run tests and build artifacts, then push docker images to a registry.
