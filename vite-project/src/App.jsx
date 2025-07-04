import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Logon from './pages/Logon'
import JobList from './pages/JobCard'
import Dashboard from './pages/Dashboard'
import JobDetail from './pages/JobDetail' 
import ApplyJob from './pages/ApplyJob'
import { Provider } from 'react-redux';
import appStore from './utils/appStore'
import About from './pages/About'

function App() {
  return (
    <>
    <Provider store={appStore}>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/' element={<Logon />} />
        <Route path='/jobs' element={<JobList />} />
         <Route path='/about' element={<About />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/job/:id' element={<JobDetail />} /> 
        <Route path='/job/apply/:id' element={<ApplyJob />} />
      </Routes>
    </Provider>
    </>
  )
}

export default App
