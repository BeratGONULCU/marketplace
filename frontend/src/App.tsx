import { useState,useContext } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from "../src/pages/Login"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthContext, AuthProvider } from "./context/AuthContext";
import Home from './pages/Home'


function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
