import React, { useEffect, useState } from 'react'
import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import useRedirect from '../../components/Redirect'
import { useParams } from 'react-router'
import { getSessionCode } from '../../data/session'
import { useNotification } from '../../components/Snackbar'

type AddProps = {
  session?: boolean
}

const Add = ({ session }: AddProps) => {
  const redirect = useRedirect()
  const params   = useParams()

  const [notify, Snackbar] = useNotification()

  const [id, setId] = useState<string>('')
  
  useEffect(() => {
    if (session) {
      const code = getSessionCode()
      if (code) {
        // window.sipapu.Session.get(code)
        //   .then(session => {
        //     if (session) {
        //       setId(session.playlistId)
        //     }
        //   })
      }
    } else {
      // React router gives this guarantee
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setId(params.id!)
    }
  })

  return <Box className="h-4/6 flex items-center">
    <Snackbar />
    <div>
      <Typography
        className="text-center pt-4 px-2"
        variant='h4'>
        Add a new song to this playlist
      </Typography>

      <Typography
        className="text-center p-2"
        variant="body1">
        You can add a song by clicking the button below. Kokopelli can play songs from the platforms below.
      </Typography>
 
      <main className="w-full h-1/2">

        <div className="center w-full py-8">
          <Button variant="contained" className="w-1/2 mx-2" onClick={() => redirect('/add/spotify/' + id)}>Spotify</Button>
        </div>

        <div className="center w-full">
          <Button variant="contained" className="w-1/2" onClick={() => notify({ title: 'Oops', message: 'Sorry, YouTube functionality has not been implemented yet', severity: 'warning' })}>YouTube</Button>
        </div>

      </main>
    </div>
  </Box>
}

export default Add