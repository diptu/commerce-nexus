# Commerce Nexus — Microservices Architecture

## Core Services

| Service | Responsibilities |
|---|---|
| Identity Service | Authentication, JWT, OAuth2, RBAC, MFA |
| User Service | Profiles, addresses, preferences, wishlist |
| Catalog Service | Products, categories, variants, brands |
| Inventory Service | Stock management, reservations, warehouses |
| Pricing Service | Discounts, coupons, taxes, dynamic pricing |
| Cart Service | Shopping cart, guest cart, cart merge |
| Order Service | Order lifecycle, invoices, refunds |
| Payment Service | Payment gateway integration, refunds, webhooks |
| Shipping Service | Courier integration, tracking, fulfillment |
| Notification Service | Email, SMS, push notifications |

---

## Marketplace Services

| Service | Responsibilities |
|---|---|
| Seller Service | Vendor onboarding, storefront management |
| Commission Service | Revenue sharing, commissions |
| Payout Service | Vendor payouts, wallet/bank transfers |

---

## Customer Experience Services

| Service | Responsibilities |
|---|---|
| Search Service | Product search, filtering, autocomplete |
| Recommendation Service | Personalized recommendations |
| Review Service | Ratings, reviews, moderation |
| CMS Service | Banners, blogs, landing pages |

---

## Infrastructure Services

| Service | Responsibilities |
|---|---|
| API Gateway | Routing, rate limiting, auth |
| Event Bus | Async communication (RabbitMQ/Kafka) |
| Media Service | Image uploads, CDN, resizing |
| Analytics Service | Sales and user analytics |
| Observability Service | Logs, metrics, tracing |
| Config Service | Centralized configuration |

---

# Tech Stack

| Layer | Technology |
|---|---|
| Backend | Nodejs/FastAPI |
| Frontend | Next.js |
| Database | Mongodb/PostgreSQL |
| Cache | Redis |
| Messaging | RabbitMQ |
| Search | OpenSearch |
| Auth | Keycloak |
| Containers | Docker |
| Orchestration | Kubernetes |
| Monitoring | Grafana + Prometheus |
| CI/CD | GitHub Actions |
| Cloud |  AWS |

---

# Architecture

```text
Frontend (Next.js)
        ↓
API Gateway
        ↓
Microservices
        ↓
Event Bus (RabbitMQ/Kafka)
        ↓
Database per Service
