import { Box } from '@mui/system'
import { Fab, Snackbar, Card, Alert, AlertTitle, CardContent, CardMedia, Typography, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material'
import React, { useEffect } from 'react'
import { PlaylistType } from 'sipapu/dist/src/services/playlist'
import { Add } from '@mui/icons-material'
import BadgeIcon from '@mui/icons-material/Badge'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'

const Playlists = () => {
  const [playlists, setPlaylists] = React.useState<PlaylistType[]>([])
  const [error, setErrors] = React.useState<string>('NetworkError when attempting to fetch resource.')
  const [open, setOpen] = React.useState(false)

  useEffect(() => {
    window.sipapu.Playlist.getAllFromUser()
      .then(setPlaylists)
      .catch(err => {
        setErrors(err.message)
        setOpen(true)
      })
  }, [])

  const handleClose = () => setOpen(false)

  // const list = playlists.map(playlist => {  
  //   return <ListItem key={playlist.id}>
  //     <ListItemAvatar>
  //       <ListItemAvatar />
  //     </ListItemAvatar>
  //     <ListItemText primary={playlist.name} secondary={playlist.createdAt} />
  //   <ListItem/>
  // })

  return <Box className="w-full h-full">
    <main className="mb-auto pt-4 flex flex-col items-center">
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>

      </List>
      {/* <PlaylistItem playlist={{ name:'Playlist #1', createdAt: new Date(), id: 0, user: 'Niels', users: ['1','2','3','4'] }} />
      <PlaylistItem playlist={{ name:'Playlist #1', createdAt: new Date(), id: 0, user: 'Niels', users: ['1','2','3','4'] }} />
      <PlaylistItem playlist={{ name:'Playlist #1', createdAt: new Date(), id: 0, user: 'Niels', users: ['1','2','3','4'] }} /> */}
    </main>

    <ErrorSnack open={open} error={error} handleClose={handleClose} />

    <div className="fixed bottom-20 right-6">
      <Fab color="primary">
        <Add />
      </Fab>
    </div>
  </Box>
}

type PlaylistItemProps = {
  playlist: PlaylistType
}

const PlaylistItem = ({ playlist }: PlaylistItemProps) => {
  return <Card className="flex w-11/12 my-2">
    <CardMedia
      component="img"
      sx={{ height: 90, width: 40 }}
      className="ml-2 my-1"
      alt="Playlist img"
      image="/kokopelli.png" />
    <Box className="flex flex-col justify-between ml-2">
      <CardContent>

        <div className="flex">
          <BadgeIcon />
          <h2 className="pl-1">
            {playlist.name}
          </h2>
        </div>

        <div className="flex">
          <CalendarTodayIcon />
          <h3 className="pl-1">
            {playlist.createdAt.toLocaleDateString()}
          </h3>
        </div>
      </CardContent>
    </Box>

    <Box>
    </Box>
  </Card>
}

type SnackProps = {
  open: boolean
  error: string
  handleClose: () => void
}

const ErrorSnack = ({ open, error, handleClose }: SnackProps) => {
  return <div>
    <Snackbar
      open={open}
      sx={{ bottom: { xs: 150, sm: 0 } }}
      onClose={handleClose}
      autoHideDuration={6000}>
      <Alert severity="error" onClose={handleClose}>
        <AlertTitle>
          Failed to load playlists 
        </AlertTitle>
        {error}
      </Alert>
    </Snackbar>
  </div>
}

export default Playlists