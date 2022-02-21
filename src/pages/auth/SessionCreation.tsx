import React, { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Button, FormControl, FormGroup, FormControlLabel, FormLabel, Switch, Radio, RadioGroup, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Fab, List, Skeleton } from '@mui/material'
import { SessionSettings, DEFAULT_SETTINGS, QueueAlgorithms } from 'sipapu/dist/src/services/session'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { useNotification } from '../../components/Snackbar'
import { NewPlaylistModal, PlaylistItem } from '../Playlists'
import { Add } from '@mui/icons-material'
import { PlaylistType } from 'sipapu/dist/src/services/playlist'
import Kokopelli from '../../components/Kokopelli'
import { createSpotifyLink, fetchSpotifyToken } from '../LogIntoSpotify'
import OTP from '../../components/OTP'
import { saveSessionCode } from '../../data/session'

// 1. Session settings
// 2. Playlist selection
// 3. Spotify check
// 4. Connect to tv
// 5. redirect to /session/session

const SessionCreation = () => {
  const [notify, Snackbar] = useNotification()

  const [step, setStep]               = useState<number>(0)
  const [settings, setSettings]       = useState<SessionSettings>(DEFAULT_SETTINGS)
  const [playlist, setPlaylist]       = useState<number>()
  const [spotifyCode, setSpotifyCode] = useState<string>('')
  const [sessionCode, setSessionCode] = useState<string>('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1])

    if (params.get('code')) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setSpotifyCode(params.get('code')!)
      setStep(2) // spotify step
    }

    if (hashParams.get('step')) {
      setStep(2) // tv step
    }
  }, [])

  useEffect(() => {
    if (!sessionCode || sessionCode.length !== 4) return

    // This is safe
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    window.sipapu.Session.claim(playlist!, sessionCode, settings)
      .then(() => {
        saveSessionCode(sessionCode)
        window.location.href = '#/session/session'
      })
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
  }, [sessionCode])

  const next = () => {
    setStep(step + 1)
    document.getElementById('main-div')?.scrollTo(0,0)
  }
  const skip = () => setStep(step + 2)
 
  const pages = [
    <SetSessionSettings key={0} next={next} setSettings={setSettings} settings={settings} notify={notify} />,
    <PlaylistSelection key={1} next={next} skip={skip} setPlaylist={setPlaylist} settings={settings} notify={notify} />,
    <SpotifyCheck key={2} next={next} code={spotifyCode} notify={notify}/>,
    <ConnectToTv key={3} next={next} notify={notify} setCode={setSessionCode} />,
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
  settings?: SessionSettings
  notify: (settings: any) => void
}

type SetSessionSettingsProps = Props & {
  settings: SessionSettings
  setSettings: (settings: SessionSettings) => void
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
      algorithmUsed: event.target.value as QueueAlgorithms
    })
  }

  const setEventFrequency = (event: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(event.target.value)

    if (!num) {
      return notify({ title: 'Error', message: 'Invalid event frequency', severity: 'warning' })
    }

    setSettings({
      ...settings,
      eventFrequency: num
    })
  }

  const setAllowedEvents = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSettings({
        ...settings,
        // @ts-expect-error - TS doesn't know that this is correct
        allowedEvents: [...settings.allowedEvents, event.target.name]
      })
    } else {
      setSettings({
        ...settings,
        allowedEvents: settings.allowedEvents.filter(e => e !== event.target.name)
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
      randomWordList: a
    })
  }

  const nextStep = () => {
    if (settings.randomWordList.length === 0) {
      // Filter out the random-word event if there are no random words
      setSettings({
        ...settings,
        allowedEvents: settings.allowedEvents.filter(e => e !== 'random-word')
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
  settings.allowEvents = false

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
          control={<Switch checked={settings.allowSpotify} onChange={handleChange} name="allowSpotify" />}
          label="Allow Spotify"
        />
        <FormControlLabel
          disabled
          control={<Switch checked={false /*settings.allowYouTube*/} onChange={handleChange} name="allowYouTube" />}
          label="Allow YouTube"
        />
        <FormControlLabel
          disabled={true /*!settings.allowYouTube*/}
          control={<Switch checked={settings.youtubeOnlyAudio} onChange={handleChange} name="youtubeOnlyAudio" />}
          label="No video for YouTube"
        />
      </FormGroup>

      <FormLabel onClick={() => openModal('controls')} color="primary">Controls <HelpOutlineIcon fontSize="small" sx={{ paddingBottom: '2px' }}/></FormLabel>
      <FormGroup className="pb-4">
        <FormControlLabel
          disabled
          control={<Switch checked={settings.anyoneCanUsePlayerControls} onChange={handleChange} name="anyoneCanUsePlayerControls" />}
          label="Anyone can use player controls"
        />
        <FormControlLabel
          disabled
          control={<Switch checked={false /*settings.anyoneCanAddToQueue*/} onChange={handleChange} name="anyoneCanAddToQueue" />}
          label="Allow can add to queue"
        />
      </FormGroup>

      <FormLabel onClick={() => openModal('data')} color="primary">Data <HelpOutlineIcon fontSize="small" sx={{ paddingBottom: '2px' }}/></FormLabel>
      <FormGroup className="pb-4">
        <FormControlLabel
          control={<Switch checked={settings.anyoneCanSeePlaylist} onChange={handleChange} name="anyoneCanSeePlaylist" />}
          label="Anyone can see the contents of the playlist"
        />
        <FormControlLabel
          disabled
          control={<Switch checked={false /*settings.anyoneCanSeeQueue*/} onChange={handleChange} name="anyoneCanSeeQueue" />}
          label="Anyone can see the song queue"
        />
        <FormControlLabel
          disabled
          control={<Switch checked={false /*settings.anyoneCanSeeHistory*/} onChange={handleChange} name="anyoneCanSeeHistory" />}
          label="Anyone can see the song history"
        />
      </FormGroup>

      <FormLabel onClick={() => openModal('algorithm')} color="primary">Shuffle Algorithm <HelpOutlineIcon fontSize="small" sx={{ paddingBottom: '2px' }}/></FormLabel>
      <RadioGroup
        className="pb-4"
        name="algorithmUsed"
        value={settings.algorithmUsed}
        onChange={setAlgorithm}>
        <FormControlLabel value="modern" control={<Radio />} label="Modern" />
        <FormControlLabel value="classic" control={<Radio />} label="Classic" />
        <FormControlLabel value="random" control={<Radio />} label="Random" />
        <FormControlLabel value="weighted_song" control={<Radio />} label="Weighted Song" />
      </RadioGroup>
    </FormControl>

    <FormLabel onClick={() => openModal('events')} color="primary">Events <HelpOutlineIcon fontSize="small" sx={{ paddingBottom: '2px' }}/></FormLabel>
    <FormGroup className="pb-4">
      <FormControlLabel
        disabled
        control={<Switch checked={settings.allowEvents} onChange={handleChange} name="allowEvents" />}
        label="Allow Events"
      />
      <FormControlLabel
        disabled={!settings.allowEvents}
        control={<Switch checked={settings.allowedEvents.includes('adtrad')} onChange={setAllowedEvents} name="adtrad" />}
        label="Enable the Wheel of Fortune game"
      />
      <FormControlLabel
        disabled={!settings.allowEvents}
        control={<Switch checked={settings.allowedEvents.includes('opus')} onChange={setAllowedEvents} name="opus" />}
        label="Enable Opus"
      />
      <FormControlLabel
        disabled={!settings.allowEvents}
        control={<Switch checked={settings.allowedEvents.includes('random-word')} onChange={setAllowedEvents} name="random-word" />}
        label="Enable the Random Word game"
      />
      <TextField 
        variant="standard"
        disabled={!settings.allowEvents}
        value={settings.eventFrequency}
        className="w-1/2"
        onChange={setEventFrequency}
        type="number"
        name="eventFrequency"
        label="Event Frequency"/>
      <TextField
        variant="standard"
        disabled={!settings.allowEvents || !settings.allowedEvents.includes('random-word')}
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
  const [playlists, setPlaylists]     = useState<PlaylistType[]>([])
  const [loading, setLoading]         = useState(true)
  const [openModal, setOpenModal]     = useState(false)
  const [forceReload, setForceReload] = useState(false)
  const [spotify, setSpotify]         = useState(false)

  useEffect(() => {
    window.sipapu.Spotify.get()
      .then(s => setSpotify(!!s))
      .catch(() => setSpotify(false))
  }, [])

  useEffect(() => {
    if (forceReload) {
      setForceReload(false)
    }
    window.sipapu.Playlist.getAllFromUser()
      .then(setPlaylists)
      .then(() => setLoading(false))
      .catch(err => {
        notify({ title: 'Error', message: err.message, severity: 'error' })
      })
  }, [forceReload])

  const selectPlaylist = (id: number) => {
    setPlaylist(id)
    if (spotify || !settings?.allowSpotify) {
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
  const BASE_URL = process.env.REACT_APP_BASE_URL ?? 'http://localhost:3000'  
  const redirectBack= BASE_URL + '/#/auth/sessionCreation?step=3'

  useEffect(() => {
    if (code === '') return

    fetchSpotifyToken(code, redirectBack, redirectBack, notify)
  }, [code])

  useEffect(() => {
    window.sipapu.Spotify.get()
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