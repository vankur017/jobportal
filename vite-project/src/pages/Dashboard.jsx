import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Layers, FileText, Building2, Pencil } from 'lucide-react';
import Navbar from '../../src/components/Navbar';
import axios from 'axios';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { JOBAPI_URL } from '../constants/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    startDate: '',
    endDate: '',
    currentCTC: '',
    expectedCTC: '',
    skills: '',
  });
  const [message, setMessage] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);

  // ✅ Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        setLoadingProfile(false);
        setLoadingApplications(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch Profile (Runs when `user` is ready)
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`${JOBAPI_URL}/user/profile/${user.uid}`);
        if (res.data?.profile) {
          const p = res.data.profile;
          
          
          setProfile(p);
          setFormData({
            name: p.name || '',
            email: user.email,
            company: p.company || '',
            startDate: p.startDate || '',
            endDate: p.endDate || '',
            currentCTC: p.currentCTC || '',
            expectedCTC: p.expectedCTC || '',
            skills: (p.skills || []).join(', '),
          });
          setIsEditMode(false);
        } else {
          setIsEditMode(true);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setIsEditMode(true);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  // ✅ Fetch Applications (Runs when `user` is ready)
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      console.log(user.email);
      

      try {
        const res = await axios.get(`${JOBAPI_URL}/user/applications/${user.email.toLowerCase()}`);
        setApplications(res.data || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoadingApplications(false);
      }
    };

    if (user) fetchApplications();
  }, [user]);

    
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setMessage('❌ Not authenticated');

    const payload = {
      uid: user.uid,
      name: formData.name,
      company: formData.company,
      startDate: formData.startDate,
      endDate: formData.endDate,
      currentCTC: formData.currentCTC,
      expectedCTC: formData.expectedCTC,
      skills: formData.skills.split(',').map(s => s.trim()),
    };

    try {
      await axios.post(`${JOBAPI_URL}/user/profile`, payload);
      setMessage('✅ Profile saved successfully!');
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to save profile');
    }
  };

  if (loadingProfile || loadingApplications) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin border-t-transparent border-4 border-indigo-500 rounded-full w-12 h-12"></div>
      </div>
    );
  }
 
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <Navbar />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring' }}
        className="max-w-4xl mx-auto mt-16 bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-lg backdrop-blur-md">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">🚀 Your Profile</h2>
          {!isEditMode && (
            <button onClick={() => setIsEditMode(true)} className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300">
              <Pencil size={16} /> Edit
            </button>
          )}
        </div>

        {message && <p className="text-center mb-4 text-sm text-indigo-400">{message}</p>}

        {isEditMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField icon={<User />} name="name" value={formData.name} placeholder="Full Name" onChange={handleChange} />
            <InputField icon={<Building2 />} name="company" value={formData.company} placeholder="Company" onChange={handleChange} />
            <div className="flex gap-3">
              <InputField icon={<FileText />} name="startDate" value={formData.startDate} placeholder="Start Date" onChange={handleChange} />
              <InputField icon={<FileText />} name="endDate" value={formData.endDate} placeholder="End Date" onChange={handleChange} />
            </div>
            <div className="flex gap-3">
              <InputField icon={<FileText />} name="currentCTC" value={formData.currentCTC} placeholder="Current CTC" onChange={handleChange} />
              <InputField icon={<FileText />} name="expectedCTC" value={formData.expectedCTC} placeholder="Expected CTC" onChange={handleChange} />
            </div>
            <InputField icon={<Layers />} name="skills" value={formData.skills} placeholder="Skills" onChange={handleChange} />
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-3 bg-indigo-600 rounded-xl font-semibold uppercase hover:bg-indigo-700">
              Save Profile
            </motion.button>
          </form>
        ) : (
          <div className="space-y-3 text-gray-300">
            <ProfileItem label="Name" value={formData.name} />
            <ProfileItem label="Email" value={user?.email} />
            <ProfileItem label="Company" value={formData.company} />
            <ProfileItem label="Period" value={`${formData.startDate || '—'} to ${formData.endDate || 'Present'}`} />
            <ProfileItem label="Current CTC" value={formData.currentCTC} />
            <ProfileItem label="Expected CTC" value={formData.expectedCTC} />
            <ProfileItem label="Skills" value={formData.skills} />
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, type: 'spring' }}
        className="max-w-4xl mx-auto mt-12 bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-lg backdrop-blur-md">
        <h3 className="text-xl font-bold mb-4">📄 Jobs You've Applied For</h3>
        {applications.length === 0 ? (
          <p className="text-gray-500">No applications yet.</p>
        ) : (
          <ul className="space-y-4">
            {applications.map((app, idx) => (
              <li key={idx} className="border border-gray-700 rounded-xl p-4 bg-gray-800 hover:bg-gray-700 transition">
                <p className="text-white font-semibold">{app.roleAppliedFor? `${app.roleAppliedFor} ` : 'Role not specified'}</p>
                <p className="text-sm text-gray-400">{app.companyAppliedTo ? `${app.companyAppliedTo}` : 'Company not specified'}</p>
                <p className="text-sm text-indigo-300 mt-1">{app.salaryOffered && `Offered: ₹${app.salaryOffered}`}</p>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

const InputField = ({ icon, ...props }) => (
  <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700 w-full">
    <div className="text-indigo-400">{icon}</div>
    <input {...props} className="bg-transparent outline-none w-full text-white" />
  </div>
);

const ProfileItem = ({ label, value }) => (
  <div className="border-b border-gray-700 pb-2">
    <p className="text-xs text-gray-500 uppercase">{label}</p>
    <p className="text-lg text-white">{value || '—'}</p>
  </div>
);

export default Dashboard;
