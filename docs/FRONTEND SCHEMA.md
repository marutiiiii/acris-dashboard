# ReguFlow AI

## Frontend Architecture Schema

Version: 1.0

---

# Purpose

This document defines:

* Frontend structure
* Route hierarchy
* Page hierarchy
* Component architecture
* State ownership
* Frontend responsibilities

This document is intended for:

* AI coding agents
* Frontend developers
* Product contributors

---

# Frontend Philosophy

Frontend is responsible for:

* User interaction
* Data presentation
* Workflow orchestration
* Visualization
* User productivity

Frontend is NOT responsible for:

* Business logic
* Compliance calculations
* Clause comparison
* Impact analysis
* MAP generation
* Database operations

These belong to the backend.

---

# Frontend Technology Stack

Framework:

React

Language:

TypeScript

Styling:

TailwindCSS

State Management:

React Query
+
Context API

Routing:

React Router

Charts:

Recharts

Drag & Drop:

Dnd Kit

---

# Application Layout

```text id="rk41ra"
App Layout

├── Sidebar
├── Top Navigation
├── Mode Banner
├── Page Content
└── Global Notifications
```

The layout persists across all authenticated pages.

---

# Navigation Structure

```text id="z8rx5f"
Overview
│
├── Dashboard

Intelligence
│
├── Regulations

Analysis
│
├── Document Analysis
├── Change Detection
├── Impact Analysis
├── AI Copilot

Actions
│
├── MAP Management

Governance
│
├── Audit Readiness
├── Reports
├── Alerts
├── Audit Logs

Administration
│
├── Company Profile
```

---

# Route Structure

```text id="f1tqig"
/dashboard

/regulations

/document-analysis

/change-detection

/impact-analysis

/copilot

/maps

/audit-readiness

/reports

/alerts

/audit-logs

/company-profile
```

Future Routes:

```text id="6n12j9"
/settings

/users

/roles

/integrations
```

Not MVP.

---

# Global Layout Components

## Sidebar

Responsibilities:

* Navigation
* Active Route
* Section Grouping

Persistent.

---

## Top Navigation

Responsibilities:

* User Information
* Theme Toggle
* Adaptive Mode Toggle
* Notifications

Persistent.

---

## Mode Banner

Responsibilities:

Display:

* Beginner
* Intermediate
* Expert

Current mode.

Persistent.

---

# Shared Components

These components should be reused.

---

## PageHeader

Used By:

All pages.

Contains:

* Title
* Description
* Actions

---

## KpiCard

Used By:

* Dashboard
* MAPs
* Audit Readiness

Contains:

* Metric
* Trend
* Description

---

## Drawer

Used By:

* Regulation Details
* MAP Details
* Report Preview

Reusable.

---

## StatusBadge

Displays:

* Active
* Pending
* Completed
* Review

---

## RiskBadge

Displays:

* Low
* Medium
* High
* Critical

---

## LoadingState

Used on:

All async screens.

---

## EmptyState

Used when:

No data exists.

---

## ErrorState

Used when:

Data retrieval fails.

---

## BeginnerHint

Used only in Beginner Mode.

Provides:

* Guidance
* Recommendations

---

# Page Architecture

---

# Dashboard

Route:

/dashboard

Purpose:

Executive overview.

Sections:

```text id="7c77gf"
Journey Tracker

Today's Focus

KPI Cards

Trend Charts

Risk Distribution

Recent Activity

Compliance Timeline

AI Insights
```

Data Sources:

* Regulations
* MAPs
* Audit Metrics

---

# Regulations

Route:

/regulations

Purpose:

Regulation repository.

Sections:

```text id="yg2jrf"
Source Cards

Regulation Table

Filters

Search

Detail Drawer
```

---

# Document Analysis

Route:

/document-analysis

Purpose:

Upload workflow.

Sections:

```text id="9xyqha"
Upload Zone

Pipeline Status

Results Summary

Clause Cards
```

States:

* Idle
* Uploading
* Processing
* Completed
* Failed

---

# Change Detection

Route:

/change-detection

Purpose:

Version comparison.

Sections:

```text id="yfjv1i"
Executive Summary

Filters

Diff Workspace

Sticky Metrics
```

---

# Impact Analysis

Route:

/impact-analysis

Purpose:

Department impact visualization.

Sections:

```text id="l4r0rx"
Department Matrix

Risk Charts

Business Impact

Recommendations
```

---

# AI Copilot

Route:

/copilot

Purpose:

Compliance assistance.

Sections:

```text id="s4h1oi"
Chat Interface

Quick Actions

Response Panel

Citation Panel
```

---

# MAP Management

Route:

/maps

Purpose:

Task lifecycle management.

Sections:

```text id="e9v11k"
KPI Strip

Workflow Status

Kanban Board

Task Drawer
```

Columns:

* Pending
* Assigned
* In Progress
* Review
* Completed

---

# Audit Readiness

Route:

/audit-readiness

Purpose:

Readiness assessment.

Sections:

```text id="q4l7gr"
Readiness Score

Department Ranking

Heatmap

Timeline

Executive Summary
```

---

# Reports

Route:

/reports

Purpose:

Report management.

Sections:

```text id="zujgsl"
Report Types

Preview

Export

Print

Share
```

---

# Alerts

Route:

/alerts

Purpose:

Risk notifications.

Sections:

```text id="w09mrl"
Alert Feed

Severity Filters

Status Filters
```

---

# Audit Logs

Route:

/audit-logs

Purpose:

Audit trail.

Sections:

```text id="wz6fuo"
Log Table

Filters

Search
```

---

# Company Profile

Route:

/company-profile

Purpose:

Organization settings.

Sections:

```text id="0tnuyh"
Organization Details

Current Mode

Preferences
```

---

# Global State

Global State should store:

```text id="z7wq0n"
Current User

Theme

Current Adaptive Mode

Notifications

Selected Regulation

Current Demo Scenario
```

Shared globally.

---

# Page-Level State

Examples:

Document Analysis:

```text id="uj3u0d"
Uploaded File

Pipeline Status

Analysis Result
```

Local only.

---

Change Detection:

```text id="aabn8s"
Selected Versions

Filters

Search Query
```

Local only.

---

# Adaptive Mode System

Modes:

* Beginner
* Intermediate
* Expert

Persisted in:

localStorage

---

## Beginner

Display:

* Guidance
* Tooltips
* Recommendations

---

## Intermediate

Display:

* Standard layout

---

## Expert

Display:

* Dense tables
* Bulk actions
* Advanced controls

Important:

Adaptive mode only affects UI.

Never affects business logic.

---

# Data Ownership Rules

Frontend owns:

* UI State
* Theme State
* Modal State
* Layout State

Backend owns:

* Regulations
* Changes
* MAPs
* Reports
* Audit Data

Frontend must never become the source of truth.

---

# Demo Scenario Engine

Purpose:

Support hackathon demos.

Examples:

```text id="e8zbl4"
RBI Digital Lending

AML Compliance Update

Cybersecurity Advisory

KYC Workflow Change
```

Changing scenario updates:

* Dashboard
* Change Detection
* MAPs
* Reports

Frontend only.

---

# Frontend Principles

1. Reuse components.

2. Avoid duplicate UI patterns.

3. Keep workflows visible.

4. Preserve Regulation → Action → Proof.

5. Optimize for enterprise users.

6. Optimize for demo clarity.

7. Adaptive Mode affects presentation only.

8. Frontend never becomes the source of truth.
