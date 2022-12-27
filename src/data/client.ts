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

    try {
      await this.req('get_user', {})
      this.setTokenValid(true)
      return true
    } catch (err) {
      this.setTokenValid(false)
      return false
    }
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

export const client = new JsonRPCClient()