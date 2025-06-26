import { motion } from 'framer-motion';
import { Search, Briefcase } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useEffect, useMemo, useState } from 'react';
import { auth } from '../firebase/config';
import { getJobs } from '../utils/fetchjobs';
import { JOBAPI_URL } from '../constants/jobsapi';
import { useDispatch, useSelector } from 'react-redux';
import { addAllJobs, addFilteredJobs, addSuggetedJob } from '../utils/jobSlice';
import JobLists from './JobLists';
import { useNavigate } from 'react-router-dom';
import GradientText from '../components/GradientText';
import { onAuthStateChanged } from 'firebase/auth';
import { s } from 'framer-motion/client';

const Home = () => {
  const [error, setError] = useState('');
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // this will be debounced
  const [message, setMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobLists = useSelector((state) => state.job.jobs);
  const allJobs = useSelector((state) => state.job.allJobs);

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
  const delay = setTimeout(() => {
    setSearchTerm(inputValue);

    // Live Suggestions by job title
    if (inputValue.trim() !== '') {
      const matched = allJobs.filter((job) =>
        job.job_title.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(matched.slice(0, 5)); // Limit to top 5 suggestions
    } else {
      setSuggestions([]);
    }

  }, 500);

  return () => clearTimeout(delay);
}, [inputValue, allJobs]);


  // 🔐 Auth Check + Fetch Jobs
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const token = user.accessToken;
        if (!token) return;

        const fetchData = async () => {
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
          }
        };

        fetchData();
      } else {
        setError('User not authenticated');
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate]);

  // 🔃 Initial Jobs Load
  useEffect(() => {
    const fetchData = async () => {
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
      }
    };

    fetchData();
  }, [dispatch]);

  // ✅ Memoized Filtered Jobs
  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return allJobs.filter((job) =>
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allJobs, searchTerm]);

  // 🔍 Handle Search Button Click
  const handleSearch = () => {
    if (!searchTerm.trim()) {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-zinc-800 text-white p-6">
      <Navbar />
      {error && <p className="text-center text-red-500 mt-2">{error}</p>}

      {/* Header + Search */}
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
            className="custom-class"
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
          <div className='relative w-full'>
            <div className="flex items-center gap-2 bg-zinc-800 p-3 rounded-lg w-full">
              <Briefcase className="text-indigo-400" />
              <input
                type="text"
                placeholder="Search by skills, title..."
                className="bg-transparent outline-none text-white w-full"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setSuggestionOpen(true)
                }}
              />
            </div>
          {suggestionOpen && suggestions.length > 0 && (
              <ul className="absolute bg-zinc-900 border border-zinc-700 mt-1 w-full rounded-lg z-50 shadow-lg">
                {suggestions.map((job, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-zinc-800 cursor-pointer text-sm text-white"
                    onClick={() => {
                      setInputValue(job.job_title);
                      setSearchTerm(job.job_title);
                      setSuggestionOpen(false); 
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

      {/* Job Listings */}
      <div className="mt-8">
        {hasSearched && jobLists.length > 0 && <JobLists jobs={jobLists} />}
      </div>
    </div>
  );
};

export default Home;
