import React from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Layers, FileText, Building2, Pencil } from 'lucide-react';

const InputField = ({ icon, ...props }) => (
  <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700 w-full">
    <div className="text-indigo-400">{icon}</div>
    <input {...props} className="bg-transparent outline-none w-full text-white" />
  </div>
);

const ProfileItem = ({ label, value }) => (
  <div className="border-b border-gray-700 pb-2">
    <p className="text-sm text-gray-500 uppercase">{label}</p>
    <p className="text-lg text-white font-medium">{value || '—'}</p>
  </div>
);

const UserProfile = ({ formData, isEditMode, handleChange, handleSubmit, setIsEditMode, message }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 80, damping: 15 }}
    className="max-w-3xl mx-auto mt-16 bg-gray-900/90 border border-gray-800 rounded-3xl p-8 shadow-lg backdrop-blur-md"
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold">🚀 Your Profile</h2>
      {!isEditMode && (
        <button
          onClick={() => setIsEditMode(true)}
          className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
        >
          <Pencil size={16} /> Edit
        </button>
      )}
    </div>

    {message && <p className="text-center mb-4 text-sm text-indigo-400">{message}</p>}

    {isEditMode ? (
      <motion.form onSubmit={handleSubmit} className="space-y-5">
        <InputField icon={<User />} placeholder="Your Name" name="name" value={formData.name} onChange={handleChange} />
        <InputField icon={<Building2 />} placeholder="Company" name="company" value={formData.company} onChange={handleChange} />
        <div className="flex gap-3">
          <InputField icon={<FileText />} placeholder="Current CTC" name="currentCTC" value={formData.currentCTC} onChange={handleChange} />
          <InputField icon={<FileText />} placeholder="Expected CTC" name="expectedCTC" value={formData.expectedCTC} onChange={handleChange} />
        </div>
        <InputField icon={<Layers />} placeholder="Skills (comma separated)" name="skills" value={formData.skills} onChange={handleChange} />
        <InputField icon={<Briefcase />} placeholder="Experience" name="experience" value={formData.experience} onChange={handleChange} />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          type="submit"
          className="w-full py-3 bg-indigo-600 rounded-xl font-semibold uppercase tracking-wide hover:bg-indigo-700 transition"
        >
          Save Profile
        </motion.button>
      </motion.form>
    ) : (
      <motion.div className="space-y-4 text-gray-300">
        <ProfileItem label="Name" value={formData.name} />
        <ProfileItem label="Company" value={formData.company} />
        <ProfileItem label="Current CTC" value={formData.currentCTC} />
        <ProfileItem label="Expected CTC" value={formData.expectedCTC} />
        <ProfileItem label="Skills" value={formData.skills} />
        <ProfileItem label="Experience" value={formData.experience} />
      </motion.div>
    )}
  </motion.div>
);

export default UserProfile;
