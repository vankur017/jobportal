import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { removeJobs , clearSuggestedJobs} from '../utils/jobSlice';
import { useDispatch } from 'react-redux';

const navLinks = [
  { name: 'Home', path: '/home' },
  { name: 'About', path: '/about' },
  { name: 'Profile', path: '/user/profile' },
  { name: 'Logout', path: '/', isLogout: true }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem('token');
      dispatch(removeJobs());
      dispatch(clearSuggestedJobs());

      setIsOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout fail:', error);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-black text-white px-6 py-4 shadow-md sticky top-0 z-50 backdrop-blur-md bg-opacity-90"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-2xl font-bold tracking-wide text-indigo-400 cursor-pointer"
        >
          <Link to="/home">Jobs Dekho</Link>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-10 text-sm font-medium">
          {navLinks.map((link) =>
            link.isLogout ? (
              <motion.button
                key={link.name}
                whileHover={{ scale: 1.1 }}
                onClick={handleLogout}
                className="hover:text-indigo-400 transition"
              >
                {link.name}
              </motion.button>
            ) : (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.1 }}
                className="hover:text-indigo-400 transition"
              >
                <Link to={link.path}>{link.name}</Link>
              </motion.div>
            )
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="text-white focus:outline-none"
          >
            <Menu size={26} />
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer */}
     <AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => setIsOpen(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Mobile Drawer */}
     <motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', stiffness: 250, damping: 25 }}
  className="fixed top-0 right-0 h-full w-64 bg-white/5 backdrop-blur-md border-l border-white/10 z-50 shadow-2xl p-4 flex flex-col rounded-l-xl"
>
  {/* Header Section */}
  <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
    <h2 className="text-xl font-semibold text-indigo-300">Menu</h2>
    <motion.button
      whileTap={{ rotate: 90 }}
      onClick={() => setIsOpen(false)}
      className="text-white hover:text-red-400"
    >
      <X size={24} />
    </motion.button>
  </div>

  {/* Navigation Links */}
  <div className="mt-1 rounded-lg bg-white/10 p-4 backdrop-blur-lg shadow-inner">
    <ul className="flex flex-col gap-5 text-white">
      {navLinks.map((link) =>
        link.isLogout ? (
          <li key={link.name}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="block text-base font-medium hover:text-indigo-400 transition"
            >
              {link.name}
            </motion.button>
          </li>
        ) : (
          <li key={link.name}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-base font-medium hover:text-indigo-400 transition"
              >
                {link.name}
              </Link>
            </motion.div>
          </li>
        )
      )}
    </ul>
  </div>
</motion.div>
    </>
  )}
</AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;