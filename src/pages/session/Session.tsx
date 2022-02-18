import { Box } from '@mui/system'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SessionType } from 'sipapu/dist/src/services/session'
import { useNotification } from '../../components/Snackbar'
import { getSessionCode } from '../../data/session'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'
import HistoryIcon from '@mui/icons-material/History'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import useRedirect from '../../components/Redirect'
import { EventTypes, NextSongEventData } from 'sipapu/dist/src/events'
import { SongEnum, SongType } from 'sipapu/dist/src/services/song'
import { Button, Typography } from '@mui/material'
import PlayerProgressionBar from '../../components/PlayerProgressionBar'

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

    // TODO
    setSong({
      id: 1,
      title: 'Hallowed Be Thy Name - 2015 Remaster',
      artist: 'Iron Maiden',
      cover: 'https://i.scdn.co/image/ab67616d0000b2735c29a88ba5341ca428f0c322',
      addedBy: 'Niels',
      createdAt: new Date(),
      playCount: 0,
      queryResult: {},
      songType: SongEnum.SPOTIFY,
      platformId: '',
      playlistId: 29,
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

  const history = () => redirect('/history')
  const queue = () => redirect('/queue')

  return <Box className="h-screen overflow-scroll">
    <Snackbar />
    <Box className="grid grid-rows-9 h-full pb-32">

      {/* Queue and History buttons */}
      <Box className="w-full flex justify-between py-2 px-4 row-span-1">
        <Button onClick={history}> <HistoryIcon    sx={{ fontSize: 35 }} /> </Button>
        <Button onClick={queue}>   <QueueMusicIcon sx={{ fontSize: 35 }} /> </Button>
      </Box>

      {/* Album cover */}
      <Box className="px-8 row-span-2">
        <img src={song?.cover ?? '/missing.jpg'} />    
      </Box>

      <Box className="px-8 pt-6 w-screen h-full row-span-3">
        {/* Song information */}
        <Box>
          <Typography
            noWrap
            variant="h5">
            {song?.title ?? ''}
          </Typography>

          <Typography
            noWrap
            variant="body1">
            {song?.artist ?? ''}
          </Typography>

        </Box>

        {/* Progress bar */}
        <Box className="pt-2">
          <PlayerProgressionBar timeLeft={40} />
        </Box>

        {/* Player buttons */}
        <Box className="w-full center">
          <Box>
            <Button onClick={previous}>  <SkipPreviousIcon sx={{ fontSize: 40 }}/></Button>
            <Button onClick={playPause}> <PauseCircleIcon  sx={{ fontSize: 50 }}/></Button>
            <Button onClick={skip}>      <SkipNextIcon     sx={{ fontSize: 40 }}/></Button>
          </Box>
        </Box>
      </Box>

    </Box>
  </Box>
}

export default Session