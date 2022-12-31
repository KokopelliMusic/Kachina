import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import OTP from '../../components/OTP'
import useRedirect from '../../components/Redirect'
import { useNotification } from '../../components/Snackbar'
import { client } from '../../data/client'
import { saveSessionID } from '../../data/session'

const SessionSelect = () => {
  const [code, setCode] = useState<string>()
  const [notify, Snackbar] = useNotification()

  const navigate = useNavigate()
  const redirect = useRedirect()

  const joinSession = () => {
    if (code && code.length === 4) {

      client.req('join_session', { session_id: code })
        .then(() => {
          saveSessionID(code)
          navigate('/session/session')
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

  const createSession = () => redirect('/sessionCreation')

  return <Box className="h-4/6 flex justify-center items-center">
    <div>
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
        <Button variant="contained" onClick={createSession}>
          Create new session
        </Button>
      </div>
    </div>
  </Box>
}

export default SessionSelect