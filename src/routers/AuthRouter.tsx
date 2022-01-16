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
import SessionCreation from '../pages/auth/SessionCreation'
import EditPlaylist from '../pages/EditPlaylist'
import useRedirect from '../components/Redirect'
import Add from '../pages/add/Add'
import Spotify from '../pages/add/Spotify'
import YouTube from '../pages/add/YouTube'

const pages = {
  playlists: <Playlists />,
  session: <SessionSelect />,
  profile: <Profile />,
  sessionCreation: <SessionCreation />,
  edit: <EditPlaylist />,
  add: <Add />,
  spotify: <Spotify />,
  youtube: <YouTube />,
  help: <Help />,
  notFound: <NotFound to="/auth/session" />
}

/**
 * Base page component for when the user is authenticated. 
 */
const AuthRouter = () => {
  const redirect = useRedirect()

  const [page, setPage] = React.useState('session')

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
        <Route path="/auth/playlists" element={pages.playlists} />
        <Route path="/auth/session" element={pages.session} />
        <Route path="/auth/profile" element={pages.profile} />
        <Route path="/auth/edit/:id" element={pages.edit} />
        <Route path="/auth/add/:id" element={pages.add} />
        <Route path="/auth/spotify/:id" element={pages.spotify} />
        <Route path="/auth/youtube/:id" element={pages.youtube} />
        <Route path="/auth/sessionCreation" element={pages.sessionCreation} />
        <Route path="/auth/help" element={pages.help} />
        <Route path="/auth/*" element={pages.notFound} />
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
          to="/auth/playlists"
          value={'playlists'} 
          icon={<QueueMusicIcon />} />
        <BottomNavigationAction 
          label="Session"
          component={Link}
          to="/auth/session"
          value={'session'} 
          icon={<LibraryMusicIcon />} />
        <BottomNavigationAction 
          label="Help"
          component={Link}
          to="/auth/help"
          value={'help'} 
          icon={<HelpCenter />} />
      </BottomNavigation>
    </Paper>
  </Box>
}


export default AuthRouter