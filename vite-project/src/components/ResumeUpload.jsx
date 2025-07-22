import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { JOBAPI_URL } from '../constants/api';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) {
      setMessage('No file selected');
      setSuccess(false);
      return;
    }
    console.log("Uploading file:", file, file instanceof File);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploading(true);
      setMessage('Uploading...');
      setSuccess(false);
      setAiSuggestions(null); // reset on new upload

      const res = await fetch(`http://localhost:8000/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();

      setMessage('✅ Resume analyzed successfully');
      setSuccess(true);

      // ✅ FIX: Declare parsed before inner try block
      let parsed = data.suggestions;
      try {
        parsed = typeof parsed === 'string'
          ? JSON.parse(parsed)
          : parsed;
      } catch (e) {
        console.warn("AI response is not valid JSON:", e);
      }

      setAiSuggestions(parsed);

    if (onUploadSuccess) {
  const suggestedJobs = parsed?.suggested_jobs || [];
  console.log("📤 Calling onUploadSuccess with:", suggestedJobs);
  onUploadSuccess(suggestedJobs);
}
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('❌ Failed to upload or analyze resume');
      setSuccess(false);
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  return (
    <div className="text-white">
      {/* Upload Box */}
      <div
        {...getRootProps()}
        className={`transition-all duration-300 border-2 border-dashed rounded-2xl p-8 md:p-10 text-center cursor-pointer
        ${
          isDragActive
            ? 'bg-blue-900/20 border-blue-500'
            : 'bg-neutral-900 border-neutral-700 hover:border-blue-400 hover:bg-neutral-800/60'
        }`}
      >
        <input {...getInputProps()} className="hidden" />
        <p className="text-white/90 text-lg">
          {isDragActive
            ? '📂 Drop your resume here'
            : '📄 Drag & drop or click to upload your resume'}
        </p>

        {uploading && (
          <p className="mt-3 text-blue-400 animate-pulse">Analyzing...</p>
        )}
        {message && (
          <p
            className={`mt-3 text-sm ${
              success ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* AI Suggestions Below */}
      {aiSuggestions && (
        <div className="mt-6 bg-neutral-900 border border-neutral-700 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-white/90">🎯 AI Suggested Roles</h3>

          {Array.isArray(aiSuggestions.suggested_jobs) ? (
            <ul className="list-disc list-inside text-blue-300 mb-4">
              {aiSuggestions.suggested_jobs.map((job, idx) => (
                <li key={idx}>{job}</li>
              ))}
            </ul>
          ) : (
            <p className="text-blue-300">{aiSuggestions.suggested_jobs}</p>
          )}

          {Array.isArray(aiSuggestions.skills) && (
            <>
              <h4 className="text-lg font-semibold text-white/80 mt-4 mb-2">🧠 Extracted Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {aiSuggestions.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-800/40 text-blue-200 text-sm rounded-full border border-blue-500"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
