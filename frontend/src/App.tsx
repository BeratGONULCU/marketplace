import { useState,useContext } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from "../src/pages/Login"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthContext, AuthProvider } from "./context/AuthContext";
import Home from './pages/Home'
import Create from './pages/Create'
import UserSetting from './pages/UserSetting'
import ProductSetting from './pages/ProductSetting'


function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Create />} />
          <Route path="/usersetting" element={<UserSetting />} />
          <Route path="/ProductSetting" element={<ProductSetting />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
