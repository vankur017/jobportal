import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const navLinks = [
  { name: 'Home', path: '/home' },
  { name: 'About', path: '/about' },
  { name: 'Profile', path: '/profile' },
  { name: 'Logout', path: '/', isLogout: true }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
      navigate('/'); // or navigate to login if you have one
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-black text-white px-6 py-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide text-indigo-400">
          <Link to="/home">Jobs Dekho</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-sm font-medium">
          {navLinks.map((link) =>
            link.isLogout ? (
              <button
                key={link.name}
                onClick={handleLogout}
                className="hover:text-indigo-400 transition"
              >
                {link.name}
              </button>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-indigo-400 transition"
              >
                {link.name}
              </Link>
            )
          )}
        </div>

        {/* Burger Icon (Mobile only) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(true)} className="text-white focus:outline-none">
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Right Side) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 w-64 h-full bg-zinc-900 z-50 shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">Menu</h2>
                <button onClick={() => setIsOpen(false)} className="text-white">
                  <X size={24} />
                </button>
              </div>

              <ul className="space-y-6 text-white">
                {navLinks.map((link) =>
                  link.isLogout ? (
                    <li key={link.name}>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          handleLogout();
                        }}
                        className="block text-base hover:text-indigo-400"
                      >
                        {link.name}
                      </button>
                    </li>
                  ) : (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className="block text-base hover:text-indigo-400"
                      >
                        {link.name}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
