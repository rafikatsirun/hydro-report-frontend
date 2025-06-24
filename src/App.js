import React from 'react'
import Home from './pages/home'
import Mitigasi from './pages/mitigasi'
import Input from './pages/input'
import Cuaca from './pages/cuaca'
import Contact from './pages/contact'
import Login from './pages/login'
import Data from './pages/data'
import Maps from './pages/maps'
import Dashboard from './pages/dashboard'
import EditLaporan from './pages/edit'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/mitigasi' element={<Mitigasi/>}/>
    <Route path='/input' element={<Input/>}/>
    <Route path='/cuaca' element={<Cuaca/>}/>
    <Route path='/contact' element={<Contact/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/data' element={<Data/>}/>
    <Route path='/maps' element={<Maps/>}/>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/edit/:id" element={<EditLaporan />} />

  </Routes>
  </BrowserRouter>  
      
  
  )
}

export default App
