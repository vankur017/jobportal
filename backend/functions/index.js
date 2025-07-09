const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getStorage } = require("firebase-admin/storage");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mockDataRaw = require("./MOCK_DATA.json");

// ✅ Set global deployment options (Region: asia-south1)
setGlobalOptions({ region: 'asia-south1' });

// ✅ Initialize Firebase Admin SDK
initializeApp({
  storageBucket: 'jobportalapi09876.firebasestorage.app',
});

const bucket = getStorage().bucket();
const db = getFirestore();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Multer for file uploads (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Prepare mock job data
const mockData = mockDataRaw.map((job, index) => ({
  id: index + 1,
  ...job,
  image: `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company_name)}&background=random&rounded=true&size=256`,
}));

// ✅ POST /upload-resume (resume only)
app.post("/upload-resume", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileName = `resumes/${Date.now()}-${req.file.originalname}`;
  const file = bucket.file(fileName);

  try {
    await file.save(req.file.buffer, { metadata: { contentType: req.file.mimetype } });
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2030',
    });

    return res.status(200).json({ message: "Resume uploaded", url });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Failed to upload resume" });
  }
});

// ✅ POST /apply (formData + resume + Firestore save)
app.post("/apply", async (req, res) => {
  try {
    const { name, mobile, mailId, currentCTC, expectedCTC, resumeFile, resumeFileName } = req.body;

    if (!name || !mobile || !mailId || !resumeFile || !resumeFileName) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const matches = resumeFile.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Invalid file format." });
    }

    const mimeType = matches[1];
    const fileBuffer = Buffer.from(matches[2], 'base64');
    const fileName = `resumes/${Date.now()}-${resumeFileName}`;
    const file = bucket.file(fileName);

    await file.save(fileBuffer, { metadata: { contentType: mimeType } });
    const [resumeUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2030',
    });

    const newApplication = {
      name: name.trim(),
      mobile: mobile.trim(),
      mailId: mailId.trim().toLowerCase(),
      currentCTC: currentCTC?.trim() || "",
      expectedCTC: expectedCTC?.trim() || "",
      resumeUrl,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("applications").add(newApplication);

    res.status(201).json({ message: "Application submitted successfully", id: docRef.id, resumeUrl });

  } catch (error) {
    console.error("❌ Error saving application:", error);
    res.status(500).json({ error: "Failed to submit application." });
  }
});

// ✅ GET /jobs (with filters)
app.get("/jobs", (req, res) => {
  const { location, role } = req.query;
  let filteredJobs = mockData;

  if (location) {
    filteredJobs = filteredJobs.filter(job =>
      job.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (role) {
    filteredJobs = filteredJobs.filter(job =>
      job.job_title.toLowerCase().includes(role.toLowerCase())
    );
  }

  res.status(200).json(filteredJobs);
});

// ✅ GET /job/:id (single job detail)
app.get("/job/:id", (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  const job = mockData.find((j) => j.id === jobId);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.status(200).json(job);
});

// ✅ Export API (asia-south1 region)
exports.api = onRequest(app);
