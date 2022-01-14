import React from 'react'
import AnonRouter from './routers/AnonRouter'
import AuthRouter from './routers/AuthRouter'
import { HashRouter } from 'react-router-dom'

// TODO error handler hiero


function App() {
  return <HashRouter>
    {window.sipapu.isLoggedIn() ? <AuthRouter /> : <AnonRouter />}
  </HashRouter>
}

export default App
