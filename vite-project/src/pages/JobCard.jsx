import { MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const JobCard = ({ job }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow hover:shadow-indigo-600/10 transition"
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          src={job.image}
          alt={job.company_name}
          className="w-14 h-14 rounded-xl object-cover border border-zinc-700"
        />
        <div>
          <h3 className="text-lg font-semibold text-white">{job.job_title}</h3>
          <p className="text-sm text-zinc-400">{job.company_name}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
        <MapPin size={16} className="text-indigo-400" />
        <span>{job.location}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Briefcase size={16} className="text-indigo-400" />
        <span>{job.job_type}</span>
      </div>

      <div className="mt-4">
        <span className="text-xs text-white bg-indigo-600 px-3 py-1 rounded-full">
          {job.job_type}
        </span>
      </div>
    </motion.div>
  );
};

export default JobCard;
