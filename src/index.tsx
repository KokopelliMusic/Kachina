import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { purple } from '@mui/material/colors'
import { createTheme, ThemeProvider } from '@mui/material'
import { StatusBar } from '@capacitor/status-bar'
import { client } from './data/client'
import { getSessionID } from './data/session'

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

    const path = window.location.pathname
    const code = getSessionID()
    
    if (path === '/') {
      if (code) {
        window.location.href = '/session/session'
      } else if (auth) {
        window.location.href = '/auth/session'
      }
    }
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