import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'

const Queue = () => {
  const [queue, setQueue] = useState([])

  return <Box className="p-4">
    <Typography
      variant="h2">
      Queue
    </Typography>

    <Typography
      variant="h5">
      TODO
    </Typography>
  </Box>
}

export default Queue