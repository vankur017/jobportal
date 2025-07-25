import React from 'react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job, searchTerm }) => {
  const navigate = useNavigate();

  const handleClick = () => {

    try{
      // Navigate to the job details page with the job ID

      console.log(job.id, 'Job ID clicked');
      
      navigate(`/job/${job.id}`, {
      ...(searchTerm && { state: { searchTerm } }),
    });

    } catch (error) {
      console.error('Navigation error:', error);  
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-neutral-900 border border-neutral-700 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-center gap-3 mb-2">
        <img src={job.image} alt={job.company_name} className="w-10 h-10 rounded-full" />
        <div>
          <p className="text-lg font-semibold text-white">{job.job_title}</p>
          <p className="text-sm text-gray-400">{job.company_name} • {job.location}</p>
        </div>
      </div>
      <p className="text-gray-300 text-sm mb-2 line-clamp-3">{job.description}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {job.tags?.split(',')?.map((tag, idx) => (
          <span
            key={idx}
            className="bg-blue-700 text-sm px-2 py-1 rounded-full text-white/90"
          >
            {tag.trim()}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-400 mt-3">
        💰 {job.salary} • 🕐 {job.job_type}
      </p>
    </div>
  );
};

export default JobCard;
