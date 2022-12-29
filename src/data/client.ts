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

}

type TokenValid = {
  tokenValid: boolean,
  timestamp: number
}

export type KokopelliSettings = {
  allow_spotify: boolean
  allow_youtube: boolean
  youtube_only_audio: boolean

  allow_events: boolean
  event_frequency: number
  allowed_events: KokopelliEvent[]
  random_word_list: string

  anyone_can_use_player_controls: boolean
  anyone_can_add_to_queue: boolean
  anyone_can_remove_from_queue: boolean
  anyone_can_see_history: boolean
  anyone_can_see_queue: boolean
  anyone_can_see_playlist: boolean

  algorithm_used: string

  allow_guests: boolean
}

export type KokopelliEvent = {
  name: string
  pretty_name: string
  active: boolean
}

/**
 * All queueing algorithms the user can choose from
 * <pre></pre>
 * 'classic' is the default and classic Kokopelli experience, weighted random on user
 * First the algorithm chooses an random user, then it uses weighted-song to select from the user's queue
 * <pre></pre>
 * 'modern' assigns weights to each user (based on how many times they have played), and then uses weighted-song to select from the user's queue
 * basically the classic algo but better
 * <pre></pre>
 * 'random' is pure random (garbage)
 * <pre></pre>
 * 'weighted-song' assignes weights to each song in the queue (based on how many times it has been played), and selects a song with the lowest weight (random if multiple with same weight)
 */
export type QueueAlgorithms = 'classic' | 'modern' | 'random' | 'weighted-song';

export const client = new JsonRPCClient()