import React from 'react'
import { AppBar, BottomNavigation, BottomNavigationAction, Paper, Toolbar, Typography } from '@mui/material'
import PlaylistAddCircleIcon from '@mui/icons-material/PlaylistAddCircle'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import SettingsIcon from '@mui/icons-material/Settings'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Box } from '@mui/system'
import { Link, Route, Routes } from 'react-router-dom'
import NotFound from '../pages/NotFound'
import Playlists from '../pages/Playlists'
import Session from '../pages/session/Session'
import Settings from '../pages/session/Settings'
import Add from '../pages/session/Add'
import Profile from '../pages/Profile'
import useRedirect from '../components/Redirect'

const pages = {
  playlists: <Playlists />,
  session: <Session />,
  add: <Add />,
  settings: <Settings />,
  profile: <Profile />,
  notFound: <NotFound to="/session/session" />
}

/**
 * Base page component for when the user is authenticated. 
 */
const SessionRouter = () => {
  const redirect = useRedirect()

  const [page, setPage] = React.useState('playlists')

  const handleChange = (_event: unknown, newPage: string) => setPage(newPage)

  const clickOnProfile = () => {
    setPage('profile')
    redirect('/profile')
  }

  return <Box className="h-screen w-screen overflow-hidden">
    <Paper elevation={3}>
      <AppBar 
        position="fixed"
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
      <Routes>
        <Route path="/session/playlists" element={pages.playlists} />
        <Route path="/session/session" element={pages.session} />
        <Route path="/session/add" element={pages.add} />
        <Route path="/session/profile" element={pages.profile} />
        <Route path="/session/settings" element={pages.settings} />
        <Route path="/session/*" element={pages.notFound} />
      </Routes>
    </div>

    <Paper elevation={3}>
      <BottomNavigation
        value={page}
        onChange={handleChange} 
        className="fixed bottom-0 left-0 right-0"
      >
        <BottomNavigationAction 
          label="Playlists"
          component={Link}
          to="/session/playlists"
          value={'playlists'} 
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
}


export default SessionRouter