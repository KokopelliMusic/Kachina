import { Button, CircularProgress, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useNotification } from '../components/Snackbar'

type LogIntoSpotifyProps = {
  redirectBack: string
  redirectUri?: string
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchSpotifyToken = (code: string, redirectUri: string, redirectBack: string, notify: any) => {
  console.log('Fetching refresh token with code:', code)
  fetch(process.env.REACT_APP_SPOTIFY_AUTH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      redirect_uri: redirectUri
    })
  }).then(res => res.json())
    .then(data => {
      if (!data) return notify({ title: 'Error', message: 'Spotify authentication failed, please try again.', severity: 'error' })

      window.sipapu.Spotify.create({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(new Date().getTime() + data.expires_in)
      }).then(() => {
        // Redirect back to original location after successful login
        window.location.href = redirectBack
      }).catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
    })
    .catch(err => {
      console.error(err)
      notify({ title: 'Error', message: err.message, severity: 'error' })
    })
}

export const createSpotifyLink = (redirectUri: string) => {
  return `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-private%20streaming%20user-read-email`
}

const LogIntoSpotify = (props: LogIntoSpotifyProps) => {
  const [notify, Snackbar] = useNotification()

  const [code, setCode] = useState<string>('')

  const BASE_URL = process.env.REACT_APP_LOCALHOST == 'true' ? process.env.REACT_APP_BASE_URL : process.env.REACT_APP_LINK_URL
  const redirectUri = BASE_URL + '/auth/login/spotify?redirect=' + props.redirectBack

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get('code')) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setCode(params.get('code')!)
    }
    // } else {
    //   const params = new URLSearchParams(window.location.href.split('?')[1])
    //   if (params.get('code')!) {
    //     setCode(params.get('code')!)
    //   }
    // }
  }, [])

  useEffect(() => {
    if (code === '') return

    fetchSpotifyToken(code, redirectUri, props.redirectBack, notify)
  }, [code])

  const redirectToSpotify = () => {
    window.location.href = createSpotifyLink(redirectUri)
  }

  if (code) {
    return <Box className="h-4/6 w-full center">
      <CircularProgress />
    </Box>
  }

  return <Box className="h-3/5 center">
    <Box>
      <Snackbar />

      <Typography
        className="w-full text-center py-4"
        variant="h2">
        Link Spotify
      </Typography>

      <Typography
        className="px-6"
        variant="body1">
        Kokopelli uses Spotify to play (most) music. 
        For it to work you need to link your Spotify account to Kokopelli. 
        Click the button below to continue. A Spotify premium account is required. 
      </Typography>

      <Box className="w-full center pt-4">
        <Button variant="contained" onClick={redirectToSpotify}>
          Link Spotify
        </Button>
      </Box>

    </Box>
  </Box>
}

export default LogIntoSpotify
