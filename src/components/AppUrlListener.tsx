import { useNavigate } from 'react-router'
import { App, URLOpenListenerEvent } from '@capacitor/app'
import { useEffect } from 'react'

const AppUrlListener = () => {
  const navigate = useNavigate()

  useEffect(() => {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      const slug = event.url.split('.nl').pop()
      console.log('appUrlOpen', event.url)
      console.log('appUrlOpen href', window.location.href)
      console.log('slug', slug)

      if (slug?.startsWith('/?code')) {
        const code = slug.split('?code=')[1].split('#')[0]
        const hash = slug.split('#')[1]
        const dec = decodeURIComponent(hash)
        console.log(dec + '&code=' + code)
        window.location.reload()
      } else {
        if (slug) {
          navigate(slug)
          window.location.reload()
        }
      }


    })
  }, [])

  return null
}

export default AppUrlListener