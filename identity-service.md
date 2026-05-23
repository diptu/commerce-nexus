# Identity Service Specification:Draft (Multi-Tenant)

This document outlines the concise structural blueprint for the high-performance, multi-tenant **Identity-Service** within the **Commerce-Nexus** microservice ecosystem.

---

## 1. Architectural Strategy
The `Identity-Service` serves as the multi-tenant edge security component responsible for tenant validation, centralized scoped token issuance, validation caching, and cryptographic credential handling.

* **Separation of Concerns**: While `User-Service` manages profile domains (names, addresses, and localized metadata) scoped by tenant, `Identity-Service` strictly isolates raw security attributes (credentials, tenant status variables, active states, and explicit RBAC scopes).
* **Asymmetric Token Lifecycle Engine**: Uses cryptographic private keys to mint high-speed JWT payloads injecting structural tenant metadata (`tenant_id`, `tenant_tier`, and `schema_isolation`). Downstream microservices (such as `analytics-service` and `order-service`) use public verification keys exposed via standard JSON Web Key Sets (JWKS) routes to parse and trust the tenant context statelessly[cite: 5, 8, 10].

---

## 2. Multi-Tenant High-Throughput Relational Storage Schema
The underlying data layer focuses strictly on relational credential mapping, multi-tenant workspace partitioning, and token-family lineage tracking.

```sql
-- Global enumeration for tracking authentication states per tenant workspace
CREATE TYPE active_auth_status AS ENUM ('ACTIVE', 'FORCE_PASSWORD_RESET', 'LOCKED_OUT');
CREATE TYPE tenant_tier_status AS ENUM ('FREE', 'PROFESSIONAL', 'ENTERPRISE');

-- Centralized Tenants Table for high-speed workspace identification
CREATE TABLE tenants (
    id VARCHAR(64) PRIMARY KEY, -- e.g., 'tenant_omega_456'
    name VARCHAR(255) NOT NULL,
    tier tenant_tier_status NOT NULL DEFAULT 'FREE',
    schema_name VARCHAR(63) UNIQUE NOT NULL, -- Used by downstream services for routing data walls
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tenant-scoped credentials mapping
CREATE TABLE credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- Unique identifier within this specific tenant boundary
    hashed_secret VARCHAR(255) NOT NULL,
    mfa_secret VARCHAR(128),
    auth_status active_auth_status NOT NULL DEFAULT 'ACTIVE',
    failed_login_attempts INT NOT NULL DEFAULT 0,
    lockout_until TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tenant_user UNIQUE (tenant_id, user_id)
);

-- Multi-tenant token lineage and replay attack prevention tables
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    token_family_id UUID NOT NULL, -- Corresponds to the rotation chain id
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Optimized Compound Indexes for rapid tenant session resolution and revocation lookups
CREATE INDEX idx_credentials_tenant_lookup ON credentials(tenant_id, user_id);
CREATE INDEX idx_tokens_family_tenant ON refresh_tokens(tenant_id, token_family_id);