from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pdfminer.high_level import extract_text
import tempfile
import requests
import json
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_resume(resume: UploadFile = File(...)):
    try:
        # Save uploaded PDF to temp file
        contents = await resume.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        # Extract text
        resume_text = extract_text(tmp_path)
        if not resume_text or len(resume_text.strip()) < 50:
            return JSONResponse(status_code=400, content={"error": "Resume is empty or unparseable."})

        # Prepare prompt for LLM
        prompt = f"""
                You are an expert resume analyzer.
                Extract:
                - A flat list of 5–10 top skills (strings only)
                - A flat list of 5 suggested job roles (strings only)

                Resume:
                {resume_text.strip()[:4000]}

                Respond ONLY in raw JSON object format like:
                {{
                  "skills": ["React", "Redux", "TypeScript"],
                  "suggested_jobs": ["Frontend Developer", "Full Stack Developer"]
                }}
                """


        # LM Studio API call
        response = requests.post("http://localhost:1234/v1/chat/completions", json={
            "model": "lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF",  # Replace with your actual model
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.5
        })

        if response.status_code != 200:
            return JSONResponse(status_code=500, content={"error": "LLM failed", "details": response.text})

        ai_text = response.json()["choices"][0]["message"]["content"]

        # ✅ Extract JSON from formatted LLM output
        try:
            json_match = re.search(r"\{[\s\S]*?\}", ai_text)

            if json_match:
                parsed = json.loads(json_match.group())
            else:
                raise ValueError("No valid JSON found in LLM response.")
        except Exception as e:
            return JSONResponse(status_code=500, content={
                "error": "Failed to parse LLM response",
                "raw": ai_text,
                "details": str(e)
            })

                # Fetch matched jobs from Firebase /jobs endpoint
        firebase_jobs_url = "https://api-am5r376q7a-el.a.run.app/jobs"  # 🔁 replace this with your deployed URL

        matched_jobs = []
        for job_title in parsed.get("suggested_jobs", []):
            try:
                res = requests.get(firebase_jobs_url, params={"role": job_title})
                if res.status_code == 200:
                    jobs = res.json()
                    for job in jobs:
                        if job not in matched_jobs:
                            matched_jobs.append(job)
            except Exception as fetch_err:
                print(f"Error fetching jobs for {job_title}: {fetch_err}")

        # ✅ Final response with everything
        return {
            "skills": parsed.get("skills", []),
            "suggested_jobs": parsed.get("suggested_jobs", []),
            "matched_jobs": matched_jobs
        }


    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
