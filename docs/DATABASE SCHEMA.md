# ReguFlow AI

## Database Schema Specification

Version: 1.0

Database:

PostgreSQL

---

# Purpose

This document defines:

* Database entities
* Relationships
* Ownership
* Constraints
* Auditability requirements

The database must preserve:

Regulation → Change → Impact → MAP → Audit Readiness

for complete compliance traceability.

---

# Design Principles

1. PostgreSQL only.

2. Strong relational design.

3. Historical records are preserved.

4. Soft delete preferred over hard delete.

5. Auditability is mandatory.

6. Every compliance action must trace back to a regulation.

---

# ENTITY RELATIONSHIP OVERVIEW

```text
Organization
    │
    ▼
Users
    │
    ▼
Regulations
    │
    ▼
RegulationVersions
    │
    ▼
Clauses
    │
    ▼
Changes
    │
    ▼
ImpactAssessments
    │
    ▼
MAPs
    │
    ▼
AuditReadiness

Reports
AuditLogs
Notifications
Findings
```

---

# TABLE: organizations

Purpose:

Organization profile.

```sql
id UUID PK

name VARCHAR(255)

industry VARCHAR(100)

country VARCHAR(100)

created_at TIMESTAMP

updated_at TIMESTAMP
```

---

# TABLE: roles

Purpose:

RBAC roles.

```sql
id UUID PK

name VARCHAR(100)

description TEXT

created_at TIMESTAMP
```

Examples:

* Admin
* Compliance Officer
* Legal Officer
* Auditor
* Executive Viewer

---

# TABLE: users

Purpose:

System users.

```sql
id UUID PK

organization_id UUID FK

role_id UUID FK

first_name VARCHAR(100)

last_name VARCHAR(100)

email VARCHAR(255) UNIQUE

status VARCHAR(50)

created_at TIMESTAMP

updated_at TIMESTAMP
```

Status:

* Active
* Inactive

---

# TABLE: regulations

Purpose:

Master regulation record.

```sql
id UUID PK

organization_id UUID FK

regulation_code VARCHAR(100)

title VARCHAR(500)

source VARCHAR(100)

source_type VARCHAR(100)

risk_level VARCHAR(50)

publication_date DATE

status VARCHAR(50)

created_by UUID FK

created_at TIMESTAMP

updated_at TIMESTAMP
```

Status:

* Active
* Archived
* Superseded

---

# TABLE: regulation_versions

Purpose:

Version history.

```sql
id UUID PK

regulation_id UUID FK

version_number INTEGER

version_label VARCHAR(100)

document_path TEXT

effective_date DATE

created_at TIMESTAMP
```

Examples:

Version 1

Version 2

Version 3

---

# TABLE: documents

Purpose:

Uploaded files.

```sql
id UUID PK

regulation_version_id UUID FK

file_name VARCHAR(255)

file_type VARCHAR(50)

file_size BIGINT

storage_path TEXT

uploaded_by UUID FK

uploaded_at TIMESTAMP
```

Supported:

* PDF
* DOCX

---

# TABLE: clauses

Purpose:

Store extracted clauses.

```sql
id UUID PK

regulation_version_id UUID FK

clause_number VARCHAR(100)

title VARCHAR(500)

content TEXT

created_at TIMESTAMP
```

Examples:

Clause 4.1

Clause 4.2

Clause 5.3

---

# TABLE: changes

Purpose:

Store detected changes.

```sql
id UUID PK

regulation_id UUID FK

old_clause_id UUID FK

new_clause_id UUID FK

change_type VARCHAR(50)

severity VARCHAR(50)

summary TEXT

created_at TIMESTAMP
```

Change Types:

* Added
* Modified
* Removed

Severity:

* Low
* Medium
* High
* Critical

---

# TABLE: impact_assessments

Purpose:

Store impact analysis.

```sql
id UUID PK

change_id UUID FK

department VARCHAR(100)

impact_score INTEGER

priority VARCHAR(50)

recommendation TEXT

created_at TIMESTAMP
```

Departments:

* Compliance
* Legal
* Operations
* IT
* Cybersecurity
* Audit

Priority:

* Low
* Medium
* High
* Critical

---

# TABLE: maps

Purpose:

Measurable Action Points.

```sql
id UUID PK

impact_assessment_id UUID FK

regulation_id UUID FK

title VARCHAR(500)

description TEXT

department VARCHAR(100)

owner_id UUID FK

severity VARCHAR(50)

status VARCHAR(50)

due_date DATE

completed_at TIMESTAMP NULL

created_at TIMESTAMP

updated_at TIMESTAMP
```

Status:

* Pending
* Assigned
* In Progress
* Review
* Completed

---

# TABLE: findings

Purpose:

Audit findings.

```sql
id UUID PK

regulation_id UUID FK

title VARCHAR(500)

description TEXT

severity VARCHAR(50)

status VARCHAR(50)

created_at TIMESTAMP
```

Severity:

* Low
* Medium
* High
* Critical

Status:

* Open
* Closed

---

# TABLE: audit_readiness

Purpose:

Readiness snapshots.

```sql
id UUID PK

organization_id UUID FK

readiness_score NUMERIC(5,2)

completed_maps INTEGER

total_maps INTEGER

open_findings INTEGER

critical_findings INTEGER

generated_at TIMESTAMP
```

Readiness snapshots should be historical.

Never overwrite.

Always create new records.

---

# TABLE: reports

Purpose:

Generated reports.

```sql
id UUID PK

organization_id UUID FK

report_type VARCHAR(100)

title VARCHAR(500)

generated_by UUID FK

file_path TEXT

generated_at TIMESTAMP
```

Report Types:

* Executive
* Compliance
* Risk
* Audit
* Department

---

# TABLE: notifications

Purpose:

User alerts.

```sql
id UUID PK

user_id UUID FK

title VARCHAR(255)

message TEXT

severity VARCHAR(50)

is_read BOOLEAN

created_at TIMESTAMP
```

---

# TABLE: audit_logs

Purpose:

System audit trail.

```sql
id UUID PK

user_id UUID FK

entity_type VARCHAR(100)

entity_id UUID

action VARCHAR(100)

description TEXT

created_at TIMESTAMP
```

Examples:

* Regulation Created
* MAP Assigned
* Report Generated

Audit logs are immutable.

---

# RELATIONSHIPS

Organization

```text
Organization
├── Users
├── Regulations
├── Reports
└── Audit Readiness
```

---

Regulation Chain

```text
Regulation
│
├── Regulation Versions
│
├── Documents
│
├── Clauses
│
├── Changes
│
├── Impact Assessments
│
├── MAPs
│
└── Findings
```

---

Compliance Workflow Chain

```text
Regulation
↓
Version
↓
Clause
↓
Change
↓
Impact Assessment
↓
MAP
↓
Audit Readiness
```

This relationship chain must never be broken.

---

# INDEXING STRATEGY

Required indexes:

```sql
regulations(source)

regulations(status)

regulations(risk_level)

changes(change_type)

changes(severity)

impact_assessments(department)

maps(status)

maps(owner_id)

maps(due_date)

findings(status)

audit_logs(entity_type)
```

---

# SOFT DELETE POLICY

Allowed:

```sql
status = Archived
```

Not Allowed:

```sql
DELETE FROM regulations
```

Historical compliance records must be preserved.

---

# AUDITABILITY REQUIREMENTS

The database must always answer:

1. Which regulation created this MAP?

2. Which clause changed?

3. Which department was impacted?

4. Why was this action generated?

5. What was the readiness score at that time?

Traceability is mandatory.

---

# MVP TABLES

Required:

* organizations
* roles
* users
* regulations
* regulation_versions
* documents
* clauses
* changes
* impact_assessments
* maps
* findings
* audit_readiness
* reports
* audit_logs

Optional MVP:

* notifications

---

# DATABASE PRINCIPLES

1. Preserve historical records.

2. Prefer relational integrity.

3. Never lose traceability.

4. Every MAP must reference a regulation.

5. Every change must reference clauses.

6. Every impact assessment must reference a change.

7. Audit readiness must be reproducible.

8. Preserve Regulation → Action → Proof.
