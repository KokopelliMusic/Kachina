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

const pages = {
  playlists: <h1>Playlists</h1>,
  session: <h1>Session</h1>,
  add: <h1>Add</h1>,
  settings: <h1>Settings</h1>,
  profile: <h1>Profile</h1>,
  notFound: <NotFound to="/playlists" />
}

/**
 * Base page component for when the user is authenticated. 
 */
const AuthRouter = () => {
  const [page, setPage] = React.useState('playlists')

  const handleChange = (_event: unknown, newPage: string) => setPage(newPage)

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
          
          <Link to="/profile" onClick={() => setPage('profile')}>
            <AccountCircleIcon />
          </Link>
        </Toolbar>
      </AppBar>
    </Paper>

    <div className="h-full overflow-scroll" style={{ marginTop: '64px' }}>
      <Routes>
        <Route path="playlists" element={pages.playlists} />
        <Route path="session" element={pages.session} />
        <Route path="add" element={pages.add} />
        <Route path="profile" element={pages.profile} />
        <Route path="settings" element={pages.settings} />
        <Route path="*" element={pages.notFound} />
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
          to="playlists"
          value={'playlists'} 
          icon={<QueueMusicIcon />} />
        <BottomNavigationAction 
          label="Session"
          component={Link}
          to="session"
          value={'session'} 
          icon={<LibraryMusicIcon />} />
        <BottomNavigationAction 
          label="Add"
          component={Link}
          to="add"
          value={'add'}
          icon={<PlaylistAddCircleIcon />} />
        <BottomNavigationAction 
          label="Settings"
          component={Link}
          to="settings"
          value={'settings'}
          icon={<SettingsIcon />} />
      </BottomNavigation>
    </Paper>
  </Box>
}


export default AuthRouter