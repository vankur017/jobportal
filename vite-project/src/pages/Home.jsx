import { motion } from 'framer-motion'
import { Search, MapPin, Briefcase } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { auth } from '../firebase/config'
import { getJobs } from '../utils/fetchjobs'
import { JOBAPI_URL } from '../constants/jobsapi'

const Home = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [jobs, setJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const [message, setMessage] = useState('')
  

  useEffect(() => {
    

    const fetchData =  getJobs(JOBAPI_URL+ '/jobs')
    
    console.log('Fetching jobs from API...', jobs);
    
  

    fetchData.then((data) => {
      if (data && data.length > 0) {
        setJobs(data)
        console.log('Jobs fetched successfully:', data);
      } else {
        setError('No jobs found')
        console.error('No jobs found in the response');
      }
    })
    

  
  }, [])
  console.log(searchTerm);
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-zinc-800 text-white p-6">
      <Navbar />
      {error}

      {/* Animated Background Elements */}
      <div className='mt-10'>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl font-bold text-center mb-8"
        >
          Over 8,00,000 openings delivered perfectly
        </motion.h1>
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md border border-zinc-700 p-4 rounded-xl max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center"
        >
        
          <div className="flex items-center gap-2 bg-zinc-800 p-3 rounded-lg w-full">
            <Briefcase className="text-indigo-400" />
            <input
              type="text"
              placeholder="Search by skills, title..."
              className="bg-transparent outline-none text-white w-full"
              onChange={(e)=> setSearchTerm(e.target.value) }
            />
          
          </div>
          <div className="flex items-center gap-2 bg-zinc-800 p-3 rounded-lg w-full">
            <MapPin className="text-indigo-400" />
            <input
              type="text"
              placeholder="Location"
              className="bg-transparent outline-none text-white w-full"
            />
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white font-semibold w-full sm:w-auto flex items-center gap-2 justify-center">
            <Search size={18} />
            Search
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
