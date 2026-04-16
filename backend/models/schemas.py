from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


# ── Auth ─────────────────────────────────────────────────────────────────────

class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str


# ── Resume ────────────────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    job_description: str
    resume_storage_path: str
    resume_filename: str

class AnalysisResult(BaseModel):
    match_score: int
    missing_keywords: List[str]
    strengths: List[str]
    suggestions: List[str]
    summary: str

class AnalysisResponse(BaseModel):
    id: str
    user_id: str
    created_at: datetime
    resume_filename: str
    resume_storage_path: str
    job_description: str
    match_score: int
    missing_keywords: List[str]
    strengths: List[str]
    suggestions: List[str]
    summary: str

class UploadResponse(BaseModel):
    storage_path: str
    filename: str
    message: str