import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Sipapu } from 'sipapu'
import { Session } from '@supabase/gotrue-js'
import { purple } from '@mui/material/colors'
import { createTheme, ThemeProvider } from '@mui/material'
import { StatusBar } from '@capacitor/status-bar'
import { client } from './data/client'

window.sipapu = new Sipapu('kachina', process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY, process.env.REACT_APP_TAWA_URL)
const Context = React.createContext<Session | null>(null)

type AuthSession = {
  token: string,
  valid: boolean,
  user: {
    id: number,
    username: string,
    profile_picture: string
  }
}

const Index = () => {

  const [auth, setAuth]       = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {

    client.req('get_user', {})
      .then(res => {
        console.log('Logged in')
        setAuth(true)
      })
      .catch(err => {
        console.log('Not logged in')
        setAuth(false)
      })
      .finally(() => setLoading(false))

    // TODO: Set session


    // setSession(window.sipapu.client.auth.session())


    // const path = window.location.pathname
    // const code = getSessionCode()
    
    // if (code) {
    //   window.sipapu.Session.setSessionId(code)
    // }

    // if (path === '/') {
    //   if (getSessionCode()) {
    //     window.location.href = '/session/session'
    //   } else if (window.sipapu.isLoggedIn()) {
    //     window.location.href = '/auth/session'
    //   }
    // }

    // window.sipapu.client.auth.onAuthStateChange((_event, session) => setSession(session))
  }, [])

  if (loading) {
    return null
  }

  return <App auth={auth}/>
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