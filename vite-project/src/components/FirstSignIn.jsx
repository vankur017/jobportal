import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Layers, FileText, Building2 } from 'lucide-react';
import Navbar from './Navbar';

const FirstSignIn = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    currentCTC: '',
    expectedCTC: '',
    skills: '',
    experience: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const profileData = {
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()),
    };

    // (profileData);console.log
    
    // onSubmit(profileData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        className="max-w-2xl mx-auto mt-20 bg-gray-900/90 border border-gray-800 rounded-3xl p-8 shadow-lg backdrop-blur-md"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 tracking-tight">🚀 Complete Your Profile</h2>
        <p className="text-gray-400 text-center mb-10 text-sm">Tell us a bit more to help match you with the best roles.</p>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-5"
        >
          <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
            <User className="text-indigo-400" size={20} />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-transparent outline-none w-full text-white"
            />
          </div>

          <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
            <Building2 className="text-indigo-400" size={20} />
            <input
              type="text"
              name="company"
              placeholder="Current Company (optional)"
              value={formData.company}
              onChange={handleChange}
              className="bg-transparent outline-none w-full text-white"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700 w-full">
              <FileText className="text-indigo-400" size={18} />
              <input
                type="text"
                name="currentCTC"
                placeholder="Current CTC"
                value={formData.currentCTC}
                onChange={handleChange}
                className="bg-transparent outline-none text-white w-full"
              />
            </div>
            <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700 w-full">
              <FileText className="text-indigo-400" size={18} />
              <input
                type="text"
                name="expectedCTC"
                placeholder="Expected CTC"
                value={formData.expectedCTC}
                onChange={handleChange}
                className="bg-transparent outline-none text-white w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
            <Layers className="text-indigo-400" size={20} />
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma separated)"
              value={formData.skills}
              onChange={handleChange}
              required
              className="bg-transparent outline-none w-full text-white"
            />
          </div>

          <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
            <Briefcase className="text-indigo-400" size={20} />
            <input
              type="text"
              name="experience"
              placeholder="Previous Experience (optional)"
              value={formData.experience}
              onChange={handleChange}
              className="bg-transparent outline-none w-full text-white"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="w-full py-3 bg-indigo-600 rounded-xl font-semibold uppercase tracking-wide hover:bg-indigo-700 transition"
          >
            Save & Continue
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default FirstSignIn;
