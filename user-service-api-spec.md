# User Service REST  API Specification 

This document defines the interface endpoints and contract schemas for the tenant-isolated **User-Service** within the **Commerce-Nexus** microservice ecosystem.

Base Service Boundary URL: `/api/v1`  
Enforced Header Requirement: All incoming internal requests must be enriched by the Gateway with an `X-Tenant-ID` header.

---

## 1. Tenant-Scoped Profiling Domain (`/users/me`)

### `GET /users/me`
* **Description**: Fetches profile JSON context matching active entity claims. The service uses the gateway-supplied tenant ID to scope the relational data lookup.
* **Authorization Requirement**: Bearer `<AccessToken>` containing valid `tenant_context`
* **Headers Required**:
  * `X-Tenant-ID`: `tenant_omega_456`
* **Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "user_id": "usr_01H7XYZ...",
    "tenant_id": "tenant_omega_456",
    "email": "engineering@omega.com",
    "first_name": "John",
    "last_name": "Doe",
    "status": "ACTIVE",
    "created_at": "2026-01-15T08:00:00Z"
  }
}
```

### `PUT /users/me/addresses`
* **Description**: Appends a delivery tracking asset to the tenant-isolated address index matrix.
* **Authorization Requirement**: Bearer `<AccessToken>`
* **Headers Required**:
  * `X-Tenant-ID`: `tenant_omega_456`
* **Request Payload**:
```json
{
  "address_line_1": "123 Main St",
  "city": "San Jose",
  "state": "CA",
  "country": "USA",
  "is_default_shipping": true
}
```
* **Response (`201 Created`)**:
```json
{
  "success": true,
  "data": {
    "address_id": "adr_90ef4abc...",
    "is_default_shipping": true
  }
}
```

---

## 2. Shared Core Provisioning (Internal gRPC/Loopback Only)

### `RPC CreateTenantUser`
* **Description**: Internal loopback invoked exclusively by the `Identity-Service` during a new user sign-up handshake to provision profile metadata alongside credential initialization.
* **Request Payload**:
```json
{
  "tenant_id": "tenant_omega_456",
  "user_id": "usr_01H7XYZ...",
  "email": "engineering@omega.com",
  "first_name": "John",
  "last_name": "Doe"
}
```
* **Response**: Struct confirming profile initialization within the tenant's relational storage boundary.

---

## 3. Administrative Tenant Workspace Control (`/admin`)

### `GET /admin/users`
* **Description**: Paginated lookup of consumer identities partitioned strictly within the administrator's authorized tenant space.
* **Query Parameters**: `page=1&limit=20&status=ACTIVE`
* **Authorization Requirement**: RBAC permission claim string `commerce:admin:users:*` nested within a matching `tenant_id` scope.
* **Headers Required**:
  * `X-Tenant-ID`: `tenant_omega_456`
* **Response (`200 OK`)**:
```json
{
  "success": true,
  "meta": {
    "current_page": 1,
    "limit": 20,
    "total_records": 142
  },
  "data": [
    {
      "user_id": "usr_01H7XYZ...",
      "email": "engineering@omega.com",
      "first_name": "John",
      "last_name": "Doe",
      "status": "ACTIVE"
    }
  ]
}
```