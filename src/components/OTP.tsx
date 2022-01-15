import { Box, TextField } from '@mui/material'
import React from 'react'

type OTPProps = {
  setCode: (code: string) => void
}

const OTP = (props: OTPProps) => {
  const [letter1, setLetter1] = React.useState('')
  const [letter2, setLetter2] = React.useState('')
  const [letter3, setLetter3] = React.useState('')
  const [letter4, setLetter4] = React.useState('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputFocus = (el: any) => {
    if (el === undefined) return

    props.setCode(`${letter1}${letter2}${letter3}${letter4}`)

    if (el.key === 'Delete' || el.key === 'Backspace') {
      const next = el.target.tabIndex - 2

      if (el.target.value !== '' && next >= -1)
        el.target.form.elements[next].focus()

    } else {
      const next = el.target.tabIndex + 2

      if (next < 8) {
        el.target.form.elements[next].focus()
      }

    }
  }

  const otpStyles: React.CSSProperties = {
    width: '18%',
    textAlign: 'right'
  }

  const inputStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '1.5rem',
  }
  
  return <Box>

    <form className="flex w-100 place-content-evenly">
      <TextField
        required
        style={otpStyles}
        value={letter1}
        onChange={(event) => setLetter1(event.target.value.toUpperCase())}
        variant="outlined"
        inputProps={{ maxLength: 1, style: inputStyle, onKeyUp: inputFocus, tabIndex: 0 }}
        margin="normal"/>

      <TextField
        required
        style={otpStyles}
        value={letter2}
        onChange={(event) => setLetter2(event.target.value.toUpperCase())}
        variant="outlined"
        inputProps={{ maxLength: 1, style: inputStyle, onKeyUp: inputFocus, tabIndex: 2 }}
        margin="normal"/>

      <TextField
        required
        style={otpStyles}
        value={letter3}
        onChange={(event) => setLetter3(event.target.value.toUpperCase())}
        variant="outlined"
        inputProps={{ maxLength: 1, style: inputStyle, onKeyUp: inputFocus, tabIndex: 4 }}
        margin="normal"/>

      <TextField
        required
        style={otpStyles}
        value={letter4}
        onChange={(event) => setLetter4(event.target.value.toUpperCase())}
        variant="outlined"
        tabIndex={3}
        inputProps={{ maxLength: 1, style: inputStyle, onKeyUp: inputFocus, tabIndex: 6 }}
        margin="normal"/>
    </form>

  </Box>
}

export default OTP