const axios = require("axios");
const FormData = require("form-data");

module.exports = (upload) => [
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const form = new FormData();
      form.append("resume", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const fastapiURL = "http://localhost:8000/analyze"; // Or your deployed FastAPI URL
      const response = await axios.post(fastapiURL, form, {
        headers: form.getHeaders(),
      });

      const aiSuggestions = response.data;

      // You can now match jobs using local /jobs route or mockData
      const mockData = require("./MOCK_DATA.json").map((job, index) => ({
        id: index + 1,
        ...job,
      }));

      const matchedJobs = mockData.filter((job) =>
        aiSuggestions.suggested_jobs.some((title) =>
          job.job_title.toLowerCase().includes(title.toLowerCase())
        )
      );

      return res.status(200).json({
        suggestions: aiSuggestions,
        matched_jobs: matchedJobs,
      });
    } catch (error) {
      console.error("AI Resume Error:", error.message || error);
      return res.status(500).json({ error: "Failed to analyze resume." });
    }
  },
];
