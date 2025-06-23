import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Logon from './pages/Logon'
import JobList from './pages/JobList'
import Dashboard from './pages/Dashboard'
import JobDetail from './pages/JobDetail' 
import ApplyJob from './pages/ApplyJob'

function App() {
  return (
    <>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/' element={<Logon />} />
        <Route path='/jobs' element={<JobList />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/jobs/:id' element={<JobDetail />} /> 
        <Route path='/jobs/apply/:id' element={<ApplyJob />} />
      </Routes>
    </>
  )
}

export default App
