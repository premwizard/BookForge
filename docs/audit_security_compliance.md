# Enterprise Audit, Security & Compliance Administration Studio

The **Enterprise Audit, Security & Compliance Administration Studio** provides enterprise-grade governance, immutable audit trail logging, SOC2 Type II compliance event tracking, API key management, role-based security controls, and organization billing administration across DocForge.

---

## 1. Immutable Audit Trail Architecture

Every critical action across the platform automatically emits a structured `ActivityLog` entry containing:
- `user_id`: Authenticated user UUID.
- `action`: Standardized event string (`DOCUMENT_EDITED`, `SECURITY_LOGIN`, `EXPORT_GENERATED`, `API_KEY_GENERATED`).
- `category`: `SECURITY`, `DOCUMENT`, `EXPORT`, `BILLING`, `TEMPLATE`.
- `severity`: `INFO`, `WARNING`, `CRITICAL`.
- `old_value` / `new_value`: JSON diff payload of mutated entity properties.
- `ip_address` & `device_info`: Client telemetry for forensic analysis.

---

## 2. API Key Security & Scope Scoping

Programmatic access keys use a 2-part security mechanism:
1. **Public Prefix**: Rendered in UI as `sk_live_a1b2...` for key identification.
2. **Hashed Secret**: Stored in the database as a SHA-256 hash. The raw secret string is rendered exactly once upon key generation and never stored unencrypted.
3. **Scopes**: Scoped permissions (`read`, `write`, `export`).

---

## 3. REST API Reference

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/audit/logs` | Query immutable activity logs with category & severity filtering |
| `GET` | `/api/v1/audit/logs/export` | Download CSV audit trail report for SOC2 / SIEM compliance |
| `GET` | `/api/v1/audit/apikeys` | List active organization API keys |
| `POST` | `/api/v1/audit/apikeys` | Generate new API key with custom scopes |
| `DELETE` | `/api/v1/audit/apikeys/{key_id}` | Revoke API key |
| `GET` | `/api/v1/audit/security/overview` | Retrieve SOC2 Type II security posture and compliance status |
