import { AlertColor, Snackbar, Alert, AlertTitle } from '@mui/material'
import React, { useState, useEffect } from 'react'

type NotificationConfig = {
  title: string
  message: string
  severity: AlertColor
}

export const useNotification = () => {
  const [conf, setConf] = useState<NotificationConfig | undefined>(undefined)
  const [open, setOpen] = useState<boolean>(false)

  const handleClose = () => setOpen(false)

  useEffect(() => {
    if (conf?.message) {
      setOpen(true)
    }
  }, [conf])

  const SnackbarComponent = () => <div>
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ bottom: { xs: 150, sm: 0 } }}
      onClose={handleClose}
      autoHideDuration={6000}>
      <Alert severity={conf?.severity} onClose={handleClose}>
        <AlertTitle>
          {conf?.title} 
        </AlertTitle>
        {conf?.message}
      </Alert>
    </Snackbar>
  </div>

  return [setConf, SnackbarComponent] as const
}