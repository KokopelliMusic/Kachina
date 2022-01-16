import { Typography, Button } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { ProfileType } from 'sipapu/dist/src/services/profile'
import { useNotification } from '../components/Snackbar'

const Profile = () => {
  const [notify, Snackbar] = useNotification()

  const [user, setUser] = useState<ProfileType>()


  useEffect(() => {
    window.sipapu.Profile.getCurrent()
      .then(setUser)
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
  })

  return <Box>
    <Snackbar />

    <Typography
      variant="h3"
      component="h3">
      Hello, {user?.username}!
    </Typography>

    <Button onClick={() => window.sipapu.signOut()}>
      Sign Out
    </Button>
  </Box>
}

export default Profile