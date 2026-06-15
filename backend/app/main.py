import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.router import api_router

# Initialize database schema on startup
from app.core.database import engine, Base, SessionLocal
from app.models import models
from app.models.models import Regulation
from datetime import datetime

Base.metadata.create_all(bind=engine)

# Seed default regulations if database is empty
db = SessionLocal()
try:
    if db.query(Regulation).count() == 0:
        seed_regs = [
            Regulation(
                source="RBI",
                title="Master Direction on Digital Lending Guidelines",
                date=datetime.strptime("2026-05-15", "%Y-%m-%d").date(),
                link="https://rbi.org.in",
                summary="Sets out mandatory disclosure norms for Digital Lending Apps (DLAs), First Loss Default Guarantee (FLDG) caps, and customer grievance mechanisms."
            ),
            Regulation(
                source="RBI",
                title="Master Direction on KYC (Amendment 2026)",
                date=datetime.strptime("2026-04-08", "%Y-%m-%d").date(),
                link="https://rbi.org.in",
                summary="Shifts high-risk customer CDD from biennial to annual cadence; elevates V-CIP from permissive to preferred."
            ),
            Regulation(
                source="SEBI",
                title="LODR Amendment — Materiality Threshold",
                date=datetime.strptime("2026-04-04", "%Y-%m-%d").date(),
                link="https://sebi.gov.in",
                summary="Lowers materiality threshold for event disclosures under Regulation 30, increasing the frequency of mandatory disclosures."
            )
        ]
        db.add_all(seed_regs)
        db.commit()
finally:
    db.close()

# Create storage directories locally on startup
os.makedirs(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "storage", "documents"), exist_ok=True)
os.makedirs(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "storage", "reports"), exist_ok=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev/hackathon local deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Mount local storage folder to serve documents and reports
storage_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "storage")
app.mount("/storage", StaticFiles(directory=storage_path), name="storage")

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}

@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
def api_health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
