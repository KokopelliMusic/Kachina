import { Avatar, CircularProgress, Divider, Fab, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState, useEffect } from 'react'
import { Add } from '@mui/icons-material'
import { useParams } from 'react-router'
import { PlaylistWithSongsType } from 'sipapu/dist/src/services/playlist'
import { useNotification } from '../components/Snackbar'
import { SongType } from 'sipapu/dist/src/services/song'

const EditPlaylist = () => {
  const params = useParams()
  const [notify, Snackbar] = useNotification()
  
  const [playlist, setPlaylist] = useState<PlaylistWithSongsType | undefined>(undefined)

  useEffect(() => {
    if (!params.id) {
      notify({ title: 'Playlist ID unknown', message: 'Cannot find anything about this playlist', severity: 'error' })
      return
    }

    window.sipapu.Playlist.getWithSongs(parseInt(params.id))
      .then(p => {
        console.log(p)
        return p
      })
      .then(setPlaylist)
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })

    
  }, [])

  // TODO
  if (!playlist) {
    return <Box className="w-full" height="77%">
      <Snackbar />
      TODO: Skeleton loading

      <div className="w-full h-full flex justify-center items-center">
        <CircularProgress />
        <div />
      </div>
    </Box>
  }

  return <Box className="w-full h-full">
    <Snackbar />
    
    <main className="mb-8 scroll">
      <Typography
        className="center w-full py-4"
        variant="h2">
        {playlist.name}
      </Typography>
      <Typography
        className="center w-full pb-4">
        Made by {'TODO'}
      </Typography>

      <div className="w-full center pb-4">
        <Divider className="w-80"/>
      </div>

      <List>
        {playlist.songs.map(song => <SongItem key={song.id} song={song} />)}
      </List>
    </main>

    <div className="fixed bottom-20 right-6">
      <Fab color="primary" onClick={() => notify({ title: 'Error', message: 'Adding songs is not supported yet', severity: 'error'})}>
        <Add />
      </Fab>
    </div>
  </Box>
}

type SongItemProps = {
  song: SongType
}

const SongItem = ({ song }: SongItemProps) => {
  const cover  = song.cover ?? '/missing.jpg'
  const artist = song.artist ?? 'YouTube'

  return <ListItem sx={{ height: 72 }}>
    <ListItemAvatar>
      <Avatar variant="square" alt={song.title} src={cover} />
    </ListItemAvatar>

    <ListItemText primary={song.title} secondary={artist} primaryTypographyProps={{ noWrap: true }} />
  </ListItem>
}

export default EditPlaylist