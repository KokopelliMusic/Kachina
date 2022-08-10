import { Box } from '@mui/system'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../../components/Snackbar'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'
import HistoryIcon from '@mui/icons-material/History'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import useRedirect from '../../components/Redirect'
import { Button, Typography, Skeleton } from '@mui/material'
import PlayerProgressionBar from '../../components/PlayerProgressionBar'
import Kokopelli from '../../components/Kokopelli'
import { EventContext } from '../../routers/SessionRouter'
import { getSessionCode } from '../../data/session'
import * as sipapu from 'sipapu-2'

const Session = () => {
  const [notify, Snackbar] = useNotification()
  const navigate           = useNavigate()
  const redirect           = useRedirect()
  const event              = useContext(EventContext)
  
  const [loading, setLoading]           = useState<boolean>(false)
  const [session, setSession]           = useState<sipapu.Session>()
  const [song, setSong]                 = useState<sipapu.Song>()
  const [progress, setProgress]         = useState<number>(77)
  const [progInterval, setProgInterval] = useState<NodeJS.Timeout>()
  const [playing, setPlaying]           = useState<boolean>(false)

  const skip = () => {
    // window.sipapu.Session.notifyEvent(event.session, EventTypes.SKIP_SONG, {})
    notify({ title: 'Error', message: 'Not implemented yet!', severity: 'error' })
  }

  const playPause = () => {
    // window.sipapu.Session.notifyEvent(event.session, EventTypes.PLAY_PAUSE, {})
    notify({ title: 'Error', message: 'Not implemented yet!', severity: 'error' })
  }

  const previous = () => {
    // window.sipapu.Session.notifyEvent(event.session, EventTypes.PREVIOUS_SONG, {})
    notify({ title: 'Error', message: 'Not implemented yet!', severity: 'error' })
  }

  const history = () => redirect('/history')
  const queue = () => redirect('/queue')

  useEffect(() => {
    if (song) return

    const code = getSessionCode()
    window.db.getDocument('session', code)
      .then(async session => {
        const song = await window.db.getDocument('song', session.currently_playing)
        setSong(song as unknown as sipapu.Song)
        setSession(session as unknown as sipapu.Session)
      })
      .then(() => setPlaying(true))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    // TODO pak het nummer van de cache ofzo
    // switch (event.eventType) {

    // case EventTypes.PLAY_SONG:
    //   setPlaying(true)
    //   setSong((JSON.parse(event.data as unknown as string).song) as SongType)
    //   break

    // case EventTypes.NEXT_SONG:
    //   setPlaying(true)
    //   setSong((JSON.parse(event.data as unknown as string).song) as SongType)
    //   setProgress(0)
    //   break

    // case EventTypes.PREVIOUS_SONG:
    //   setProgress(0)
    //   break
    
    // case EventTypes.SONG_FINISHED:
    // case EventTypes.SKIP_SONG:
    //   setPlaying(false)
    //   setProgress(0)
    //   break

    // case EventTypes.PLAY_PAUSE:
    //   setPlaying(!playing)
    //   break

    // default:
    //   // Do nothing by default
    //   // This is so we do not trigger the useMemo below, which would cause a re-render
    //   break

    // }
  }, [event])

  useEffect(() => {
    if (song?.length && playing) {
      setProgInterval(setInterval(() => {
        if (song?.length) {
          setProgress(p => p + 1000)
        }
      }, 1000))
    }

    if (!playing) {
      // @ts-expect-error kut ts
      clearInterval(progInterval)
    }

    return () => {
      // @ts-expect-error kut ts
      clearInterval(progInterval)
    }
  }, [playing])

  // useMemo prevents a rerender when any event fires, this makes everything a lot quicker
  return useMemo(() => {
    if (loading) {
      return <Box className="h-screen">
        <Snackbar />
        <Box className="grid grid-rows-9 h-full pb-32">
          {/* History buttons */}
          <Box className="w-full flex justify-between py-2 px-4 row-span-1">
            <Button> <Skeleton variant="circular" width={35} height={35} /> </Button>
            <Button> <Skeleton variant="circular" width={35} height={35} /> </Button>
          </Box>
  
          {/* Album cover */}
          <Box className="px-8 row-span-2">
            <Skeleton variant="rectangular">
              <img src='/missing.jpg' />
            </Skeleton>
          </Box>
  
          {/* Song info */}
          <Box className="px-8 pt-6 w-screen h-full row-span-3">
            <Box>
              <Skeleton>
                <Typography noWrap variant="h4">
                  This is a very long song title that should be truncated
                </Typography>
              </Skeleton>
    
              <Skeleton>
                <Typography variant="body1">
                  The songs artist is a bit shorter
                </Typography>
              </Skeleton>
            </Box>
  
            {/* Progress bar */}
            <Box className="pt-2 pb-2 pt-4">
              <Skeleton className="w-full" height={20}/>
            </Box>
  
            {/* Player buttons */}
            <Box className="w-full center">
              <Box className="flex items-center space-x-4">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="circular" width={50} height={50} />
                <Skeleton variant="circular" width={40} height={40} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    }
  
    if (!song) {
      return <Box className="h-screen">
        <Snackbar />
  
        <Box className="grid grid-rows-4 h-full pb-32">
  
          <Box className="row-span-1 w-full text-center pt-4">
            <Typography
              variant="h4">
              No song is playing!
            </Typography>
  
            <Typography
              className="px-4 pt-2"
              variant="body1">
              This could be because the playlist is empty or the player is having errors
            </Typography>
  
            <Typography
              className="px-6"
              variant="body1">
              To fix this, try adding some songs and/or restarting the player (press F5)
            </Typography>
          </Box>
  
          <Box className="row-span-2 center">
            <Kokopelli />
          </Box>
  
        </Box>
      </Box>
    }
  
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
              {song.title}
            </Typography>
  
            <Typography
              noWrap
              variant="body1">
              {song.artists}
            </Typography>
  
          </Box>
  
          {/* Progress bar */}
          <Box className="pt-2">
            <PlayerProgressionBar timeLeft={song.length ? ((progress / song.length) * 100) : 100} />
          </Box>
  
          {/* Player buttons */}
          <Box className="w-full center">
            <Box>
              <Button onClick={previous}>  <SkipPreviousIcon sx={{ fontSize: 40 }}/></Button>
              {playing ? 
                <Button onClick={playPause}> <PauseCircleIcon  sx={{ fontSize: 50 }}/></Button> :
                <Button onClick={playPause}> <PlayCircleIcon   sx={{ fontSize: 50 }}/></Button>
              }
              <Button onClick={skip}>      <SkipNextIcon     sx={{ fontSize: 40 }}/></Button>
            </Box>
          </Box>
        </Box>
  
      </Box>
    </Box>
  }, [loading, song, playing, progress])
}

export default Session