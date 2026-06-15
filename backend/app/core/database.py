import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

logger = logging.getLogger("uvicorn.error")

# Adjust postgres scheme if necessary (e.g. postgres:// to postgresql://)
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

use_sqlite = False
try:
    # Attempt to create the engine and verify connection
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20
    )
    # Ping the database to verify connectivity
    with engine.connect() as conn:
        pass
    logger.info("Connected to PostgreSQL database successfully.")
except Exception as e:
    logger.warning(f"PostgreSQL connection failed ({e}). Falling back to local SQLite database.")
    use_sqlite = True

if use_sqlite:
    backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    sqlite_path = os.path.join(backend_dir, "app.db")
    db_url = f"sqlite:///{sqlite_path}"
    engine = create_engine(
        db_url,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
