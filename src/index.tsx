import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Sipapu } from 'sipapu'
import { Session } from '@supabase/gotrue-js'
import { purple } from '@mui/material/colors'
import { createTheme, ThemeProvider } from '@mui/material'
import { getSessionCode } from './data/session'

window.sipapu = new Sipapu('kachina', process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY, process.env.REACT_APP_TAWA_URL)
const Context = React.createContext<Session | null>(null)

const Index = () => {
  const [session, setSession] = React.useState<Session | null>(null)

  useEffect(() => {
    setSession(window.sipapu.client.auth.session())

    const path = window.location.pathname
    const code = getSessionCode()
    
    if (code) {
      window.sipapu.Session.setSessionId(code)
    }

    if (getSessionCode() && path === '/#/') {
      window.location.href = '/#/session/session'
    }

    window.sipapu.client.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return <Context.Provider value={session}>
    <App />
  </Context.Provider>
}

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: '#f44336',
    },
  },
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Index />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)