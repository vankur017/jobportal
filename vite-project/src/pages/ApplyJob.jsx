import React, { useEffect, useState } from 'react'
import ApplyForm from '../components/ApplyForm'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ApplyJob = () => {

  const { id } = useParams();
  const job = useSelector((state) => state.job.jobs);
   const navigate = useNavigate();
   console.log(job);
   
  const [loading, setLoading] = useState(true); // Loader state

   useEffect(() => {
      const token = sessionStorage.getItem('token');
      
      //delay in auth token retrival showing spinner
      
      setTimeout(() => {
        if (!token) {
          navigate('/');
        } else {
          setLoading(false); 
        }
      }, 600); 
    }, [navigate]);
  
    // Spinner during token check
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

 

  return (
    <div className='bg-black text-white  px-4'>
      <ApplyForm />
    </div>
  )
}

export default ApplyJob