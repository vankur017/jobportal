import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JobCard from '../pages/JobCard';
import { motion } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getJobs } from '../utils/fetchjobs';
import { JOBAPI_URL } from '../constants/jobsapi';
import { jobsQuery } from '../utils/jobsQuery';
import { addFilteredJobs, addSuggetedJob } from '../utils/jobSlice';

const SuggestedJobs = ({searchTerm}) => {
  
  const [jobs, setJobs] = useState()
  const dispatch = useDispatch()


   useEffect(() => {
      const fetchJobsQuery = async () => {
        if (!searchTerm) return;
  
        const [role, location] = searchTerm.split('||');
  
        try {
          const jobquery = await jobsQuery({ role, location });
          setJobs(jobquery)
          console.log(jobquery);
          
          dispatch(addFilteredJobs(jobs));
          dispatch(addSuggetedJob(jobs));
        } catch (error) {
          console.error('Error fetching jobs:', error);
          setMessage('Failed to fetch jobs');
        }
      };
  
      fetchJobsQuery();
    },
     [searchTerm, dispatch]);

      // const [role, location] = searchTerm.split('||');

  
  //  const suuge = async()=>{
  //    try {
  //       const data = await getJobs(JOBAPI_URL + '/jobs');
  //       if (data && data.length > 0) {
  //         console.log("Fetched Jobs:", data);
          
  //       } else {
  //         setError('No jobs found');
  //       }
  //     } catch (err) {
  //       console.error('API call failed:', err);
  //       setError('Something went wrong');
  //     } 

  //  }

  //  // Auth and job fetch
  // useEffect(() => {
  //   suuge();
  // }, []);

  // console.log("Suggested Jobs:", jobs);

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
