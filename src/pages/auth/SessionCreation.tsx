import React, { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Button, FormControl, FormGroup, FormControlLabel, FormLabel, Switch, Radio, RadioGroup, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Fab, List, Skeleton, Fade } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { useNotification } from '../../components/Snackbar'
import { NewPlaylistModal, PlaylistItem } from '../Playlists'
import { Add } from '@mui/icons-material'
import Kokopelli from '../../components/Kokopelli'
import { createSpotifyLink, fetchSpotifyToken } from '../LogIntoSpotify'
import OTP from '../../components/OTP'
import { Playlist } from '../../types/tawa'
import { client, KokopelliSettings, QueueAlgorithms } from '../../data/client'
import { saveSessionID } from '../../data/session'

// 1. Session settings
// 2. Playlist selection
// 3. Spotify check
// 4. Connect to tv
// 5. redirect to /session/session

const DEFAULT_SETTINGS: KokopelliSettings = {
  allow_spotify: true,
  allow_youtube: true,
  youtube_only_audio: false,

  allow_events: true,
  event_frequency: 10,
  allowed_events: [
    {
      name: 'adtrad',
      pretty_name: 'Wheel of Fortune',
      active: true,
    },
    {
      name: 'opus',
      pretty_name: 'Opus',
      active: true,
    },
  ],
  random_word_list: '[]',

  anyone_can_use_player_controls: true,
  anyone_can_add_to_queue: true,
  anyone_can_remove_from_queue: true,
  anyone_can_see_history: true,
  anyone_can_see_queue: true,
  anyone_can_see_playlist: true,

  algorithm_used: 'random',

  allow_guests: true
}

const SessionCreation = () => {
  const [notify, Snackbar] = useNotification()

  const [step, setStep]               = useState<number>(0)
  const [settings, setSettings]       = useState<KokopelliSettings>({ ...DEFAULT_SETTINGS })
  const [playlist, setPlaylist]       = useState<number>()
  const [spotifyCode, setSpotifyCode] = useState<string>('')
  const [sessionID, setSessionID]     = useState<string>('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get('code')) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setSpotifyCode(params.get('code')!)
      setStep(2) // spotify step
    } else if (params.get('step')) {
      setStep(parseInt(params.get('step')!, 10))
    }

  })

  useEffect(() => {
    if (!sessionID || sessionID.length !== 4) return

    const playlist = Number.parseInt(localStorage.getItem('kachina:selectedPlaylist')!)

    client.req('claim_session', { playlist_id: playlist, session_id: sessionID, settings })
      .then(() => {
        saveSessionID(sessionID)
        window.location.href = '/session/session'
      })
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
  }, [sessionID])

  const next = () => {
    setStep(step + 1)
    document.getElementById('main-div')?.scrollTo(0,0)
  }
  const skip = () => setStep(step + 2)
 
  const pages = [
    <SetSessionSettings key={0} next={next} setSettings={setSettings} settings={settings} notify={notify} />,
    <PlaylistSelection key={1} next={next} skip={skip} setPlaylist={setPlaylist} settings={settings} notify={notify} />,
    <SpotifyCheck key={2} next={next} code={spotifyCode} notify={notify}/>,
    <ConnectToTv key={3} next={next} notify={notify} setCode={setSessionID} />,
  ]

  return <Box id="main-div" className="h-full">
    <Snackbar />
    {pages[step]}
    <div className='pb-32' />
  </Box>
}

type Props = {
  key: number
  next: () => void
  skip?: () => void
  settings?: KokopelliSettings
  notify: (settings: any) => void
}

type SetSessionSettingsProps = Props & {
  settings: KokopelliSettings
  setSettings: (settings: KokopelliSettings) => void
}

const SetSessionSettings = ({ next, settings, setSettings, notify }: SetSessionSettingsProps ) => {
  // Default settings
  // const [settings, setSettings]     = useState<SessionSettings>(DEFAULT_SETTINGS)
  const [modalOpen, setModalOpen]   = useState<boolean>(false)
  const [modalTitle, setModalTitle] = useState<string>('')
  const [modalInfo, setModalInfo]   = useState<React.ReactNode>(null)

  const [randomWordList, setRandomWordList] = useState<string>('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.checked,
    })
  }

  const setAlgorithm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      algorithm_used: event.target.value as QueueAlgorithms
    })
  }

  const setEventFrequency = (event: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(event.target.value)

    if (!num) {
      return notify({ title: 'Error', message: 'Invalid event frequency', severity: 'warning' })
    }

    setSettings({
      ...settings,
      event_frequency: num
    })
  }

  const setAllowedEvents = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSettings({
        ...settings,
        allowed_events: [...settings.allowed_events, DEFAULT_SETTINGS.allowed_events.find(e => e.name === event.target.name)!]
      })
    } else {
      setSettings({
        ...settings,
        allowed_events: settings.allowed_events.filter(e => e.name !== event.target.name)
      })
    }
  }

  const randomWordListChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const a = event.target.value.split(',').map(s => s.trim())

    if (a[a.length - 1] === '') {
      a.pop()
    }

    setRandomWordList(event.target.value)

    setSettings({
      ...settings,
      random_word_list: JSON.stringify(a)
    })
  }

  const nextStep = () => {
    if (!settings.allow_spotify && !settings.allow_youtube) {
      return notify({ title: 'Error', message: 'You must allow at least one source', severity: 'warning' })
    }

    if (settings.allowed_events.length === 0) {
      setSettings({
        ...settings,
        allow_events: false
      })
    }

    if (settings.random_word_list.length === 0) {
      // Filter out the random-word event if there are no random words
      setSettings({
        ...settings,
        allowed_events: settings.allowed_events.filter(e => e.name !== 'random-word')
      })
    }

    next()
  }

  const modals = [
    <DialogContent key={0}>
      <DialogContentText>
        <b>Allow Spotify:</b> Enable adding Spotify songs to the playlist during this session, this requires a Spotify Premium account.
      </DialogContentText>
      <DialogContentText>
        <b>Allow YouTube:</b> Enable adding YouTube songs to the playlist during this session.
      </DialogContentText>
      <DialogContentText>
        <b>No video for YouTube:</b> When this (and Allow YouTube) is enabled, then the player will only play the audio of a YouTube video.
      </DialogContentText>
    </DialogContent>,

    <DialogContent key={1}>
      <DialogContentText>
        <b>Allow Events:</b> Enables the player to play events, little games, in between songs. 
      </DialogContentText>
      <DialogContentText>
        <b>Event Frequency:</b> The aproximate amount of songs in between events, this is slightly random but a higher number will add more time in between events.
      </DialogContentText>
      <DialogContentText>
        <b>Allowed Events:</b> List of events that will be played. Choices are <b>Wheel of Fortune</b>, <b>Opus</b> (Drinking game), <b>Random Word</b> (Puts random word on screen from list below) 
      </DialogContentText>
      <DialogContentText>
        <b>Random Word List:</b> Comma seperated list of all the words that can be used in the random word game. (For example you can use spirits or mixdrinks)
      </DialogContentText>
    </DialogContent>,

    <DialogContent key={2}>
      <DialogContentText>
        <b>Anyone can use player controls:</b> If enabled, then everyone with the sessioncode change the playback (pause, skip, previous) 
      </DialogContentText>
      <DialogContentText>
        <b>Anyone can add to queue:</b> If enabled, then anyone with the sessioncode can add songs directly into the queue, bypassing the shuffle algorithm
      </DialogContentText>
    </DialogContent>,

    <DialogContent key={3}>
      <DialogContentText>
        <b>Anyone can see the contents of the playlist:</b> If enabled, then everyone with the sessioncode can see the contents of the playlist.
      </DialogContentText>
      <DialogContentText>
        <b>Anyone can see the song queue:</b> If enabled, then anyone with the sessioncode can see the song queue.
      </DialogContentText>
      <DialogContentText>
        <b>Anyone can see the song history:</b> If enabled, then anyone with the sessioncode can see the history of played songs (in this session)
      </DialogContentText>
    </DialogContent>,

    <DialogContent key={4}>
      <DialogContentText>
        <b>Modern:</b> The default shuffle algorithm, which aims to shuffle the songs in the most fair way. It favors songs that have been played less often, from users who have their songs not played the most.
      </DialogContentText>
      <DialogContentText>
        <b>Classic:</b> The classic shuffle algorithm, which first selects someone who has added a song randomly, then selects a random song from that person.
      </DialogContentText>
      <DialogContentText>
        <b>Random:</b> Pure random, it selects a song without any consideration.
      </DialogContentText>
      <DialogContentText>
        <b>Weighted Song:</b> This algorithm will favor songs that have not been played before.
      </DialogContentText>
    </DialogContent>
  ]

  const openModal = (option: string) => {
    switch (option) {
    case 'sources':
      setModalTitle('Sources help')
      setModalInfo(modals[0])
      break
    case 'events':
      setModalTitle('Events help')
      setModalInfo(modals[1])
      break
    case 'controls':
      setModalTitle('Controls help')
      setModalInfo(modals[2])
      break
    case 'data':
      setModalTitle('Data help')
      setModalInfo(modals[3])
      break
    case 'algorithm':
      setModalTitle('Shuffle Algorithm help')
      setModalInfo(modals[4])
      break
    }
    
    setModalOpen(true)
  }

  // TODO
  settings.allow_youtube = false
  settings.algorithm_used = 'weighted-song'

  return <Box className="p-4">
    <SettingsInfoModal open={modalOpen} setOpen={setModalOpen} title={modalTitle} info={modalInfo} />
    <Typography
      variant="h5">
      Step 1: Session Settings
    </Typography>

    <Typography
      className="pb-2"
      variant="body1">
      These settings are saved automatically and are recommended, but feel free to change them however you like
    </Typography>

    <FormControl>
      <FormLabel onClick={() => openModal('sources')} color="primary">Sources <HelpOutlineIcon fontSize="small" sx={{ paddingBottom: '2px' }}/></FormLabel>
      <FormGroup className="pb-4">
        <FormControlLabel
          control={<Switch checked={settings.allow_spotify} onChange={handleChange} name="allow_spotify" />}
          label="Allow Spotify"
        />
        <FormControlLabel
          disabled
          control={<Switch checked={false /*settings.allow_youtube*/} onChange={handleChange} name="allow_youtube" />}
          label="Allow YouTube"
        />
        <FormControlLabel
          disabled={true /*!settings.allow_youtube*/}
          control={<Switch checked={settings.youtube_only_audio} onChange={handleChange} name="youtube_only_audio" />}
          label="No video for YouTube"
        />
      </FormGroup>

      <FormLabel onClick={() => openModal('controls')} color="primary">Controls <HelpOutlineIcon fontSize="small" sx={{ paddingBottom: '2px' }}/></FormLabel>
      <FormGroup className="pb-4">
        <FormControlLabel
          disabled
          control={<Switch checked={settings.anyone_can_use_player_controls} onChange={handleChange} name="anyone_can_use_player_controls" />}
          label="Anyone can use player controls"
        />
        <FormControlLabel
          disabled
          control={<Switch checked={false /*settings.anyone_can_add_to_queue*/} onChange={handleChange} name="anyone_can_add_to_queue" />}
          label="Allow can add to queue"
        />
      </FormGroup>

      <FormLabel onClick={() => openModal('data')} color="primary">Data <HelpOutlineIcon fontSize="small" sx={{ paddingBottom: '2px' }}/></FormLabel>
      <FormGroup className="pb-4">
        <FormControlLabel
          control={<Switch checked={settings.anyone_can_see_playlist} onChange={handleChange} name="anyone_can_see_playlist" />}
          label="Anyone can see the contents of the playlist"
        />
        <FormControlLabel
          disabled
          control={<Switch checked={false /*settings.anyone_can_see_queue*/} onChange={handleChange} name="anyone_can_see_queue" />}
          label="Anyone can see the song queue"
        />
        <FormControlLabel
          disabled
          control={<Switch checked={false /*settings.anyone_can_see_history*/} onChange={handleChange} name="anyone_can_see_history" />}
          label="Anyone can see the song history"
        />
      </FormGroup>

      <FormLabel onClick={() => openModal('algorithm')} color="primary">Shuffle Algorithm <HelpOutlineIcon fontSize="small" sx={{ paddingBottom: '2px' }}/></FormLabel>
      <RadioGroup
        className="pb-4"
        name="algorithm_used"
        value={settings.algorithm_used}
        onChange={setAlgorithm}>
        <FormControlLabel disabled value="modern" control={<Radio />} label="Modern" />
        <FormControlLabel disabled value="classic" control={<Radio />} label="Classic" />
        <FormControlLabel disabled value="random" control={<Radio />} label="Random" />
        <FormControlLabel value="weighted-song" control={<Radio />} label="Weighted Song" />
      </RadioGroup>
    </FormControl>

    <FormLabel onClick={() => openModal('events')} color="primary">Events <HelpOutlineIcon fontSize="small" sx={{ paddingBottom: '2px' }}/></FormLabel>
    <FormGroup className="pb-4">
      <FormControlLabel
        control={<Switch checked={settings.allow_events} onChange={handleChange} name="allow_events" />}
        label="Allow Events"
      />
      <FormControlLabel
        disabled={!settings.allow_events}
        control={<Switch checked={!!settings.allowed_events.find(e => e.name === 'adtrad')} onChange={setAllowedEvents} name="adtrad" />}
        label="Enable the Wheel of Fortune game"
      />
      <FormControlLabel
        disabled={!settings.allow_events}
        control={<Switch checked={!!settings.allowed_events.find(e => e.name === 'opus')} onChange={setAllowedEvents} name="opus" />}
        label="Enable Opus"
      />
      <FormControlLabel
        disabled
        // disabled={!settings.allowEvents}
        control={<Switch checked={!!settings.allowed_events.find(e => e.name === 'random-word')} onChange={setAllowedEvents} name="random-word" />}
        label="Enable the Random Word game"
      />
      <TextField 
        variant="standard"
        disabled={!settings.allow_events}
        value={settings.event_frequency}
        className="w-1/2"
        onChange={setEventFrequency}
        type="number"
        name="eventFrequency"
        label="Event Frequency"/>
      <TextField
        variant="standard"
        disabled={!settings.allow_events || !settings.allowed_events.find(e => e.name === 'random-word')}
        value={randomWordList}
        className="w-11/12"
        onChange={randomWordListChange}
        name="randomWordList"
        label="Random Word List (comma seperated)"/>

    </FormGroup>

    <Box className="w-full center pt-6 pb-4">
      <Button variant="contained" onClick={nextStep}>Continue</Button>
    </Box>
  </Box>
}

type SettingsInfoModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  title: string
  info: React.ReactNode
}

const SettingsInfoModal = ({ open, setOpen, title, info }: SettingsInfoModalProps) => {
  return <Dialog open={open} onClose={() => setOpen(false)}>
    <DialogTitle>{title}</DialogTitle>
    {info}
    <DialogActions>
      <Button onClick={() => setOpen(false)}>Close</Button>
    </DialogActions>
  </Dialog>
}

type PlaylistSelectionProps = Props & {
  setPlaylist: (playlist: number) => void
}

const PlaylistSelection = ({ next, skip, setPlaylist, settings, notify }: PlaylistSelectionProps) => {
  const [playlists, setPlaylists]     = useState<Playlist[]>([])
  const [loading, setLoading]         = useState(true)
  const [openModal, setOpenModal]     = useState(false)
  const [forceReload, setForceReload] = useState(false)
  const [spotify, setSpotify]         = useState(false)

  useEffect(() => {
    client.req('get_spotify', {})
      .then(s => setSpotify(!!s))
      .catch(() => setSpotify(false))
  }, [])

  useEffect(() => {
    if (forceReload) {
      setForceReload(false)
    }
    client.req('get_own_playlists', {})
      .then(setPlaylists)
      .then(() => setLoading(false))
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
  }, [forceReload])

  const selectPlaylist = (id: number) => {
    setPlaylist(id)
    localStorage.setItem('kachina:selectedPlaylist', '' + id)
    if (spotify || !settings?.allow_spotify) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return skip!()
    }

    next()
  }

  const loadingPlaylist = <Box className="w-full flex" height={88}>
    <div className="pl-4 w-20 center">
      <Skeleton variant="circular" width={40} height={40} />
    </div>
    <Skeleton className="center ml-2" width="65%" height="100%" />
  </Box>

  if (loading) {
    return <Box className="w-full h-full">
      <div className="pt-1"/>
      {[...Array(10)].map((_val, idx) => <div key={idx}>{loadingPlaylist}</div>)}
    </Box>  
  }

  if (playlists.length === 0) {
    return <Box className="h-4/6 flex items-center p-4">
      <div>
        <NewPlaylistModal open={openModal} setOpen={setOpenModal} notify={notify} forceReload={setForceReload} />
        <Fade in={true} timeout={250}>
          <Box>
            <Typography
              className="pt-4"
              variant="h5">
              Step 2: Playlist Selection
            </Typography>

            <Typography
              variant="body1"
              className="pb-2">
              Now select the playlist you want to use for the music.
            </Typography>
          
            <Typography
              className="text-center w-full pt-4 px-8"
              variant="h4"
              component="h1">
              You do not have any playlists yet.
            </Typography>

            <Typography
              className="text-center w-full pt-4 px-8"
              variant="h6"
              component="h1">
              Make your first playlist with the + button below.
            </Typography>
          
            <div className="center w-full">
              <Kokopelli height={250} />
            </div>
          </Box>
        </Fade>

        <div className="fixed bottom-20 right-6">
          <Fab color="primary" onClick={() => setOpenModal(true)} >
            <Add />
          </Fab>
        </div>
      </div>
    </Box>
  }

  return <Box className="w-full">
    <NewPlaylistModal open={openModal} setOpen={setOpenModal} notify={notify} forceReload={setForceReload} />
    <Fade in={true} timeout={250}>
      <Box>
        <Typography
          className="px-4 pt-4"
          variant="h5">
          Step 2: Playlist Selection
        </Typography>

        <Typography
          variant="body1"
          className="px-4 py-2">
          Now select the playlist you want to use for the music.
        </Typography>

        <main className="mb-auto flex flex-col items-center scroll">

          <List sx={{ width: '100%' }}>
            {playlists.map(playlist => (<div key={playlist.id}>
              <PlaylistItem onClick={() => selectPlaylist(playlist.id)} playlist={playlist}/>
            </div>))}
          </List>
        </main>
      </Box>
    </Fade>


    <div className="fixed bottom-20 right-6">
      <Fab color="primary" onClick={() => setOpenModal(true)} >
        <Add />
      </Fab>
    </div>
  </Box>
}

type SpotifyCheckProps = Props & {
  code: string
}

const SpotifyCheck = ({ next, code, notify }: SpotifyCheckProps) => {
  const BASE_URL = process.env.REACT_APP_LOCALHOST == 'true' ? process.env.REACT_APP_BASE_URL : process.env.REACT_APP_LINK_URL 
  const redirectBack = BASE_URL + '/auth/sessionCreation?step=3'

  useEffect(() => {
    console.log('code', code)

    if (code === '') return

    fetchSpotifyToken(code, redirectBack, redirectBack, notify)
  }, [code])

  useEffect(() => {
    console.log('code', code)

    client.req('get_spotify', {})
      .then(s => {
        if (s) {
          next()
        }
      })
  })


  const login = () => window.location.href = createSpotifyLink(redirectBack)

  return <Box className="p-4 h-full w-full mb-32">
    <Typography
      variant="h5">
      Step 3: Linking Spotify
    </Typography>

    <Typography
      variant="body1"
      className="pb-2">
      You have enabled Spotify in the session settings, but are not logged in! Press the button below to log into Spotify, this requires you to have a Spotify Premium account.
    </Typography>

    <Typography
      variant="body1"
      sx={{ color: 'red' }}
      className="pb-2">
      Note: this might redirect you to an empty page. If that is the case press the back button and try again. If it still does not work
      please send an email to kokopelli@nierot.com
    </Typography>
    <Button onClick={login}>Login to Spotify</Button>
  </Box>
}

type ConnectToTvProps = Props & {
  setCode: (code: string) => void
}

const ConnectToTv = ({ setCode }: ConnectToTvProps) => {
  
  return <Box className="h-full p-4">
    <Box>
      <Typography
        variant="h5">
        Step 4: Connect to TV
      </Typography>

      <Typography
        variant="body1">
        Now navigate on your TV to
      </Typography>
      <Typography
        className="text-center"
        variant="h6">
        {process.env.REACT_APP_KOKOPELLI_URL}
      </Typography>
      <Typography
        className="text-right"
        variant="body1">
        and fill in the code you see there.
      </Typography>
        
      <Kokopelli className="w-full center" />

      <OTP setCode={setCode} />
    </Box>
  </Box>
}

export default SessionCreation