import { Event, EventTypes } from '../types/tawa'
import { getSessionID } from './session'

class JsonRPCClient {
  
  default = {
    'jsonrpc': '2.0',
    'id': 44,
    'method': '',
    'params': {}
  }

  req = async (method: string, params: Record<string, unknown>, auth=true) => {
    const req = this.default
    req.method = method
    req.params = params

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Kokopelli-Client-Type': 'kachina'
    }

    if (auth) {
      const token = this.getToken()
      if (!token) {
        throw new Error('No token provided, but auth is required')
      }
      headers['Authorization'] = 'Bearer ' + token
    }
    
    return await fetch(process.env.REACT_APP_TAWA_URL + '/rpc/', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req)
    }).then(res => res.json())
      .then(res => {
        if (res.error) {
          throw new Error(res.error.message)
        }
        return res.result
      })
  }

  setToken = (token: string) => {
    localStorage.setItem('kachina::token', token)
  }

  getToken = () => {
    return localStorage.getItem('kachina::token')
  }

  setUser = (user: Record<string, unknown>) => {
    localStorage.setItem('kachina::user', JSON.stringify(user))
  }

  getUser = async () => {
    const user = localStorage.getItem('kachina::user')
    if (user) {
      return JSON.parse(user)
    }

    let new_user = {}

    // This will raise an exception if the token is invalid
    new_user = await this.req('get_user', {})

    this.setUser(new_user)

    return new_user
  }

  tokenValid = async () => {
    const token = this.getToken()

    if (!token) {
      localStorage.removeItem('kachina::isLoggedIn')
      return false
    }

    const local = localStorage.getItem('kachina::isLoggedIn')

    if (local) {
      const obj: TokenValid = JSON.parse(local)
      // If timestamp is less than 1 day old, then its fine
      if (Date.now() - obj.timestamp < 24 * 60 * 60 * 1000) {
        return true
      }

      // Otherwise, check with the server
    }

    return await this.req('get_user', {})
      .then(() => {
        this.setTokenValid(true)
        return true
      }).catch(() => {
        this.setTokenValid(false)
        return false
      })
  }

  setTokenValid = (tokenValid: boolean) => {
    localStorage.setItem('kachina::isLoggedIn', JSON.stringify({
      tokenValid,
      timestamp: Date.now()
    }))
  }

  pushEvent = (eventType: EventTypes, data: Record<string, unknown>, sessionID?: string) => {
    if (!sessionID) {
      sessionID = getSessionID()
    }

    this.req('push_event', {
      session_id: sessionID,
      client_type: 'kachina',
      event_type: eventType,
      date: new Date().toUTCString(),
      data,
    })
  }

}

type TokenValid = {
  tokenValid: boolean,
  timestamp: number
}
export class WSClient {

  url: string
  // @ts-expect-error WebSocket is defined in connect() and that is called in the constructor
  ws: WebSocket

  constructor(sessionID: string, cb: (data: Event) => void) {
    this.url = `${process.env.REACT_APP_TAWA_WS}/session/${sessionID}/`
    this.connect(cb)
  }

  connect(cb: (data: Event) => void) {
    this.ws = new WebSocket(this.url)
    
    this.ws.onmessage = (e) => {
      const data = JSON.parse(e.data)
      cb(data)
    }

    this.ws.onerror = (e => {
      console.error('WebSocket encountered error: ', e)
      this.ws.close()
    })

    this.ws.onclose = (e => {
      console.log('Socket is closed, attempting reconnect.', e)

      setTimeout(() => this.connect(cb), 1000)
    })
  }

  close() {
    this.ws.close()
  }
}

export const client = new JsonRPCClient()