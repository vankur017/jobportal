import { motion } from 'framer-motion'
import { Search, MapPin, Briefcase } from 'lucide-react'
import Navbar from '../components/Navbar'
import { use, useEffect, useState } from 'react'
import { auth } from '../firebase/config'
import { getJobs } from '../utils/fetchjobs'
import { JOBAPI_URL } from '../constants/jobsapi'
import { useDispatch, useSelector } from 'react-redux'
import { addAllJobs, addFilteredJobs } from '../utils/jobSlice'
import JobLists from './JobLists'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')
  const dispatch = useDispatch()
  const [hasSearched, setHasSearched] = useState(false)
  const navigate = useNavigate()


  const jobLists = useSelector((state) => state.job.jobs)
  const allJobs = useSelector((state) => state.job.allJobs) // assuming you store all jobs separately too

  useEffect(() => {

    // const token = auth.currentUser?.accessToken
    // if (!token) {
    //   setError('User not authenticated')
    //   navigate('/')
    //   return
    // }
    const fetchData = async () => {
      try {
        const data = await getJobs(JOBAPI_URL + '/jobs')
        if (data && data.length > 0) {
          dispatch(addAllJobs(data))
          // dispatch(addFilteredJobs(data)) // initially show all
        } else {
          setError('No jobs found')
        }
      } catch (err) {
        console.error('API call failed:', err)
        setError('Something went wrong')
      }
    }

    fetchData()
  }, [dispatch])

  // 🔍 Live Filtering on searchTerm
  useEffect(() => {
    if (searchTerm.trim() === '') {
      dispatch(addFilteredJobs(allJobs))
      setMessage('')
      return
    }

    const filteredJobs = allJobs.filter((job) =>
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (filteredJobs.length > 0) {
      dispatch(addFilteredJobs(filteredJobs))
      setMessage('')
    } else {
      dispatch(addFilteredJobs([]))
      setMessage('No jobs found for the given search term')
    }
  }, [searchTerm, allJobs, dispatch])

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-zinc-800 text-white p-6">
      <Navbar />
      {error && <p className="text-center text-red-500 mt-2">{error}</p>}

      {/* Animated Background Elements */}
      <div className="mt-10">
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-zinc-800 p-3 rounded-lg w-full">
            <MapPin className="text-indigo-400" />
            <input
              type="text"
              placeholder="Location"
              className="bg-transparent outline-none text-white w-full"
              disabled // optional: since location isn't used in filtering here
            />
          </div>

          <button
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white font-semibold w-full sm:w-auto flex items-center gap-2 justify-center"
            onClick={() => {
                  if (searchTerm.trim() === '') {
                    setMessage('Please enter a search term')
                    setHasSearched(false)
                    dispatch(addFilteredJobs([]))
                    return
                  }
                
                  setHasSearched(true)
                  const filteredJobs = allJobs.filter((job) =>
                    job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                
                  if (filteredJobs.length > 0) {
                    dispatch(addFilteredJobs(filteredJobs))
                    setMessage('')
                  } else {
                    dispatch(addFilteredJobs([]))
                    setMessage('No jobs found for the given search term')
                  }
                }}
          >
            <Search size={18} />
            Search
          </button>
        </motion.div>

        {message && (
          <p className="text-center text-yellow-400 mt-4">{message}</p>
        )}
      </div>

      {/* Job Listings */}
      <div className="mt-8">
        {hasSearched && jobLists.length > 0 && <JobLists jobs={jobLists} />}
      </div>
    </div>
  )
}

export default Home
