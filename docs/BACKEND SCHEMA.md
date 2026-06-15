# ReguFlow AI

## Backend Architecture Schema

Version: 1.0

---

# Purpose

This document defines:

* Backend modules
* Service ownership
* Business boundaries
* Internal workflows
* Domain responsibilities

This document does NOT define:

* Database schema
* API endpoints
* UI behavior

Those belong in:

* DATABASE_SCHEMA.md
* API_SPEC.md
* FRONTEND_SCHEMA.md

---

# Backend Philosophy

The backend is the compliance workflow engine.

Its responsibility is to transform:

Regulation
↓
Change Detection
↓
Impact Analysis
↓
MAP Generation
↓
Audit Readiness
↓
Reporting

The backend is the system of record.

The frontend is only a consumer.

---

# Backend Technology

Framework:

FastAPI

Language:

Python

Architecture:

Modular Monolith

Database:

PostgreSQL

Future:

Redis (Optional)

---

# Backend Layer Structure

```text
backend/

├── api/
├── modules/
├── services/
├── repositories/
├── models/
├── schemas/
├── ai/
├── core/
├── utils/
└── jobs/
```

---

# Module Architecture

Each module owns:

* Business Logic
* Validation
* Domain Rules

Modules should not directly manipulate other modules' internals.

Communication occurs through services.

---

# Core Modules

## 1. User Module

Purpose:

Manage users and access.

Responsibilities:

* User profiles
* Roles
* Permissions

Owns:

* Users
* Roles

Consumes:

Nothing

---

## 2. Regulation Module

Purpose:

Manage regulations.

Responsibilities:

* Create regulations
* Version regulations
* Archive regulations
* Retrieve regulations

Owns:

* Regulations
* Regulation Versions

Produces:

* Clauses

---

## 3. Document Module

Purpose:

Process uploaded files.

Responsibilities:

* File ingestion
* Text extraction
* Clause segmentation

Owns:

* Documents
* Uploaded Files

Produces:

* Clauses

Consumes:

* Regulations

---

## 4. Clause Module

Purpose:

Manage clause records.

Responsibilities:

* Store clauses
* Retrieve clauses
* Version clauses

Owns:

* Clauses

Consumes:

* Documents

Produces:

* Change Detection Inputs

---

## 5. Change Detection Module

Purpose:

Compare versions.

Responsibilities:

* Added clauses
* Modified clauses
* Removed clauses

Owns:

* Change Records

Consumes:

* Clauses

Produces:

* Impact Analysis Inputs

---

## 6. Impact Analysis Module

Purpose:

Determine organizational impact.

Responsibilities:

* Department mapping
* Priority assignment
* Risk classification

Owns:

* Impact Records

Consumes:

* Changes

Produces:

* MAP Inputs

---

## 7. MAP Module

Purpose:

Manage compliance actions.

MAP

=

Measurable Action Point

Responsibilities:

* Create MAPs
* Assign MAPs
* Track MAP lifecycle

Owns:

* MAPs

Consumes:

* Impact Records

Produces:

* Readiness Inputs

---

## 8. Audit Readiness Module

Purpose:

Measure readiness.

Responsibilities:

* Readiness calculation
* Findings tracking
* Compliance coverage

Owns:

* Readiness Metrics
* Findings

Consumes:

* MAPs

Produces:

* Dashboard Metrics

---

## 9. Reporting Module

Purpose:

Generate reports.

Responsibilities:

* Executive Reports
* Compliance Reports
* Audit Reports
* Risk Reports

Owns:

* Generated Reports

Consumes:

* All business modules

---

## 10. Audit Log Module

Purpose:

Maintain traceability.

Responsibilities:

* Record events
* Record changes
* Record user actions

Owns:

* Audit Logs

Consumes:

* All modules

---

## 11. Notification Module

Purpose:

User notifications.

Responsibilities:

* Alert generation
* Notification delivery

Owns:

* Notifications

Consumes:

* All modules

---

## 12. AI Copilot Module

Purpose:

Assist users.

Responsibilities:

* Explain regulations
* Summarize changes
* Generate recommendations
* Generate report drafts

Owns:

No business data.

Consumes:

* Regulations
* Changes
* MAPs
* Reports

Produces:

* AI Responses

Important:

AI never modifies business entities directly.

---

# Service Layer

Every module exposes services.

Example:

```text
RegulationService

DocumentService

ClauseService

ChangeDetectionService

ImpactAnalysisService

MAPService

ReadinessService

ReportService
```

Business logic belongs here.

Never inside routes.

---

# Repository Layer

Repositories are responsible for:

* Reading data
* Writing data

Repositories must NOT:

* Perform business calculations
* Execute workflows

Example:

```text
RegulationRepository

MAPRepository

ReportRepository
```

---

# API Layer

Responsibilities:

* Request validation
* Authentication
* Authorization
* Response formatting

API routes should remain thin.

No business logic.

Example:

```python
router -> service -> repository
```

Never:

```python
router -> database
```

---

# AI Layer

Structure:

```text
ai/

├── prompts/
├── providers/
├── chains/
├── context/
└── evaluators/
```

Purpose:

Encapsulate all AI behavior.

---

# AI Responsibilities

Allowed:

* Explain
* Summarize
* Recommend
* Draft

Not Allowed:

* Auto-approve
* Auto-complete MAPs
* Auto-modify regulations

Human review required.

---

# Background Jobs

Directory:

```text
jobs/
```

Purpose:

Async operations.

Examples:

* Report generation
* Regulation monitoring
* Scheduled readiness updates

Future-ready.

Not required for MVP.

---

# Internal Data Flow

## Regulation Upload

```text
Upload
↓
Document Module
↓
Clause Module
↓
Regulation Module
```

---

## Change Detection

```text
Clause Module
↓
Change Detection Module
↓
Change Records
```

---

## Impact Analysis

```text
Changes
↓
Impact Analysis
↓
Impact Records
```

---

## MAP Generation

```text
Impact Records
↓
MAP Module
↓
MAP Records
```

---

## Audit Readiness

```text
MAP Records
+
Findings
↓
Readiness Module
↓
Readiness Score
```

---

## Reporting

```text
Regulations
Changes
MAPs
Readiness
↓
Reporting Module
↓
Report
```

---

# Ownership Rules

Only Regulation Module may modify:

* Regulations

Only Clause Module may modify:

* Clauses

Only Change Detection Module may create:

* Change Records

Only Impact Analysis Module may create:

* Impact Records

Only MAP Module may modify:

* MAPs

Only Audit Readiness Module may calculate:

* Readiness

Ownership must remain strict.

---

# Auditability Requirements

Every entity must be traceable.

Required chain:

```text
Regulation
↓
Clause
↓
Change
↓
Impact
↓
MAP
↓
Readiness
```

At any time the system must answer:

Why does this MAP exist?

Which regulation caused it?

Which clause changed?

Which department was affected?

---

# MVP Scope

Included:

* Users
* Regulations
* Documents
* Clauses
* Change Detection
* Impact Analysis
* MAPs
* Audit Readiness
* Reporting
* Audit Logs
* AI Copilot

Excluded:

* Workflow Automation
* Multi-Tenancy
* Real-Time Collaboration
* Predictive Analytics
* Enterprise Integrations

---

# Backend Principles

1. Business logic lives in services.

2. Repositories only access data.

3. Routes remain thin.

4. AI remains advisory.

5. Preserve auditability.

6. Preserve traceability.

7. Preserve Regulation → Action → Proof.

8. Every business entity must have a clear owner module.
