
export const saveSessionCode = (code: string) => {
  localStorage.setItem('kokopelli:sessionCode', JSON.stringify({
    timeSet: (new Date()).getTime(),
    code
  }))
}

export const leaveSession = () => {
  localStorage.removeItem('kokopelli:sessionCode')
  window.location.href = '/'
}

export const getSessionCode = () => {
  const item = localStorage.getItem('kokopelli:sessionCode')

  if (item) {
    const obj = JSON.parse(item)

    // if the session code is older than 24 hours, remove it
    if (obj.timeSet + (1000 * 60 * 60 * 24) > (new Date()).getTime()) {
      return obj.code
    }
  }
  return null
}