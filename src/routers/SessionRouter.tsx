import React, { useEffect, useState } from 'react'
import { AppBar, BottomNavigation, BottomNavigationAction, Paper, Toolbar, Typography } from '@mui/material'
import PlaylistAddCircleIcon from '@mui/icons-material/PlaylistAddCircle'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import SettingsIcon from '@mui/icons-material/Settings'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Box } from '@mui/system'
import { Link, useNavigate } from 'react-router-dom'
import useRedirect from '../components/Redirect'
import { getSessionCode } from '../data/session'
import { useNotification } from '../components/Snackbar'
import { Event } from 'sipapu/dist/src/events'

type SessionRouterProps = {
  element: React.ReactNode
  elevation?: number
  pageName: string
}


// @ts-expect-error This is necessary since React does not use the default value, when it is passed in the Provider, which we do.
export const EventContext = React.createContext<Event>(undefined)

/**
 * Base page component for when the user is authenticated. 
 */
const SessionRouter = ({ element, elevation, pageName }: SessionRouterProps) => {
  const redirect            = useRedirect()
  const navigate            = useNavigate()
  const [notify, Snackbar]  = useNotification()

  const [code, setCode]     = useState<string>('')
  const [event, setEvent]   = useState<Event>({
    session: getSessionCode(),
    clientType: 'kachina',
    eventType: 'generic',
    date: new Date().getTime(),
    data: { error: false },
  })

  const clickOnProfile = () => {
    redirect('/profile')
  }

  useEffect(() => {
    const code = getSessionCode()

    if (!code) {
      notify({ title: 'Catastophic Failure', message: 'The session is invalid or expired, sending you back to home in 5 seconds', severity: 'error' })
      setTimeout(() => navigate('/auth/session'), 5000)
      return
    }

    const close = window.sipapu.Session.watch(code, e => setEvent(e))

    setCode(code)
    // close the connection with the backend
    return () => {
      const fun = async () => (await close)()
      fun()
    }
  }, [])

  return <EventContext.Provider value={event}>
    <Box className="h-screen w-screen overflow-hidden">
      <Paper elevation={3}>
        <AppBar 
          position="fixed"
          elevation={elevation ?? 3}
        >
          <Toolbar style={{ height: '64px' }}>
            <img src="/kokopelli-white.png" alt="Kokopelli" style={{ height: '70%', objectFit: 'contain' }}/>
            
            <Typography 
              className="pl-4"
              variant="h6" 
              component="h1" 
              sx={{ flexGrow: 1 }}>
              Kokopelli
            </Typography>
            
            <button onClick={clickOnProfile}>
              <AccountCircleIcon />
            </button>
          </Toolbar>
        </AppBar>
      </Paper>

      <div className="h-full overflow-scroll" style={{ marginTop: '64px' }}>
        {element}
      </div>

      <Paper elevation={3}>
        <BottomNavigation
          value={pageName}
          className="fixed bottom-0 left-0 right-0"
        >
          <BottomNavigationAction 
            label="Playlist"
            component={Link}
            to="/session/playlist"
            value={'playlist'} 
            icon={<QueueMusicIcon />} />
          <BottomNavigationAction 
            label="Session"
            component={Link}
            to="/session/session"
            value={'session'} 
            icon={<LibraryMusicIcon />} />
          <BottomNavigationAction 
            label="Add"
            component={Link}
            to="/session/add"
            value={'add'}
            icon={<PlaylistAddCircleIcon />} />
          <BottomNavigationAction 
            label="Settings"
            component={Link}
            to="/session/settings"
            value={'settings'}
            icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  </EventContext.Provider> 
}


export default SessionRouter