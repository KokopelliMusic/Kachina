import React from 'react'
import { Typography, Button, TextField } from '@mui/material'
import { Box } from '@mui/system'
import Caroussel from '../components/Caroussel'
import { useNavigate } from 'react-router-dom'

const Welcome = () => {
  const [activeStep, setActiveStep] = React.useState(0)
  const pages = [<Page1 setActiveStep={setActiveStep} key={0}/>, <Page2 setActiveStep={setActiveStep} key={1}/>, <SignUp key={2}/>, <SignIn key={3} />]

  return pages[activeStep]
}

type PageProps = {
  setActiveStep: (step: number) => void
}

const Page1 = (props: PageProps) => {
  return <Box className="flex flex-col h-screen jusify-between">
    <main className="mb-auto">
      <img src="/kokopelli.png" className="h-80 mx-auto pt-8" />

      <Typography
        className="h-10 w-full text-center pt-8"
        variant="h4"
        component="h1">
          Welcome to Kokopelli
      </Typography>

      <div className="h-10 w-full text-center pt-8">
          Have full control over your music
      </div>

    </main>

    <div className="h-40 w-full center">
      <Button variant="contained" onClick={() => props.setActiveStep(1)}>Get started</Button>
    </div>

    <footer className="h-20 center w-full pb-12">
      <Caroussel activeStep={0} steps={3} className="w-4/5" />
    </footer>
  </Box>
}

const Page2 = (props: PageProps) => {
  return <Box className="flex flex-col h-screen jusify-between">
    <main className="mb-auto">
      <img src="/kokopelli.png" className="h-80 mx-auto pt-8" />  

      <Typography
        className="h-20 w-full text-center pt-8"
        variant="h4"
        component="h1">
          Start using Kokopelli
      </Typography>

      <div className="center pt-16">
        <Button variant="contained" className="w-1/2" onClick={() => props.setActiveStep(2)}>
          Sign up
        </Button>
      </div>

      <div className="pt-4 text-center">
        Already have an account?
        <Button onClick={() => props.setActiveStep(3)}>
          Sign in
        </Button>
      </div>

    </main>

    <footer className="h-20 center w-full pb-12">
      <Caroussel activeStep={1} steps={3} className="w-4/5" />
    </footer>
  </Box>
}

const SignUp = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [emailError, setEmailError] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')
  const [usernameError, setUsernameError] = React.useState('')
  const [signUpError, setSignUpError] = React.useState('')

  const navigate = useNavigate()

  const signUp = () => {
    if (email === '') {
      setEmailError('Field required')
    }
    if (password === '') {
      setPasswordError('Field required')
    }
    if (username === '') {
      setUsernameError('Field required')
    }

    window.sipapu.signUp(email, password, username)
      .then(() => navigate('/playlists'))
      .catch(err => setSignUpError(err.message))
  }

  return <Box className="flex flex-col h-screen jusify-between">
    <main className="mb-auto">
      <Typography
        className="h-10 w-full text-center py-16"
        variant="h4"
        component="h1">
          Sign up for Kokopelli
      </Typography>

      <p className="text-center w-full">
        It&apos;s free and always will be
      </p>
    
      <Box
        className="flex flex-col items-center pt-8"
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '20rem' },
        }}
        autoComplete="on">

        <TextField
          label="Username"
          variant="outlined"
          className="pt-16"
          error={!!usernameError}
          helperText={usernameError ? usernameError : ''}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Email"
          variant="outlined"
          className="pt-16"
          error={!!emailError}
          helperText={emailError ? emailError : ''}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          variant="outlined"
          className="pt-8"
          error={!!passwordError}
          helperText={passwordError ? passwordError : ''}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="w-full text-center font-light text-red-600 text-sm pb-4">
          {signUpError}
        </p>

        <Button
          variant="contained"
          onClick={signUp}>
          Sign up
        </Button>
      </Box>
    </main>

    <footer className="h-20 center w-full pb-12">
      <Caroussel activeStep={3} steps={3} className="w-4/5" />
    </footer>
  </Box>
}

const SignIn = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [emailError, setEmailError] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')
  const [signUpError, setSignUpError] = React.useState('')

  const navigate = useNavigate()

  const signUp = () => {
    if (email === '') {
      setEmailError('Field required')
    }
    if (password === '') {
      setPasswordError('Field required')
    }

    window.sipapu.signIn(email, password)
      .then(() => navigate('/playlists'))
      .catch(err => setSignUpError(err.message))
  }

  return <Box className="flex flex-col h-screen jusify-between">
    <main className="mb-auto">
      <Typography
        className="h-10 w-full text-center py-16"
        variant="h4"
        component="h1">
          Sign in
      </Typography>

      <p className="text-center w-full">
        One step away from using Kokopelli
      </p>
    
      <Box
        className="flex flex-col items-center pt-8"
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '20rem' },
        }}
        autoComplete="on">
        <TextField
          label="Email"
          variant="outlined"
          className="pt-16"
          error={!!emailError}
          helperText={emailError ? emailError : ''}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          variant="outlined"
          className="pt-8"
          error={!!passwordError}
          helperText={passwordError ? passwordError : ''}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="w-full text-center font-light text-red-600 text-sm pb-4">
          {signUpError}
        </p>

        <Button
          variant="contained"
          onClick={signUp}>
          Sign in
        </Button>
      </Box>
    </main>

    <footer className="h-20 center w-full pb-12">
      <Caroussel activeStep={3} steps={3} className="w-4/5" />
    </footer>
  </Box>
}

export default Welcome