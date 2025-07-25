import React, { useEffect, useState } from 'react';
import ApplyForm from '../components/ApplyForm';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jobById } from '../utils/jobById';


const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const reduxJob = useSelector((state) => state.job.selectedJob);
  const locationJob = location?.state?.job || null;

  const [selectedJob, setSelectedJob] = useState(reduxJob || locationJob || null);
  const [loading, setLoading] = useState(false);

  // Optional: You can uncomment this if you want login check
  // useEffect(() => {
  //   const token = sessionStorage.getItem('token');
  //   if (!token) {
  //     navigate('/');
  //   }
  // }, [navigate]);

    useEffect(() => {
      const fetchJob = async () => {
        if (reduxJob) {
          setSelectedJob(reduxJob);
          setLoading(false);
          return;
        }
  
        try {
          const jobData = await jobById(id);
          setLoading(true);
          if (!jobData) {
            console.warn('❌ Job not found in backend.');
            setSelectedJob(null);
          } else {
            setSelectedJob(jobData);
           
          }
        } catch (error) {
          console.error('❌ Error fetching job:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchJob();
    }, [id]);

  useEffect(() => {
    if (!reduxJob && locationJob) {
      setSelectedJob(locationJob);
    }
  }, [reduxJob, locationJob]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!selectedJob) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-lg">
        ❌ Job not found. Try visiting again from job list.
      </div>
    );
  }

  return (
    <div className="bg-black text-white px-4">
      <ApplyForm selectedJob={selectedJob} />
    </div>
  );
};

export default ApplyJob;
