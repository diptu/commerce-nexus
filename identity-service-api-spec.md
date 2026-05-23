# Identity Service RESTSpecification:Draft (Multi-Tenant)

This document defines the condensed interface endpoints, tenant scoping mechanisms, and signature parameters for the high-performance, edge-security **Identity-Service** within the multi-tenant **Commerce-Nexus** microservice ecosystem.

Base Service Boundary URL: `/api/v1/identity`

---

## 1. Authentication Execution & Tenant Token Operations

### `POST /oauth/token`
* **Description**: Multi-tenant OpenID Connect / OAuth2 compatible token exchange node. Infers tenant context via incoming header `X-Tenant-ID` or parses it explicitly from the payload body.
* **Request Payload (Password Grant Type)**:
```json
{
  "grant_type": "password",
  "client_id": "nexus-web-app",
  "tenant_id": "tenant_omega_456",
  "username": "engineering@omega.com",
  "password": "SecurePassword123!"
}
```
* **Success Response (`200 OK`)**:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im5leHVzLWFlLWtleS12MSJ9...",
  "refresh_token": "r1_tenant_omega_456_8f2b3c4d90ef4abc91231a2b",
  "token_type": "Bearer",
  "expires_in": 900
}
```

#### Decrypted JWT Payload Architecture (Downstream System Context)
```json
{
  "iss": "https://identity.commerce-nexus.com",
  "sub": "usr_01H7XYZ...",
  "aud": "commerce-nexus-services",
  "exp": 1716483900,
  "tenant_context": {
    "tenant_id": "tenant_omega_456",
    "tenant_tier": "ENTERPRISE",
    "db_shard_hint": "postgresql_cluster_us_east_04",
    "schema_isolation": "tenant_omega_456_schema"
  },
  "roles": ["Tenant_Admin"],
  "scopes": ["orders:write", "analytics:read"]
}
```

### `POST /oauth/revoke`
* **Description**: Invalidates an active refresh token family string within a strict tenant boundary.
* **Headers Required**:
  * `X-Tenant-ID`: `tenant_omega_456`
* **Request Payload**:
```json
{
  "token": "r1_tenant_omega_456_8f2b3c4d90ef4abc91231a2b",
  "token_type_hint": "refresh_token"
}
```
* **Success Response (`204 No Content`)**

---

## 2. Cryptographic Key Distribution Engine

### `GET /.well-known/jwks.json`
* **Description**: Exposes validation public key sets used by the `gateway-service` and inner microservices to authenticate incoming tenant payloads statelessly.
* **Success Response (`200 OK`)**:
```json
{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "alg": "RS256",
      "kid": "nexus-ae-key-v1",
      "n": "u1W_de4X_zQ9O4m...",
      "e": "AQAB"
    }
  ]
}
```

---

## 3. Multi-Factor Authentication (MFA) Tenant Control Mesh

### `POST /mfa/enroll`
* **Description**: Generates Time-Based One-Time Password (TOTP) seeds and custom branded QR configurations isolated per tenant workspace.
* **Authorization Requirement**: Bearer `<TransientToken>`
* **Headers Required**:
  * `X-Tenant-ID`: `tenant_omega_456`
* **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "secret": "NEXUSAUTHSECRET32BITSTRING...",
    "qrCodeUri": "otpauth://totp/Commerce-Nexus:engineering@omega.com?secret=NEXUSAUTH&issuer=Omega%20Enterprise"
  }
}
```

### `POST /mfa/verify`
* **Description**: Validates step-up authentication tokens to elevate active tokens to critical transactional security tiers.
* **Headers Required**:
  * `X-Tenant-ID`: `tenant_omega_456`
* **Request Payload**:
```json
{
  "code": "582910"
}
```
* **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Tenant multi-factor token successfully verified."
}
```