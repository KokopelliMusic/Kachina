import { Typography, Button, CircularProgress, Avatar, TextField, Divider } from '@mui/material'
import { purple } from '@mui/material/colors'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useNotification } from '../components/Snackbar'
import useRedirect from '../components/Redirect'
import { getSessionID, leaveSession } from '../data/session'
import { client } from '../data/client'
import { Spotify, User } from '../types/tawa'

type ProfileProps = {
  canLoginToSpotify?: boolean
}

const Profile = ({ canLoginToSpotify }: ProfileProps) => {
  const [notify, Snackbar] = useNotification()
  const redirect           = useRedirect()

  const [user, setUser]       = useState<User>()
  const [spotify, setSpotify] = useState<Spotify>()

  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    client.req('get_user', {})
      .then(setUser)
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })

    client.req('get_spotify', {})
      .then(setSpotify)
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
  }, [])

  const changeUsername = () => {
    notify({
      title: 'Error',
      message: 'Zieke prank, werkt nog niet',
      severity: 'error'
    })
  }

  const unlink = () => {
    client.req('delete_spotify', {})
      .then(() => window.location.reload())
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
  }

  // TODO skeleton
  if (!user) {
    return <Box className="h-4/6 w-full center">
      <CircularProgress />
    </Box>
  }

  const spotifyElementSession = spotify ? <Box>
    <Typography
      variant="body1"
      className="w-full text-center">
      You are logged into spotify!
    </Typography>
    
    <Typography
      variant="body1"
      className="w-full text-center">
      Last used: {new Date(new Date(spotify.expires_at).getTime() - 60 * 60 * 1000).toLocaleString()}
    </Typography>

    <Typography
      variant="body1"
      className="w-full px-8 text-center">
      During a session you cannot sign out of Spotify, leave the session first!
    </Typography>

  </Box>
    : <Box>
      <Box>
        <Typography
          variant="body1"
          className="px-4">
          You are not logged in to Spotify! <br/>
          But during a session you cannot change this, so if you want to login to Spotify, please leave your session first.
        </Typography>
      </Box>
    </Box>

  const spotifyElement = spotify ? <Box>
    <Typography
      variant="body1"
      className="w-full text-center">
      You are logged into spotify!
    </Typography>
    
    <Typography
      variant="body1"
      className="w-full text-center">
      Last used: {new Date(new Date(spotify.expires_at).getTime() - 60 * 60 * 1000).toLocaleString()}
    </Typography>

    <Box className="w-full center pt-2">
      <Button onClick={unlink}>
        Unlink Spotify
      </Button>
    </Box>

  </Box> :
    <Box className="w-full">
      <Box>
        <Typography
          variant="body1"
          className="px-4">
          You are not logged in to Spotify!<br/> 
          Kokopelli uses your Spotify Premium account to play music. Login to Spotify to continue.
        </Typography>
        <Box className="center pt-2">
          <Button onClick={() => redirect('/login/spotify')}>Login to Spotify</Button>
        </Box>
      </Box>
    </Box>

  return <Box className="w-full h-full">
    <Snackbar />

    <Box className="flex flex-col justify-center items-center w-full" sx={{ backgroundColor: purple[500] }}>
      <div className="pt-8">
        <Avatar src={user.profile_picture} sx={{ width: '35vw', height: '35vw' }} />
      </div>

      <Typography 
        variant="h5"
        className="text-center px-4 pt-4"
        width="100%"
        noWrap
        sx={{ color: 'white' }}>
        {user.username}
      </Typography>

      <div className="pb-8" />
    </Box>

    <Box className="h-auto">
      <Box className="w-full pt-4">
        <Typography
          variant="h6"
          className="pl-4 pb-2">
          Settings
        </Typography>
        <Box className="flex justify-center items-center space-x-4">
          <TextField
            label="New username"
            value={username}
            onChange={e => setUsername(e.target.value)}/>

          <Button 
            className="ml-2"
            variant="contained" 
            onClick={changeUsername}
          >Save</Button>
        </Box>

        <Box className="w-full center pt-2">
          <Button onClick={() => notify({ title: 'Not supported', message: 'Changing your profile picture is not supported yet!', severity: 'info'})}>
            Change profile picture
          </Button>
        </Box>
      </Box>

      <Box className="w-full center pt-4"><Divider className="w-11/12" /></Box>

      <Box>
        <Typography
          variant="h6"
          className="pl-4 pb-2 pt-2">
          Spotify
        </Typography>

      </Box>
      {canLoginToSpotify === false ? spotifyElementSession : spotifyElement}

      <Box className="w-full center pt-4"><Divider className="w-11/12" /></Box>

      {getSessionID() ? <Box className="w-full pt-4">
        <Typography
          variant="h6"
          className="pl-4 pb-2">
          Session
        </Typography>

        <Typography
          variant="body1"
          className="w-full text-center">
          You are in a session!
        </Typography>
        
        <Typography
          variant="body1"
          className="w-full text-center">
          Session code: {getSessionID()}
        </Typography>

        <Box className="w-full center pt-2">
          <Button onClick={leaveSession}>
            Leave session
          </Button>
        </Box>
        <Box className="w-full center pt-4"><Divider className="w-11/12" /></Box>
      </Box> : null}

      <Box className="w-full center pt-4">
        <Button onClick={() => notify({
          title: 'Not supported',
          message: 'Logging out is not supported yet!',
          severity: 'info'
        })}>
          Sign Out
        </Button>
      </Box>

      <Box className="pt-32" />
    </Box>
  </Box>
}

export default Profile