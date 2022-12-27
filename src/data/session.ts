import { Models } from 'appwrite'
import { EventTypeEnum, Session } from 'sipapu-2'

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

export const emitEvent = (eventType: EventTypeEnum, session: Session, payload: string): Promise<Models.Document> => {
  const event = {
    type: eventType,
    session_id: session.$id,
    payload: JSON.stringify(payload)
  }

  console.log('Emitting event: ', event)
  
  return window.db.createDocument('event', 'unique()', event)

  // fetch(process.env.REACT_APP_TAWA_URL + 'session/emit', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(event)
  // })
  //   .then(res => res.json())
  //   .then(console.log)
  //   .catch(console.error)
}  