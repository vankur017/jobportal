# resume_analyzer.py
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import pdfminer
from pdfminer.high_level import extract_text
import tempfile


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to Firebase domain
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_resume(resume: UploadFile = File(...)):
    try:
        contents = await resume.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        text = extract_text(tmp_path)
        if not text or len(text.strip()) < 50:
            return JSONResponse(status_code=400, content={"error": "Resume is empty or unparseable."})

        # Dummy response: Replace with LLM call or your logic
        return {
            "skills": ["React", "Node.js", "Firebase"],
            "suggested_jobs": ["Frontend Developer", "React Engineer", "Full Stacka Developer"]
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
