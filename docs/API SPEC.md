# ReguFlow AI

## API Specification

Version: 1.0

Architecture:

REST API

Framework:

FastAPI

Base URL:

```text id="ys5z6k"
/api/v1
```

---

# API Principles

1. RESTful design.

2. Resource-oriented endpoints.

3. Predictable naming.

4. Consistent response format.

5. No business logic in routes.

6. All business rules enforced by services.

---

# Standard Response Format

Success:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# HEALTH

---

## GET

```text id="4c2x5i"
/health
```

Purpose:

System health check.

Response:

```json
{
  "status": "healthy"
}
```

---

# AUTH MODULE

---

## POST

```text id="qjny5i"
/auth/login
```

Purpose:

Authenticate user.

---

## POST

```text id="jkwwg6"
/auth/logout
```

Purpose:

Logout user.

---

## GET

```text id="2nbfqo"
/auth/me
```

Purpose:

Current user profile.

---

# USERS MODULE

---

## GET

```text id="3ee1fk"
/users
```

List users.

---

## GET

```text id="hwr23x"
/users/{user_id}
```

Get user details.

---

## POST

```text id="m8ws0e"
/users
```

Create user.

---

## PUT

```text id="ewr8i8"
/users/{user_id}
```

Update user.

---

# REGULATIONS MODULE

---

## GET

```text id="85a3vm"
/regulations
```

Purpose:

List regulations.

Filters:

* source
* status
* risk_level

---

## GET

```text id="l7wr8m"
/regulations/{regulation_id}
```

Purpose:

Get regulation details.

---

## POST

```text id="53hnj9"
/regulations
```

Purpose:

Create regulation.

---

## PUT

```text id="8wkg3j"
/regulations/{regulation_id}
```

Purpose:

Update regulation metadata.

---

## GET

```text id="p8vyz8"
/regulations/{regulation_id}/versions
```

Purpose:

Get regulation versions.

---

## POST

```text id="9j57v8"
/regulations/{regulation_id}/versions
```

Purpose:

Create regulation version.

---

# DOCUMENT MODULE

---

## POST

```text id="tb0kmw"
/documents/upload
```

Purpose:

Upload PDF or DOCX.

Request:

multipart/form-data

Fields:

* file
* regulation_id

Response:

Document metadata.

---

## GET

```text id="qkwf6o"
/documents/{document_id}
```

Purpose:

Get uploaded document.

---

## GET

```text id="8dztjh"
/documents/{document_id}/status
```

Purpose:

Processing status.

Possible values:

* Uploaded
* Processing
* Completed
* Failed

---

# CLAUSE MODULE

---

## GET

```text id="l0ok6x"
/clauses
```

Purpose:

List clauses.

---

## GET

```text id="z3u9gq"
/clauses/{clause_id}
```

Purpose:

Clause details.

---

## GET

```text id="bxhlf4"
/regulations/{regulation_id}/clauses
```

Purpose:

Clauses for regulation.

---

# CHANGE DETECTION MODULE

---

## POST

```text id="ayjv2g"
/changes/compare
```

Purpose:

Compare two regulation versions.

Request:

```json
{
  "old_version_id": "",
  "new_version_id": ""
}
```

Response:

* Added
* Modified
* Removed

---

## GET

```text id="1cqzb0"
/changes
```

Purpose:

List detected changes.

Filters:

* severity
* type

---

## GET

```text id="qk3wh2"
/changes/{change_id}
```

Purpose:

Get change details.

---

## GET

```text id="e2sdh8"
/regulations/{regulation_id}/changes
```

Purpose:

Changes linked to regulation.

---

# IMPACT ANALYSIS MODULE

---

## POST

```text id="9x7e0x"
/impact-analysis/generate
```

Purpose:

Generate impact analysis.

Request:

```json
{
  "change_id": ""
}
```

---

## GET

```text id="9ft0t3"
/impact-analysis
```

Purpose:

List impact assessments.

---

## GET

```text id="vjlwmj"
/impact-analysis/{impact_id}
```

Purpose:

Impact details.

---

## GET

```text id="hh88lf"
/changes/{change_id}/impact
```

Purpose:

Impact for change.

---

# MAP MODULE

MAP

=

Measurable Action Point

---

## POST

```text id="70qns8"
/maps/generate
```

Purpose:

Generate MAPs from impact analysis.

---

## GET

```text id="cv4j1u"
/maps
```

Purpose:

List MAPs.

Filters:

* status
* severity
* department

---

## GET

```text id="jtz21j"
/maps/{map_id}
```

Purpose:

Get MAP details.

---

## POST

```text id="8u5ehf"
/maps
```

Purpose:

Create MAP manually.

---

## PUT

```text id="b3n4cb"
/maps/{map_id}
```

Purpose:

Update MAP.

---

## PATCH

```text id="ssv2gh"
/maps/{map_id}/status
```

Purpose:

Update MAP status.

Allowed:

Pending
→ Assigned
→ In Progress
→ Review
→ Completed

---

# AUDIT READINESS MODULE

---

## GET

```text id="jlwm1z"
/audit-readiness
```

Purpose:

Current readiness score.

---

## POST

```text id="hwtf6k"
/audit-readiness/calculate
```

Purpose:

Recalculate readiness.

---

## GET

```text id="mbc5pf"
/audit-readiness/history
```

Purpose:

Historical readiness snapshots.

---

# FINDINGS MODULE

---

## GET

```text id="oah1x0"
/findings
```

Purpose:

List findings.

---

## POST

```text id="5e4jz4"
/findings
```

Purpose:

Create finding.

---

## PATCH

```text id="tgn6gj"
/findings/{finding_id}
```

Purpose:

Update finding.

---

# REPORTS MODULE

---

## GET

```text id="pc4rvx"
/reports
```

Purpose:

List reports.

---

## POST

```text id="szthg8"
/reports/generate
```

Purpose:

Generate report.

Request:

```json
{
  "report_type": "executive"
}
```

Allowed:

* executive
* compliance
* risk
* audit
* department

---

## GET

```text id="ik69rv"
/reports/{report_id}
```

Purpose:

Report details.

---

## GET

```text id="epjlwm"
/reports/{report_id}/download
```

Purpose:

Download report.

---

# AI COPILOT MODULE

---

## POST

```text id="azj3l3"
/copilot/chat
```

Purpose:

Ask AI assistant.

Request:

```json
{
  "message": "",
  "context_id": ""
}
```

Response:

```json
{
  "response": "",
  "citations": [],
  "confidence": 0.91
}
```

---

## POST

```text id="mh4rmh"
/copilot/explain-regulation
```

Purpose:

Explain regulation.

---

## POST

```text id="xg8y0y"
/copilot/explain-change
```

Purpose:

Explain change.

---

## POST

```text id="9lk54i"
/copilot/generate-summary
```

Purpose:

Generate executive summary.

---

# NOTIFICATIONS MODULE

---

## GET

```text id="y6vd4k"
/notifications
```

Purpose:

List notifications.

---

## PATCH

```text id="x5f3k4"
/notifications/{notification_id}/read
```

Purpose:

Mark notification as read.

---

# AUDIT LOGS MODULE

---

## GET

```text id="dmp3v0"
/audit-logs
```

Purpose:

Retrieve audit history.

Filters:

* entity_type
* user
* date_range

---

# DASHBOARD MODULE

---

## GET

```text id="tqu9or"
/dashboard/overview
```

Purpose:

Dashboard KPIs.

Returns:

* Compliance Health
* Active Regulations
* Pending MAPs
* Audit Readiness
* Risk Distribution

---

## GET

```text id="wl0s63"
/dashboard/activity
```

Purpose:

Recent activity.

---

## GET

```text id="wq5uvg"
/dashboard/insights
```

Purpose:

Executive insights.

---

# AUTHORIZATION RULE

Every endpoint except:

```text id="q6l2ta"
/health
/auth/login
```

requires authentication.

Authorization must follow:

AUTHORIZATION_MATRIX.md

---

# API DESIGN PRINCIPLES

1. Resources are versioned.

2. Responses are predictable.

3. Business logic belongs in services.

4. Auditability is preserved.

5. Every MAP traces to a regulation.

6. Every change traces to clauses.

7. Every impact traces to changes.

8. Preserve Regulation → Action → Proof.
