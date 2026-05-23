# User Service (Draft):(Multi-Tenant)

This document provides a concise overview of the multi-tenant **User-Service** for the **Commerce-Nexus** microservice ecosystem.

---

## 1. Core Architectural Strategy
The `User-Service` operates as a completely autonomous, tenant-isolated microservice managing user profiles, preferences, and shipping/billing configurations.

* **Purged Authentication Boundary**: All credential handling, password hash management, and direct JWT token-issuance lifecycles have been migrated to the edge **Identity-Service**.
* **Stateless Operation**: Requests hitting this layer are pre-validated by the `gateway-service` using the public JWKS verification matrix. The gateway injects an explicit `X-Tenant-ID` header into the downstream execution thread.
* **Storage Isolation**: Employs a schema-isolated or database-per-tenant architecture. Cross-tenant queries are blocked at the database driver wrapper tier. Internal profile synchronization is managed via synchronous gRPC loops or asynchronous event processing streams.

---

## 2. Comprehensive Database Schema Strategy (Tenant-Partitioned)
The relational structure ensures zero cross-contamination between enterprise clients and utilizes specialized conditional indexes to maintain exactly one default delivery configuration per user inside a given tenant workspace.

```sql
CREATE TYPE user_status_enum AS ENUM ('ACTIVE', 'SUSPENDED', 'DEACTIVATED');

-- Profile storage isolated by Tenant
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    user_id UUID NOT NULL, -- Matched against sub/user claim from Identity-Service
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    status user_status_enum NOT NULL DEFAULT 'ACTIVE',
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tenant_profile UNIQUE (tenant_id, user_id)
);

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    user_id UUID NOT NULL,
    is_default_shipping BOOLEAN NOT NULL DEFAULT FALSE,
    is_default_billing BOOLEAN NOT NULL DEFAULT FALSE,
    address_line1 VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(3) NOT NULL,
    CONSTRAINT fk_user_profile FOREIGN KEY (tenant_id, user_id) REFERENCES user_profiles(tenant_id, user_id) ON DELETE CASCADE
);

-- Compound Unique Indices containing tenant scoping parameters
CREATE UNIQUE INDEX idx_addresses_unique_tenant_default_shipping 
ON addresses (tenant_id, user_id) WHERE (is_default_shipping = TRUE);

CREATE UNIQUE INDEX idx_addresses_unique_tenant_default_billing 
ON addresses (tenant_id, user_id) WHERE (is_default_billing = TRUE);

-- Core index for standard queries
CREATE INDEX idx_profiles_tenant_user ON user_profiles(tenant_id, user_id);
```

---

## 3. Asynchronous Domain Events (Message Broker)
Emits message contracts enriched with tenant routing context to event topics upon profile mutations.

```json
{
  "event_type": "USER_PROFILE_UPDATED",
  "timestamp": "2026-05-23T10:55:00Z",
  "tenant_context": {
    "tenant_id": "tenant_omega_456",
    "tenant_tier": "ENTERPRISE"
  },
  "data": {
    "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "email": "engineering@omega.com",
    "current_status": "ACTIVE"
  }
}
```