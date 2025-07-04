import React from 'react';
import { useSelector } from 'react-redux';
import JobCard from '../pages/JobCard';
import { motion } from 'framer-motion';

const SuggestedJobs = () => {
  // ✅ Use the full array of suggested jobs, not just [0]
  const jobs = useSelector((state) => state.job.suggestedJob) || [];

  console.log("Suggested Jobs:", jobs); // Optional: check structure

  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-8">
      {/* Animated Section Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center"
      >
        🚀 Suggested Jobs For You
      </motion.h2>

      {/* Animated Job Cards Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 },
          },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {jobs.map((job, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <JobCard job={job} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SuggestedJobs;
