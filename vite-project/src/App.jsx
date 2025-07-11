import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import appStore from './utils/appStore';

import Home from './pages/Home';
import Logon from './pages/Logon';
import JobList from './pages/JobCard';
import JobDetail from './pages/JobDetail'; 
import ApplyJob from './pages/ApplyJob';
import About from './pages/About';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Provider store={appStore}>
      <Routes>
        <Route path="/" element={<Logon />} />
        <Route path="/home" element={<Home />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/profile" element={<Dashboard />} />
        <Route path="/job/:id" element={<JobDetail />} /> 
        <Route path="/job/apply/:id" element={<ApplyJob />} />
      </Routes>
    </Provider>
  );
}

export default App;
