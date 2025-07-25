# 🚀 Job Portal Web Application

A full-featured **Job Portal Web App** built with **React.js**, **Firebase**, and **Framer Motion** that allows users to create and manage their professional profiles, browse and apply for jobs, and track their job applications in a seamless, interactive interface.

---

## 🌟 Features

* 🔐 **Authentication** using Firebase (Email/Password & Google Sign-In)
* 👤 **Persistent User Profiles** (Name, Company, Experience, CTC, Skills) stored in **Firestore**
* 📄 **Job Applications Tracker** — users can view the jobs they've applied for
* ✏️ **Edit & Save Profile Details** with real-time feedback
* 🎨 **Modern, Responsive UI** inspired by top job portals like Naukri.com
* ⚡ **Framer Motion Animations** for smooth transitions
* 🌐 **Backend Integration** for real-time profile and job data
* 🤖 **Resume Upload & AI Job Suggestions** using FastAPI + LM Studio

---

## 🛠 Tech Stack

* **Frontend:** React.js, Tailwind CSS, Framer Motion, Lucide Icons
* **Backend:** Firebase Auth, Firestore, Node.js Cloud Functions
* **AI Microservice:** Python FastAPI + Local LLM (Gemma 7B, Zephyr, etc.)
* **AI Serving:** LM Studio (for local LLM inference)
* **Deployment:** Firebase Hosting + Render/Fly.io (for FastAPI)

---

## 🚧 How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/job-portal.git
cd job-portal
```

---

### 2. Set up Frontend

```bash
cd vite-project
npm install
```

Add your Firebase config in `.env`:

```env
VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_auth_domain
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_storage_bucket
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_app_id
```

Start the app:

```bash
npm run dev
```

---

### 3. Set up FastAPI Server (Resume Parser)

```bash
cd backend  # folder with resume_analyzer.py
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

Start FastAPI server:

```bash
uvicorn resume_analyzer:app --reload
```

> Default runs at: `http://127.0.0.1:8000/analyze`

---

### 4. Setup LM Studio for Local LLM

1. **Download LM Studio:** https://lmstudio.ai
2. **Load a Model** i have used openchat_3.5 (e.g. Gemma 7B, Zephyr 7B)
3. **Enable API Server:**
   - Go to ⚙️ Settings → Enable "OpenAI Compatible API"
   - Set server to run on `localhost:1234`

4. **Verify it’s working:**

```bash
curl http://localhost:1234/v1/models
```

---

### 5. Connect Frontend to FastAPI

Make sure your frontend sends a request to:

```bash
http://localhost:8000/analyze
```

(Used in ResumeUpload → FastAPI → LM Studio → Filtered Jobs from Firebase Fucntions) 


---
