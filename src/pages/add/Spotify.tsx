/* eslint-disable @typescript-eslint/no-explicit-any */
import { List, ListItem, ListItemAvatar, ListItemButton, ListItemText, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import useRedirect from '../../components/Redirect'
import { useNotification } from '../../components/Snackbar'
import Kokopelli from '../../components/Kokopelli'
import { useDebounce } from 'use-debounce'

const TIME_BETWEEN_QUERIES = 1000
const INPUT_FETCH_TIME     = 500

// TODO:
// The first query is fast but after that the
// search bar becomes slow due to rerendering

const Spotify = () => {
  const params              = useParams()
  const redirect            = useRedirect()
  const [notify, Snackbar]  = useNotification()
  const inputRef            = useRef<HTMLInputElement>(null)
  
  const [query, setQuery]             = useState('')
  const [queryResult, setQueryResult] = useState<any>({})

  // The query is debounced so that we don't make too many requests to the Spotify API
  const [value] = useDebounce(query, TIME_BETWEEN_QUERIES)

  useEffect(() => {
    if (!params.id) {
      notify({ title: 'Playlist ID unknown', message: 'Cannot find anything about this playlist, please log out and try again.', severity: 'error' })
    }

    // Fetch the input value every 500 ms, this is to prevent lag from setState
    // setState gives lag since when there are 20 songs, rerendering is quite expensive
    const i = setInterval(() => {
      if (inputRef.current && inputRef.current.value) {
        setQuery(inputRef.current.value)
      }
    }, INPUT_FETCH_TIME)

    return () => clearInterval(i)
  }, [])

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
  }, [value])

  const SearchField = () => <Box>
    <div className="w-full px-4 pt-4">
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
        ref={inputRef}
        className="w-full"
        label="Search on Spotify"
        variant="outlined"/>   
    </div>
  </Box>

  if (!queryResult.body) 
    return <Box>
      <Snackbar />
      <SearchField/>

      <Typography
        className="text-center pt-4 px-2"
        variant='h6'>
        To add an Spotify song to this playlist, search for using the search bar above.
      </Typography>

      <Typography
        className="text-center py-2 px-8"
        variant="body1">
        Results will show up here. You can click on the result to add it to the playlist.
      </Typography>

      <div className="w-full center">
        <Kokopelli />
      </div>
    </Box>

  return <Box>
    <Snackbar />
    <SearchField />

    <div className="pb-2">
      <List>
        {queryResult.body.tracks.items.map((res: any) => <SearchResult key={res.id} queryResult={res} />)}
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
}

const SearchResult = ({ className, queryResult }: SearchResultProps) => {
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
    // TODO 
    alert(queryResult.name)
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

export default Spotify