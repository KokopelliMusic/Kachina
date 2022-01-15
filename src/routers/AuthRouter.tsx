import React from 'react'
import { AppBar, BottomNavigation, BottomNavigationAction, Paper, Toolbar, Typography } from '@mui/material'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Box } from '@mui/system'
import { Link, Route, Routes } from 'react-router-dom'
import NotFound from '../pages/NotFound'
import Playlists from '../pages/Playlists'
import SessionSelect from '../pages/auth/SessionSelect'
import Profile from '../pages/Profile'
import Help from '../pages/auth/Help'
import { HelpCenter } from '@mui/icons-material'

const pages = {
  playlists: <Playlists />,
  session: <SessionSelect />,
  profile: <Profile />,
  help: <Help />,
  notFound: <NotFound to="/playlists" />
}

/**
 * Base page component for when the user is authenticated. 
 */
const AuthRouter = () => {
  const [page, setPage] = React.useState('session')

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
        <Route path="profile" element={pages.profile} />
        <Route path="help" element={pages.help} />
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
          label="Help"
          component={Link}
          to="help"
          value={'help'} 
          icon={<HelpCenter />} />
      </BottomNavigation>
    </Paper>
  </Box>
}


export default AuthRouter