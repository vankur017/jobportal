const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const admin = require("firebase-admin");
const mockDataRaw = require("./MOCK_DATA.json");

admin.initializeApp(); // Initializes with default credentials

const app = express();
app.use(cors({ origin: '*' }));

const mockData = mockDataRaw.map((job, index) => ({
  id: index + 1,
  ...job,
  image: `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company_name)}&background=random&rounded=true&size=256`,
}));

// Multer storage (temporary in memory)
const upload = multer({ storage: multer.memoryStorage() });

// Resume Upload Endpoint
app.post("/upload-resume", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const bucket = admin.storage().bucket();
  const fileName = `resumes/${Date.now()}-${req.file.originalname}`;
  const file = bucket.file(fileName);

  try {
    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });

    // Make the file publicly accessible (optional)
    await file.makePublic();
    const publicUrl = file.publicUrl();

    return res.status(200).json({ message: "Resume uploaded", url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Failed to upload resume" });
  }
});

// Get all jobs
app.get("/jobs", (req, res) => {
  const { location, role } = req.query;

  // Start with all jobs
  let filteredJobs = mockData;

  // Filter by location (if provided)
  if (location) {
    filteredJobs = filteredJobs.filter(job =>
      job.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  // Filter by role (job_title) (if provided)
  if (role) {
    filteredJobs = filteredJobs.filter(job =>
      job.job_title.toLowerCase().includes(role.toLowerCase())
    );
  }

  res.status(200).json(filteredJobs);
});

// Get job by ID
app.get("/job/:id", (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  const job = mockData.find((j) => j.id === jobId);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.status(200).json(job);
});

exports.api = functions.https.onRequest(app);
  `-`