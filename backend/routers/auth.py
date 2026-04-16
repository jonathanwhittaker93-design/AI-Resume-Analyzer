from fastapi import APIRouter, HTTPException, status, Depends
from models.schemas import SignUpRequest, LoginRequest, TokenResponse
from services.supabase_service import supabase
from utils.auth import create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(body: SignUpRequest):
    try:
        response = supabase.auth.sign_up({
            "email": body.email,
            "password": body.password,
            "options": {
                "data": {"full_name": body.full_name or ""}
            }
        })

        if response.user is None:
            raise HTTPException(status_code=400, detail="Signup failed. Email may already be in use.")

        token = create_access_token({"sub": response.user.id, "email": response.user.email})

        return TokenResponse(
            access_token=token,
            user_id=response.user.id,
            email=response.user.email
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": body.email,
            "password": body.password
        })

        if response.user is None:
            raise HTTPException(status_code=401, detail="Invalid email or password.")

        token = create_access_token({"sub": response.user.id, "email": response.user.email})

        return TokenResponse(
            access_token=token,
            user_id=response.user.id,
            email=response.user.email
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid email or password.")


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {"user_id": current_user["sub"], "email": current_user["email"]}