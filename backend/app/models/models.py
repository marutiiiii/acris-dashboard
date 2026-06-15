import uuid
from sqlalchemy import Column, String, Integer, Date, DateTime, Boolean, ForeignKey, Table, Uuid, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Regulation(Base):
    __tablename__ = "regulations"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    source = Column(String(100), nullable=False)
    title = Column(String(500), nullable=False)
    date = Column(Date, nullable=False)
    link = Column(String(500), nullable=True)
    summary = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    findings = relationship("Finding", back_populates="regulation")


class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, nullable=False)  # Maps to auth.users.id
    title = Column(String(255), nullable=False)
    source = Column(String(100), nullable=True)
    file_path = Column(String, nullable=False)
    pages = Column(Integer, nullable=True)
    extracted_text = Column(String, nullable=True)
    status = Column(String(50), nullable=False, default="uploaded")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    clauses = relationship("Clause", back_populates="document", cascade="all, delete-orphan")


class Clause(Base):
    __tablename__ = "clauses"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    document_id = Column(Uuid, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    clause_id = Column(String(100), nullable=False)
    text = Column(String, nullable=False)
    category = Column(String(100), nullable=True)
    obligation = Column(String, nullable=True)
    severity = Column(String(50), nullable=True)
    embedding = Column(String, nullable=True) # Mapped as generic string for raw array retrieval/inserts
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    document = relationship("Document", back_populates="clauses")


class Comparison(Base):
    __tablename__ = "comparisons"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, nullable=False)
    old_document_id = Column(Uuid, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    new_document_id = Column(Uuid, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    result_json = Column(JSON, nullable=False, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    old_document = relationship("Document", foreign_keys=[old_document_id])
    new_document = relationship("Document", foreign_keys=[new_document_id])
    maps = relationship("Map", back_populates="comparison")


class Map(Base):
    __tablename__ = "maps"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, nullable=False)
    comparison_id = Column(Uuid, ForeignKey("comparisons.id", ondelete="SET NULL"), nullable=True)
    clause_ref = Column(String(100), nullable=True)
    title = Column(String(500), nullable=False)
    description = Column(String, nullable=True)
    owner = Column(String(255), nullable=True)
    severity = Column(String(50), nullable=False, default="Medium")
    status = Column(String(50), nullable=False, default="Open")
    deadline = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    comparison = relationship("Comparison", back_populates="maps")


class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, nullable=False)
    type = Column(String(100), nullable=False)
    title = Column(String(500), nullable=True)
    file_path = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ChatHistory(Base):
    __tablename__ = "chat_history"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, nullable=False)
    session_id = Column(Uuid, nullable=False)
    role = Column(String(50), nullable=False)
    content = Column(String, nullable=False)
    citations_json = Column(JSON, nullable=True, default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(Uuid, nullable=True)
    action = Column(String(100), nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(String, nullable=False)
    severity = Column(String(50), nullable=False, default="Medium")
    is_read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Finding(Base):
    __tablename__ = "findings"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    regulation_id = Column(Uuid, ForeignKey("regulations.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(String, nullable=True)
    severity = Column(String(50), nullable=False, default="Medium")
    status = Column(String(50), nullable=False, default="Open")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    regulation = relationship("Regulation", back_populates="findings")
