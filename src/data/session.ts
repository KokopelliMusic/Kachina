
export const saveSessionID = (id: string) => {
  localStorage.setItem('kachina::session_id', JSON.stringify({
    timeSet: (new Date()).getTime(),
    id
  }))
}

export const leaveSession = () => {
  localStorage.removeItem('kachina::session_id')
  window.location.href = '/auth/session'
}

export const getSessionID = () => {
  const item = localStorage.getItem('kachina::session_id')

  if (item) {
    const obj = JSON.parse(item)

    // if the session code is less than  24 hours old, then ok
    if (obj.timeSet + (1000 * 60 * 60 * 24) > (new Date()).getTime()) {
      return obj.id
    }
  }
  return null
}