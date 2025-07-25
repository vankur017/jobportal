import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) {
      setMessage('No file selected');
      setSuccess(false);
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploading(true);
      setMessage('Uploading...');
      setSuccess(false);

      // Upload to FastAPI server
      const res = await fetch(`http://localhost:8000/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();

      if (!data || (!data.suggested_jobs && !data.skills)) {
        throw new Error('Invalid response from server');
      }

      // 🔁 Client-side: Fetch matched jobs using suggested roles
      const matchedJobs = [];
      for (const role of data.suggested_jobs || []) {
        try {
          const res = await fetch(
            `https://api-am5r376q7a-el.a.run.app/jobs?role=${encodeURIComponent(role)}`
          );
          if (res.ok) {
            const jobs = await res.json();
            matchedJobs.push(...jobs);
          }
        } catch (err) {
          console.warn(`Error fetching jobs for ${role}`, err);
        }
      }

      // Remove duplicates
      const uniqueJobs = Array.from(new Set(matchedJobs.map((job) => job.id))).map((id) =>
        matchedJobs.find((job) => job.id === id)
      );

      const finalData = {
        suggested_jobs: data?.suggested_jobs || [],
        matched_jobs: uniqueJobs,
        skills: data?.skills || [],
      };

      setMessage('✅ Resume analyzed successfully');
      setSuccess(true);

      if (onUploadSuccess) {
        onUploadSuccess(finalData);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('❌ Failed to upload or analyze resume');
      setSuccess(false);
    } finally {
      setUploading(false);
      setMessage('')
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
        {uploading && <p className="mt-3 text-blue-400 animate-pulse">Analyzing...</p>}
        {message && (
          <p className={`mt-3 text-sm ${success ? 'text-green-400' : 'text-red-400'}`}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
