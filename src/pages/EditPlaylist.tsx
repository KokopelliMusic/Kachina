import { Avatar, CircularProgress, Divider, Fab, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState, useEffect } from 'react'
import { Add } from '@mui/icons-material'
import { useParams } from 'react-router'
import { PlaylistWithSongsType } from 'sipapu/dist/src/services/playlist'
import { useNotification } from '../components/Snackbar'
import { SongType } from 'sipapu/dist/src/services/song'
import useRedirect from '../components/Redirect'
import { ProfileType } from 'sipapu/dist/src/services/profile'
import { purple } from '@mui/material/colors'

// TODO AddedBy toevoegen voor elk nummer

const EditPlaylist = () => {
  const params              = useParams()
  const redirect            = useRedirect()
  const [notify, Snackbar]  = useNotification()

  const [playlist, setPlaylist] = useState<PlaylistWithSongsType | undefined>(undefined)
  const [users, setUsers]       = useState<ProfileType[] | undefined>(undefined)
  const [user, setUser]          = useState<ProfileType | undefined>(undefined)
  

  useEffect(() => {
    if (!params.id) {
      notify({ title: 'Playlist ID unknown', message: 'Cannot find anything about this playlist', severity: 'error' })
      return
    }

    window.sipapu.Playlist.getWithSongs(parseInt(params.id))
      .then(setPlaylist)
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })

    window.sipapu.Profile.getCurrent()
      .then(setUser)
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
  }, [])

  useEffect(() => {
    if (!playlist) return

    window.sipapu.Playlist.getUsers(playlist.id)
      .then(u => {
        console.log(u)
        return u
      })
      .then(setUsers)
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
  }, [playlist])
 
  // This is safe to do since we already check it in useEffect, that is before render so its safe
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const clickAdd = () => redirect('/add/' + parseInt(params.id!))

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
      <div className="center w-full">
        <Typography
          className="w-11/12 text-center pt-4 pb-2"
          noWrap
          variant="h4">
          {playlist.name}
        </Typography>
      </div>

      <div className="w-full flex justify-center items-center pb-4">
        <Avatar src={user?.profilePicture} alt={user?.username} sx={{ bgcolor: purple[500], width: 36, height: 36 }}>
          {user?.username.substring(0, 1)}
        </Avatar>

        <div className="ml-2" />

        <Typography
          className="h-full">
          Made by {!user ? '...' : user.username}
        </Typography>
      </div>

      <div className="w-full center pb-4">
        <Divider className="w-80"/>
      </div>

      <List>
        {playlist.songs.map(song => <SongItem key={song.id} song={song} />)}
      </List>
    </main>

    <div className="pb-20" />

    <div className="fixed bottom-20 right-6">
      <Fab color="primary" onClick={clickAdd}>
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

    <ListItemText primary={song.title} secondary={artist + ' | TODO: addedBy'} primaryTypographyProps={{ noWrap: true }} />
  </ListItem>
}

export default EditPlaylist