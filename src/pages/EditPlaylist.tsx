import { Avatar, Button, Skeleton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fab, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material'
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
import { getSessionCode } from '../data/session'

type EditPlaylistProps = {
  session?: boolean
}

const EditPlaylist = ({ session }: EditPlaylistProps) => {
  const params              = useParams()
  const redirect            = useRedirect()
  const [notify, Snackbar]  = useNotification()

  const [preload, setPreload]         = useState<boolean>(true)
  const [loading, setLoading]         = useState<boolean>(true)
  const [playlistId, setPlaylistId]  = useState<number>(-1)
  const [playlist, setPlaylist]       = useState<PlaylistWithSongsType | undefined>(undefined)
  const [users, setUsers]             = useState<ProfileType[] | undefined>(undefined)
  const [user, setUser]               = useState<ProfileType | undefined>(undefined)
  
  // Modal state
  const [modalOpen, setModalOpen]       = useState(false)
  const [selectedSong, setSelectedSong] = useState<SongType | undefined>(undefined)
  
  useEffect(() => {
    // A lot of ifs in this code but they should all be true
    if (session) {
      const code = getSessionCode()
      if (code) {
        window.sipapu.Session.get(code)
          .then(session => {
            console.log(session)
            if (session) {
              setPlaylistId(session.playlistId)
              setPreload(false)
            }
          })
      }
    } else {
      // React router gives this guarantee
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setPlaylistId(parseInt(params.id!))
      setPreload(false)
    }
  }, [])

  useEffect(() => {
    if (preload) return

    window.sipapu.Profile.getCurrent()
      .then(setUser)
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })

    window.sipapu.Playlist.getWithSongs(playlistId)
      .then(async playlist => {
        await window.sipapu.Playlist.getUsers(playlist.id)
          .then(setUsers)
          .catch(err => {
            notify({ title: 'Error', message: err.message, severity: 'error' })
          })

        setPlaylist(playlist)
      })
      .then(() => setLoading(false))
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
  }, [preload])

  useEffect(() => {
    if (!selectedSong) return

    setModalOpen(true)
  }, [selectedSong])


  // This is safe to do since we already check it in useEffect, that is before render so its safe
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const clickAdd = () => redirect('/add/' + playlistId)

  const loadingSong = <Box className="w-full flex" height={88}>
    <div className="pl-4 w-20 center">
      <Skeleton variant="circular" width={40} height={40} />
    </div>

    <Skeleton className="center ml-2" width="65%" height="100%" />
  </Box>

  if (loading || !playlist || !users) {
    return <Box className="w-full h-full">
      <Snackbar />

      <main className="mb-8 scroll">
        <div className="center w-full pt-2">
          <Skeleton width="58%" height={58} />
        </div>

        <div className="w-full flex justify-center items-center pb-4">
          <Skeleton variant="circular" width={36} height={36} />

          <div className="ml-2" />

          <Skeleton width={100} height={36} />
        </div>

        <div className="w-full center pb-4">
          <Divider className="w-80"/>
        </div>

        {[...Array(20)].map((_, i) => <div key={i}>{loadingSong}</div>)}
      </main>
    </Box>
  }

  return <Box className="w-full h-full">
    <Snackbar />
    <SongDetailModal open={modalOpen} setOpen={setModalOpen} song={selectedSong} notify={notify} />
    
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
        {playlist.songs.map(song => <SongItem key={song.id} song={song} selectSong={setSelectedSong} openModal={() => setModalOpen(true)} />)}
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
  selectSong: (song: SongType) => void
  openModal: () => void
}

const SongItem = ({ song, selectSong, openModal }: SongItemProps) => {
  const cover  = song.cover ?? '/missing.jpg'
  const artist = song.artist ?? 'YouTube'

  return <ListItemButton disableGutters onClick={() => {
    selectSong(song)
    openModal()
  }}>
    <ListItem sx={{ height: 72 }}>
      <ListItemAvatar>
        <Avatar variant="square" alt={song.title} src={cover} />
      </ListItemAvatar>

      <ListItemText primary={song.title} secondary={artist} primaryTypographyProps={{ noWrap: true }} />

    </ListItem>
  </ListItemButton>
  
}

type SongDetailModalType = {
  song: SongType | undefined
  open: boolean
  setOpen: (open: boolean) => void
  notify: (notification: { title: string, message: string, severity: 'error' | 'success' }) => void
}

const SongDetailModal = ({ open, setOpen, song, notify }: SongDetailModalType) => {
  if (!song) return null

  const [user, setUser] = useState<ProfileType | undefined>(undefined)

  useEffect(() => {
    window.sipapu.Profile.get(song.addedBy)
      .then(setUser)
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
  }, [])

  return <Dialog open={open} onClose={() => setOpen(false)}>
    <DialogTitle>{song.title}</DialogTitle>

    <DialogContent>
      <img src={song.cover ?? '/missing.jpg'} alt={song.title} className="w-full h-full" width={36} height={36} />
      {song.songType === 'youtube' ? null :
        <Box className="pt-2">        
          <DialogContentText>
            Performed by: {song.artist ?? ''}
          </DialogContentText>
        
          <DialogContentText>
            On: {song.album ?? 'YouTube'}
          </DialogContentText>
        </Box>

      }

      <DialogContentText>
        Added by: {!user ? '...' : user.username}
      </DialogContentText>
      <DialogContentText>
        on: {new Date(song.createdAt).toLocaleString()}
      </DialogContentText>

    </DialogContent>

    <DialogActions>
      <Button onClick={() => setOpen(false)}>Close</Button>
    </DialogActions>
  </Dialog>
}

export default EditPlaylist