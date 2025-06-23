import React, { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { checkValidData } from '../utils/validate'

const Logon = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [isSignInForm, setForm] = useState(false)
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('')
  
  const handleLogin = async (e) => {
    e.preventDefault()

    const validationError = checkValidData(email, password)
    if (validationError) {
      setError(validationError)
       return
}

    if(isSignInForm){
      try {
        await signInWithEmailAndPassword(auth, email, password)
        setToken(auth.currentUser.accessToken)
        sessionStorage.setItem('token', auth.currentUser.accessToken)
        navigate('/home')
      } catch (err) {
        setError('Invalid email or password. Please try again.')
      }
    }
    else{
      // Registration logic
        await createUserWithEmailAndPassword(auth,email, password)
        setMessage('Account created successfully! Please sign in.')
        setEmail('')
        setPassword('')
       // Switch to sign-in form after successful registration
        setForm(true)
        setError('')
        setTimeout(() => {
          setMessage('')
        }, 3000)
        // Optionally, you can redirect to the sign-in page or show a success message
     
    }
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Animated scrolling text */}
        
        <div className="w-full max-w-4xl mb-8 sm:mb-12">
          <div className="overflow-hidden h-20 sm:h-24 relative">
            {['Software Developer', 'Frontend Engineer', 'Full Stack Developer', 'UI/UX Designer', 'Software Tester'].map((title, index) => (
              <motion.div
                key={index}
                initial={{ x: '100vw', opacity: 0 }}
                animate={{ x: '-100vw', opacity: 1 }}
                transition={{ 
                  duration: 12 + index * 2, 
                  ease: 'linear', 
                  repeat: Infinity,
                  delay: index * 3 
                }}
                className="absolute whitespace-nowrap"
                style={{ top: `${index * 20}px` }}
              >
                <span className="inline-block bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text border border-purple-400/30 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm bg-white/5">
                  {title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main form container */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="relative p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
         
           
        

            {/* Header */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text mb-2">
                {isSignInForm ? "Welcome Back" : "Join Us Today"}
              </h1>
              <p className="text-sm text-gray-300">
                {isSignInForm ? "Sign in to Jobs Dekho" : "Create your Jobs Dekho account"}
              </p>
            </motion.div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm text-center backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form 
             onSubmit={handleLogin}
             className="space-y-6">
              {/* Email field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-200">
                  Email Address
                </label>
               
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                
              </motion.div>

              {/* Password field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-200">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </motion.div>

              {/* Submit button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl relative overflow-hidden group"
              >
                <span
                className="relative z-10">
                  {isSignInForm ? "Sign In" : "Create Account"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </motion.button>

              {/* Toggle form */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center pt-4"
              >
                <button
                  type="button"
                  onClick={() => {
                    return setForm(!isSignInForm) // Toggle between sign-in and sign-up forms
                  }
                }
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200"

                >
                  {isSignInForm 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"}
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-xs text-gray-400"
        >
          <p>© 2024 Jobs Dekho. Find your dream job today.</p>
        </motion.div>
      </div>
    </div>
  )
}

export default Logon
