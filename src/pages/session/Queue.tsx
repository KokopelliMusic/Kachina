import { CircularProgress, Fade, List, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import Kokopelli from '../../components/Kokopelli'
import { useNotification } from '../../components/Snackbar'
import { client } from '../../data/client'
import { getSessionID } from '../../data/session'
import { Song, QueueItem } from '../../types/tawa'
import { SongDetailModal, SongItem } from '../EditPlaylist'

const Queue = () => {
  const [notify, Snackbar] = useNotification()

  const [queue, setQueue] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)

  // Modal state
  const [modalOpen, setModalOpen]       = useState(true)
  const [selectedSong, setSelectedSong] = useState<Song | undefined>(undefined)
  

  const load = () => setTimeout(() => setLoading(false), 1000)

  useEffect(() => {
    const session_id = getSessionID()

    client.req('get_queue', { session_id })
      .then(setQueue)
      .then(load)
      .catch(e => {
        notify({
          title: 'Error',
          message: e.message,
          severity: 'error'
        })
      })
  }, [])

  useEffect(() => {
    if (!selectedSong) return

    setModalOpen(true)
  }, [selectedSong])

  if (loading) return <Box className="h-4/6 w-full center">
    <CircularProgress />
  </Box>

  if (queue.length === 0) return <Box className="pt-4 w-full center">
    <Box>

      <Typography className="text-center" variant="h3">
        Queue is empty
      </Typography>

      <Box className="center">
        <Box className="text-center w-4/6">
          That usually means an event is nearby... Stay tuned!
        </Box>

      </Box>

      <Box className="center pt-4">
        <Kokopelli />
      </Box>

    </Box>
  </Box>


  return <Box className="p-4">
    <Snackbar />
    <SongDetailModal open={modalOpen} setOpen={setModalOpen} song={selectedSong} notify={notify} removeAvailable={false}/>

    <Fade in={true} timeout={250}>
      <Box>

        <Typography
          variant="h3">
          Queue
        </Typography>

        <Typography>
          What songs are currently queued up?
        </Typography>

        <List>
          {queue.map(qi => <SongItem 
            key={qi.position}
            song={qi.song}
            selectSong={setSelectedSong}
            openModal={() => setModalOpen(true)}/>
          )}
        </List>

      </Box>
    </Fade>


  </Box>
}

export default Queue