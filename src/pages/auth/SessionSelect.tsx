import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import OTP from '../../components/OTP'
import { useNotification } from '../../components/Snackbar'

const SessionSelect = () => {
  const [code, setCode] = useState<string>()
  const [notify, Snackbar] = useNotification()

  const joinSession = () => {
    if (code && code.length === 4) {
      window.sipapu.Session.join(code)
        .then(() => {
          alert('Joined session')
        })
        .catch(err => {
          if (err.message === 'session is undefined') {
            notify({ title: 'Session not found', message: 'The session code you entered is invalid', severity: 'error' })
          }
        })
    } else {
      notify({ title: 'Invalid code', message: 'A session code always has 4 letters', severity: 'info' })
    }
  }

  return <Box>
    <Snackbar />

    <Typography
      className="text-center w-full pt-4 px-8"
      variant="h4"
      component="h1">
      Get started with Kokopelli
    </Typography>

    <Typography
      className="text-center w-full pt-4 px-8"
      component="h2">
      Fill in the session code of an existing session...
    </Typography>

    <OTP setCode={setCode}/>

    <div className="center w-full pt-6 pb-4">
      <Button variant="contained" onClick={joinSession}>
        Join session
      </Button>
    </div>

    <Typography
      className="text-center w-full pt-4"
      component="h2">
      ...or create a new session
    </Typography>

    <div className="center w-full pt-6">
      <Button variant="contained">
        Create new session
      </Button>
    </div>

  </Box>
}

export default SessionSelect