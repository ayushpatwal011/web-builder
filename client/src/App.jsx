import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { useGetCurrentUser } from './hooks/useGetCurrentUser'
import Dashboard from './pages/Dashboard'
import Generated from './pages/Generated'
import { useSelector } from 'react-redux'
import WebsiteEditor from './pages/Editor'
import LiveSite from './pages/LiveSite'
import Pricing from './pages/Pricing'

export const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'

const App = () => {
  useGetCurrentUser()
  const { userData } = useSelector(state => state.user)
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/dashboard' element={userData ? <Dashboard/> : <Home/>} />
      <Route path='/generated' element={userData ? <Generated/> : <Home/>} />
      <Route path='/editor/:id' element={userData ? <WebsiteEditor/> : <Home/>} />
      <Route path='/site/:id' element={<LiveSite/>} />
      <Route path='/pricing' element={<Pricing/>} />
      <Route path='*' element={<Home/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App