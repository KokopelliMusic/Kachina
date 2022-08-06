import { Avatar, Button, Skeleton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fab, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState, useEffect } from 'react'
import { Add } from '@mui/icons-material'
import { useParams } from 'react-router'
import { useNotification } from '../components/Snackbar'
import useRedirect from '../components/Redirect'
import { purple } from '@mui/material/colors'
import { getSessionCode } from '../data/session'
import Kokopelli from '../components/Kokopelli'
import { Account, Models, Query } from 'appwrite'
import { Playlist, Song, SongTypeEnum } from 'sipapu-2'

type EditPlaylistProps = {
  session?: boolean
}

const EditPlaylist = ({ session }: EditPlaylistProps) => {
  const params              = useParams()
  const redirect            = useRedirect()
  const [notify, Snackbar]  = useNotification()

  const [preload, setPreload]         = useState<boolean>(true)
  const [loading, setLoading]         = useState<boolean>(true)
  const [playlistId, setPlaylistId]   = useState<string>('')
  const [songs, setSongs]             = useState<Song[] | undefined>(undefined)
  const [playlist, setPlaylist]       = useState<Playlist | undefined>(undefined)
  const [user, setUser]               = useState<Models.User<Models.Preferences> | undefined>(undefined)
  const [canSee, setCanSee]           = useState<boolean>(true)
  
  // Modal state
  const [modalOpen, setModalOpen]       = useState(true)
  const [selectedSong, setSelectedSong] = useState<Song | undefined>(undefined)
  
  useEffect(() => {
    // A lot of ifs in this code but they should all be true
    if (session) {
      const code = getSessionCode()
      if (code) {
        // window.sipapu.Session.get(code)
        //   .then(session => {
        //     console.log(session)
        //     if (session) {
        //       if (!session.settings.anyoneCanSeePlaylist) {
        //         setCanSee(false)
        //       }
        //       setPlaylistId(session.playlistId)
        //       setPreload(false)
        //     }
        //   })
      }
    } else {
      // React router gives this guarantee
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setPlaylistId(params.id!)
      setPreload(false)
    }
  }, [])

  useEffect(() => {
    if (preload) return

    const account = new Account(window.api)

    account.get()
      .then(setUser)
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })

    window.db.getDocument('playlist', playlistId)
      .then(doc => setPlaylist(doc as unknown as Playlist))

    window.db.listDocuments('song', [
      Query.equal('playlist_id', playlistId)
    ])
      .then(s => setSongs(s.documents as unknown as Song[]))
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

  if (loading || !playlist || !songs) {
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

  if (songs.length === 0) return <Box className="p-4">
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
        {/* <Avatar src={user?.profilePicture} alt={user?.username} sx={{ bgcolor: purple[500], width: 36, height: 36 }}> */}
        <Avatar alt={user?.name} sx={{ bgcolor: purple[500], width: 36, height: 36 }}>
          {user?.name.substring(0, 1)}
        </Avatar>

        <div className="ml-2" />

        <Typography
          className="h-full">
          Made by {!user ? '...' : user.name}
        </Typography>
      </div>

      <div className="w-full center pb-4">
        <Divider className="w-80"/>
      </div>

      <Typography
        variant="h6"
        className="text-center italic">
        &quot;Ohne dich kann ich nicht sein&quot;
      </Typography>

      <Typography
        variant="body1"
        className="text-center pt-2 px-4">
        There are no songs in this playlist, add the first with the button below!
      </Typography>
    </main>

    <div className="pb-20" />

    <div className="fixed bottom-20 right-6">
      <Fab color="primary" onClick={clickAdd}>
        <Add />
      </Fab>
    </div>
  </Box>

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
        {/* <Avatar src={user?.profilePicture} alt={user?.username} sx={{ bgcolor: purple[500], width: 36, height: 36 }}> */}
        <Avatar alt={user?.name} sx={{ bgcolor: purple[500], width: 36, height: 36 }}>
          {user?.name.substring(0, 1)}
        </Avatar>

        <div className="ml-2" />

        <Typography
          className="h-full">
          Made by {!user ? '...' : user.name}
        </Typography>
      </div>

      <div className="w-full center pb-4">
        <Divider className="w-80"/>
      </div>

      <List>
        {songs.map(song => <SongItem key={song.$id} song={song} selectSong={setSelectedSong} openModal={() => setModalOpen(true)} />)}
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
  song: Song
  selectSong: (song: Song) => void
  openModal: () => void
}

const SongItem = ({ song, selectSong, openModal }: SongItemProps) => {
  const cover  = song.cover ?? '/missing.jpg'
  const artist = song.artists ?? 'YouTube'

  return <ListItemButton disableGutters onClick={() => {
    selectSong(song)
    openModal()
  }}>
    <ListItem sx={{ height: 72 }}>
      <ListItemAvatar>
        <Avatar variant="square" alt={song.title} src={cover} imgProps={{ loading: 'lazy' }}/>
      </ListItemAvatar>

      <ListItemText primary={song.title} secondary={artist} primaryTypographyProps={{ noWrap: true }} />

    </ListItem>
  </ListItemButton>
  
}

type SongDetailModalType = {
  song: Song | undefined
  open: boolean
  setOpen: (open: boolean) => void
  notify: (notification: { title: string, message: string, severity: 'error' | 'success' }) => void
}

const SongDetailModal = ({ open, setOpen, song, notify }: SongDetailModalType) => {
  if (!song) return null

  const remove = (id: string) => {
    window.db.deleteDocument('song', id)
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
      {song.song_type === SongTypeEnum.YouTube ? null :
        <Box className="pt-2">        
          <DialogContentText>
            Performed by: {song.artists ?? ''}
          </DialogContentText>
        
          <DialogContentText>
            On: {song.album ?? 'YouTube'}
          </DialogContentText>
        </Box>

      }

      <DialogContentText>
        Added by: {song.user_name ?? '...'}
      </DialogContentText>
      <DialogContentText>
        on: {new Date(song.$createdAt).toLocaleString()}
      </DialogContentText>

    </DialogContent>

    <DialogActions>
      <Button onClick={() => remove(song.$id)}>Remove</Button>
      <Button onClick={() => setOpen(false)}>Close</Button>
    </DialogActions>
  </Dialog>
}

export default EditPlaylist