import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

const Welcome = () => {
  return <Box>
    <img src="/kokopelli.png" className="w-1/3 mx-auto pt-8" />

    <Typography
      className="w-full text-center pt-8"
      variant="h3"
      component="h1">
        Welcome to Kokopelli
    </Typography>

  </Box>
}

export default Welcome