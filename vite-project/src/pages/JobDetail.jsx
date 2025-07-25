import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import SuggestedJobs from '../components/SuggestedJobs';
import { jobById } from '../utils/jobById';
import { useDispatch } from 'react-redux';
import { addSelectedJob } from '../utils/jobSlice';
import { useSelector } from 'react-redux';

const JobDetail = () => {
  console.log('jobdetail');
  
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const searchTerm = location?.state?.searchTerm || '';
  const jobFromRedux = useSelector((state) => state.job.selectedJob);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (jobFromRedux) {
        setJob(jobFromRedux);
        setLoading(false);
        return;
      }

      try {
        const jobData = await jobById(id);
        if (!jobData) {
          console.warn('❌ Job not found in backend.');
          setJob(null);
        } else {
          setJob(jobData);
         
        }
      } catch (error) {
        console.error('❌ Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleClick = () => {
    navigate(`/job/apply/${id}`, {
      state: { job }, // pass fallback for apply page
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-gray-400">Loading....</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return <div className="text-center text-white mt-10">❌ Job not found</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl w-full bg-[#1a1a1a] bg-opacity-80 backdrop-blur-md rounded-2xl shadow-2xl p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <img
              src={job.image}
              alt={job.company_name}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
            />
            <div>
              <h1 className="text-2xl font-bold">{job.job_title}</h1>
              <p className="text-gray-400">{job.company_name}</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-300">
            <div className="grid grid-cols-2 gap-4">
              <Detail label="Location" value={job.location} />
              <Detail label="Job Type" value={job.job_type} />
              <Detail label="Posted On" value={job.posted_date} />
              <Detail
                label="Salary"
                value={job.salary != null ? `₹${job.salary.toLocaleString()}` : 'Not Disclosed'}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
              <p className="text-gray-400 leading-relaxed">{job.description}</p>
            </div>

            {job.tags && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Tags</h2>
                <div className="flex gap-2 flex-wrap">
                  {job.tags.split(',').map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#2a2a2a] text-white text-xs font-medium px-3 py-1 rounded-full shadow-inner hover:bg-[#3b3b3b] transition"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <button
              className="bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-semibold mt-2 hover:bg-amber-600 transition"
              onClick={handleClick}
            >
              Apply
            </button>
          </div>
        </motion.div>
      </div>

      <div className="bg-[#0f0f0f] text-white flex items-center justify-center px-4">
        <SuggestedJobs searchTerm={searchTerm} />
      </div>
    </>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-500 uppercase text-xs">{label}</p>
    <p className="text-white">{value}</p>
  </div>
);

export default JobDetail;
