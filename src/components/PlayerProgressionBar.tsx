import React from 'react'

type PlayerProgressionBarProps = {
  timeLeft: number
}

const PlayerProgressionBar = ({ timeLeft }: PlayerProgressionBarProps) => {
  return <div className="flex-grow">
    <div className="pt-3">
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-xlight">
        <div style={{ width: `${timeLeft}%` }} 
          className="shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-primary" />
      </div>
    </div>
  </div>
}

export default PlayerProgressionBar