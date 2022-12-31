import { Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNotification } from '../../components/Snackbar'
import { client } from '../../data/client'
import { getSessionID } from '../../data/session'
import { Event } from '../../types/tawa'

const History = () => {

  const [notify, Snackbar] = useNotification()

  const [loading, setLoading] = useState<boolean>(true)
  const [events, setEvents]   = useState<Event[]>([])

  const [open, setOpen]       = useState<boolean>(false)
  const [event, setEvent]     = useState<Event>({
    event_type: 'generic',
    client_type: 'kachina',
    date: new Date().toISOString(),
    data: '',
    session_id: ''
  })

  useEffect(() => {
    const session_id = getSessionID()
    client.req('get_event_history', { session_id })
      .then(setEvents)
      .then(load)
      .catch(e => {
        notify({
          title: 'Error',
          message: e.message,
          severity: 'error'
        })
      })
  }, [])

  const load = () => setTimeout(() => setLoading(false), 500)

  const showDetails = (event: Event) => {
    console.log(event)
    setEvent(event)
    setOpen(true)
  }
  
  if (loading) {
    return <Box className="h-4/6 w-full center">
      <CircularProgress />
    </Box>
  }

  return <Box className="p-4">
    <Snackbar />
    <EventDetailsModal event={event!} open={open} onClose={() => setOpen(false)} />
    <Typography
      variant="h3">
      History
    </Typography>

    <Typography>
      This page shows everything that happend in this session.
    </Typography>

    <Box className="mt-4">
      {events.map((event, idx) => 
        <Card key={idx} className="mb-4" >
          <CardContent>
            
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>
                    Event Type
                  </TableCell>
                  <TableCell>
                    {event.event_type}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    Client
                  </TableCell>
                  <TableCell>
                    {event.client_type}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    Date
                  </TableCell>
                  <TableCell>
                    {new Date(event.date).toLocaleString('nl-NL')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button 
              sx={{ float: 'right' }}
              onClick={() => showDetails(event)}>
              Details
            </Button>
          </CardContent>
        </Card>
      )}

      <Box className="pb-32 text-center">
        <Typography variant="h5">
          That&apos;s all folks!
        </Typography>
      </Box>
    </Box>
  </Box>
}

type EventDetailsModalProps = {
  event: Event
  open: boolean
  onClose: () => void
}

const EventDetailsModal = ({ event, open, onClose }: EventDetailsModalProps) => {
  return <Dialog open={open} onClose={onClose}>
    <DialogTitle>
      {event.event_type}
    </DialogTitle>

    <DialogContent>
      <DialogContentText>
        {JSON.stringify(event, null, 2)}
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button onClick={onClose}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
}

export default History