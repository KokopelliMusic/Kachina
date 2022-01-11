import { Stepper, Step, StepLabel } from '@mui/material'
import React from 'react'

type CarousselProps = {
  steps: number
  activeStep: number
  className?: string
}

const Caroussel = (props: CarousselProps) => {

  return <Stepper activeStep={props.activeStep} className={'' + props.className}>
    {[...Array(props.steps)].map((_, i) => <Step key={i}><StepLabel/></Step>)}
  </Stepper>
}

export default Caroussel