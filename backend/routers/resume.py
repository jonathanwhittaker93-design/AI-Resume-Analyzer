from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status
from typing import List
import uuid

from models.schemas import AnalyzeRequest, AnalysisResponse, UploadResponse
from services.pdf_parser import extract_text_from_pdf
from services.claude_service import analyze_resume
from services.supabase_service import supabase_admin
from utils.auth import get_current_user

router = APIRouter(prefix="/resume", tags=["resume"])

ALLOWED_CONTENT_TYPES = {"application/pdf"}
MAX_FILE_SIZE_MB = 5


@router.post("/upload", response_model=UploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    file_bytes = await file.read()

    if len(file_bytes) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File must be under {MAX_FILE_SIZE_MB}MB.")

    user_id = current_user["sub"]
    filename = f"{uuid.uuid4()}_{file.filename}"
    storage_path = f"{user_id}/{filename}"

    try:
        supabase_admin.storage.from_("resumes").upload(
            path=storage_path,
            file=file_bytes,
            file_options={"content-type": "application/pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

    return UploadResponse(
        storage_path=storage_path,
        filename=file.filename,
        message="Resume uploaded successfully."
    )


@router.post("/analyze", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
async def analyze(
    body: AnalyzeRequest,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["sub"]

    try:
        file_bytes: bytes = supabase_admin.storage.from_("resumes").download(body.resume_storage_path)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Could not retrieve resume: {str(e)}")

    resume_text = extract_text_from_pdf(file_bytes)
    result = analyze_resume(resume_text, body.job_description)

    record = {
        "user_id": user_id,
        "resume_filename": body.resume_filename,
        "resume_storage_path": body.resume_storage_path,
        "job_description": body.job_description,
        "match_score": result.match_score,
        "missing_keywords": result.missing_keywords,
        "strengths": result.strengths,
        "suggestions": result.suggestions,
        "summary": result.summary,
    }

    try:
        db_response = supabase_admin.table("analyses").insert(record).execute()
        saved = db_response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save analysis: {str(e)}")

    return AnalysisResponse(**saved)


@router.get("/analyses", response_model=List[AnalysisResponse])
def get_analyses(current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]

    try:
        response = supabase_admin.table("analyses") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analyses/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(analysis_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]

    try:
        response = supabase_admin.table("analyses") \
            .select("*") \
            .eq("id", analysis_id) \
            .eq("user_id", user_id) \
            .single() \
            .execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Analysis not found.")

        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/analyses/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_analysis(analysis_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]

    try:
        supabase_admin.table("analyses") \
            .delete() \
            .eq("id", analysis_id) \
            .eq("user_id", user_id) \
            .execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))