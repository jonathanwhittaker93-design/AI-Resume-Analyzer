from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, resume

app = FastAPI(
    title="Resume Analyzer API",
    description="AI-powered resume analysis against job descriptions.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-app.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(resume.router)

@app.get("/")
def root():
    return {"status": "ok", "message": "Resume Analyzer API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}