# ReguFlow AI

## Architectural & Product Decisions

Version: 1.0

Status: Approved

---

# Purpose

This document records finalized decisions for ReguFlow AI.

These decisions should be treated as authoritative.

AI coding agents, developers, and contributors must follow these decisions unless a new version of this document explicitly changes them.

Do not re-evaluate previously approved decisions.

Do not introduce alternative architectures unless approved.

---

# D-001

Product Category

Decision:

ReguFlow AI is a Compliance Operations Platform.

Not:

* Compliance Dashboard
* Compliance Chatbot
* Regulatory Repository
* Document Management System

Primary Goal:

Convert regulations into executable compliance actions.

Core Philosophy:

Regulation → Action → Proof

Status:

Approved

---

# D-002

Target Industry

Decision:

Primary target users are:

* Banks
* Financial Institutions
* NBFCs

Initial focus:

Indian regulatory ecosystem.

Supported regulators:

* RBI
* SEBI
* NPCI
* CERT-In

Status:

Approved

---

# D-003

Deployment Model

Decision:

Single organization deployment.

Multi-tenant architecture is out of MVP scope.

Status:

Approved

Reason:

Hackathon MVP does not require multi-tenancy.

---

# D-004

Frontend Framework

Decision:

React + TypeScript

Status:

Approved

Alternative frameworks are not permitted.

Rejected:

* Angular
* Vue
* Svelte

---

# D-005

UI Component Strategy

Decision:

Reusable component architecture.

Shared components include:

* PageHeader
* KpiCard
* Drawer
* StatusBadge
* RiskBadge
* LoadingState
* EmptyState
* ErrorState

Status:

Approved

---

# D-006

Styling System

Decision:

TailwindCSS

Status:

Approved

Reason:

Rapid iteration and design consistency.

Rejected:

* Bootstrap
* Material UI
* Ant Design

unless explicitly required.

---

# D-007

Design Language

Decision:

Enterprise Banking UI

Characteristics:

* Minimal
* Professional
* Information-dense
* Accessibility-focused

Avoid:

* Gaming aesthetics
* Consumer app aesthetics
* Excessive animation

Status:

Approved

---

# D-008

Primary Color

Decision:

Enterprise Blue

Hex:

#1E40AF

Status:

Approved

---

# D-009

Typography

Decision:

Inter

Fallback:

IBM Plex Sans

Status:

Approved

---

# D-010

Adaptive Compliance Copilot

Decision:

Adaptive UI remains a core differentiator.

Supported modes:

* Beginner
* Intermediate
* Expert

Mode changes affect:

* Guidance
* Layout density
* Tool visibility

Mode changes do not affect:

* Data
* Permissions
* Business logic

Status:

Approved

---

# D-011

AI Copilot Positioning

Decision:

AI Copilot is an assistant.

AI Copilot is not an autonomous agent.

Responsibilities:

* Explain
* Summarize
* Recommend

Not Allowed:

* Automatic approval
* Automatic closure
* Automatic status changes

Status:

Approved

---

# D-012

Document Processing Strategy

Decision:

Documents are the primary input source.

Supported:

* PDF
* DOCX

Initial MVP focus:

PDF

Status:

Approved

---

# D-013

Regulation Sources

Decision:

Supported sources:

* RBI
* SEBI
* NPCI
* CERT-In
* Internal Policies

Future sources may be added.

Status:

Approved

---

# D-014

Change Detection Granularity

Decision:

Clause-level comparison.

Not:

* Entire-document comparison only
* Paragraph-level only

Status:

Approved

Reason:

This is a primary differentiator.

---

# D-015

Impact Analysis Strategy

Decision:

Impact analysis is department-centric.

Primary departments:

* Compliance
* Legal
* Operations
* IT
* Cybersecurity
* Audit

Status:

Approved

---

# D-016

Task Management Strategy

Decision:

All compliance actions are represented as MAPs.

MAP

=
Measurable Action Point

Status:

Approved

No alternative task systems should be introduced.

---

# D-017

Workflow Model

Decision:

MAP lifecycle:

Pending
→ Assigned
→ In Progress
→ Review
→ Completed

Status:

Approved

No additional states without approval.

---

# D-018

Audit Readiness Calculation

Decision:

Audit readiness is based primarily on:

* MAP completion
* Findings
* Compliance coverage

Status:

Approved

---

# D-019

Dashboard Philosophy

Decision:

Dashboard must answer:

1. What changed?
2. What is impacted?
3. What requires action?
4. How audit-ready are we?

Status:

Approved

Avoid vanity metrics.

---

# D-020

Reporting Strategy

Decision:

Reports are generated outputs.

Reports never modify data.

Status:

Approved

---

# D-021

Architecture Pattern

Decision:

Modular Monolith

MVP Architecture:

Frontend
↓
Backend API
↓
Database

Status:

Approved

Rejected:

* Microservices
* Event-driven architecture
* Service mesh

Reason:

Overengineering for MVP.

---

# D-022

Backend Framework

Decision:

FastAPI

Language:

Python

Status:

Approved

Rejected:

* Django
* Flask
* ExpressJS
* Spring Boot

---

# D-023

Database

Decision:

PostgreSQL

Status:

Approved

Rejected:

* MongoDB
* Firebase
* Supabase as primary database

Reason:

Strong relational model.

---

# D-024

Caching

Decision:

Redis may be introduced later.

Not required for MVP.

Status:

Approved

---

# D-025

Authentication

Decision:

Simple RBAC authentication.

Roles:

* Admin
* Compliance Officer
* Legal Officer
* Auditor
* Executive Viewer

Status:

Approved

---

# D-026

Authorization Model

Decision:

Role-Based Access Control

RBAC only.

ABAC is out of scope.

Status:

Approved

---

# D-027

Evidence Validation

Decision:

Simulated for MVP.

Real validation deferred.

Status:

Approved

---

# D-028

Regulatory Monitoring

Decision:

Automated source monitoring is a future-ready feature.

MVP supports:

* Manual upload
* Simulated monitoring

Status:

Approved

---

# D-029

Notifications

Decision:

Notifications are informational only.

Notifications never execute actions automatically.

Status:

Approved

---

# D-030

Demo Strategy

Decision:

Demo must follow:

Regulation
→ Change Detection
→ Impact Analysis
→ MAP Generation
→ Audit Readiness
→ Report

Status:

Approved

This workflow must be preserved across all future development.

---

# D-031

Success Definition

Decision:

The product succeeds when a compliance officer can:

1. Upload a regulation.
2. Understand changes.
3. Understand impact.
4. Generate actions.
5. Track execution.
6. Measure readiness.

Within a single platform.

Status:

Approved

---

# D-032

What ReguFlow AI Is Not

ReguFlow AI is NOT:

* A chatbot
* A generic document manager
* A CRM
* A ticketing platform
* A workflow builder
* A project management tool

ReguFlow AI is a Compliance Operations Platform.

Status:

Approved
