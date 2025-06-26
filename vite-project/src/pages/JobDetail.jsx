import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const JobDetail = () => {
  const { id } = useParams();
  const jobList = useSelector((state) => state.job.jobs);
 
  

  if (!jobList) {
    return <div className="text-center text-white mt-10">Job not found</div>;
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-4 py-10">
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full bg-[#1a1a1a] bg-opacity-80 backdrop-blur-md rounded-2xl shadow-2xl p-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <img
            src={jobList.image}
            alt={jobList.company_name}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">{jobList.job_title}</h1>
            <p className="text-gray-400">{jobList.company_name}</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-gray-300">
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Location" value={jobList.location} />
            <Detail label="Job Type" value={jobList.job_type} />
            <Detail label="Posted On" value={jobList.posted_date} />
            <Detail label="Salary" value={`₹${jobList.salary.toLocaleString()}`} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
            <p className="text-gray-400 leading-relaxed">{jobList.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Tags</h2>
            <div className="flex gap-2 flex-wrap">
              {jobList.tags?.split(',').map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#2a2a2a] text-white text-xs font-medium px-3 py-1 rounded-full shadow-inner hover:bg-[#3b3b3b] transition"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
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
