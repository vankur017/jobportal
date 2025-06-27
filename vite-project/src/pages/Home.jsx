import { motion } from 'framer-motion';
import { Search, Briefcase } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { auth } from '../firebase/config';
import { getJobs } from '../utils/fetchjobs';
import { JOBAPI_URL } from '../constants/jobsapi';
import { useDispatch, useSelector } from 'react-redux';
import { addAllJobs, addFilteredJobs, addSuggetedJob } from '../utils/jobSlice';
import JobLists from './JobLists';
import { useNavigate } from 'react-router-dom';
import GradientText from '../components/GradientText';
import { onAuthStateChanged } from 'firebase/auth';


const Home = () => {
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobLists = useSelector((state) => state.job.jobs);
  const allJobs = useSelector((state) => state.job.allJobs);
  const suggestedJobs = useSelector((state) => state.job.suggestedJob);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced input handler
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = inputValue.trim().toLowerCase();
      setSearchTerm(trimmed);

      if (trimmed) {
        const matched = allJobs.filter((job) =>
          job.job_title.toLowerCase().includes(trimmed)
        );
        setSuggestions(matched.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [inputValue, allJobs]);

  // Auth and job fetch
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

      try {
        const data = await getJobs(JOBAPI_URL + '/jobs');
        if (data && data.length > 0) {
          dispatch(addAllJobs(data));
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

  const filteredJobs = useMemo(() => {
    if (!searchTerm) return [];
    return allJobs.filter((job) =>
      job.job_title.toLowerCase().includes(searchTerm) ||
      job.location.toLowerCase().includes(searchTerm)
    );
  }, [allJobs, searchTerm]);

  const handleSearch = useCallback(() => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setMessage('Please enter a search term');
      setHasSearched(false);
      
      dispatch(addFilteredJobs([]));
      return;
    }

    if (filteredJobs.length > 0) {
      dispatch(addFilteredJobs(filteredJobs));
      dispatch(addSuggetedJob(filteredJobs));

      setMessage('');
    } else {
      dispatch(addFilteredJobs([]));
      setMessage('No jobs found for the given search term');
    }

    setHasSearched(true);
    setShowSuggestions(false);
     setShowSearch(false);
  }, [searchTerm, filteredJobs, dispatch]);

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
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-zinc-800 text-white p-6">
      <Navbar />
      {error && <p className="text-center text-red-500 mt-2">{error}</p>}

      <div className="mt-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
          transition={{ delay: 0.4 }}
          className="bg-white/10 mt-20 backdrop-blur-md border border-zinc-700 p-4 rounded-xl max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center"
        >
          <div className="relative w-full">
            <div className="flex items-center gap-2 bg-zinc-800 p-3 rounded-lg w-full">
              <Briefcase className="text-indigo-400" />
              <input
                type="text"
                placeholder="Search by skills, title..."
                className="bg-transparent outline-none text-white w-full"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => {
                  setShowSuggestions(true)
                  setShowSearch(true);  
                }}
                onBlur={() => setTimeout(() =>{ 
                  setShowSuggestions(false)
                  setShowSearch(false);
                }, 200)}
              />
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute bg-zinc-900 border border-zinc-700 mt-1 w-full rounded-lg z-50 shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((job, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-zinc-800 cursor-pointer text-sm text-white"
                    onClick={() => {
                      setInputValue(job.job_title);
                      setSearchTerm(job.job_title);
                      handleSearch();
                    }}
                  >
                    {job.job_title}
                  </li>
                ))}
              </ul>
            )}
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
        {hasSearched && jobLists.length > 0 && <JobLists showSearch={showSearch} jobs={jobLists} />}
      </div>
    </div>
  );
};

export default Home;
