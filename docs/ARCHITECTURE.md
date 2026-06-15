# ReguFlow AI

## System Architecture

Version: 1.0

---

# Purpose

This document defines the architecture of ReguFlow AI.

It describes:

* System structure
* Module boundaries
* Data flow
* Service responsibilities
* Integration points

This document does not define implementation details.

Implementation details belong in TRD.md.

---

# Architecture Philosophy

ReguFlow AI follows:

Modular Monolith Architecture

Structure:

Frontend
↓
Backend API
↓
Database

The MVP intentionally avoids:

* Microservices
* Service Mesh
* Event Streaming Platforms
* Distributed Architectures

Reason:

The product is in MVP stage and benefits from simplicity.

---

# Core Product Workflow

The entire system revolves around:

Regulation
↓
Change Detection
↓
Impact Analysis
↓
MAP Generation
↓
Execution
↓
Audit Readiness
↓
Reporting

Every feature must support this flow.

---

# High-Level Architecture

```text
┌──────────────────────────┐
│       Frontend UI        │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      Backend API         │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      PostgreSQL DB       │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      AI Services         │
└──────────────────────────┘
```

---

# Frontend Layer

Purpose:

User interaction and workflow orchestration.

Responsibilities:

* Display regulations
* Upload documents
* Display change analysis
* Display impact analysis
* Manage MAP workflow
* Display audit readiness
* Generate reports
* Adaptive UI modes

Frontend does not:

* Process documents
* Perform clause comparison
* Execute AI logic

Frontend consumes backend APIs only.

---

# Backend Layer

Purpose:

Business workflow engine.

Responsibilities:

* Regulation management
* Document processing
* Clause extraction
* Change detection
* Impact analysis
* MAP generation
* Audit readiness calculations
* Report generation

Backend is the source of truth.

---

# Database Layer

Purpose:

Persistent storage.

Responsibilities:

Store:

* Users
* Regulations
* Clauses
* Changes
* Impact Assessments
* MAPs
* Audit Data
* Reports
* Logs

Database must support:

* Historical traceability
* Auditability
* Version tracking

---

# AI Layer

Purpose:

Assist compliance workflows.

Responsibilities:

* Regulation explanation
* Change explanation
* Impact summarization
* MAP suggestions
* Report drafting

AI is advisory.

AI does not make final compliance decisions.

---

# Core Modules

---

## Module 1

Regulatory Intelligence

Purpose:

Manage regulatory sources and regulations.

Responsibilities:

* Store regulations
* Categorize regulations
* Search regulations
* Manage versions

Inputs:

* Uploaded regulations
* Imported regulations

Outputs:

* Regulation records

---

## Module 2

Document Analysis

Purpose:

Analyze uploaded documents.

Responsibilities:

* Accept uploads
* Extract text
* Segment clauses

Inputs:

* PDF
* DOCX

Outputs:

* Structured clauses

---

## Module 3

Change Detection

Purpose:

Compare regulation versions.

Responsibilities:

* Detect added clauses
* Detect removed clauses
* Detect modified clauses

Inputs:

* Old Version
* New Version

Outputs:

* Change Records

---

## Module 4

Impact Analysis

Purpose:

Determine business impact.

Responsibilities:

* Department mapping
* Priority calculation
* Risk assessment

Inputs:

* Changes

Outputs:

* Impact Records

---

## Module 5

MAP Engine

Purpose:

Generate compliance actions.

Responsibilities:

* Create MAPs
* Assign ownership
* Track lifecycle

Inputs:

* Impact Analysis

Outputs:

* Compliance Tasks

---

## Module 6

Audit Readiness

Purpose:

Measure organizational readiness.

Responsibilities:

* Calculate readiness
* Track findings
* Track completion

Inputs:

* MAP Status
* Findings

Outputs:

* Readiness Metrics

---

## Module 7

Reporting Engine

Purpose:

Generate compliance reports.

Responsibilities:

* Executive Reports
* Risk Reports
* Audit Reports

Inputs:

* System Data

Outputs:

* Reports

---

## Module 8

Compliance Copilot

Purpose:

Assist users.

Responsibilities:

* Explain regulations
* Explain changes
* Summarize impact
* Recommend actions

Inputs:

* Regulations
* Changes
* MAPs

Outputs:

* AI Responses

---

# Data Flow

## Regulation Upload Flow

```text
User
↓
Upload Regulation
↓
Document Analysis
↓
Clause Extraction
↓
Store Regulation
↓
Store Clauses
```

---

## Change Detection Flow

```text
Version A
+
Version B
↓
Change Detection
↓
Added Clauses
Modified Clauses
Removed Clauses
↓
Store Changes
```

---

## Impact Analysis Flow

```text
Detected Changes
↓
Impact Analysis
↓
Department Mapping
↓
Risk Assessment
↓
Store Impact Records
```

---

## MAP Generation Flow

```text
Impact Analysis
↓
MAP Engine
↓
Create MAPs
↓
Assign Ownership
↓
Store MAPs
```

---

## Audit Readiness Flow

```text
MAP Completion
+
Findings
↓
Readiness Engine
↓
Audit Score
```

---

## Reporting Flow

```text
Regulations
Changes
MAPs
Readiness
↓
Report Engine
↓
Generated Report
```

---

# Integration Boundaries

Frontend may access:

* Backend API only

Frontend may NOT access:

* Database directly
* AI provider directly

---

Backend may access:

* Database
* AI Services

Backend may NOT access:

* Frontend State

---

# Security Boundaries

User
↓
Authentication
↓
Authorization
↓
Business Logic
↓
Database

Authorization must occur before business operations.

---

# Adaptive Compliance Copilot Architecture

```text
User
↓
Selected Mode

Beginner
Intermediate
Expert

↓
Frontend Presentation Layer
```

Important:

Modes affect:

* Layout
* Guidance
* Productivity Features

Modes do NOT affect:

* Permissions
* Data
* Business Logic

---

# Auditability Requirements

Every major entity must be traceable.

Required Traceability:

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
Audit Readiness
```

The system should always be able to explain:

Why a MAP exists.

Which regulation created it.

Which change triggered it.

Which department owns it.

---

# MVP Architecture Scope

Included:

* Regulation Repository
* Document Upload
* Clause Extraction
* Change Detection
* Impact Analysis
* MAP Management
* Audit Readiness
* Reporting
* AI Copilot

Excluded:

* Multi-Tenant Architecture
* Event Streaming
* Workflow Automation
* Predictive Compliance Analytics
* Enterprise Integrations
* Distributed Services

---

# Architecture Principles

1. Simplicity over complexity.

2. Traceability over automation.

3. Human accountability over autonomous decision making.

4. Compliance workflows must remain visible.

5. Every action must be explainable.

6. Every compliance task must trace back to a regulation.

7. Preserve the Regulation → Action → Proof philosophy across all modules.
