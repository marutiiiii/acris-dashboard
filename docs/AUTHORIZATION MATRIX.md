# ReguFlow AI

## Authorization & Access Control Matrix

Version: 1.0

Authorization Model:

RBAC (Role-Based Access Control)

---

# Purpose

This document defines:

* User roles
* Permissions
* Resource access
* Action restrictions

Authorization decisions must follow this document.

Business logic should never bypass these rules.

---

# Authorization Philosophy

Principle:

Least Privilege Access

Users should only access:

* Information they require
* Actions they are authorized to perform

Users should not gain access through UI manipulation.

All permissions must be enforced on the backend.

---

# Roles

Supported Roles:

1. Admin
2. Compliance Officer
3. Legal Officer
4. Auditor
5. Executive Viewer

---

# Role Definitions

---

## Admin

Purpose:

System administration.

Responsibilities:

* Manage users
* Manage roles
* Configure organization
* Access all modules

Access Level:

Full

---

## Compliance Officer

Purpose:

Primary operational user.

Responsibilities:

* Manage regulations
* Review changes
* Generate MAPs
* Track compliance

Access Level:

High

---

## Legal Officer

Purpose:

Regulatory interpretation.

Responsibilities:

* Review regulations
* Review changes
* Provide legal guidance

Access Level:

Medium

---

## Auditor

Purpose:

Audit verification.

Responsibilities:

* Review readiness
* Review findings
* Review audit logs
* Review reports

Access Level:

Read-heavy

---

## Executive Viewer

Purpose:

Leadership visibility.

Responsibilities:

* Monitor risk
* Monitor readiness
* Review reports

Access Level:

Read-only

---

# Permission Types

Actions:

```text id="act1"
CREATE
READ
UPDATE
DELETE
APPROVE
GENERATE
EXPORT
ASSIGN
```

---

# REGULATIONS

| Action             | Admin | Compliance | Legal | Auditor | Executive |
| ------------------ | ----- | ---------- | ----- | ------- | --------- |
| View Regulations   | ✅     | ✅          | ✅     | ✅       | ✅         |
| Create Regulation  | ✅     | ✅          | ❌     | ❌       | ❌         |
| Update Regulation  | ✅     | ✅          | ❌     | ❌       | ❌         |
| Archive Regulation | ✅     | ✅          | ❌     | ❌       | ❌         |
| Delete Regulation  | ❌     | ❌          | ❌     | ❌       | ❌         |
| View Versions      | ✅     | ✅          | ✅     | ✅       | ✅         |

Reason:

Regulations are immutable records.

---

# DOCUMENTS

| Action            | Admin | Compliance | Legal | Auditor | Executive |
| ----------------- | ----- | ---------- | ----- | ------- | --------- |
| Upload Document   | ✅     | ✅          | ❌     | ❌       | ❌         |
| View Document     | ✅     | ✅          | ✅     | ✅       | ✅         |
| Download Document | ✅     | ✅          | ✅     | ✅       | ✅         |
| Delete Document   | ❌     | ❌          | ❌     | ❌       | ❌         |

---

# CLAUSES

| Action       | Admin | Compliance | Legal | Auditor | Executive |
| ------------ | ----- | ---------- | ----- | ------- | --------- |
| View Clauses | ✅     | ✅          | ✅     | ✅       | ✅         |
| Edit Clauses | ❌     | ❌          | ❌     | ❌       | ❌         |

Clauses originate from documents.

Manual editing is prohibited.

---

# CHANGE DETECTION

| Action         | Admin | Compliance | Legal | Auditor | Executive |
| -------------- | ----- | ---------- | ----- | ------- | --------- |
| View Changes   | ✅     | ✅          | ✅     | ✅       | ✅         |
| Run Comparison | ✅     | ✅          | ❌     | ❌       | ❌         |
| Export Results | ✅     | ✅          | ✅     | ✅       | ✅         |

---

# IMPACT ANALYSIS

| Action                   | Admin | Compliance | Legal | Auditor | Executive |
| ------------------------ | ----- | ---------- | ----- | ------- | --------- |
| View Impact              | ✅     | ✅          | ✅     | ✅       | ✅         |
| Generate Impact Analysis | ✅     | ✅          | ❌     | ❌       | ❌         |
| Export Analysis          | ✅     | ✅          | ✅     | ✅       | ✅         |

---

# MAPS

MAP

=
Measurable Action Point

| Action            | Admin | Compliance | Legal | Auditor | Executive |
| ----------------- | ----- | ---------- | ----- | ------- | --------- |
| View MAPs         | ✅     | ✅          | ✅     | ✅       | ✅         |
| Create MAPs       | ✅     | ✅          | ❌     | ❌       | ❌         |
| Generate MAPs     | ✅     | ✅          | ❌     | ❌       | ❌         |
| Assign MAPs       | ✅     | ✅          | ❌     | ❌       | ❌         |
| Update MAPs       | ✅     | ✅          | ❌     | ❌       | ❌         |
| Change MAP Status | ✅     | ✅          | ❌     | ❌       | ❌         |
| Delete MAPs       | ❌     | ❌          | ❌     | ❌       | ❌         |

---

# MAP STATUS TRANSITIONS

Allowed Roles:

* Admin
* Compliance Officer

Only these roles may update MAP lifecycle states.

---

# FINDINGS

| Action          | Admin | Compliance | Legal | Auditor | Executive |
| --------------- | ----- | ---------- | ----- | ------- | --------- |
| View Findings   | ✅     | ✅          | ✅     | ✅       | ✅         |
| Create Findings | ✅     | ❌          | ❌     | ✅       | ❌         |
| Close Findings  | ✅     | ❌          | ❌     | ✅       | ❌         |

Reason:

Findings belong to audit workflows.

---

# AUDIT READINESS

| Action                  | Admin | Compliance | Legal | Auditor | Executive |
| ----------------------- | ----- | ---------- | ----- | ------- | --------- |
| View Readiness          | ✅     | ✅          | ✅     | ✅       | ✅         |
| Recalculate Readiness   | ✅     | ✅          | ❌     | ❌       | ❌         |
| Export Readiness Report | ✅     | ✅          | ✅     | ✅       | ✅         |

---

# REPORTS

| Action           | Admin | Compliance | Legal | Auditor | Executive |
| ---------------- | ----- | ---------- | ----- | ------- | --------- |
| View Reports     | ✅     | ✅          | ✅     | ✅       | ✅         |
| Generate Reports | ✅     | ✅          | ❌     | ❌       | ❌         |
| Export Reports   | ✅     | ✅          | ✅     | ✅       | ✅         |

---

# AI COPILOT

| Action             | Admin | Compliance | Legal | Auditor | Executive |
| ------------------ | ----- | ---------- | ----- | ------- | --------- |
| Use Copilot        | ✅     | ✅          | ✅     | ✅       | ✅         |
| Explain Regulation | ✅     | ✅          | ✅     | ✅       | ✅         |
| Explain Change     | ✅     | ✅          | ✅     | ✅       | ✅         |
| Generate Summary   | ✅     | ✅          | ✅     | ✅       | ✅         |

Important:

AI Copilot is advisory only.

No role may use AI to bypass business rules.

---

# AUDIT LOGS

| Action            | Admin | Compliance | Legal | Auditor | Executive |
| ----------------- | ----- | ---------- | ----- | ------- | --------- |
| View Audit Logs   | ✅     | ✅          | ❌     | ✅       | ❌         |
| Export Audit Logs | ✅     | ❌          | ❌     | ✅       | ❌         |
| Modify Audit Logs | ❌     | ❌          | ❌     | ❌       | ❌         |

Audit logs are immutable.

---

# NOTIFICATIONS

| Action               | Admin  | Compliance | Legal  | Auditor | Executive |
| -------------------- | ------ | ---------- | ------ | ------- | --------- |
| View Notifications   | ✅      | ✅          | ✅      | ✅       | ✅         |
| Mark Read            | ✅      | ✅          | ✅      | ✅       | ✅         |
| Create Notifications | System | System     | System | System  | System    |

Notifications are system-generated.

---

# COMPANY PROFILE

| Action         | Admin | Compliance | Legal | Auditor | Executive |
| -------------- | ----- | ---------- | ----- | ------- | --------- |
| View Profile   | ✅     | ✅          | ✅     | ✅       | ✅         |
| Update Profile | ✅     | ❌          | ❌     | ❌       | ❌         |

---

# USER MANAGEMENT

| Action        | Admin | Compliance | Legal | Auditor | Executive |
| ------------- | ----- | ---------- | ----- | ------- | --------- |
| View Users    | ✅     | ❌          | ❌     | ❌       | ❌         |
| Create Users  | ✅     | ❌          | ❌     | ❌       | ❌         |
| Update Users  | ✅     | ❌          | ❌     | ❌       | ❌         |
| Disable Users | ✅     | ❌          | ❌     | ❌       | ❌         |

Only administrators manage users.

---

# ADAPTIVE COMPLIANCE MODES

Modes:

* Beginner
* Intermediate
* Expert

Important:

Modes affect:

* Layout
* Guidance
* Productivity Features

Modes do NOT affect:

* Permissions
* Authorization
* Access Rights

Example:

A Compliance Officer in Beginner Mode has identical permissions to a Compliance Officer in Expert Mode.

---

# FORBIDDEN ACTIONS

No role may:

* Delete Regulations
* Delete Audit Logs
* Delete Change Records
* Delete Impact Records
* Modify Historical Reports
* Bypass MAP Workflow
* Override Business Rules

---

# API AUTHORIZATION ENFORCEMENT

Every protected endpoint must:

1. Authenticate User
2. Resolve Role
3. Validate Permission
4. Execute Business Logic

Sequence:

```text id="authflow"
Request
↓
Authentication
↓
Authorization
↓
Business Logic
↓
Response
```

Authorization must occur before service execution.

---

# AUDIT REQUIREMENTS

Permission-sensitive actions must generate audit logs.

Examples:

* Regulation Created
* MAP Assigned
* MAP Status Updated
* Finding Closed
* Report Generated

Audit logging is mandatory.

---

# PRINCIPLES

1. Least privilege access.

2. Read access is broader than write access.

3. Compliance Officers manage compliance workflows.

4. Auditors manage findings and verification.

5. Executives consume information.

6. Admins manage the platform.

7. Adaptive modes never affect permissions.

8. Authorization is enforced on the backend only.
