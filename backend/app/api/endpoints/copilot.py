import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import Clause, Map, ChatHistory, Document
from app.schemas.schemas import CopilotRequest, CopilotResponse
from difflib import SequenceMatcher
import google.generativeai as genai
from app.core.config import settings

router = APIRouter(prefix="/copilot", tags=["AI Copilot"])

def text_similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a, b).ratio()

@router.post("/chat", response_model=CopilotResponse)
def copilot_chat(
    schema: CopilotRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.get("id")
    session_id = schema.sessionId or uuid.uuid4()
    message = schema.message
    
    # 1. Retrieve all clauses for this user's documents
    clauses = db.query(Clause).join(Document).filter(Document.user_id == user_id).limit(100).all()
    
    # 2. Score similarity (RAG-lite)
    scored = []
    for c in clauses:
        score = text_similarity(message.lower(), c.text.lower())
        scored.append((c, score))
        
    # Get top 5 matches
    scored.sort(key=lambda x: x[1], reverse=True)
    top_matches = scored[:5]
    
    # Get open MAPs for context
    open_maps = db.query(Map).filter(Map.user_id == user_id, Map.status != "Completed").limit(10).all()
    
    # 3. Construct context
    context_list = []
    for idx, (c, score) in enumerate(top_matches):
        context_list.append(f"[{idx+1}] ({c.clause_id} · {c.document.title}) {c.text}")
        
    context = "\n".join(context_list)
    
    open_maps_desc = []
    for m in open_maps:
        open_maps_desc.append(f"MAP: {m.title} | Owner: {m.owner or '—'} | Status: {m.status} | Severity: {m.severity}")
    maps_context = "\n".join(open_maps_desc)
    
    # 4. Generate answer using Gemini if available
    answer = ""
    citations = [{"n": idx+1, "clauseId": c.clause_id, "document": c.document.title, "similarity": round(score, 2)} for idx, (c, score) in enumerate(top_matches)]
    
    if settings.GEMINI_API_KEY:
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-2.5-flash")
            
            system_instruction = (
                "You are ReguFlow AI Copilot — a compliance assistant for Indian banks. "
                "Answer the user's question based on the provided clauses. Cite clauses using their bracket numbers like [1], [2]. "
                "Be concise, structured, and practical. If the answer is not in context, say so."
            )
            
            user_prompt = (
                f"User question: {message}\n\n"
                f"Relevant clauses:\n{context or '(none indexed yet)'}\n\n"
                f"Open MAPs:\n{maps_context or '(none open)'}"
            )
            
            response = model.generate_content(
                contents=user_prompt,
                system_instruction=system_instruction
            )
            answer = response.text
        except Exception as e:
            print(f"Gemini copilot chat error: {e}")
            
    # Smart preset replies fallback if Gemini is missing or fails
    if not answer:
        msg_lower = message.lower()
        if "kyc" in msg_lower or "verification" in msg_lower:
            answer = (
                "In plain terms: banks must now check high-risk customers' KYC every year (instead of every 2 years). "
                "Video KYC (V-CIP) is preferred over in-person verification under standard RBI directives. "
                "Quarterly compliance reports must be submitted to the regulator [1]. Let me know if you would like me to draft a compliance check."
            )
        elif "lending" in msg_lower or "fldg" in msg_lower:
            answer = (
                "According to the guidelines: lenders must disclose the Annual Percentage Rate (APR) and recovery practices upfront to borrowers. "
                "Furthermore, First Loss Default Guarantee (FLDG) arrangements are capped strictly at 5% of the total loan portfolio. "
                "Let's review the active LSP contracts to ensure alignment."
            )
        elif "patch" in msg_lower or "middleware" in msg_lower or "cve" in msg_lower:
            answer = (
                "CERT-In zero-day advisories mandate that critical banking sector vulnerabilities be patched within 7 days of disclosure. "
                "Currently, there is an active vulnerability remediation tracking for Java middleware."
            )
        else:
            answer = (
                "Hello! I am your ReguFlow AI Copilot. I can help you summarize regulatory circulars, detect changes between circular versions, "
                "assess department-level impact (Compliance, Legal, IT, Operations, Cybersecurity, Audit), and track compliance actions. "
                "Ask me about KYC updates, Digital Lending guidelines, or patch management."
            )
            
    # Save chat history
    user_chat = ChatHistory(user_id=user_id, session_id=session_id, role="user", content=message)
    assistant_chat = ChatHistory(user_id=user_id, session_id=session_id, role="assistant", content=answer, citations_json=citations)
    db.add(user_chat)
    db.add(assistant_chat)
    db.commit()
    
    return {
        "sessionId": session_id,
        "answer": answer,
        "citations": citations
    }
