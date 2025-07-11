import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import { JOBAPI_URL } from "../constants/api";
import SuccessModal from "./SuccessModal";  // Make sure this exists

const ApplyForm = ({ selectedJob }) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    mailId: "",
    currentCTC: "",
    expectedCTC: ""
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const [showForm, setShowForm] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setMessage("");

  if (!resumeFile) {
    setMessage("Please select a resume file.");
    setIsSubmitting(false);
    return;
  }

  try {
    const base64File = await fileToBase64(resumeFile);

    const payload = {
      ...formData,
      resumeFile: base64File,
      resumeFileName: resumeFile.name,
      roleAppliedFor: selectedJob?.job_title || "",      
      companyAppliedTo: selectedJob?.company_name || "", 
      salaryOffered: selectedJob?.salary || ""
    };

    const response = await fetch(`${JOBAPI_URL}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      setMessage(`✅ Application for ${selectedJob?.job_title || "this role"} submitted successfully!`);
      setFormData({
        name: "",
        mobile: "",
        mailId: "",
        currentCTC: "",
        expectedCTC: "",
      });
      setResumeFile(null);
      fileInputRef.current.value = "";
      setShowForm(false);
      setShowSuccess(true);
    } else {
      setMessage(result.error || "❌ Submission failed.");
    }
  } catch (error) {
    console.error("❌ Error:", error);
    setMessage("❌ Something went wrong.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4 py-10">
      <Navbar />

      <AnimatePresence>
        <>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start mt-10"
            >
              {/* Job Card */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={selectedJob?.image}
                    alt="Company Logo"
                    className="w-16 h-16 rounded-lg border border-gray-600 object-cover"
                  />
                  <div>
                    <h1 className="text-xl font-bold">{selectedJob?.job_title}</h1>
                    <p className="text-gray-400">{selectedJob?.company_name}</p>
                    <p className="text-gray-400 text-sm">{selectedJob?.location}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Apply now to be part of {selectedJob?.company_name}'s team as a {selectedJob?.job_title} in {selectedJob?.location}.
                </p>
              </motion.div>

              {/* Application Form */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700 space-y-5"
              >
                <h2 className="text-2xl font-bold mb-4">🚀 Apply for This Role</h2>

                {["name", "mobile", "mailId", "currentCTC", "expectedCTC"].map((field, index) => (
                  <input
                    key={index}
                    type={field === "mailId" ? "email" : "text"}
                    name={field}
                    placeholder={field === "mailId" ? "Email" : field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                ))}

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  ref={fileInputRef}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-semibold ${
                    isSubmitting ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                  } transition duration-300`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>

                {message && <p className="mt-2 text-sm text-yellow-400">{message}</p>}
              </motion.form>
            </motion.div>
          )}

          {showSuccess && (
            <SuccessModal
              onClose={() => {
                setShowSuccess(false);
                setShowForm(true);
              }}
            />
          )}
        </>
      </AnimatePresence>
    </div>
  );
};

export default ApplyForm;
