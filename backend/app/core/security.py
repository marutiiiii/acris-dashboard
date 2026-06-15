import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    print("DEBUG verify_token: received token:", token)
    
    # Bypass for frontend demo session (mock-access-token)
    if token == "mock-access-token":
        import uuid
        demo_uuid = uuid.UUID("00000000-0000-0000-0000-000000000000")
        print("DEBUG verify_token: matched mock-access-token. returning demo user details.")
        return {
            "sub": demo_uuid,
            "id": demo_uuid,
            "email": "demo@safebank.com",
            "role": "authenticated",
            "user_metadata": {
                "name": "Aarav Mehta",
                "role": "Compliance Officer"
            }
        }
        
    try:
        # Supabase JWTs are typically HS256 signed with the project JWT secret
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False} # Supabase JWT aud varies between 'authenticated' and api targets
        )
        print("DEBUG verify_token: decoded payload:", payload)
        import uuid
        # Standardize sub/id keys
        if "sub" in payload and "id" not in payload:
            payload["id"] = payload["sub"]
        
        # Convert IDs to UUID objects to be compatible with database models
        if "id" in payload:
            try:
                print("DEBUG verify_token: converting id to UUID:", payload["id"])
                payload["id"] = uuid.UUID(str(payload["id"]))
                print("DEBUG verify_token: converted id successfully:", payload["id"], type(payload["id"]))
            except ValueError as ve:
                print("DEBUG verify_token: failed to convert id to UUID:", ve)
                pass
        if "sub" in payload:
            try:
                print("DEBUG verify_token: converting sub to UUID:", payload["sub"])
                payload["sub"] = uuid.UUID(str(payload["sub"]))
                print("DEBUG verify_token: converted sub successfully:", payload["sub"], type(payload["sub"]))
            except ValueError as ve:
                print("DEBUG verify_token: failed to convert sub to UUID:", ve)
                pass
        return payload
    except jwt.PyJWTError as e:
        # Fallback in case of local testing where signature verification might be complex:
        # We try to decode unverified just to see if it's a valid Supabase token, but we default to strict rejection
        try:
            unverified_payload = jwt.decode(token, options={"verify_signature": False})
            # If we decoded it without verification and it has a sub, we might allow it under local testing,
            # but standard security practices say we must reject if signature fails.
            # We reject it.
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token signature verification failed: {str(e)}",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

def get_current_user(payload: dict = Depends(verify_token)) -> dict:
    # Standard helper to return user dictionary
    return payload
