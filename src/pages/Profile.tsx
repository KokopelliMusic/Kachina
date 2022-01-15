import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'

const Profile = () => {
  const [username, setUsername] = useState<string>()


  useEffect(() => {
    window.sipapu.getUsername()
      .then(name => setUsername(name))
      .catch(err => {
        alert('fucking error handling')
      })
  })

  return <Box>
    <Typography
      variant="h3"
      component="h3">
      Hello, {username}!
    </Typography>
  </Box>
}

export default Profile