import React from 'react';
import JobCard from './JobCard';

const JobLists = ({ jobs, showSearch, searchTerm}) => {


  return (
    <div>
    
      <div
       className={`grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4
        
         
        gap-6 p-4 transition-all duration-300 ${
          showSearch ? 'pt-40' : ''
        } max-w-screen-2xl mx-auto`}
      >
        {jobs.map((job, index) => (
          <JobCard key={index} job={job} searchTerm={searchTerm}  />
        ))}
      </div>
    </div>
  );
};

export default JobLists;