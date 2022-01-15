import { Box } from '@mui/system'
import { Fab, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton } from '@mui/material'
import React, { useEffect } from 'react'
import { PlaylistType } from 'sipapu/dist/src/services/playlist'
import { Add } from '@mui/icons-material'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import { useNotification } from '../components/Snackbar'
import useRedirect from '../components/Redirect'

// TODO notify that playlists are public

const Playlists = () => {
  const [playlists, setPlaylists] = React.useState<PlaylistType[]>([])
  const [loading, setLoading] = React.useState(true)
  const [notify, Snackbar] = useNotification()

  useEffect(() => {
    window.sipapu.Playlist.getAllFromUser()
      .then(setPlaylists)
      .then(() => setLoading(false))
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
  }, [])

  const loadingPlaylist = <Box className="w-full flex" height={88}>
    <div className="pl-4 w-20 center">
      <Skeleton variant="circular" width={40} height={40} />
    </div>
    <Skeleton className="center ml-2" width="65%" height="100%" />
  </Box>

  if (loading) {
    return <Box className="w-full h-full">
      <div className="pt-1"/>
      {[...Array(10)].map(() => loadingPlaylist)}
    </Box>  
  }

  return <Box className="w-full h-full">
    <Snackbar />
    <main className="mb-auto flex flex-col items-center scroll mb-8">
      <List sx={{ width: '100%' }}>
        {playlists.map(playlist => (<div key={playlist.id}>
          <PlaylistItem playlist={playlist}/>
        </div>))}
      </List>
    </main>


    <div className="fixed bottom-20 right-6">
      <Fab color="primary" onClick={() => notify({ title: 'Error', message: 'Adding a new playlist is not supported yet', severity: 'error'})}>
        <Add />
      </Fab>
    </div>
  </Box>
}

type PlaylistItemProps = {
  playlist: PlaylistType
}

const PlaylistItem = ({ playlist }: PlaylistItemProps) => {
  const redirect = useRedirect()

  const onClick = () => redirect('/edit/' + playlist.id)

  return <ListItem>
    <ListItemButton onClick={onClick}>
      <ListItemAvatar>
        <QueueMusicIcon />
      </ListItemAvatar>
      <ListItemText primary={playlist.name} secondary={playlist.createdAt.toDateString()} />
    </ListItemButton>
  </ListItem>
}

export default Playlists