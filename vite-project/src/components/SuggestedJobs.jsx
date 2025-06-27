import React from 'react';
import { useSelector } from 'react-redux';
import JobCard from '../pages/JobCard';


const SuggestedJobs = () => {

    const jobs = useSelector((state) => state.job.suggestedJob[0]);
    console.log('suggestedJobs', jobs);
    

    return (
        <>
        
            return (
                <div
                  className={`grid 
                    grid-cols-1 
                    sm:grid-cols-2 
                    md:grid-cols-3 
                    lg:grid-cols-4
                    gap-6 p-4 transition-all duration-300  max-w-screen-2xl mx-auto`}
                >
                  {jobs.map((job, index) => (
                    <JobCard key={index} job={job} />
                  ))}
                </div>
              );

        
        
        </>
    )
}


export default SuggestedJobs;