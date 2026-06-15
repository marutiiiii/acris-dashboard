# ReguFlow AI

## AI Development Context

Version: 1.0

Purpose:

Provide domain understanding and project context for AI coding agents, copilots, autonomous development systems, and contributors.

This document should be loaded before generating code.

---

# Project Identity

Product Name:

ReguFlow AI

Category:

Compliance Operations Platform

Industry:

Banking and Financial Services

Primary Market:

Indian Banking Ecosystem

Supported Regulators:

* RBI
* SEBI
* NPCI
* CERT-In

Core Philosophy:

Regulation → Action → Proof

---

# What Problem ReguFlow AI Solves

Banks continuously receive regulatory updates.

Examples:

* RBI Circulars
* SEBI Advisories
* NPCI Notifications
* CERT-In Security Directives

Most organizations handle these updates manually.

Common process:

Read regulation
↓
Interpret change
↓
Identify affected teams
↓
Create tasks
↓
Track implementation
↓
Prepare audit evidence

Problems:

* Slow execution
* High operational effort
* Weak traceability
* Audit risk
* Regulatory exposure

ReguFlow AI transforms this into an operational workflow.

---

# What ReguFlow AI Does

ReguFlow AI converts regulatory updates into executable compliance actions.

Workflow:

Regulation
↓
Change Detection
↓
Impact Analysis
↓
MAP Generation
↓
Task Tracking
↓
Audit Readiness
↓
Reporting

This workflow is the foundation of the entire platform.

Every feature should support this workflow.

---

# Core Domain Concepts

---

## Regulation

A regulation is the primary object in the system.

Examples:

* RBI Circular
* SEBI Guideline
* CERT-In Advisory
* Internal Policy Update

All workflows originate from a regulation.

Regulations cannot be deleted.

Regulations are historical records.

---

## Clause

A clause is a discrete requirement within a regulation.

Example:

"Transactions above ₹10 lakh must be reviewed weekly."

Change detection operates at the clause level.

The platform compares clauses between versions.

---

## Change Detection

Change Detection identifies:

* Added Clauses
* Removed Clauses
* Modified Clauses

This is a core differentiator.

The platform does NOT merely compare documents.

The platform compares obligations.

---

## Impact Analysis

Impact Analysis determines:

Who is affected by a regulatory change.

Typical departments:

* Compliance
* Legal
* Operations
* IT
* Cybersecurity
* Audit

Impact Analysis answers:

"What does this regulation change affect?"

---

## MAP

MAP

=

Measurable Action Point

MAPs are compliance tasks generated from regulatory changes.

Example:

Title:

Update KYC Verification Workflow

Owner:

Compliance Team

Severity:

High

Deadline:

7 Days

MAPs represent compliance execution.

---

## Audit Readiness

Audit Readiness measures:

How prepared an organization is for an audit.

Calculated using:

* MAP Completion
* Findings
* Compliance Coverage

Expressed as:

0–100%

Higher values indicate stronger readiness.

---

## Compliance Copilot

Compliance Copilot is an AI assistant.

Responsibilities:

* Explain regulations
* Explain changes
* Summarize impact
* Recommend actions

The Copilot is advisory.

It does not make decisions.

---

# User Personas

---

## Compliance Officer

Primary user.

Goals:

* Understand regulations
* Assign actions
* Track compliance

Most workflows revolve around this persona.

---

## Legal Officer

Goals:

* Review obligations
* Interpret changes

Consumes regulatory information.

---

## Operations Team

Goals:

* Execute compliance actions

Consumes MAPs.

---

## Cybersecurity Team

Goals:

* Respond to security-related regulations

Consumes impact analysis.

---

## Auditor

Goals:

* Review readiness
* Review evidence
* Review history

Consumes reports and audit readiness.

---

## Executive

Goals:

* Monitor risk
* Monitor readiness

Consumes dashboards and reports.

---

# Product Philosophy

The platform is not a document repository.

The platform is not a chatbot.

The platform is not a generic dashboard.

The platform is an execution platform.

Everything should answer:

What changed?
↓
Who is impacted?
↓
What action is required?
↓
Has it been completed?

---

# Adaptive Compliance Copilot

A major differentiator.

Supported Modes:

---

## Beginner

Purpose:

Reduce onboarding complexity.

Characteristics:

* Guidance
* Tooltips
* Recommendations
* Simplified layouts

---

## Intermediate

Purpose:

Balanced productivity.

Characteristics:

* Moderate guidance
* Standard density

---

## Expert

Purpose:

Maximize efficiency.

Characteristics:

* Dense layouts
* Bulk actions
* Advanced controls

Important:

Modes affect UX only.

Modes never affect business logic.

---

# Product Modules

---

## Dashboard

Answers:

* What changed?
* What is important?
* What needs attention?

---

## Regulatory Intelligence

Stores and manages regulations.

---

## Document Analysis

Processes uploaded regulations.

---

## Change Detection

Compares regulation versions.

---

## Impact Analysis

Determines affected departments.

---

## AI Copilot

Provides explanations and summaries.

---

## MAP Management

Tracks compliance execution.

---

## Audit Readiness

Measures preparedness.

---

## Reporting

Generates executive outputs.

---

# Frontend Mental Model

Frontend should feel like:

Enterprise SaaS

Characteristics:

* Professional
* Trustworthy
* Information-dense
* Accessible

Avoid:

* Consumer-app aesthetics
* Social-media aesthetics
* Gaming-style interfaces

---

# Backend Mental Model

Backend is a compliance workflow engine.

Responsibilities:

* Store regulations
* Compare clauses
* Generate MAPs
* Manage readiness

Backend is not a chatbot service.

---

# Database Mental Model

Database stores:

Regulations
↓
Clauses
↓
Changes
↓
Impacts
↓
MAPs
↓
Readiness

Relationships are important.

Audit traceability is mandatory.

Historical records must be preserved.

---

# AI Mental Model

AI assists compliance execution.

AI does NOT replace compliance officers.

AI outputs are:

* Recommendations
* Explanations
* Drafts

Human review is always required.

---

# Technical Scope Boundaries

Current MVP Includes:

* Regulation Repository
* Document Upload
* Change Detection
* Impact Analysis
* MAP Management
* Audit Readiness
* Reporting
* Adaptive Copilot

---

Current MVP Excludes:

* Multi-tenancy
* Workflow Automation
* Enterprise SSO
* Real-time Collaboration
* Advanced Predictive Analytics
* Autonomous Compliance Decisions

---

# Development Principles

When implementing features:

1. Preserve Regulation → Action → Proof.

2. Prefer clarity over complexity.

3. Preserve audit traceability.

4. Keep compliance workflows explicit.

5. Avoid hidden automation.

6. Human accountability must remain visible.

7. Every compliance action should be traceable back to a regulation.

---

# AI Agent Instructions

Before generating code:

Understand:

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

This chain is the core domain model.

If a proposed feature does not support this chain, reconsider its necessity.

When uncertain:

Prefer solutions that strengthen auditability, traceability, explainability, and compliance execution.

Those are the primary goals of ReguFlow AI.
