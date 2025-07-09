import React from "react";
import { motion } from "framer-motion";

const SuccessModal = ({ onClose }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
      className="min-h-screen bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-[#0f0f0f] rounded-3xl p-10 max-w-sm w-full border border-[#222] shadow-xl text-center"
      >
        <h2 className="text-2xl font-semibold text-white mb-4">application received</h2>
        <p className="text-gray-400 text-sm mb-8">we’ll reach out to you shortly</p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-white text-black font-medium uppercase tracking-wide hover:bg-gray-200 transition"
        >
          close
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SuccessModal;
