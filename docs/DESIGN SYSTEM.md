# ReguFlow AI

## Design System Specification

Version: 1.0

---

# Purpose

This document defines:

* Visual language
* Design tokens
* Component standards
* Layout standards
* Typography
* Colors
* States
* Accessibility requirements

All UI implementations must follow this system.

This document is authoritative.

---

# Design Philosophy

ReguFlow AI is an enterprise compliance platform.

The interface must feel:

* Professional
* Trustworthy
* Efficient
* Data-driven
* Audit-friendly

The platform should resemble:

* Enterprise SaaS
* Banking Platforms
* Governance Systems

The platform should NOT resemble:

* Consumer Apps
* Social Media Products
* Gaming Interfaces
* Marketing Websites

---

# Design Principles

## Principle 1

Clarity Over Decoration

Information should be easy to understand.

Avoid unnecessary visual effects.

---

## Principle 2

Information Density With Structure

Compliance users work with large datasets.

Support dense information layouts.

Do not sacrifice readability.

---

## Principle 3

Visual Hierarchy

Users should immediately identify:

1. What changed
2. What is important
3. What requires action

---

## Principle 4

Consistency

Identical actions should always look identical.

---

# Color System

## Primary

Enterprise Blue

```css id="color1"
#1E40AF
```

Purpose:

* Primary actions
* Navigation highlights
* Key metrics

---

## Secondary

Slate

```css id="color2"
#475569
```

---

## Neutral

```css id="color3"
#64748B
```

Purpose:

Supporting text.

---

# Status Colors

## Success

```css id="color4"
#16A34A
```

Used For:

* Completed
* Healthy
* Success

---

## Warning

```css id="color5"
#D97706
```

Used For:

* Medium Risk
* Attention Needed

---

## Error

```css id="color6"
#DC2626
```

Used For:

* Critical
* Failed
* High Risk

---

## Information

```css id="color7"
#2563EB
```

Used For:

* Informational States

---

# Risk Color Mapping

Low

```css id="risk1"
Green
```

Medium

```css id="risk2"
Amber
```

High

```css id="risk3"
Orange
```

Critical

```css id="risk4"
Red
```

This mapping must remain consistent.

---

# Theme System

Supported Themes:

* Light
* Dark

---

# Light Theme

Background

```css id="theme1"
#F8FAFC
```

Cards

```css id="theme2"
#FFFFFF
```

Text

```css id="theme3"
#0F172A
```

---

# Dark Theme

Background

```css id="theme4"
#0F172A
```

Cards

```css id="theme5"
#1E293B
```

Text

```css id="theme6"
#F8FAFC
```

---

# Typography

Primary Font

```text id="font1"
Inter
```

Fallback

```text id="font2"
IBM Plex Sans
```

---

# Type Scale

## Page Title

```css id="type1"
32px
Weight: 700
```

Examples:

Dashboard

Audit Readiness

---

## Section Title

```css id="type2"
24px
Weight: 600
```

---

## Card Title

```css id="type3"
18px
Weight: 600
```

---

## Body

```css id="type4"
14px–16px
Weight: 400
```

---

## Labels

```css id="type5"
12px–14px
Weight: 500
```

---

# Spacing System

Base Unit

```text id="space1"
8px
```

Allowed Values

```text id="space2"
8
16
24
32
48
64
80
96
```

Do not use arbitrary spacing values.

---

# Border Radius

Cards

```css id="radius1"
6px
```

Buttons

```css id="radius2"
4px
```

Inputs

```css id="radius3"
4px
```

Tables

```css id="radius4"
6px
```

---

# Shadows

Allowed

```css id="shadow1"
shadow-sm
shadow-md
```

Not Allowed

* Heavy shadows
* Floating cards
* Glassmorphism

---

# Layout System

Maximum Content Width

```css id="layout1"
1600px
```

---

# Page Layout

```text id="layout2"
Page Header

↓

Primary Content

↓

Supporting Content
```

---

# Sidebar

Width

```css id="layout3"
280px
```

Behavior

* Persistent Desktop
* Collapsible Mobile

---

# KPI Card Standards

Every KPI Card must contain:

Required:

* Title
* Value

Optional:

* Trend
* Description
* Progress Indicator

---

# KPI Hierarchy

Example:

```text id="kpi1"
Audit Readiness

92%

↑ 5%

3 Open Findings
```

---

# Table Standards

Tables are primary UI elements.

---

# Table Requirements

Must Support:

* Sorting
* Filtering
* Search
* Pagination

---

# Table Density

Beginner

```text id="table1"
Comfortable
```

Expert

```text id="table2"
Compact
```

Controlled by Adaptive Mode.

---

# Badge Standards

---

## Status Badge

Examples:

```text id="badge1"
Active

Pending

Completed

Archived
```

---

## Risk Badge

Examples:

```text id="badge2"
Low

Medium

High

Critical
```

Must use Risk Color Mapping.

---

# Form Standards

Every form must contain:

* Label
* Input
* Validation
* Error Message

Avoid unlabeled fields.

---

# Button Standards

## Primary

Purpose:

Main action.

Example:

```text id="btn1"
Generate MAPs
```

---

## Secondary

Purpose:

Supporting actions.

---

## Ghost

Purpose:

Low-priority actions.

---

# Drawer Standards

Preferred over modal for:

* Regulation Details
* MAP Details
* Report Preview

Purpose:

Maintain context.

---

# Modal Standards

Reserved for:

* Confirmation
* Critical Actions

Avoid excessive modal usage.

---

# Chart Standards

Purpose:

Support decision-making.

Not decoration.

---

# Approved Charts

* Line
* Bar
* Donut
* Area

Avoid:

* 3D charts
* Decorative charts

---

# Chart Colors

Use design token colors only.

Maintain consistency.

---

# Empty States

Every page must have:

Title

Description

Action

Example:

```text id="empty1"
No Regulations Found

Upload a regulation to begin compliance analysis.

[ Upload Regulation ]
```

---

# Loading States

Required:

* Skeleton Cards
* Skeleton Tables
* Skeleton Charts

Never show blank screens.

---

# Error States

Required Structure:

```text id="error1"
What happened

Why it happened

What to do next
```

---

# Notification System

Severity Levels

```text id="notif1"
Info

Warning

Critical
```

Critical notifications must be visually prominent.

---

# Adaptive Mode Design

---

## Beginner

Display:

* Guidance Cards
* Tooltips
* Expanded Explanations

Goal:

Reduce complexity.

---

## Intermediate

Balanced presentation.

Default mode.

---

## Expert

Display:

* Compact tables
* Bulk actions
* Reduced guidance

Goal:

Maximize efficiency.

---

# Accessibility

Minimum Requirements

* WCAG AA contrast
* Keyboard navigation
* Focus indicators
* Screen reader support

Mandatory.

---

# Animation Standards

Purpose:

Feedback

Not entertainment.

Allowed Duration

```css id="anim1"
200ms
250ms
300ms
```

---

Allowed Animations

* Hover
* Fade
* Slide
* Progress

---

Not Allowed

* Bounce
* Excessive motion
* Decorative effects

---

# Iconography

Use one icon system consistently.

Recommended:

```text id="icon1"
Lucide React
```

Avoid mixing icon libraries.

---

# Component Reuse Rule

Before creating a component:

Check if a shared component exists.

Examples:

* PageHeader
* KpiCard
* Drawer
* StatusBadge
* RiskBadge
* LoadingState
* EmptyState
* ErrorState

Reuse first.

---

# Visual Success Criteria

The design system is successful when:

1. Every page feels part of the same product.

2. Compliance workflows are easy to understand.

3. Information is easy to scan.

4. Risk is immediately visible.

5. Audit readiness is always clear.

6. Adaptive modes feel meaningfully different.

7. The interface feels enterprise-grade.

8. ReguFlow AI looks credible in front of banking, audit, and compliance stakeholders.
