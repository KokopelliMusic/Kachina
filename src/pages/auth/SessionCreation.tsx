import React, { useState } from 'react'
import { Box } from '@mui/system'
import { Button, FormControl, FormGroup, FormControlLabel, FormLabel, Switch, Radio, RadioGroup, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { SessionSettings, DEFAULT_SETTINGS, QueueAlgorithms } from 'sipapu/dist/src/services/session'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

// 1. Session settings
// 2. Playlist selection
// 3. Spotify check
// 4. Connect to tv
// 5. redirect to /session/session

const SessionCreation = () => {
  const [step, setStep] = useState<number>(0)

  const next = () => setStep(step + 1)
  const skip = () => setStep(step + 2)
 
  const pages = [
    <SetSessionSettings key={0} next={next} />,
    <PlaylistSelection key={1} next={next} skip={skip}/>,
    <SpotifyCheck key={2} next={next} />,
    <ConnectToTv key={3} next={next} />,
  ]

  return <Box>
    {pages[step]}
  </Box>
}

type Props = {
  key: number
  next: () => void
  skip?: () => void
}

const SetSessionSettings = ({ next }: Props) => {
  // Default settings
  const [settings, setSettings]     = useState<SessionSettings>(DEFAULT_SETTINGS)
  const [modalOpen, setModalOpen]   = useState<boolean>(false)
  const [modalTitle, setModalTitle] = useState<string>('')
  const [modalInfo, setModalInfo]   = useState<React.ReactNode>(null)

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
    }
    
    setModalOpen(true)
  }

  return <Box className="p-4 h-full mb-32">
    <SettingsInfoModal open={modalOpen} setOpen={setModalOpen} title={modalTitle} info={modalInfo} />
    <Typography
      variant="h5">
      Session Settings
    </Typography>

    <Typography
      className="pb-2"
      variant="body1">
      These settings are saved automatically and are recommended, but feel free to change them however you like
    </Typography>

    <FormControl>
      <FormLabel onClick={() => openModal('sources')} color="primary">Sources <HelpOutlineIcon fontSize="small" sx={{ paddingBottom: '2px' }}/></FormLabel>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={settings.allowSpotify} onChange={handleChange} name="allowSpotify" />}
          label="Allow Spotify"
        />
        <FormControlLabel
          control={<Switch checked={settings.allowYouTube} onChange={handleChange} name="allowYouTube" />}
          label="Allow YouTube"
        />
        <FormControlLabel
          control={<Switch checked={settings.youtubeOnlyAudio} onChange={handleChange} name="youtubeOnlyAudio" />}
          label="No video for YouTube"
        />
      </FormGroup>

      <FormLabel onClick={() => openModal('events')} color="primary">Events <HelpOutlineIcon fontSize="small" sx={{ paddingBottom: '2px' }}/></FormLabel>
      <FormGroup>
        <FormControlLabel
          control={<Switch disabled checked={false} onChange={handleChange} name="allowEvents" />}
          label="Allow Events"
        />
        {/* eventFrequency, allowedEvents */}
      </FormGroup>

      <FormLabel onClick={() => openModal('controls')} color="primary">Controls <HelpOutlineIcon fontSize="small" sx={{ paddingBottom: '2px' }}/></FormLabel>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={settings.anyoneCanUsePlayerControls} onChange={handleChange} name="anyoneCanUsePlayerControls" />}
          label="Anyone can use player controls"
        />
        <FormControlLabel
          control={<Switch checked={settings.anyoneCanAddToQueue} onChange={handleChange} name="anyoneCanAddToQueue" />}
          label="Allow can add to queue"
        />
      </FormGroup>

      <FormLabel>Data</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={settings.anyoneCanSeePlaylist} onChange={handleChange} name="anyoneCanSeePlaylist" />}
          label="Anyone can see the contents of the playlist"
        />
        <FormControlLabel
          control={<Switch checked={settings.anyoneCanSeeQueue} onChange={handleChange} name="anyoneCanSeeQueue" />}
          label="Anyone can see the song queue"
        />
        <FormControlLabel
          control={<Switch checked={settings.anyoneCanSeeHistory} onChange={handleChange} name="anyoneCanSeeHistory" />}
          label="Anyone can see the song history"
        />
      </FormGroup>

      <FormLabel>Shuffle algorithm</FormLabel>
      <RadioGroup
        name="algorithmUsed"
        value={settings.algorithmUsed}
        onChange={setAlgorithm}>
        <FormControlLabel value="modern" control={<Radio />} label="Modern" />
        <FormControlLabel value="classic" control={<Radio />} label="Classic" />
        <FormControlLabel value="random" control={<Radio />} label="Random" />
        <FormControlLabel value="weighted_song" control={<Radio />} label="Weighted Song" />
      </RadioGroup>
    </FormControl>

    <Box className="w-full center pt-6 pb-4">
      <Button variant="contained" onClick={next}>Continue</Button>
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

const PlaylistSelection = ({ next, skip }: Props) => {
  return <Box>
    Playlist Selection
    <Button onClick={next}>Spotify not logged in</Button>
    <Button onClick={skip}>Spotify logged in</Button>
  </Box>
}

const SpotifyCheck = ({ next }: Props) => {
  return <Box>
    Spotify Check
    <Button onClick={next}>Connect to TV</Button>
  </Box>
}

const ConnectToTv = ({ next }: Props) => {
  return <Box>
    Connect to TV
    <Button onClick={() => alert('Session creation finished, now redirect')}>Session</Button>
  </Box>
}

export default SessionCreation