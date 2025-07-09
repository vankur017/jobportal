import { motion } from 'framer-motion';
import { Search, Briefcase, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { auth } from '../firebase/config';
import { getJobs } from '../utils/fetchjobs';
import { JOBAPI_URL } from '../constants/jobsapi';
import { useDispatch, useSelector } from 'react-redux';
import { addFilteredJobs, addSuggetedJob } from '../utils/jobSlice';
import { useNavigate } from 'react-router-dom';
import GradientText from '../components/GradientText';
import { onAuthStateChanged } from 'firebase/auth';
import { jobsQuery } from '../utils/jobsQuery';

const JobLists = lazy(() => import('./JobLists'));

const Home = () => {
  const [error, setError] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jobLists = useSelector((state) => state.job.jobs);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || !user.accessToken || !token) {
        setError('User not authenticated');
        navigate('/');
        return;
      }

      setLoading(true);
      try {
        const data = await getJobs(JOBAPI_URL + '/jobs');
        if (data && data.length > 0) {
          dispatch(addFilteredJobs(data));
        } else {
          setError('No jobs found');
        }
      } catch (err) {
        console.error('API call failed:', err);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate]);

  useEffect(() => {
    const fetchJobsQuery = async () => {
      if (!searchTerm) return;

      const [role, location] = searchTerm.split('||');
      setLoading(true);
      try {
        const jobs = await jobsQuery({ role, location });
        setFilteredJobs(jobs);
        dispatch(addFilteredJobs(jobs));  // still updating store as you do
        dispatch(addSuggetedJob(jobs));
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setMessage('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobsQuery();
  }, [searchTerm, dispatch]);

  const handleSearch = useCallback(() => {
    const trimmedRole = roleInput.trim();
    const trimmedLocation = locationInput.trim();

    if (!trimmedRole && !trimmedLocation) {
      setMessage('Please enter a role or location to search');
      setHasSearched(false);
      dispatch(addFilteredJobs([]));
      return;
    }

    setSearchTerm(`${trimmedRole}||${trimmedLocation}`);
    setHasSearched(true);
  }, [roleInput, locationInput, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white px-6 py-10">
      <Navbar />

      {error && <p className="text-center text-red-500 mt-2">{error}</p>}

      <div className="mt-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-5xl font-bold text-center mb-8"
        >
          <GradientText
            colors={['#40ffaa', '#4079ff', '#40ffaa', '#4079ff', '#40ffaa']}
            animationSpeed={3}
            showBorder={false}
          >
            Over 8,00,000 openings delivered perfectly
          </GradientText>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 mt-20 backdrop-blur-md border border-zinc-700 p-4 rounded-xl max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center"
        >
          <div className="flex flex-col sm:flex-row w-full gap-4">
            <div className="flex items-center gap-2 bg-zinc-800 p-3 rounded-lg w-full">
              <Briefcase className="text-indigo-400" />
              <input
                type="text"
                placeholder="Search for roles..."
                className="bg-transparent outline-none text-white w-full"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 bg-zinc-800 p-3 rounded-lg w-full">
              <MapPin className="text-indigo-400" />
              <input
                type="text"
                placeholder="Search by location..."
                className="bg-transparent outline-none text-white w-full"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
              />
            </div>
          </div>

          <button
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white font-semibold w-full sm:w-auto flex items-center gap-2 justify-center"
            onClick={handleSearch}
          >
            <Search size={18} />
            Search
          </button>
        </motion.div>

        {message && <p className="text-center text-yellow-400 mt-4">{message}</p>}
      </div>

      <div className="mt-8">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin mb-4"></div>
              <p className="text-sm text-gray-400">Loading...</p>
            </div>
          </div>
        }>
          {hasSearched && !loading && (
            <JobLists showSearch={true} searchTerm={searchTerm} jobs={filteredJobs.length > 0 ? filteredJobs : jobLists} />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
