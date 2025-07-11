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


app.get("/user/profile/:uid", async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: "User ID (uid) is required." });
  }

  try {
    const doc = await db.collection('userProfiles').doc(uid).get();
    if (doc.exists) {
      res.status(200).json({ exists: true, profile: doc.data() });
    }
    else{
      res.status(200).json({exists: false})
    }
    
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
});

// ✅ POST /user/profile → Create or update user's profile
app.post("/user/profile", async (req, res) => {
  const { uid, name, company, startDate, endDate, currentCTC, expectedCTC, skills, experience } = req.body;

  if (!uid || !name || !Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ error: "Missing required fields: uid, name, skills." });
  }

  const profileData = {
    name,
    company: company || "",
    currentCTC: currentCTC || "",
    expectedCTC: expectedCTC || "",
    startDate: startDate,
    endDate: endDate,
    skills,
    experience: experience || "",
    updatedAt: FieldValue.serverTimestamp(),
  };

  try {
    await db.collection('userProfiles').doc(uid).set(profileData, { merge: true });
    res.status(200).json({ message: "Profile saved successfully." });
  } catch (error) {
    console.error("❌ Error saving profile:", error);
    res.status(500).json({ error: "Failed to save profile." });
  }
});

// // ✅ GET /user/profile/:uid - Get Profile
// app.get("/user/profile/:uid", async (req, res) => {
//   const { uid } = req.params;

//   try {
//     const doc = await db.collection('userProfiles').doc(uid).get();
//     if (!doc.exists) {
//       return res.status(404).json({ error: "Profile not found." });
//     }

//     res.status(200).json(doc.data());
//   } catch (error) {
//     console.error("❌ Error fetching profile:", error);
//     res.status(500).json({ error: "Failed to fetch profile." });
//   }
// });


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
    const { name, mobile, mailId, currentCTC, salaryOffered, expectedCTC, resumeFile, resumeFileName, roleAppliedFor, companyAppliedTo } = req.body;

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
      salaryOffered: salaryOffered,
      resumeUrl,
      createdAt: FieldValue.serverTimestamp(),
      roleAppliedFor: roleAppliedFor?.trim() || "",     
      companyAppliedTo: companyAppliedTo?.trim() || "", 
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

app.get("/user/applications/:mailId", async (req, res) => {
  const { mailId } = req.params;

  if (!mailId) return res.status(400).json({ error: "mailId is required" });

  try {
    const snapshot = await db.collection("applications")
      .where("mailId", "==", mailId.toLowerCase())
      .get();

    const applications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(applications);
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications." });
  }
});

app.get("/user/profile/:uid", async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: "User ID (uid) is required." });
  }

  try {
    const doc = await db.collection('userProfiles').doc(uid).get();
    if (doc.exists) {
      return res.status(200).json({ exists: true, profile: doc.data() });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
});


// ✅ Export API (asia-south1 region)
exports.api = onRequest(app);
