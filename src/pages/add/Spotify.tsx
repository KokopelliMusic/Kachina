/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useRedirect from '../../components/Redirect'
import { useNotification } from '../../components/Snackbar'
import Kokopelli from '../../components/Kokopelli'
import { client } from '../../data/client'
import { Song, User } from '../../types/tawa'


// TODO:
// The first query is fast but after that the
// search bar becomes slow due to rerendering

const Spotify = () => {
  const params              = useParams()
  const [notify, Snackbar]  = useNotification()
  
  const [query, setQuery]   = useState('')
  const [user, setUser]     = useState<User>()


  // The query is debounced so that we don't make too many requests to the Spotify API
  // const [value] = useDebounce(query, TIME_BETWEEN_QUERIES)

  useEffect(() => {
    if (!params.id) {
      notify({ title: 'Playlist ID unknown', message: 'Cannot find anything about this playlist, please log out and try again.', severity: 'error' })
    }

    client.req('get_user', {})
      .then(setUser)
      .catch(err => notify({ title: 'Error getting profile', message: err.message, severity: 'error' }))
  }, [])

  const SearchField = <Box>
    <div className="w-full px-4 pt-4">
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
        autoComplete="off"
        className="w-full"
        label="Search on Spotify"
        variant="outlined"/>   
    </div>
  </Box>

  return <Box>
    <Snackbar />
    {SearchField}
    <SearchPage 
      query={query}
      notify={notify}
      user={user!} />
  </Box>
}

type SearchPageProps = {
  query: string
  notify: (settings: any) => void
  user: User
}

const SearchPage = ({ query, notify, user }: SearchPageProps) => {
  const params   = useParams()
  const redirect = useRedirect()

  const [queryResult, setQueryResult]       = useState<any>({})
  const [openModal, setOpenModal]           = React.useState(false)
  const [forceReload, setForceReload]       = React.useState(false)
  const [selectedResult, setSelectedResult] = React.useState<any>({})

  useEffect(() => {
    // Do not search for anything with less than 3 letters, most of it will be crap
    if (query.length < 3) return

    // Query the spotify API
    fetch(process.env.REACT_APP_SPOTIFY_SEARCH_STRING + query)
      .then(res => res.json())
      .then(setQueryResult)
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
  }, [query])

  useEffect(() => {
    if (forceReload) {
      setForceReload(false)
      window.location.reload()
    }
  }, [forceReload])

  useEffect(() => {
    if (selectedResult.id) {
      setOpenModal(true)
    }
  }, [selectedResult])

  return !queryResult.body ? 
    <Box>
      <Typography
        className="text-center pt-4 px-2"
        variant='h6'>
        To add an Spotify song to this playlist, search for it using the search bar above.
      </Typography>

      <Typography
        className="text-center py-2 px-8"
        variant="body1">
        Results will show up here. You can click on the result to add it to the playlist.
      </Typography>

      <div className="w-full center">
        <Kokopelli />
      </div>

      <div className="w-full center pt-4">
        <Button variant="contained" onClick={() => redirect('/edit/' + params.id)}>
          Back to playlist
        </Button>
      </div>
    </Box> : <Box>
      <AddSongModal 
        open={openModal} 
        setOpen={setOpenModal} 
        notify={notify} 
        forceReload={setForceReload} 
        queryResult={selectedResult} 
        playlistId={parseInt(params.id!)} 
        user={user}/>

      <div className="pb-2">
        <List>
          {queryResult.body.tracks.items.map((res: any, idx: number) => <SearchResult key={idx} queryResult={res} setSelectedResult={setSelectedResult} />)}
        </List>
      </div>

      <Typography
        className="text-center pb-36 px-2"
        variant="body1">
        Still haven&apos;t found what you&apos;re looking for? Try be more specific in your query
      </Typography>

    </Box>
}

type SearchResultProps = {
  className?: string
  queryResult: any
  setSelectedResult: (queryResult: any) => void
}

const SearchResult = ({ className, queryResult, setSelectedResult }: SearchResultProps) => {
  const artists  = queryResult.artists.map((artist: { name: string }) => artist.name).join(', ')
  // Always take the smallest image
  let coverImg
  if (queryResult.album.images && queryResult.album.images.length > 0) {
    coverImg = queryResult.album.images[queryResult.album.images.length - 1].url
  } else {
    // Reeee some songs do not have an album cover
    coverImg = '/missing.jpg'
  }

  const addSong = () => {
    setSelectedResult(queryResult)
  }

  return <ListItemButton onClick={addSong}>
    <ListItem 
      className={className}
      disableGutters 
      alignItems="flex-start">
      <ListItemAvatar>
        {/* loading: 'lazy' does not work on safari iOS. I do not really care about that 
            The album covers are 64x64 anyway, so it's not a big deal */}
        <img 
          alt="cover"
          src={coverImg}
          loading='lazy'
          style={{ width: 56, height: 56 }} />
      </ListItemAvatar>

      <ListItemText 
        primary={queryResult.name}
        className="pl-4"
        primaryTypographyProps={{ noWrap: true}}
        secondary={artists}/>
    </ListItem>
  </ListItemButton>
}

type AddSongModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  notify: (notification: { title: string, message: string, severity: 'error' | 'success' }) => void
  forceReload: (force: boolean) => void
  playlistId: number
  user: User
  queryResult: any
}

const AddSongModal = ({ open, setOpen, notify, forceReload, queryResult, playlistId, user }: AddSongModalProps) => {
  const handleClose = () => setOpen(false)

  const artists = queryResult.artists?.map((artist: { name: string }) => artist.name).join(', ') ?? 'Unknown Artist'

  const create = () => {

    const song: Song = {
      title: queryResult.name,
      platform_id: queryResult.id,
      added_by: user!,
      playlist_id: playlistId,
      song_type: 'spotify',
      artists,
      cover: queryResult.album.images[0].url ?? '/missing.jpg',
      length: queryResult.duration_ms,
      album: queryResult.album.name,
    }
  
    client.req('add_song_to_playlist', song)
      .then(() => forceReload(true))
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
  }
  
  if (!queryResult.id) return null

  return <Dialog open={open}>
    <DialogTitle>Add song</DialogTitle>

    <DialogContent>
      <DialogContentText>
        Do you want to add {queryResult.name} by {artists} from {queryResult.album.name} to this playlist?
      </DialogContentText>

    </DialogContent>

    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={create}>Add</Button>
    </DialogActions>
  </Dialog>
}

export default Spotify