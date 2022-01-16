import React from 'react'

type KokopelliProps = {
  className?: string
  height?: string | number
  width?: string | number
  white?: boolean
}

const Kokopelli = ({ className, height, width, white }: KokopelliProps) => {
  height = height || 250

  return <div className={className}>
    <img src={white ? '/kokopelli-white.png' : '/kokopelli.png'} alt="Kokopelli" style={{ height, width, objectFit: 'contain' }}/>
  </div>
}

export default Kokopelli