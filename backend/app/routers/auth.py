"""
ArthaWire Terminal Access & Authentication Router
Provides institutional access key verification and session management.
"""

import hmac
import hashlib
import time
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    access_key: str

class LoginResponse(BaseModel):
    authenticated: bool
    token: str
    role: str
    display_name: str
    expires_at: int

def generate_token(access_key: str) -> str:
    """Generates a signed, verifiable token based on access key and timestamp."""
    timestamp = str(int(time.time()))
    signature = hmac.new(
        settings.JWT_SECRET.encode(),
        f"{access_key}:{timestamp}".encode(),
        hashlib.sha256
    ).hexdigest()
    return f"AW-{timestamp}-{signature[:24]}"

def verify_token(token: str) -> bool:
    """Verifies that the provided token was signed with the terminal secret."""
    try:
        parts = token.split("-")
        if len(parts) != 3 or parts[0] != "AW":
            return False
        timestamp_str = parts[1]
        signature = parts[2]
        
        # Check token age (valid for 7 days = 604800 seconds)
        token_time = int(timestamp_str)
        if time.time() - token_time > 604800:
            return False
            
        expected_sig = hmac.new(
            settings.JWT_SECRET.encode(),
            f"{settings.TERMINAL_ACCESS_KEY}:{timestamp_str}".encode(),
            hashlib.sha256
        ).hexdigest()[:24]
        
        return hmac.compare_digest(signature, expected_sig)
    except Exception:
        return False

@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    """
    Validates institutional master access key.
    Default key is ARTHA-2026 (or configurable via TERMINAL_ACCESS_KEY).
    """
    provided_key = payload.access_key.strip()
    expected_key = settings.TERMINAL_ACCESS_KEY.strip()

    if not hmac.compare_digest(provided_key, expected_key):
        raise HTTPException(
            status_code=401,
            detail="Invalid Terminal Access Key. Access denied to Dalal Street intelligence desk."
        )

    token = generate_token(expected_key)
    expires_at = int(time.time()) + 604800

    return LoginResponse(
        authenticated=True,
        token=token,
        role="Chief Market Strategist",
        display_name="Authorized Terminal Analyst",
        expires_at=expires_at
    )

@router.get("/verify")
def verify_session(authorization: Optional[str] = Header(None)):
    """Verifies currently held terminal bearer token."""
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization header provided")

    token = authorization.replace("Bearer ", "").strip()
    if not verify_token(token):
        raise HTTPException(status_code=401, detail="Terminal clearance expired or invalid")

    return {
        "authenticated": True,
        "role": "Chief Market Strategist",
        "display_name": "Authorized Terminal Analyst"
    }
