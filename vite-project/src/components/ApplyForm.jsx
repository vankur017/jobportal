// App.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase/config.js'; // Your firebase config file
import Navbar from './Navbar.jsx';

const storage = getStorage(app);

export default function App() {
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  

      const onSubmit = async (data) => {
        setIsSubmitting(true);
        console.log(data);
        
      
        try {
          // Extract the resume file
          const file = data.resume[0]; // resume is an array from input
          const fileName = `resumes/${Date.now()}-${file.name}`;
          const storageRef = ref(storage, fileName);
        
          // Upload to Firebase Storage
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
        
          // You can now save downloadURL + form data in Firestore or send to backend
          console.log('Resume uploaded:', downloadURL);
          console.log('Full form data:', {
            ...data,
            resumeURL: downloadURL,
          });
        
          setSubmitted(true);
          reset();
        } catch (error) {
          console.error('Upload failed:', error);
          console.log('Something went wrong while uploading your resume.');
        }
      
        setIsSubmitting(false);
      };
  

  if(isSubmitting){
     return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-gray-400">Submitting, Please Wait....</p>
        </div>
      </div>
    );
  }
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center">
          <p className="text-xl font-semibold mb-4">🎉 Application Submitted!</p>
          <p className="text-sm text-gray-400">We’ll get back to you shortly.</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <div className="min-h-screen from-slate-900 via-zinc-900 to-slate-900 text-white flex items-center justify-center px-4">
      
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-900 rounded-2xl p-8 text-center shadow-lg"
              >
                <motion.div
                  className="w-10 h-10 border-4 border-dashed border-gray-400 rounded-full animate-spin mx-auto mb-4"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                />
                <p className="text-lg font-medium">Submitting your application...</p>
              </motion.div>
            ) : submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-900 text-green-200 rounded-2xl p-8 text-center shadow-lg"
              >
                <p className="text-xl font-semibold">🎉 Application Submitted!</p>
                <p className="text-sm mt-2 opacity-80">We’ll get back to you shortly.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-gray-900 rounded-2xl p-8 shadow-lg space-y-6"
              >
                <motion.h2
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  🚀 Apply for a Role
                </motion.h2>
                <div>
                  <label className="block mb-1 text-sm text-gray-400">Full Name</label>
                  <input
                    {...register('fullName', { required: true })}
                    type="text"
                    className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Ankur Verma"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-400">Gender</label>
                  <select
                    {...register('gender', { required: true })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-400">Upload Resume (PDF)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    {...register('resume', { required: true })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                </div>
                <button type="submit" className='w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 '>
                  <motion.span
                    className="text-white font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Submit Application
                  </motion.span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
