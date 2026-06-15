from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import AuditLog
from app.schemas.schemas import AuditLogResponse

router = APIRouter(prefix="/audit-logs", tags=["Audit History"])

@router.get("", response_model=List[AuditLogResponse])
def get_audit_logs(
    query: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.get("id")
    db_query = db.query(AuditLog).filter(AuditLog.user_id == user_id)
    
    if query:
        # Simple case-insensitive search in action and description
        search = f"%{query}%"
        db_query = db_query.filter(
            (AuditLog.action.ilike(search)) | 
            (AuditLog.description.ilike(search)) |
            (AuditLog.entity_type.ilike(search))
        )
        
    return db_query.order_by(AuditLog.created_at.desc()).all()
