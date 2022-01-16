import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Redirects a user to a given path, respects the current router
 * So if the user is in a session, and you redirect them to /playlists, it will redirect to /session/playlists
 * Always use this hook instead of using window.location.href directly
 * @param path The path to redirect to, start this string with a slash
 * USAGE:
 *  const redirect = useRedirect()
 *  redirect('/playlists') -> redirects to /session/playlists
 */
const useRedirect = () => {
  const [to, setTo] = useState<string>('')
  const location    = useLocation()
  const navigate    = useNavigate()

  useEffect(() => {
    if (to === '') return

    if (location.pathname.startsWith('/session')) {
      navigate(`/session${to}`)
    } else if (location.pathname.startsWith('/auth')) {
      navigate(`/auth${to}`)
    } else {
      navigate(to)
    }
    setTo('')
  }, [to])

  return setTo
}

export default useRedirect