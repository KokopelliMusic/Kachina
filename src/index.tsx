import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { purple } from '@mui/material/colors'
import { createTheme, ThemeProvider } from '@mui/material'
// import { getSessionCode } from './data/session'
import { StatusBar } from '@capacitor/status-bar'
import { Account, Client, Databases, Models } from 'appwrite'
import EventEmitter from 'events'

window.api = new Client()
window.api
  .setEndpoint(process.env.REACT_APP_APPWRITE_URL)
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT)
  .setEndpointRealtime(process.env.REACT_APP_APPWRITE_REALTIME)

window.db = new Databases(window.api, 'main')

window.accountEvents = new EventEmitter()


// const Context = React.createContext<Session | null>(null)
const Context = React.createContext<Models.User<Models.Preferences> | null>(null)

const Index = () => {
  // const [session, setSession] = React.useState<Session | null>(null)
  const [session, setSession] = React.useState<Models.User<Models.Preferences> | null>(null)

  useEffect(() => {
    const account = new Account(window.api)

    account.get()
      .then(setSession)

    window.accountEvents.on('change', session => {
      console.log(session)
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

StatusBar.setBackgroundColor({ color: purple[500] })

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Index />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)