import pdfplumber
import io
from fastapi import HTTPException


def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            pages_text = []
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text.strip())

        full_text = "\n\n".join(pages_text)

        if not full_text.strip():
            raise HTTPException(
                status_code=422,
                detail="Could not extract text from the PDF. Make sure it is not a scanned image."
            )

        return full_text

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Failed to parse PDF: {str(e)}"
        )