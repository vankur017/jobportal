import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { removeJobs } from '../utils/jobSlice';
import { useDispatch } from 'react-redux';

const navLinks = [
  { name: 'Home', path: '/home' },
  { name: 'About', path: '/about' },
  { name: 'Profile', path: '/profile' },
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
      setIsOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
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
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-64 h-full bg-zinc-900 z-50 shadow-xl p-6 flex flex-col justify-start"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-bold text-white">Menu</h2>
                <motion.button
                  whileTap={{ rotate: 90 }}
                  onClick={() => setIsOpen(false)}
                  className="text-white"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <ul className="space-y-6 text-white">
                {navLinks.map((link) =>
                  link.isLogout ? (
                    <li key={link.name}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          setIsOpen(false);
                          handleLogout();
                        }}
                        className="block text-base hover:text-indigo-400"
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
                          className="block text-base hover:text-indigo-400"
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    </li>
                  )
                )}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;