from fastapi import APIRouter
from app.api.endpoints import (
    maps, 
    regulations, 
    documents, 
    comparisons, 
    dashboard, 
    audit_logs, 
    notifications, 
    copilot, 
    reports
)

api_router = APIRouter()

api_router.include_router(maps.router)
api_router.include_router(regulations.router)
api_router.include_router(documents.router)
api_router.include_router(comparisons.router)
api_router.include_router(dashboard.router)
api_router.include_router(audit_logs.router)
api_router.include_router(notifications.router)
api_router.include_router(copilot.router)
api_router.include_router(reports.router)
