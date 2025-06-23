const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const mockDataRaw = require("./MOCK_DATA.json");

const app = express();
app.use(cors({ origin: true }));

// Add ID and custom logo for each job
const mockData = mockDataRaw.map((job, index) => ({
  id: index + 1,
  ...job,
  image: `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company_name)}&background=random&rounded=true&size=256`,
}));

// All jobs
app.get("/jobs", (req, res) => {
  res.status(200).json(mockData);
});

// Job by ID
app.get("/job/:id", (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  const job = mockData.find((j) => j.id === jobId);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.status(200).json(job);
});

exports.api = functions.https.onRequest(app);
