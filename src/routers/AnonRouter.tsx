import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Welcome from '../pages/Welcome'

const AnonRouter = () => {
  return <Routes>
    <Route path="/" element={<Welcome />} />
    <Route path="*" element={<Welcome />} />
  </Routes>

}

export default AnonRouter