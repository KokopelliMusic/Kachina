import React from 'react'
import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Link } from 'react-router-dom'

type NotFoundProps = {
  to: string
}

const NotFound = (props: NotFoundProps) => {
  return <Box>
    <Typography
      className="w-full text-center pt-16"
      variant="h1"
      component="h1">
      404
    </Typography>
    <Typography
      className="w-full text-center"
      variant="h5"
      component="h1">
      Page not found
    </Typography>

    <div className="p-4"/>

    <div className="w-full text-center">
      <Button variant="contained" component={Link} to={props.to}>
        Go Back
      </Button>
    </div>
  </Box>
}

export default NotFound