from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import Regulation
from app.schemas.schemas import RegulationResponse

router = APIRouter(prefix="/regulations", tags=["Regulations"])

@router.get("", response_model=List[RegulationResponse])
def list_regulations(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Regulation).order_by(Regulation.date.desc()).all()
