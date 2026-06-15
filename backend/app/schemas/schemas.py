from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import date, datetime
from uuid import UUID

# General Response
class MessageResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[Dict[str, Any]] = None

# Regulations
class RegulationBase(BaseModel):
    source: str
    title: str
    date: date
    link: Optional[str] = None
    summary: Optional[str] = None

class RegulationResponse(RegulationBase):
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

# Documents
class DocumentResponse(BaseModel):
    id: UUID
    title: str
    source: Optional[str] = None
    pages: Optional[int] = None
    status: str
    file_path: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ListDocumentsResponse(BaseModel):
    documents: List[DocumentResponse]

# Clauses
class ClauseResponse(BaseModel):
    id: UUID
    clause_id: str
    text: str
    category: Optional[str] = None
    obligation: Optional[str] = None
    severity: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Comparisons
class ComparisonRequest(BaseModel):
    oldDocumentId: UUID
    newDocumentId: UUID

class ComparisonResponse(BaseModel):
    comparisonId: UUID
    added: List[Dict[str, Any]]
    removed: List[Dict[str, Any]]
    modified: List[Dict[str, Any]]
    counts: Dict[str, int]

# Maps
class MapStatusUpdate(BaseModel):
    status: str

class MapCreate(BaseModel):
    title: str
    description: Optional[str] = None
    owner: Optional[str] = None
    severity: str = "Medium"
    deadline: Optional[date] = None
    clause_ref: Optional[str] = None
    comparison_id: Optional[UUID] = None

class MapResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    owner: Optional[str] = None
    severity: str
    status: str
    deadline: Optional[date] = None
    clause_ref: Optional[str] = None
    comparison_id: Optional[UUID] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Copilot
class CopilotRequest(BaseModel):
    message: str
    sessionId: Optional[UUID] = None

class CopilotResponse(BaseModel):
    sessionId: UUID
    answer: str
    citations: List[Dict[str, Any]]

# Dashboard Metrics
class KpiCardData(BaseModel):
    value: int
    tone: Optional[str] = None
    delta: Optional[int] = None
    trendLabel: Optional[str] = None

class DashboardOverviewResponse(BaseModel):
    score: int
    total: int
    completed: int
    overdue: int
    departments: List[Dict[str, Any]]
    recentActivity: List[Dict[str, Any]]
    insights: List[Dict[str, Any]]
    complianceTrend: List[Dict[str, Any]]
    mapProgress: List[Dict[str, Any]]

# Reports
class ReportRequest(BaseModel):
    type: str

class ReportResponse(BaseModel):
    report: Dict[str, Any]
    signed_url: str

# Audit Logs
class AuditLogResponse(BaseModel):
    id: UUID
    user_id: UUID
    entity_type: str
    entity_id: Optional[UUID] = None
    action: str
    description: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Notifications / Alerts
class NotificationResponse(BaseModel):
    id: UUID
    title: str
    message: str
    severity: str
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
