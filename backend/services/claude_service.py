import anthropic
import json
from fastapi import HTTPException
from config import settings
from models.schemas import AnalysisResult

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

SYSTEM_PROMPT = """You are an expert recruitment consultant and career coach with 15+ years of experience.
Your job is to analyze a candidate's resume against a specific job description and provide actionable, 
honest feedback to help them improve their chances.

You MUST respond with valid JSON only — no markdown, no explanation outside the JSON.
"""

ANALYSIS_PROMPT = """Analyze the following resume against the job description.

JOB DESCRIPTION:
{job_description}

RESUME:
{resume_text}

Return a JSON object with exactly these fields:
{{
  "match_score": <integer 0-100 representing overall fit>,
  "missing_keywords": [<list of important keywords/skills from the JD missing in the resume>],
  "strengths": [<list of 3-5 things the candidate does well relative to this role>],
  "suggestions": [<list of 3-5 specific, actionable improvements the candidate should make>],
  "summary": "<2-3 sentence overall assessment of the candidate's fit for this role>"
}}

Be specific and honest. The match_score should reflect true fit, not just keyword overlap.
"""


def analyze_resume(resume_text: str, job_description: str) -> AnalysisResult:
    try:
        message = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1500,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": ANALYSIS_PROMPT.format(
                        job_description=job_description,
                        resume_text=resume_text
                    )
                }
            ]
        )

        raw_response = message.content[0].text
        clean = raw_response.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        data = json.loads(clean)

        return AnalysisResult(
            match_score=int(data["match_score"]),
            missing_keywords=data.get("missing_keywords", []),
            strengths=data.get("strengths", []),
            suggestions=data.get("suggestions", []),
            summary=data.get("summary", "")
        )

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")
    except anthropic.APIError as e:
        raise HTTPException(status_code=502, detail=f"Claude API error: {str(e)}")