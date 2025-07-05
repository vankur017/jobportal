import { MapPin, Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectedJob } from '../utils/jobSlice'
import ShinyText from '../components/ShinyText'


const JobCard = ({ job, searchTerm  }) => {

  // const handleJobDetails = useSelector((state)=>state.job.jobs)
  // console.log(handleJobDetails);
  const navigate = useNavigate()
  const dispatch = useDispatch()
 const handleClick = () => {
  dispatch(setSelectedJob(job)); 
  navigate(`/job/${job.id}`, {
    state: { searchTerm },
  });

  // Delay scroll to allow the route to change
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100); // 100ms delay works well
};
  return (

    <div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full sm:w-[250px] md:w-[300px] lg:w-[320px] h-[280px] bg-white/5 border border-zinc-700 backdrop-blur-md rounded-2xl p-5 m-2 flex flex-col justify-between transition-all"
        onClick={handleClick}
      
      >
        <div className=" items-center gap-4">
          <img
            src={job.image}
            alt={job.company_name}
            className="w-14 h-14 rounded-xl object-cover border border-zinc-600"
          />
          <div>
            <h3 className="text-lg font-semibold text-white line-clamp-1">{job.job_title}</h3>
            <ShinyText className="text-sm text-zinc-400" text={job.company_name} />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <MapPin size={16} className="text-indigo-400" />
            <ShinyText text={job.location} disabled={false} speed={3} className='custom-class' />
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Briefcase size={16} className="text-indigo-400" />
            <span>{job.job_type}</span>
          </div>
        </div>
        <div className="mt-4">
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-xs font-medium text-white bg-indigo-600 px-4 py-1 rounded-full inline-block"
          >
            {job.job_type}
          </motion.span>
        </div>
       
      </motion.div>
    </div>
  )
}

export default JobCard
