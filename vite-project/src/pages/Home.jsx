import { motion } from 'framer-motion';
import { Search, Briefcase, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { getJobs } from '../utils/fetchjobs';
import { JOBAPI_URL } from '../constants/api';
import { useDispatch, useSelector } from 'react-redux';
import { addFilteredJobs, addSuggetedJob } from '../utils/jobSlice';
import { useNavigate } from 'react-router-dom';
import GradientText from '../components/GradientText';
import { jobsQuery } from '../utils/jobsQuery';
import { auth } from '../firebase/config';
import ResumeUpload from '../components/ResumeUpload';

const JobLists = lazy(() => import('./JobLists'));
const PAGE_SIZE = 12;

const Home = () => {
  const [error, setError] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [aiSuggestedJobs, setAiSuggestedJobs] = useState([]); // NEW

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jobLists = useSelector((state) => state.job.jobs);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handler = () => navigate("/home", { replace: true });
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      navigate('/home');
    } else {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) navigate('/home');
      });
      return () => unsubscribe();
    }
  }, [navigate]);

  useEffect(() => {
    const fetchInitialJobs = async () => {
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
    };
    fetchInitialJobs();
  }, [dispatch]);

  useEffect(() => {
    const fetchJobsQuery = async () => {
      if (!searchTerm) return;
      const [role, location] = searchTerm.split('||');
      setLoading(true);
      try {
        const jobs = await jobsQuery({ role, location });
        setFilteredJobs(jobs);
        dispatch(addFilteredJobs(jobs));
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

  const noOfPages = Math.ceil(filteredJobs.length / PAGE_SIZE);
  const start = currentPage * PAGE_SIZE;
  const end = (currentPage + 1) * PAGE_SIZE;

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

  const handleNextPageLoad = (n) => {
    setCurrentPage(n);
  };

  const handleReset = () => {
    setResumeUploaded(false);
    setAiSuggestedJobs([]);
    setRoleInput('');
    setLocationInput('');
    setHasSearched(false);
    setFilteredJobs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white px-6 py-10">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-10 max-w-3xl mx-auto"
      >
        <ResumeUpload
  onUploadSuccess={async (aiJobs) => {
    console.log("🚀 onUploadSuccess triggered with:", aiJobs);
    setResumeUploaded(true);
    setAiSuggestedJobs(aiJobs);

    if (aiJobs && aiJobs.length > 0) {
      try {
        const allMatches = [];

        for (let role of aiJobs) {
          const query = encodeURIComponent(role);
          const res = await fetch(`${JOBAPI_URL}/jobs?role=${query}`);
          if (res.ok) {
            const jobs = await res.json();
            jobs.forEach(job => {
              if (!allMatches.some(existing => existing.id === job.id)) {
                allMatches.push(job);
              }
            });
          }
        }

        setFilteredJobs(allMatches);
        dispatch(addFilteredJobs(allMatches));
        dispatch(addSuggetedJob(allMatches));
      } catch (err) {
        console.error("❌ Failed to fetch jobs for AI suggestions:", err);
      }
    }
  }}
/>


        {resumeUploaded && (
          <p className="text-green-400 text-center mt-4">
            ✅ Resume uploaded successfully. AI suggestions below.
          </p>
        )}
      </motion.div>

      {error && <p className="text-center text-red-500 mt-2">{error}</p>}

      {!resumeUploaded && (
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

          {message && (
            <p className="text-center text-yellow-400 mt-4">{message}</p>
          )}
        </div>
      )}

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin mb-4"></div>
                <p className="text-sm text-gray-400">Loading...</p>
              </div>
            </div>
          }
        >
          {resumeUploaded ? (
  <>
    <div className="mt-10 max-w-4xl mx-auto bg-neutral-900 p-6 rounded-xl border border-neutral-700">
      <h2 className="text-xl font-semibold mb-4 text-white/90">
        🎯 AI Suggested Job Titles
      </h2>
      <ul className="list-disc list-inside text-blue-300 space-y-2">
        {aiSuggestedJobs.map((job, idx) => (
          <li key={idx}>{job}</li>
        ))}
      </ul>
      <button
        onClick={handleReset}
        className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
      >
        🔁 Reset Search & Upload
      </button>
    </div>

    {/* Render matched jobs below */}
    <JobLists
      showSearch={false}
      searchTerm="AI Matched Roles"
      jobs={filteredJobs.slice(start, end)}
    />
  </>
) : (
  hasSearched &&
  !loading && (
    <JobLists
      showSearch={true}
      searchTerm={searchTerm}
      jobs={(filteredJobs.length > 0 ? filteredJobs : jobLists).slice(
        start,
        end
      )}
    />
  )
)}

        </Suspense>

        {!resumeUploaded && (
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(noOfPages).keys()].map((n) => (
              <button
                key={n}
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  currentPage === n
                    ? 'bg-gradient-to-r from-[#40ffaa] to-[#4079ff] text-black'
                    : 'bg-zinc-800 text-white'
                }`}
                onClick={() => handleNextPageLoad(n)}
              >
                {n + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
