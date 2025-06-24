import React from 'react';
import JobCard from './JobCard';

const JobLists = ({ jobs }) => {
  console.log('Jobs:', jobs);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {jobs.map((job, index) => (
        <JobCard key={index} job={job} />
      ))}
    </div>
  );
};

export default JobLists;
