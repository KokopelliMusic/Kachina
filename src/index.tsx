import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Sipapu } from 'sipapu'
import { purple } from '@mui/material/colors'
import { createTheme, ThemeProvider } from '@mui/material'
// import { getSessionCode } from './data/session'
import { StatusBar } from '@capacitor/status-bar'
import { Account, Client, Models } from 'appwrite'
import EventEmitter from 'events'

window.sipapu = new Sipapu('kachina', process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY, process.env.REACT_APP_TAWA_URL)

// const Context = React.createContext<Session | null>(null)
const Context = React.createContext<Models.User<Models.Preferences> | null>(null)

const Index = () => {
  // const [session, setSession] = React.useState<Session | null>(null)
  const [session, setSession] = React.useState<Models.User<Models.Preferences> | null>(null)

  useEffect(() => {
    // setSession(window.sipapu.client.auth.session())
    window.api = new Client()

    window.accountEvents = new EventEmitter()

    window.api
      .setEndpoint(process.env.REACT_APP_APPWRITE_URL)
      .setProject(process.env.REACT_APP_APPWRITE_PROJECT)
      .setEndpointRealtime(process.env.REACT_APP_APPWRITE_REALTIME)

    const account = new Account(window.api)

    account.get()
      .then(setSession)

    const path = window.location.pathname
    
    // if (code) {
    //   window.sipapu.Session.setSessionId(code)
    // }


    window.accountEvents.on('change', session => {
      console.log(session)
      setSession(session)
    })

    // if (path === '/') {
    //   if (getSessionCode()) {
    //     window.location.href = '/session/session'
    //   // } else if (window.sipapu.isLoggedIn()) {
    //   } else if (session !== null) {
    //     window.location.href = '/auth/session'
    //   }
    // }

    // window.sipapu.client.auth.onAuthStateChange((_event, session) => setSession(session))
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

StatusBar.setBackgroundColor({ color: purple[500] })

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Index />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)