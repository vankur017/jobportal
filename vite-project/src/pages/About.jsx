import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white px-6 py-10">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text mb-6">
          Who's Building This?
        </h1>

        <p className="text-gray-400 text-lg leading-relaxed mb-10">
          Hi 👋 I'm <span className="text-white font-semibold">Ankur Verma</span>, an Associate Software Developer at DXC Technology. 
          I design highly interactive web apps using modern frontend technologies like React, Redux, Javascript, Tailwind CSS, and Framer Motion — with a strong focus on minimal design, performance, and animation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 border border-zinc-700 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-2">Tech Stack</h3>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              <li>React, Redux, Tailwind CSS</li>
              <li>Framer Motion, Javascript, TypeScript, Vite</li>
              <li>Firebase (Auth, Firestore, Functions)</li>
              <li>Node.js, Git</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 border border-zinc-700 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-2">Fun Fact</h3>
            <p className="text-gray-400">
              I transitioned from Mechanical Engineering into web development and now build smooth, animated interfaces that don't just work, but feel delightful — like this one 😉
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <a
            href="https://linkedin.com/in/ankur-verma-6b80b416a/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Connect on LinkedIn
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
