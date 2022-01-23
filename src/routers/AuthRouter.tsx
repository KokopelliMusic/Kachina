import React from 'react'
import { AppBar, BottomNavigation, BottomNavigationAction, Paper, Toolbar, Typography } from '@mui/material'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Box } from '@mui/system'
import { Link } from 'react-router-dom'
import { HelpCenter } from '@mui/icons-material'
import useRedirect from '../components/Redirect'

type AuthRouterProps = {
  element: React.ReactNode
  elevation?: number
  pageName: string
}


/**
 * Base page component for when the user is authenticated. 
 */
const AuthRouter = ({ element, elevation, pageName }: AuthRouterProps) => {
  const redirect = useRedirect()

  // const [page, setPage] = React.useState('session')
  // const [shadow, setShadow] = React.useState(3)

  // const handleChange = (_event: unknown, newPage: string) => {
  //   setShadow(3)
  //   setPage(newPage)
    
  //   document.getElementById('main-div')?.scrollTo(0,0)
  // }

  const clickOnProfile = () => {
    // setPage('profile')
    // setShadow(0)
    redirect('/profile')
  }
  
  return <Box className="h-screen w-screen overflow-hidden">
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

    <div className="h-full overflow-scroll" id="main-div" style={{ marginTop: '64px' }}>
      {element}
    </div>

    <Paper elevation={3}>
      <BottomNavigation
        value={pageName}
        // onChange={handleChange} 
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