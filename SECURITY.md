# Security Checklist for Easy Game

- Authentication: JWT with strong `JWT_SECRET`, rotate keys regularly.
- Passwords: hashed with `bcrypt` (we use bcryptjs).
- Input validation: `joi` validation on all endpoints to reduce injection risk.
- Database: use parameterized queries / ORM (we use Mongoose) to avoid SQL injection.
- XSS: escape or sanitize user-provided content before rendering; use Content Security Policy.
- CSRF: for cookie-based auth, implement CSRF protections. With JWT in Authorization header, CSRF risk is reduced.
- Rate limiting: `express-rate-limit` to mitigate brute-force.
- Headers: `helmet` applied.
- TLS: require HTTPS in production; terminate TLS at a load balancer.
- Secrets: store in environment variables or secret manager (AWS Secrets Manager, Vault).
- Payments: do NOT handle raw card data. Use Stripe Checkout/Elements or similar to remain PCI-DSS compliant.
- Logging & Monitoring: centralize logs, monitor suspicious activity, audit critical operations.
- Backups & DR: backup DB, test restores.

Follow these guidelines when moving to production. This file is a short checklist, not a full compliance manual.
