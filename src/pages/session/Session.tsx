import { Button, LinearProgress, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SessionType } from 'sipapu/dist/src/services/session'
import { useNotification } from '../../components/Snackbar'
import { getSessionCode } from '../../data/session'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'
import useRedirect from '../../components/Redirect'
import { EventTypes, NextSongEventData } from 'sipapu/dist/src/events'
import { SongType } from 'sipapu/dist/src/services/song'

const Session = () => {
  const [notify, Snackbar] = useNotification()
  const navigate           = useNavigate()
  const redirect           = useRedirect()
  
  const [code, setCode]       = useState<string>('')
  const [session, setSession] = useState<SessionType>()
  
  const [song, setSong]         = useState<SongType>()
  const [progress, setProgress] = useState<number>(77)

  useEffect(() => {
    const code = getSessionCode()

    if (!code) {
      notify({ title: 'Catastophic Failure', message: 'The session is invalid or expired, sending you back to home in 5 seconds', severity: 'error' })
      setTimeout(() => navigate('/auth/session'), 5000)
      return
    }

    const close = window.sipapu.Session.watch(code, event => {
      if (event.eventType === EventTypes.NEXT_SONG) {
        const data = event.data as NextSongEventData
        setSong(data.song)
      }
    })

    setCode(code)
    // close the connection with the backend
    return () => {
      const fun = async () => (await close)()
      fun()
    }
  }, [])

  useMemo(() => {
    window.sipapu.Session.get(code)
      .then(setSession)
      .catch(() => {
        notify({ title: 'Session not found', message: 'The session code you entered is invalid', severity: 'error' })
      })
  }, [code])

  const skip = () => {
    window.sipapu.Session.notifyEvent(code, EventTypes.SKIP_SONG, {})
  }

  const playPause = () => {
    window.sipapu.Session.notifyEvent(code, EventTypes.PLAY_PAUSE, {})
  }

  const previous = () => {
    window.sipapu.Session.notifyEvent(code, EventTypes.PREVIOUS_SONG, {})
  }

  const history = () => {
    redirect('/history')
  }

  const queue = () => {
    redirect('/queue')
  }

  return <Box className="p-4">
    <Snackbar />
    <Box className="grid grid-rows-6" sx={{ height: '90vh' }}>
      <Typography
        className="w-full text-center"
        variant="h4">
        Current Session
      </Typography>

      <Box className="row-span-4">
        <img 
          src="/missing.jpg" 
          alt="Cover" 
          className="px-4" />

        <Box className="w-full center pt-6 pb-4">
          <LinearProgress className="w-5/6" variant="determinate" value={progress}/>
        </Box>

        <Box className="w-full center">
          <Box>
            <Button onClick={previous}>  <SkipPreviousIcon sx={{ fontSize: 40 }}/></Button>
            <Button onClick={playPause}> <PauseCircleIcon  sx={{ fontSize: 50 }}/></Button>
            <Button onClick={skip}>      <SkipNextIcon     sx={{ fontSize: 40 }}/></Button>
          </Box>
        </Box>
      </Box>

      <Box className="flex justify-evenly items-center mb-32 row-span-1">
        <Button variant="contained" onClick={history}>
          History
        </Button>

        <Button variant="contained" onClick={queue}>
          Queue
        </Button>
      </Box>

    </Box>
  </Box>
}

export default Session