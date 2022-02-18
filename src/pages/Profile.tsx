import { Typography, Button, CircularProgress, Avatar, TextField, Divider } from '@mui/material'
import { purple } from '@mui/material/colors'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { ProfileType } from 'sipapu/dist/src/services/profile'
import { useNotification } from '../components/Snackbar'
import { SpotifyType } from 'sipapu/dist/src/services/spotify'
import useRedirect from '../components/Redirect'

type ProfileProps = {
  canLoginToSpotify?: boolean
}

const Profile = ({ canLoginToSpotify }: ProfileProps) => {
  const [notify, Snackbar] = useNotification()
  const redirect           = useRedirect()

  const [user, setUser]       = useState<ProfileType>()
  const [spotify, setSpotify] = useState<SpotifyType>()

  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    window.sipapu.Profile.getCurrent()
      .then(setUser)
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })

    window.sipapu.Spotify.get()
      .then(setSpotify)
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
  }, [])

  const changeUsername = () => {
    if (!username || username.length === 0) {
      return notify({ title: 'Error', message: 'Username cannot be empty', severity: 'error' })
    }

    window.sipapu.Profile.updateUsername(username)
      .then(() => window.location.reload())
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
  }

  const unlink = () => {
    window.sipapu.Spotify.delete()
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
      Last used: {new Date(new Date(spotify.expiresAt).getTime() - 60 * 60 * 1000).toLocaleString()}
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
      Last used: {new Date(new Date(spotify.expiresAt).getTime() - 60 * 60 * 1000).toLocaleString()}
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
        <Avatar src={user.profilePicture} sx={{ width: '35vw', height: '35vw' }} />
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
            onClick={changeUsername}>Save</Button>
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

      <Box className="w-full center pt-4">
        <Button onClick={() => window.sipapu.signOut()}>
          Sign Out
        </Button>
      </Box>

      <Box className="pt-32" />
    </Box>
  </Box>
}

export default Profile