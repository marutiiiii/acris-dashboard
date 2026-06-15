# ReguFlow AI

## AI Development Operating System

Version: 1.0

Status: Active

---

# Purpose

This document defines how AI coding agents should operate when working on ReguFlow AI.

This document must be loaded before:

* Generating code
* Refactoring code
* Creating schemas
* Creating APIs
* Creating UI components
* Creating AI workflows

This document governs AI development behavior.

---

# Project Identity

Product:

ReguFlow AI

Category:

Compliance Operations Platform

Industry:

Banking & Financial Services

Core Philosophy:

Regulation → Action → Proof

Every implementation decision should reinforce this workflow.

---

# Primary Objective

The goal of ReguFlow AI is NOT:

* Building dashboards
* Building chatbots
* Managing documents

The goal is:

Transform regulations into executable compliance actions and audit-ready outcomes.

If a feature does not strengthen this objective, question its necessity.

---

# Required Reading Order

Before generating code, read:

```text id="readorder"
1. PRD.md

2. BUSINESS_RULES.md

3. DECISIONS.md

4. AI_CONTEXT.md

5. ARCHITECTURE.md

6. FRONTEND_SCHEMA.md

7. BACKEND_SCHEMA.md

8. DATABASE_SCHEMA.md

9. API_SPEC.md

10. AUTHORIZATION_MATRIX.md

11. UIUX.md

12. DESIGN_SYSTEM.md

13. TASKS.md

14. TRD.md
```

Never start coding before understanding these documents.

---

# AI Agent Responsibilities

AI agents are responsible for:

* Implementing requirements
* Maintaining consistency
* Following architecture
* Following business rules

AI agents are NOT responsible for:

* Inventing new features
* Changing architecture
* Replacing approved technologies
* Changing business rules

---

# Decision Hierarchy

When conflicts occur:

Priority Order:

```text id="priority"
BUSINESS_RULES.md

↓

DECISIONS.md

↓

PRD.md

↓

ARCHITECTURE.md

↓

TRD.md

↓

Implementation
```

Higher documents always win.

---

# Architecture Rules

Mandatory:

* Modular Monolith
* FastAPI
* PostgreSQL
* React
* TypeScript

Do NOT replace approved technologies.

Rejected technologies must remain rejected.

---

# Frontend Development Rules

Frontend owns:

* UI
* State
* Interaction
* Visualization

Frontend does NOT own:

* Business Logic
* Compliance Calculations
* Clause Comparison
* Impact Analysis

Never move business logic into React components.

---

# Backend Development Rules

Backend owns:

* Regulations
* Clauses
* Changes
* Impacts
* MAPs
* Readiness

Backend is the source of truth.

Frontend is a consumer.

---

# Service Layer Rule

Business logic belongs ONLY in services.

Allowed:

```python id="rule1"
router
↓
service
↓
repository
```

Forbidden:

```python id="rule2"
router
↓
database
```

Forbidden:

```python id="rule3"
router
↓
business logic
```

---

# Repository Rule

Repositories:

Allowed:

* Create
* Read
* Update
* Query

Forbidden:

* Business Logic
* AI Calls
* Workflow Logic

---

# AI Feature Rules

AI is advisory.

AI may:

* Explain
* Summarize
* Recommend
* Draft

AI may NOT:

* Approve
* Complete Tasks
* Modify Regulations
* Change MAP Status

Human accountability is mandatory.

---

# Traceability Rule

Every workflow must preserve:

```text id="trace1"
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

This chain must never be broken.

Before implementing anything ask:

Can this still be traced back to a regulation?

If not:

Reconsider implementation.

---

# MAP Rules

MAP

=
Measurable Action Point

Every MAP must:

* Have an owner
* Have a department
* Have a due date
* Reference a regulation

No exceptions.

---

# Auditability Rule

All important actions create audit logs.

Examples:

* Regulation Created
* MAP Assigned
* MAP Completed
* Report Generated

Audit logging is mandatory.

---

# Database Rules

Preferred:

* Normalized schema
* Strong foreign keys
* Explicit relationships

Avoid:

* JSON blobs for core entities
* Hidden relationships
* Weak references

---

# API Rules

All APIs must:

* Follow API_SPEC.md
* Return consistent responses
* Use versioned routes

Base:

```text id="api1"
/api/v1
```

Do not invent endpoint naming conventions.

---

# UI Rules

All UI must follow:

UIUX.md
+
DESIGN_SYSTEM.md

Never invent:

* New spacing systems
* New color systems
* New typography scales

---

# Component Rules

Before creating a component:

Search for reusable components.

Prefer:

* PageHeader
* KpiCard
* Drawer
* StatusBadge
* RiskBadge

Avoid duplicate implementations.

---

# Adaptive Copilot Rules

Modes:

* Beginner
* Intermediate
* Expert

Modes affect:

* UX
* Guidance
* Density

Modes do NOT affect:

* Authorization
* Permissions
* Data

Never couple adaptive mode with business logic.

---

# Coding Standards

---

## File Size Rule

Preferred:

< 300 lines

Maximum:

500 lines

If larger:

Refactor.

---

## Function Size Rule

Preferred:

< 50 lines

Maximum:

100 lines

If larger:

Extract functions.

---

## Component Size Rule

Preferred:

< 250 lines

Maximum:

400 lines

If larger:

Split components.

---

# Refactoring Rules

Allowed:

* Improve readability
* Improve maintainability
* Improve performance

Not Allowed:

* Change business behavior
* Change workflows
* Change architecture

without explicit approval.

---

# Error Handling Rules

Every async operation must:

Handle:

* Success
* Loading
* Failure

Never swallow errors.

---

# Security Rules

Never trust frontend data.

Validate:

* Input
* Permissions
* Ownership

on backend.

Always.

---

# Performance Rules

Optimize:

* Queries
* API calls
* Rendering

Do not optimize prematurely.

Correctness first.

---

# Development Strategy

Build vertically.

Good:

```text id="dev1"
Regulation
↓
Upload
↓
Clauses
↓
Changes
↓
Impact
↓
MAP
```

Bad:

```text id="dev2"
Build every table

↓

Build every endpoint

↓

Build every page
```

Complete workflows before starting new workflows.

---

# Task Execution Order

Follow TASKS.md.

Do not invent task order.

Complete dependencies first.

---

# Forbidden Behaviors

AI agents must NOT:

* Change architecture
* Replace technologies
* Create duplicate entities
* Create duplicate APIs
* Ignore business rules
* Skip audit logging
* Break traceability
* Create autonomous compliance decisions

---

# When Unsure

Prefer solutions that increase:

* Traceability
* Auditability
* Explainability
* Compliance Visibility

These are the core values of ReguFlow AI.

---

# Definition of Successful Development

Development is successful when a Compliance Officer can:

1. Upload a regulation.

2. Extract clauses.

3. Detect changes.

4. Understand impact.

5. Generate MAPs.

6. Track completion.

7. Measure readiness.

8. Generate reports.

9. Receive AI explanations.

All within a single workflow.

---

# Final Rule

Every commit, feature, endpoint, database change, UI component, and AI workflow should support:

```text id="finalrule"
Regulation
↓
Action
↓
Proof
```

If it does not strengthen this chain, it likely does not belong in ReguFlow AI.
