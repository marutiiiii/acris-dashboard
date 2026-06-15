import os
import json
import uuid
from datetime import datetime, date, timedelta
from difflib import SequenceMatcher
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import Document, Clause, Comparison, Map, AuditLog
from app.schemas.schemas import ComparisonRequest
import google.generativeai as genai
from app.core.config import settings

router = APIRouter(prefix="/comparisons", tags=["Document Comparisons"])

DEPARTMENTS = ["Compliance", "Legal", "Operations", "IT", "Cybersecurity", "Audit"]

def calculate_similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a, b).ratio()

@router.post("")
def compare_documents(
    schema: ComparisonRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.get("id")
    
    # Verify documents exist
    old_doc = db.query(Document).filter(Document.id == schema.oldDocumentId, Document.user_id == user_id).first()
    new_doc = db.query(Document).filter(Document.id == schema.newDocumentId, Document.user_id == user_id).first()
    
    if not old_doc or not new_doc:
        raise HTTPException(status_code=404, detail="One or both documents not found")
        
    old_clauses = db.query(Clause).filter(Clause.document_id == schema.oldDocumentId).all()
    new_clauses = db.query(Clause).filter(Clause.document_id == schema.newDocumentId).all()
    
    if not old_clauses or not new_clauses:
        raise HTTPException(status_code=400, detail="Both documents must have extracted clauses before comparison")
        
    added = []
    removed = []
    modified = []
    
    matched_new_indices = set()
    
    # Compare clauses using a sequence matcher (or cosine similarity if embeddings were populated)
    # Since mock embeddings are identical, we use SequenceMatcher for accurate textual comparisons
    for oc in old_clauses:
        best_match_idx = -1
        best_score = 0.0
        
        for idx, nc in enumerate(new_clauses):
            if idx in matched_new_indices:
                continue
            # Check similarity
            score = calculate_similarity(oc.text, nc.text)
            if score > best_score:
                best_score = score
                best_match_idx = idx
                
        if best_match_idx >= 0 and best_score >= 0.70:
            matched_new_indices.add(best_match_idx)
            nc = new_clauses[best_match_idx]
            if oc.text.strip() != nc.text.strip():
                modified.append({
                    "id": nc.clause_id,
                    "oldText": oc.text,
                    "newText": nc.text,
                    "category": nc.category,
                    "severity": nc.severity,
                    "similarity": round(best_score, 2)
                })
        else:
            removed.append({
                "id": oc.clause_id,
                "text": oc.text,
                "category": oc.category
            })
            
    for idx, nc in enumerate(new_clauses):
        if idx not in matched_new_indices:
            added.append({
                "id": nc.clause_id,
                "text": nc.text,
                "category": nc.category,
                "severity": nc.severity
            })
            
    result_json = {
        "added": added,
        "removed": removed,
        "modified": modified,
        "counts": {
            "added": len(added),
            "removed": len(removed),
            "modified": len(modified)
        }
    }
    
    # Save comparison
    db_cmp = Comparison(
        user_id=user_id,
        old_document_id=schema.oldDocumentId,
        new_document_id=schema.newDocumentId,
        result_json=result_json
    )
    db.add(db_cmp)
    db.commit()
    db.refresh(db_cmp)
    
    # Audit log
    log = AuditLog(
        user_id=user_id,
        entity_type="Comparison",
        entity_id=db_cmp.id,
        action="Document Compared",
        description=f"Compared '{old_doc.title}' with '{new_doc.title}'. Detected {len(added)} added, {len(removed)} removed, and {len(modified)} modified clauses."
    )
    db.add(log)
    db.commit()
    
    return {
        "comparisonId": db_cmp.id,
        "added": added,
        "removed": removed,
        "modified": modified,
        "counts": result_json["counts"]
    }

@router.post("/{comparison_id}/impact")
def generate_impact_analysis(
    comparison_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.get("id")
    cmp = db.query(Comparison).filter(Comparison.id == comparison_id, Comparison.user_id == user_id).first()
    if not cmp:
        raise HTTPException(status_code=404, detail="Comparison not found")
        
    res_json = cmp.result_json
    changes = []
    for c in res_json.get("added", []):
        changes.append({"id": c["id"], "text": c["text"], "type": "added", "category": c.get("category")})
    for c in res_json.get("modified", []):
        changes.append({"id": c["id"], "text": c["newText"], "type": "modified", "category": c.get("category")})
    for c in res_json.get("removed", []):
        changes.append({"id": c["id"], "text": c["text"], "type": "removed", "category": c.get("category")})
        
    changes = changes[:25] # Cap size
    
    matrix = []
    per_clause = []
    
    # Generate impact matrix using Gemini if available
    if settings.GEMINI_API_KEY and changes:
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-2.5-flash")
            
            prompt = (
                f"You assess departmental impact of regulatory clause changes. Departments: {', '.join(DEPARTMENTS)}. "
                "For each clause, return impact scores 0-100 across all 6 departments and a one-line reason for the highest-scoring one. "
                "Return strict JSON matching this structure: { \"items\": [{ \"clauseId\": \"...\", \"scores\": { \"Compliance\": 80, ... }, \"primary\": \"Compliance\", \"reason\": \"...\" }] }"
            )
            
            response = model.generate_content(
                contents=json.dumps({"changes": changes}),
                generation_config={"response_mime_type": "application/json"},
                system_instruction=prompt
            )
            parsed = json.loads(response.text)
            per_clause = parsed.get("items", [])
        except Exception as e:
            print(f"Gemini impact analysis error: {e}")
            
    # Fallback/Default impact scoring logic
    if not per_clause:
        for c in changes:
            # Smart default scoring based on category
            category = (c.get("category") or "Other").upper()
            scores = {d: 10 for d in DEPARTMENTS}
            
            if "CYBER" in category or "SECURITY" in category:
                scores["Cybersecurity"] = 90
                scores["IT"] = 80
                scores["Compliance"] = 70
                primary = "Cybersecurity"
                reason = "Clause mandates immediate security incident disclosures and SLAs."
            elif "KYC" in category or "AML" in category:
                scores["Compliance"] = 95
                scores["Operations"] = 85
                scores["Legal"] = 60
                primary = "Compliance"
                reason = "Annual review cadence change directly impacts compliance monitoring cycles."
            elif "REPORT" in category:
                scores["Compliance"] = 80
                scores["IT"] = 75
                scores["Operations"] = 70
                primary = "Compliance"
                reason = "Quarterly regulatory reports require automated IT pipeline setup."
            else:
                scores["Compliance"] = 65
                scores["Legal"] = 60
                primary = "Compliance"
                reason = "Clause updates general regulatory requirements for compliance and legal SOPs."
                
            per_clause.append({
                "clauseId": c["id"],
                "scores": scores,
                "primary": primary,
                "reason": reason
            })
            
    # Aggregate matrix scores
    agg = {d: {"sum": 0, "count": 0, "reasons": []} for d in DEPARTMENTS}
    for item in per_clause:
        for d in DEPARTMENTS:
            score = item["scores"].get(d, 0)
            agg[d]["sum"] += score
            agg[d]["count"] += 1
        prim = item["primary"]
        if prim in agg:
            agg[prim]["reasons"].append(item["reason"])
            
    for d in DEPARTMENTS:
        a = agg[d]
        impact = round(a["sum"] / a["count"]) if a["count"] > 0 else 0
        risk = "High" if impact >= 75 else "Medium" if impact >= 45 else "Low"
        priority = "P1" if impact >= 75 else "P2" if impact >= 45 else "P3"
        action = a["reasons"][0] if a["reasons"] else f"Review impacted clauses and update {d} SOPs."
        
        matrix.append({
            "department": d,
            "impact": impact,
            "risk": risk,
            "priority": priority,
            "action": action
        })
        
    return {"matrix": matrix, "perClause": per_clause}

@router.post("/{comparison_id}/generate-maps")
def generate_maps_from_comparison(
    comparison_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.get("id")
    cmp = db.query(Comparison).filter(Comparison.id == comparison_id, Comparison.user_id == user_id).first()
    if not cmp:
        raise HTTPException(status_code=404, detail="Comparison not found")
        
    res_json = cmp.result_json
    changes = []
    for c in res_json.get("added", []):
        changes.append({"id": c["id"], "text": c["text"], "type": "added", "severity": c.get("severity", "Medium")})
    for c in res_json.get("modified", []):
        changes.append({"id": c["id"], "text": c["newText"], "type": "modified", "severity": c.get("severity", "Medium")})
        
    changes = changes[:25] # Cap size
    
    maps_data = []
    
    # Generate maps using Gemini if available
    if settings.GEMINI_API_KEY and changes:
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-2.5-flash")
            
            prompt = (
                "You convert regulatory clause changes into Mitigation Action Points (MAPs) for a bank. "
                "For each clause produce one task. Owners must be one of: "
                "Compliance Team, Legal Team, Operations Team, IT Team, Cybersecurity Team, Audit Team. "
                "Severity: Low|Medium|High|Critical. Deadline: ISO date within the next 7-90 days from today. "
                "Return strict JSON matching this structure: { \"maps\": [{ \"clauseRef\": \"C001\", \"title\": \"...\", \"description\": \"...\", \"owner\": \"...\", \"severity\": \"...\", \"deadline\": \"YYYY-MM-DD\" }] }"
            )
            
            today_str = date.today().isoformat()
            response = model.generate_content(
                contents=f"Today is {today_str}.\n\nChanges:\n{json.dumps(changes)}",
                generation_config={"response_mime_type": "application/json"},
                system_instruction=prompt
            )
            parsed = json.loads(response.text)
            maps_data = parsed.get("maps", [])
        except Exception as e:
            print(f"Gemini MAP generation error: {e}")
            
    # Fallback maps generator
    if not maps_data:
        for idx, c in enumerate(changes):
            sev = c.get("severity", "Medium")
            # Map severity to departments and owners
            if sev == "Critical":
                owner = "Cybersecurity Team"
                title = f"Remediate SLA compliance for {c['id']}"
                desc = f"Configure immediate compliance controls and logging for clause: {c['text'][:150]}..."
                days = 7
            elif sev == "High":
                owner = "Compliance Team"
                title = f"Establish SOP controls for {c['id']}"
                desc = f"Update and verify operating procedures to satisfy standard requirement: {c['text'][:150]}..."
                days = 15
            else:
                owner = "Operations Team"
                title = f"Review operational impact of {c['id']}"
                desc = f"Conduct standard review of operations for clause: {c['text'][:150]}..."
                days = 30
                
            maps_data.append({
                "clauseRef": c["id"],
                "title": title,
                "description": desc,
                "owner": owner,
                "severity": sev,
                "deadline": (date.today() + timedelta(days=days)).isoformat()
            })
            
    # Save generated maps in the DB
    saved_maps = []
    for m in maps_data:
        # Convert date string to date object
        deadline_date = None
        if m.get("deadline"):
            try:
                deadline_date = datetime.strptime(m["deadline"], "%Y-%m-%d").date()
            except ValueError:
                deadline_date = date.today() + timedelta(days=30)
                
        db_map = Map(
            user_id=user_id,
            comparison_id=comparison_id,
            clause_ref=m.get("clauseRef"),
            title=m.get("title", "Untitled task"),
            description=m.get("description", ""),
            owner=m.get("owner", "Compliance Team"),
            severity=m.get("severity", "Medium"),
            status="Pending",
            deadline=deadline_date
        )
        db.add(db_map)
        saved_maps.append(db_map)
        
    db.commit()
    
    # Audit log
    log = AuditLog(
        user_id=user_id,
        entity_type="Comparison",
        entity_id=comparison_id,
        action="MAPs Generated",
        description=f"Generated {len(saved_maps)} MAP tasks for comparison: {comparison_id}."
    )
    db.add(log)
    db.commit()
    
    # Refresh all saved maps
    for sm in saved_maps:
        db.refresh(sm)
        
    return {"count": len(saved_maps), "maps": saved_maps}
