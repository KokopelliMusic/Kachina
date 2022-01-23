import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SessionType } from 'sipapu/dist/src/services/session'
import { useNotification } from '../../components/Snackbar'
import { getSessionCode } from '../../data/session'

const Session = () => {
  const [notify, Snackbar] = useNotification()
  const navigate           = useNavigate()
  
  const [code, setCode]       = useState<string>('')
  const [session, setSession] = useState<SessionType>()

  useEffect(() => {
    const code = getSessionCode()

    if (!code) {
      notify({ title: 'Catastophic Failure', message: 'The session is invalid or expired, sending you back to home in 5 seconds', severity: 'error' })
      setTimeout(() => navigate('/auth/session'), 5000)
      return
    }

    setCode(code)
  }, [])

  useMemo(() => {
    window.sipapu.Session.get(code)
      .then(setSession)
      .catch(() => {
        notify({ title: 'Session not found', message: 'The session code you entered is invalid', severity: 'error' })
      })
  }, [code])

  return <Box className="p-4 mb-32">
    <Snackbar />
    <Box>
      <Typography
        variant="h4">
        Current Session
      </Typography>
    </Box>
  </Box>
}

export default Session