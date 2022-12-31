import { Avatar, Button, Skeleton, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Fab, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, Fade, Table, TableRow, TableCell, TableBody } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState, useEffect } from 'react'
import { Add } from '@mui/icons-material'
import { useParams } from 'react-router'
import { useNotification } from '../components/Snackbar'
import useRedirect from '../components/Redirect'
import { purple } from '@mui/material/colors'
import { getSessionID } from '../data/session'
import Kokopelli from '../components/Kokopelli'
import { PlaylistWithSongs, Song, User } from '../types/tawa'
import { client } from '../data/client'

type EditPlaylistProps = {
  session?: boolean
}

const EditPlaylist = ({ session }: EditPlaylistProps) => {
  const params              = useParams()
  const redirect            = useRedirect()
  const [notify, Snackbar]  = useNotification()

  const [preload, setPreload]         = useState<boolean>(true)
  const [loading, setLoading]         = useState<boolean>(true)
  const [playlistId, setPlaylistId]   = useState<number>(-1)
  const [playlist, setPlaylist]       = useState<PlaylistWithSongs | undefined>(undefined)
  const [users, setUsers]             = useState<User[] | undefined>(undefined)
  const [user, setUser]               = useState<User | undefined>(undefined)
  const [canSee, setCanSee]           = useState<boolean>(true)
  
  // Modal state
  const [modalOpen, setModalOpen]       = useState(true)
  const [selectedSong, setSelectedSong] = useState<Song | undefined>(undefined)

  const load = () => setTimeout(() => setLoading(false), 500)
  
  useEffect(() => {
    // A lot of ifs in this code but they should all be true
    if (session) {
      const code = getSessionID()
      if (code) {
        
        client.req('get_session', { session_id: code })
          .then(settings => {
            if (settings) {
              const session = settings.session
              if (!settings.anyone_can_see_playlist) {
                setCanSee(false)
              }
              setPlaylistId(session.playlist_id)
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

    const fun = async () => {
      await client.getUser()
        .then(setUser)
        .catch(err => {
          notify({ title: 'Error', message: err.message, severity: 'error' })
        })

      await client.req('get_playlist', { playlist_id: playlistId })
        .then(setPlaylist)
        .catch(err => {
          notify({ title: 'Error', message: err.message, severity: 'error' })
        })

      await client.req('get_playlist_users', { playlist_id: playlistId })
        .then(setUsers)
        .then(load)
        .catch(err => {
          console.error(err)
          notify({ title: 'Error', message: err.message, severity: 'error' })
        })
    }

    fun()
  }, [preload])

  useEffect(() => {
    if (!selectedSong) return

    setModalOpen(true)
  }, [selectedSong])

  const clickAdd = () => {
    if (session) {
      redirect('/add')
    } else {
      redirect('/add/' + playlistId)
    }
  } 

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

  if (session && !canSee) return <Box className="p-4">
    <Snackbar />
    <Typography
      variant="h3"
      className="text-center">
      Oops!
    </Typography>

    <Typography
      variant="h5"
      className="text-center">
      You are not allowed to view this playlist!
    </Typography>

    <Typography
      variant="body1"
      className="text-center">
      This can be changed in the settings
    </Typography>

    <Box className="w-full center pt-4">
      <Kokopelli />
    </Box>
  </Box>

  return <Box className="w-full h-full">
    <Snackbar />
    <SongDetailModal open={modalOpen} setOpen={setModalOpen} song={selectedSong} notify={notify} />
    
    <Fade in={true} timeout={250}>
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
          {user?.profile_picture ? 
            <img 
              src={process.env.REACT_APP_STATIC_URL + user?.profile_picture} 
              alt={user?.username} 
              className="w-9 h-9 rounded-full" />        
            :
            <Avatar src={user?.profile_picture} alt={user?.username} sx={{ bgcolor: purple[500], width: 36, height: 36 }}>
              {user?.username.substring(0, 1)}
            </Avatar>
          }


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
    </Fade>

    <div className="pb-20" />

    <div className="fixed bottom-20 right-6">
      <Fab color="primary" onClick={clickAdd}>
        <Add />
      </Fab>
    </div>
  </Box>
}

type SongItemProps = {
  song: Song
  selectSong: (song: Song) => void
  openModal: () => void
}

export const SongItem = ({ song, selectSong, openModal }: SongItemProps) => {
  const cover  = song.cover ?? '/missing.jpg'
  const artists = song.artists ?? 'YouTube'

  return <ListItemButton disableGutters onClick={() => {
    selectSong(song)
    openModal()
  }}>
    <ListItem sx={{ height: 72 }}>
      <ListItemAvatar>
        <Avatar variant="square" alt={song.title} src={cover} imgProps={{ loading: 'lazy' }}/>
      </ListItemAvatar>

      <ListItemText primary={song.title} secondary={artists} primaryTypographyProps={{ noWrap: true }} />

    </ListItem>
  </ListItemButton>
  
}

type SongDetailModalType = {
  song: Song | undefined
  open: boolean
  setOpen: (open: boolean) => void
  notify: (notification: { title: string, message: string, severity: 'error' | 'success' }) => void
  removeAvailable?: boolean
}

export const SongDetailModal = ({ open, setOpen, song, notify, removeAvailable }: SongDetailModalType) => {
  if (!song) return null

  const remove = (id: number) => {
    client.req('delete_song_from_playlist', { song_id: id })
      .then(() => location.reload())
      .catch(err => {
        console.error(err)
        notify({ title: 'Error', message: 'You do not have permission to remove this song!', severity: 'error' })
      })
  }

  return <Dialog open={open} onClose={() => setOpen(false)}>
    <DialogTitle>{song.title}</DialogTitle>

    <DialogContent>
      <img src={song.cover ?? '/missing.jpg'} alt={song.title} className="w-full h-full" width={36} height={36} />
      {song.song_type === 'youtube' ? null :
        <Box className="pt-0">
          <Table>
            <TableBody sx={{ td: { textAlign: 'center' }}}>
              <TableRow>
                <TableCell>Artists</TableCell>
                <TableCell>{song.artists ?? '?'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Album</TableCell>
                <TableCell>{song.album ?? '?'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Added by</TableCell>
                <TableCell>{song.added_by.username}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

      }

    </DialogContent>

    <DialogActions>
      {removeAvailable === false ? null : <Button onClick={() => remove(song.id!)}>Remove</Button>}
      <Button onClick={() => setOpen(false)}>Close</Button>
    </DialogActions>
  </Dialog>
}

export default EditPlaylist