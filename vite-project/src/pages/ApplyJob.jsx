import React, { useEffect, useState } from 'react';
import ApplyForm from '../components/ApplyForm';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedJob = useSelector((state) => state.job.selectedJob);
  const jobFromLocation = location?.state?.job;
  console.log('Job from location:', jobFromLocation);
  

  console.log( 'Selected Job in ApplyJob', selectedJob,);

  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const token = sessionStorage.getItem('token');

  //   setTimeout(() => {
  //     if (!token) {
  //       navigate('/');
  //     } else {
  //       setLoading(false);
  //     }
  //   }, 600);
  // }, [navigate]);

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
