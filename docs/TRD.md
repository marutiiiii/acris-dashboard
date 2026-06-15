# ReguFlow AI

## Technical Requirements Document

Version: 1.0

Status: Approved

---

# Purpose

This document defines:

* Technical implementation requirements
* Technology stack
* System behavior
* Performance expectations
* Security requirements
* AI integration requirements
* Non-functional requirements

This document is the primary implementation guide for engineers and AI coding agents.

---

# Product Summary

ReguFlow AI is a Compliance Operations Platform that transforms regulatory changes into actionable compliance workflows.

Core Workflow:

```text
Regulation
↓
Document Analysis
↓
Clause Extraction
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
```

---

# Technical Stack

## Frontend

Framework:

React

Language:

TypeScript

Styling:

TailwindCSS

Routing:

React Router

State Management:

TanStack Query
+
Context API

Charts:

Recharts

Drag & Drop:

@dnd-kit

---

## Backend

Framework:

FastAPI

Language:

Python 3.12+

Architecture:

Modular Monolith

API Style:

REST

Validation:

Pydantic

---

## Database

Database:

PostgreSQL

ORM:

SQLAlchemy

Migration Tool:

Alembic

---

## AI Layer

Provider:

Gemini API

Fallback:

OpenAI Compatible Providers

Responsibilities:

* Explanation
* Summarization
* MAP Suggestions
* Impact Explanation

AI is advisory only.

---

# Environment Structure

```text
frontend/
backend/

docs/

PRD.md
TRD.md
ARCHITECTURE.md
DATABASE_SCHEMA.md
API_SPEC.md
```

---

# Frontend Requirements

---

## FR-001

Adaptive Compliance Copilot

Requirements:

Modes:

* Beginner
* Intermediate
* Expert

Persistence:

localStorage

Mode affects:

* Density
* Guidance
* Tooltips

Mode does NOT affect:

* Permissions
* Business Logic

---

## FR-002

Dashboard

Must Display:

* Compliance Health
* Audit Readiness
* Active Regulations
* Pending MAPs
* Recent Activity
* Journey Tracker

Refresh Strategy:

Query-based refresh.

---

## FR-003

Document Analysis

Must Support:

* PDF Upload
* DOCX Upload

Required States:

* Idle
* Uploading
* Processing
* Complete
* Error

---

## FR-004

Change Detection

Must Display:

* Added Clauses
* Modified Clauses
* Removed Clauses

Required Filters:

* Severity
* Department
* Search

---

## FR-005

MAP Board

Must Support:

* Drag & Drop
* Status Updates
* Task Detail Drawer

Workflow:

Pending
→ Assigned
→ In Progress
→ Review
→ Completed

---

# Backend Requirements

---

## BE-001

Modular Architecture

Modules:

* Users
* Regulations
* Documents
* Clauses
* Changes
* Impact Analysis
* MAPs
* Audit Readiness
* Reports
* Copilot

Modules must remain independent.

---

## BE-002

Service Layer

Business logic must exist only in:

```text
services/
```

Never in:

* Routes
* Controllers
* Repositories

---

## BE-003

Repository Layer

Responsibilities:

* Read
* Write

Not:

* Business calculations

---

## BE-004

Auditability

Every important action creates an audit log.

Examples:

* Regulation Created
* MAP Assigned
* Report Generated

---

# Document Processing Requirements

---

## DOC-001

Supported Formats

Required:

* PDF

Optional:

* DOCX

---

## DOC-002

Text Extraction

Output:

Plain text representation.

---

## DOC-003

Clause Segmentation

Output:

Structured clause records.

Example:

```json
{
  "clause_number": "4.1",
  "title": "Transaction Monitoring",
  "content": "Banks shall..."
}
```

---

# Change Detection Requirements

---

## CD-001

Comparison Scope

Comparison occurs at:

Clause Level

Not:

Document Level

---

## CD-002

Supported Change Types

* Added
* Modified
* Removed

Only these values are allowed.

---

## CD-003

Severity Classification

Values:

* Low
* Medium
* High
* Critical

Required for every change.

---

# Impact Analysis Requirements

---

## IA-001

Department Mapping

Supported Departments:

* Compliance
* Legal
* Operations
* IT
* Cybersecurity
* Audit

---

## IA-002

Impact Score

Range:

0–100

---

## IA-003

Priority

Values:

* Low
* Medium
* High
* Critical

---

# MAP Requirements

MAP

=
Measurable Action Point

---

## MAP-001

Required Fields

Every MAP must contain:

* Title
* Description
* Owner
* Department
* Severity
* Due Date

---

## MAP-002

Status Workflow

Allowed:

```text
Pending
↓
Assigned
↓
In Progress
↓
Review
↓
Completed
```

No skipping allowed.

---

## MAP-003

Ownership

Every MAP requires:

* User
* Department

---

# Audit Readiness Requirements

---

## AR-001

Score Range

0–100

---

## AR-002

Inputs

Readiness depends on:

* MAP Completion
* Findings
* Compliance Coverage

---

## AR-003

Historical Tracking

Readiness calculations must be stored historically.

Never overwrite.

---

# Reporting Requirements

---

## RP-001

Supported Reports

* Executive
* Compliance
* Risk
* Audit
* Department

---

## RP-002

Report Generation

Reports are snapshots.

Reports must not mutate data.

---

# AI Requirements

---

## AI-001

AI Responsibilities

Allowed:

* Explain
* Summarize
* Recommend
* Draft

---

## AI-002

AI Restrictions

Not Allowed:

* Auto Approve
* Auto Complete MAPs
* Auto Change Status

---

## AI-003

Traceability

AI responses should include:

* Source Reference
* Confidence Score

Where applicable.

---

# Security Requirements

---

## SEC-001

Authentication Required

All endpoints except:

```text
/health
/auth/login
```

require authentication.

---

## SEC-002

Authorization

RBAC enforced.

See:

AUTHORIZATION_MATRIX.md

---

## SEC-003

Audit Logging

Mandatory for:

* Create
* Update
* Assignment
* Status Changes

---

# Performance Requirements

---

## PERF-001

Dashboard Load

Target:

< 2 seconds

---

## PERF-002

Regulation Search

Target:

< 1 second

---

## PERF-003

MAP Retrieval

Target:

< 1 second

---

## PERF-004

Report Generation

Target:

< 10 seconds

---

# Reliability Requirements

---

## REL-001

No Data Loss

Regulations must be preserved.

---

## REL-002

Version Integrity

Regulation versions must remain immutable.

---

## REL-003

Audit Log Integrity

Audit logs cannot be modified.

---

# Observability Requirements

---

## OBS-001

Application Logs

Track:

* Errors
* Warnings
* Business Events

---

## OBS-002

Audit Logs

Track:

* User Actions
* Entity Changes

---

# Non-Goals

Not Included In MVP:

* Multi-Tenant SaaS
* Workflow Automation
* Enterprise SSO
* Real-Time Collaboration
* Predictive Compliance Analytics
* Autonomous Compliance Decisions

---

# Technical Success Criteria

The system is considered complete when a user can:

1. Upload a regulation.
2. Extract clauses.
3. Compare versions.
4. Detect changes.
5. Generate impact analysis.
6. Generate MAPs.
7. Track completion.
8. Calculate readiness.
9. Generate reports.
10. Use AI Copilot.

Within a single Regulation → Action → Proof workflow.

---

# Engineering Principles

1. Simplicity over complexity.

2. Modular ownership.

3. Strong auditability.

4. Strong traceability.

5. Human accountability.

6. AI assists, humans decide.

7. Preserve Regulation → Action → Proof.

8. Every entity must be explainable and traceable.
