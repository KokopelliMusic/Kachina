import { Box } from '@mui/system'
import { Dialog, DialogActions, Button, DialogContent, DialogContentText, DialogTitle, Fab, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { Add } from '@mui/icons-material'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import { useNotification } from '../components/Snackbar'
import useRedirect from '../components/Redirect'
import Kokopelli from '../components/Kokopelli'
import { Playlist } from 'sipapu-2'

// TODO notify that playlists are public
// TODO cache the playlists

const Playlists = () => {
  const [playlists, setPlaylists]     = React.useState<Playlist[]>([])
  const [loading, setLoading]         = React.useState(true)
  const [openModal, setOpenModal]     = React.useState(false)
  const [forceReload, setForceReload] = React.useState(false)
  const [notify, Snackbar]            = useNotification()

  useEffect(() => {
    if (forceReload) {
      setForceReload(false)
    }
    window.db.listDocuments('playlist')
      .then(lists => {
        console.log(lists)
        setPlaylists(lists.documents as unknown as Playlist[])
      })
      .then(() => setLoading(false))
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })

  }, [forceReload])

  const loadingPlaylist = <Box className="w-full flex" height={88}>
    <div className="pl-4 w-20 center">
      <Skeleton variant="circular" width={40} height={40} />
    </div>
    <Skeleton className="center ml-2" width="65%" height="100%" />
  </Box>

  if (loading) {
    return <Box className="w-full h-full">
      <Snackbar />
      <div className="pt-1"/>
      {[...Array(10)].map((_val, idx) => <div key={idx}>{loadingPlaylist}</div>)}
    </Box>  
  }

  if (playlists.length === 0) {
    return <Box className="h-4/6 flex items-center">
      <div>
        <Snackbar />
        <NewPlaylistModal open={openModal} setOpen={setOpenModal} notify={notify} forceReload={setForceReload} />
        <Typography
          className="text-center w-full pt-4 px-8"
          variant="h4"
          component="h1">
          You do not have any playlists yet.
        </Typography>

        <Typography
          className="text-center w-full pt-4 px-8"
          variant="h6"
          component="h1">
          Make your first playlist with the + button below.
        </Typography>
      
        <div className="center w-full">
          <Kokopelli height={250} />
        </div>

        <div className="fixed bottom-20 right-6">
          <Fab color="primary" onClick={() => setOpenModal(true)} >
            <Add />
          </Fab>
        </div>
      </div>
    </Box>
  }

  return <Box className="w-full h-full">
    <Snackbar />
    <NewPlaylistModal open={openModal} setOpen={setOpenModal} notify={notify} forceReload={setForceReload} />
    <main className="mb-auto flex flex-col items-center scroll">
      <List sx={{ width: '100%' }}>
        {playlists.map(playlist => (<div key={playlist.$id}>
          <PlaylistItem playlist={playlist}/>
        </div>))}
      </List>
      <div className="mt-28" />
    </main>


    <div className="fixed bottom-20 right-6">
      <Fab color="primary" onClick={() => setOpenModal(true)} >
        <Add />
      </Fab>
    </div>
  </Box>
}

type PlaylistItemProps = {
  playlist: Playlist
  onClick?: () => void
}

export const PlaylistItem = ({ playlist, onClick }: PlaylistItemProps) => {
  const redirect = useRedirect()

  const onButtonClick = () => {
    // if the prop is defined then use that
    if (onClick) return onClick()
    redirect('/edit/' + playlist.$id)
  }

  return <ListItem>
    <ListItemButton onClick={onButtonClick}>
      <ListItemAvatar>
        <QueueMusicIcon />
      </ListItemAvatar>
      <ListItemText primary={playlist.name} secondary={new Date(playlist.$createdAt * 1000).toDateString()} />
    </ListItemButton>
  </ListItem>
}

type NewPlaylistModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  notify: (notification: { title: string, message: string, severity: 'error' | 'success' }) => void
  forceReload: (force: boolean) => void
}

export const NewPlaylistModal = ({ open, setOpen, notify, forceReload }: NewPlaylistModalProps) => {
  const [name, setName] = React.useState('')
  const [error, setError] = React.useState(false)

  const handleClose = () => setOpen(false)

  const create = () => {
    if (name === '') return setError(true)

    setError(false)

    window.db.createDocument('playlist', 'unique()', {
      name,
      songs: []
    })
      .then(() => {
        handleClose()
        forceReload(true)
      })
      .catch(err => notify({ title: 'Error', message: err.message, severity: 'error' }))
  }

  return <Dialog open={open}>
    <DialogTitle>New Playlist</DialogTitle>

    <DialogContent>
      <DialogContentText>
        To create a new playlist, enter a name and click &apos;Create&apos;.
      </DialogContentText>

      <TextField
        autoFocus
        value={name}
        onChange={e => setName(e.target.value)}
        error={error}
        helperText={error ? 'Please enter a name for your playlist' : ''}
        margin="dense"
        id="name"
        label="Name"
        type="text"
        fullWidth
        variant="standard" />
    </DialogContent>

    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={create}>Create</Button>
    </DialogActions>
  </Dialog>
}

export default Playlists