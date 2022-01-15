import React  from 'react'
import AnonRouter from './routers/AnonRouter'
import AuthRouter from './routers/AuthRouter'
import { HashRouter } from 'react-router-dom'
import SessionRouter from './routers/SessionRouter'

function App() {
  let sessionPath = false

  if (window.location.pathname.startsWith('/session')) {
    sessionPath = true
  }

  return <HashRouter>
    {window.sipapu.isLoggedIn() ?
      (sessionPath ? 
        <SessionRouter /> : 
        <AuthRouter />) :
      <AnonRouter />
    }
  </HashRouter>

}

export default App
