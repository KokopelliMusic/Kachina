import React, { useEffect }  from 'react'
import AnonRouter from './routers/AnonRouter'
import AuthRouter from './routers/AuthRouter'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Spotify from './pages/add/Spotify'
import SessionCreation from './pages/auth/SessionCreation'
import SessionSelect from './pages/auth/SessionSelect'
import EditPlaylist from './pages/EditPlaylist'
import LogIntoSpotify from './pages/LogIntoSpotify'
import NotFound from './pages/NotFound'
import Playlists from './pages/Playlists'
import Profile from './pages/Profile'
import Session from './pages/session/Session'
import SessionRouter from './routers/SessionRouter'
import Add from './pages/add/Add'
import YouTube from './pages/add/YouTube'
import Settings from './pages/session/Settings'
import Help from './pages/auth/Help'

export const authPages = {
  playlists:        <AuthRouter element={<Playlists />} pageName="playlists" />,
  session:          <AuthRouter element={<SessionSelect />} pageName="session" />,
  profile:          <AuthRouter element={<Profile />} pageName="profile" elevation={0} />,
  sessionCreation:  <AuthRouter element={<SessionCreation />} pageName="sessionCreation" />,
  edit:             <AuthRouter element={<EditPlaylist />} pageName="edit" />,
  add:              <AuthRouter element={<Add />} pageName="add" />,
  spotify:          <AuthRouter element={<Spotify />} pageName="spotify" />,
  youtube:          <AuthRouter element={<YouTube />} pageName="youtube" />,
  logIntoSpotify:   <AuthRouter element={<LogIntoSpotify redirectBack="/#/auth/profile" />} pageName="logIntoSpotify" />,
  help:             <AuthRouter element={<Help />} pageName="help" />,
  notFound:         <AuthRouter element={<NotFound to="/auth/session" />} pageName="notFound" />,
}

export const sessionPages = {
  playlist: <SessionRouter element={<EditPlaylist session={true} />} pageName="playlist" />,
  session:  <SessionRouter element={<Session />} pageName="session" />,
  add:      <SessionRouter element={<Add session={true} />} pageName="add" />,
  spotify:  <SessionRouter element={<Spotify />} pageName="spotify" />,
  youtube:  <SessionRouter element={<YouTube />} pageName="youtube" />,
  settings: <SessionRouter element={<Settings />} pageName="settings" />,
  profile:  <SessionRouter element={<Profile />} pageName="profile" elevation={0} />,
  notFound: <SessionRouter element={<NotFound to="/session/session" />} pageName="notFound" />,
}


function App() {
  const params = new URLSearchParams(window.location.search)
  
  useEffect(() => {
    if (params.get('code')) {
      window.location.hash = decodeURIComponent(window.location.hash)
    }
  }, [])

  return <HashRouter>
    {window.sipapu.isLoggedIn() ?
      <Routes>
        <Route path="/session/">
          <Route path="playlist" element={sessionPages.playlist} />
          <Route path="session" element={sessionPages.session} />
          <Route path="add" element={sessionPages.add} />
          <Route path="spotify/:id" element={sessionPages.spotify} />
          <Route path="youtube/:id" element={sessionPages.youtube} />
          <Route path="profile" element={sessionPages.profile} />
          <Route path="settings" element={sessionPages.settings} />
          <Route path="*" element={sessionPages.notFound} />
        </Route>
        <Route path="/auth/">
          <Route path="playlists" element={authPages.playlists} />
          <Route path="session" element={authPages.session} />
          <Route path="profile" element={authPages.profile} />
          <Route path="edit/:id" element={authPages.edit} />
          <Route path="add/:id" element={authPages.add} />
          <Route path="spotify/:id" element={authPages.spotify} />
          <Route path="youtube/:id" element={authPages.youtube} />
          <Route path="sessionCreation" element={authPages.sessionCreation} />
          <Route path="login/spotify" element={authPages.logIntoSpotify} />
          <Route path="help" element={authPages.help} />
          <Route path="*" element={authPages.notFound} />
        </Route>
      </Routes> :
      <AnonRouter />
    }
  </HashRouter>

}

export default App
