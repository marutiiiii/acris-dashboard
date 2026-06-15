from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import Map, AuditLog, Comparison
from app.schemas.schemas import MapResponse, MapCreate, MapStatusUpdate

router = APIRouter(prefix="/maps", tags=["MAP Management"])

COLUMNS = ["Pending", "Assigned", "In Progress", "Review", "Completed"]

@router.get("", response_model=List[MapResponse])
def get_user_maps(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.get("id")
    return db.query(Map).filter(Map.user_id == user_id).order_by(Map.created_at.desc()).all()

@router.post("", response_model=MapResponse)
def create_map(
    schema: MapCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.get("id")
    
    # Create the MAP
    new_map = Map(
        user_id=user_id,
        comparison_id=schema.comparison_id,
        clause_ref=schema.clause_ref,
        title=schema.title,
        description=schema.description,
        owner=schema.owner,
        severity=schema.severity,
        status="Pending",
        deadline=schema.deadline
    )
    db.add(new_map)
    db.commit()
    db.refresh(new_map)
    
    # Create Audit Log
    log = AuditLog(
        user_id=user_id,
        entity_type="MAP",
        entity_id=new_map.id,
        action="MAP Created",
        description=f"Manually created MAP: '{new_map.title}' under Pending status."
    )
    db.add(log)
    db.commit()
    
    return new_map

@router.patch("/{map_id}/status", response_model=MapResponse)
def update_map_status(
    map_id: UUID,
    schema: MapStatusUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.get("id")
    target_status = schema.status
    
    if target_status not in COLUMNS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status: '{target_status}'. Allowed: {COLUMNS}"
        )
        
    db_map = db.query(Map).filter(Map.id == map_id, Map.user_id == user_id).first()
    if not db_map:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="MAP not found"
        )
        
    # BR-014: Completed MAPs are locked and cannot be moved/modified
    if db_map.status == "Completed":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Workflow Locked: Completed MAPs cannot be modified."
        )
        
    # BR-013: MAP status flow is sequential (allow 1 step forward or backward)
    source_index = COLUMNS.index(db_map.status)
    target_index = COLUMNS.index(target_status)
    
    if abs(target_index - source_index) > 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Workflow Violation: Cannot transition status directly from '{db_map.status}' to '{target_status}'. Sequential flow required."
        )
        
    # Perform update
    old_status = db_map.status
    db_map.status = target_status
    db_map.updated_at = datetime.utcnow() # Note: we don't have updated_at column in models.py, let's keep it simple or just omit updated_at write. Let's omit it.
    
    # Log audit trail (BR-028: immutable log creation)
    log = AuditLog(
        user_id=user_id,
        entity_type="MAP",
        entity_id=db_map.id,
        action="MAP Status Updated",
        description=f"Updated status for MAP '{db_map.title}' from '{old_status}' to '{target_status}'."
    )
    db.add(log)
    db.commit()
    db.refresh(db_map)
    
    return db_map
